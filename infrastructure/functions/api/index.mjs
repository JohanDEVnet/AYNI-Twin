import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

import {
  HttpError,
  buildBedrockPrompt,
  cleanNumber,
  cleanText,
  createFallbackPlan,
  extractBedrockPlan,
  parseJsonBody,
  summarizeImpact,
  validateScenario,
} from "./domain.mjs";

const tableName = process.env.TABLE_NAME;
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "http://localhost:3000";
const modelId = process.env.BEDROCK_MODEL_ID ?? "amazon.nova-lite-v1:0";
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const bedrock = new BedrockRuntimeClient({});

function publicItem(item) {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !["pk", "sk", "entityType"].includes(key)),
  );
}

function response(statusCode, body, requestId) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": allowedOrigin,
      "cache-control": "no-store",
      "x-request-id": requestId,
    },
    body: JSON.stringify(body),
  };
}

async function getStudent(id) {
  const result = await dynamo.send(new GetCommand({
    TableName: tableName,
    Key: { pk: `STUDENT#${id}`, sk: "PROFILE" },
  }));
  if (!result.Item) throw new HttpError(404, "Estudiante no encontrado.");
  return publicItem(result.Item);
}

async function listStudents() {
  const result = await dynamo.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: "entityType = :type",
    ExpressionAttributeValues: { ":type": "student" },
  }));
  return (result.Items ?? [])
    .map(publicItem)
    .sort((left, right) => right.riskScore - left.riskScore);
}

async function createScenario(studentId, body) {
  await getStudent(studentId);
  const scenario = validateScenario(body);
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const item = {
    pk: `STUDENT#${studentId}`,
    sk: `SCENARIO#${createdAt}#${id}`,
    entityType: "scenario",
    id,
    studentId,
    ...scenario,
    createdAt,
  };
  await dynamo.send(new PutCommand({ TableName: tableName, Item: item }));
  return publicItem(item);
}

async function listScenarios(studentId) {
  await getStudent(studentId);
  const result = await dynamo.send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    ExpressionAttributeValues: { ":pk": `STUDENT#${studentId}`, ":prefix": "SCENARIO#" },
    ScanIndexForward: false,
  }));
  return (result.Items ?? []).map(publicItem);
}

async function generatePlan(studentId, body) {
  const student = await getStudent(studentId);
  const scenario = validateScenario(body);
  let plan = createFallbackPlan(student, scenario);

  try {
    const result = await bedrock.send(new ConverseCommand({
      modelId,
      messages: [{ role: "user", content: [{ text: buildBedrockPrompt(student, scenario) }] }],
      inferenceConfig: { maxTokens: 900, temperature: 0.2, topP: 0.8 },
    }));
    plan = extractBedrockPlan(result);
  } catch (error) {
    console.warn(JSON.stringify({ event: "bedrock_fallback", reason: error.name ?? "UnknownError" }));
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  await dynamo.send(new PutCommand({
    TableName: tableName,
    Item: {
      pk: `STUDENT#${studentId}`,
      sk: `PLAN#${createdAt}#${id}`,
      entityType: "plan",
      id,
      studentId,
      scenario,
      ...plan,
      status: "draft",
      createdAt,
    },
  }));
  return { id, studentId, scenario, ...plan, status: "draft", createdAt };
}

async function createIntervention(body) {
  const studentId = cleanText(body.studentId, "studentId");
  await getStudent(studentId);
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const item = {
    pk: `INTERVENTION#${id}`,
    sk: "DETAIL",
    entityType: "intervention",
    id,
    studentId,
    planId: cleanText(body.planId, "planId", false),
    status: "active",
    initialRisk: cleanNumber(body.initialRisk, "initialRisk", 0, 100),
    estimatedRisk: cleanNumber(body.estimatedRisk, "estimatedRisk", 0, 100),
    createdAt,
    updatedAt: createdAt,
  };
  await dynamo.send(new PutCommand({ TableName: tableName, Item: item }));
  return publicItem(item);
}

async function updateIntervention(id, body) {
  const status = cleanText(body.status, "status");
  if (!["active", "completed", "cancelled"].includes(status)) {
    throw new HttpError(400, "status no es válido.");
  }
  const observedRisk = body.observedRisk == null
    ? undefined
    : cleanNumber(body.observedRisk, "observedRisk", 0, 100);
  const updateParts = ["#status = :status", "updatedAt = :updatedAt"];
  const values = {
    ":status": status,
    ":updatedAt": new Date().toISOString(),
  };
  if (observedRisk != null) {
    updateParts.push("observedRisk = :observedRisk");
    values[":observedRisk"] = observedRisk;
  }
  const result = await dynamo.send(new UpdateCommand({
    TableName: tableName,
    Key: { pk: `INTERVENTION#${id}`, sk: "DETAIL" },
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: values,
    ConditionExpression: "attribute_exists(pk)",
    ReturnValues: "ALL_NEW",
  }));
  return publicItem(result.Attributes);
}

async function getImpact() {
  const result = await dynamo.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: "entityType = :type",
    ExpressionAttributeValues: { ":type": "intervention" },
  }));
  return summarizeImpact(result.Items ?? []);
}

export async function handler(event, context) {
  const requestId = context?.awsRequestId ?? event?.requestContext?.requestId ?? randomUUID();
  const routeKey = event?.routeKey ?? `${event?.requestContext?.http?.method} ${event?.rawPath}`;
  const studentId = event?.pathParameters?.id;
  console.info(JSON.stringify({ event: "request_started", requestId, routeKey }));

  try {
    let payload;
    let statusCode = 200;
    switch (routeKey) {
      case "GET /students":
        payload = { items: await listStudents() };
        break;
      case "GET /students/{id}":
        payload = await getStudent(studentId);
        break;
      case "POST /students/{id}/scenarios":
        statusCode = 201;
        payload = await createScenario(studentId, parseJsonBody(event));
        break;
      case "GET /students/{id}/scenarios":
        payload = { items: await listScenarios(studentId) };
        break;
      case "POST /students/{id}/intervention-plan":
        statusCode = 201;
        payload = await generatePlan(studentId, parseJsonBody(event));
        break;
      case "POST /interventions":
        statusCode = 201;
        payload = await createIntervention(parseJsonBody(event));
        break;
      case "PATCH /interventions/{id}":
        payload = await updateIntervention(studentId, parseJsonBody(event));
        break;
      case "GET /impact":
        payload = await getImpact();
        break;
      default:
        throw new HttpError(404, "Ruta no encontrada.");
    }
    console.info(JSON.stringify({ event: "request_completed", requestId, routeKey, statusCode }));
    return response(statusCode, payload, requestId);
  } catch (error) {
    const statusCode = error instanceof HttpError
      ? error.statusCode
      : error.name === "ConditionalCheckFailedException" ? 404 : 500;
    const message = statusCode === 500 ? "No pudimos completar la solicitud." : error.message;
    console.error(JSON.stringify({ event: "request_failed", requestId, routeKey, statusCode, error: error.name }));
    return response(statusCode, { message, requestId }, requestId);
  }
}
