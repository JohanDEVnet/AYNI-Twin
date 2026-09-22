import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { readFile } from "node:fs/promises";

const tableName = process.env.TABLE_NAME;
if (!tableName) {
  throw new Error("Define TABLE_NAME con el output TableName del stack antes de ejecutar la semilla.");
}

const sourceUrl = new URL("../../../src/data/students.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const match = source.match(/const seeds: StudentSeed\[\] = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error("No se pudo leer la lista sintética de estudiantes.");

const seeds = Function(`"use strict"; return (${match[1]});`)();
const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const round = (value) => Math.round(value * 10) / 10;
const classifyRisk = (score) => score >= 65 ? "high" : score >= 35 ? "medium" : "low";
const calculateRisk = (student) => {
  const attendanceRisk = clamp(((95 - clamp(student.attendancePercent)) / 35) * 100);
  const averageRisk = ((17 - clamp(student.currentAverage, 0, 20)) / 8) * 100;
  const downwardTrend = Math.max(0, student.previousAverage - student.currentAverage);
  const gradeRisk = clamp(averageRisk + downwardTrend * 8);
  const assignmentRisk = student.totalAssignments > 0
    ? clamp((student.pendingAssignments / student.totalAssignments) * 100)
    : 0;
  const score = round(attendanceRisk * 0.4 + gradeRisk * 0.35 + assignmentRisk * 0.25);
  return { riskScore: score, riskLevel: classifyRisk(score) };
};

const now = new Date().toISOString();
const requests = seeds.map((student) => ({
  PutRequest: {
    Item: {
      pk: `STUDENT#${student.id}`,
      sk: "PROFILE",
      entityType: "student",
      ...student,
      ...calculateRisk(student),
      createdAt: now,
      updatedAt: now,
    },
  },
}));
const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

for (let index = 0; index < requests.length; index += 25) {
  let pending = requests.slice(index, index + 25);
  do {
    const result = await client.send(new BatchWriteCommand({
      RequestItems: { [tableName]: pending },
    }));
    pending = result.UnprocessedItems?.[tableName] ?? [];
    if (pending.length) await new Promise((resolve) => setTimeout(resolve, 500));
  } while (pending.length);
}

console.info(`Semilla completada: ${requests.length} estudiantes sintéticos en ${tableName}.`);
