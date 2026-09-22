const MAX_TEXT_LENGTH = 600;

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export function parseJsonBody(event) {
  if (!event?.body) return {};
  if (event.body.length > 12_000) {
    throw new HttpError(413, "La solicitud supera el tamaño permitido.");
  }

  try {
    return JSON.parse(event.body);
  } catch {
    throw new HttpError(400, "El cuerpo debe ser JSON válido.");
  }
}

export function cleanText(value, field, required = true) {
  if (value == null && !required) return undefined;
  if (typeof value !== "string") {
    throw new HttpError(400, `${field} debe ser texto.`);
  }
  const cleaned = value.trim();
  if (required && !cleaned) {
    throw new HttpError(400, `${field} es obligatorio.`);
  }
  if (cleaned.length > MAX_TEXT_LENGTH) {
    throw new HttpError(400, `${field} supera el límite permitido.`);
  }
  return cleaned;
}

export function cleanNumber(value, field, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new HttpError(400, `${field} debe estar entre ${minimum} y ${maximum}.`);
  }
  return number;
}

export function validateScenario(body) {
  return {
    targetAttendance: cleanNumber(body.targetAttendance, "targetAttendance", 0, 100),
    tutoringSessions: cleanNumber(body.tutoringSessions, "tutoringSessions", 0, 20),
    recoveredAssignments: cleanNumber(body.recoveredAssignments, "recoveredAssignments", 0, 30),
    familyContact: Boolean(body.familyContact),
    personalizedPlan: Boolean(body.personalizedPlan),
  };
}

export function createFallbackPlan(student, scenario) {
  const firstName = student.displayName.split(" ")[0];
  return {
    source: "fallback",
    objective: `Recuperar la continuidad académica de ${firstName} mediante asistencia sostenida, acompañamiento focalizado y cierre gradual de actividades pendientes.`,
    actions: [
      {
        action: `Coordinar ${scenario.tutoringSessions} tutorías de Matemática`,
        responsible: "Docente de Matemática",
        deadline: "Día 3",
        indicator: `${scenario.tutoringSessions} sesiones registradas`,
      },
      {
        action: `Recuperar ${scenario.recoveredAssignments} actividades prioritarias`,
        responsible: firstName,
        deadline: "Día 9",
        indicator: `${scenario.recoveredAssignments} entregas validadas`,
      },
      {
        action: "Acordar una rutina de asistencia y seguimiento",
        responsible: "Docente tutor y familia",
        deadline: "Día 2",
        indicator: `Asistencia mínima de ${scenario.targetAttendance} %`,
      },
      {
        action: "Revisar avances y ajustar el apoyo",
        responsible: "Docente tutor",
        deadline: "Día 14",
        indicator: "Comparación de resultados registrada",
      },
    ],
    humanReviewRequired: true,
    disclaimer: "Borrador para revisión docente. No diagnostica ni determina el futuro del estudiante.",
  };
}

export function extractBedrockPlan(response) {
  const text = response?.output?.message?.content?.find((item) => item.text)?.text;
  if (!text) throw new Error("Bedrock no devolvió contenido de texto.");

  const normalized = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const plan = JSON.parse(normalized);
  if (typeof plan.objective !== "string" || !Array.isArray(plan.actions) || plan.actions.length < 3) {
    throw new Error("La respuesta de Bedrock no cumple el formato esperado.");
  }

  return {
    source: "bedrock",
    objective: cleanText(plan.objective, "objective"),
    actions: plan.actions.slice(0, 5).map((action, index) => ({
      action: cleanText(action.action, `actions[${index}].action`),
      responsible: cleanText(action.responsible, `actions[${index}].responsible`),
      deadline: cleanText(action.deadline, `actions[${index}].deadline`),
      indicator: cleanText(action.indicator, `actions[${index}].indicator`),
    })),
    humanReviewRequired: true,
    disclaimer: "Borrador generado con IA para revisión docente. No diagnostica ni determina el futuro del estudiante.",
  };
}

export function buildBedrockPrompt(student, scenario) {
  return [
    "Eres un asistente de planificación educativa responsable.",
    "Genera SOLO JSON válido, sin markdown, con esta estructura:",
    '{"objective":"...","actions":[{"action":"...","responsible":"...","deadline":"...","indicator":"..."}]}',
    "Propón de 3 a 5 acciones realistas para 14 días. No diagnostiques ni uses lenguaje determinista.",
    `Estudiante sintético: ${student.displayName}; grado ${student.grade} ${student.section}.`,
    `Indicadores: asistencia ${student.attendancePercent}%, promedio ${student.currentAverage}/20, actividades pendientes ${student.pendingAssignments}.`,
    `Escenario revisado por el docente: asistencia objetivo ${scenario.targetAttendance}%, tutorías ${scenario.tutoringSessions}, recuperaciones ${scenario.recoveredAssignments}, contacto familiar ${scenario.familyContact ? "sí" : "no"}, plan personalizado ${scenario.personalizedPlan ? "sí" : "no"}.`,
  ].join("\n");
}

export function summarizeImpact(items) {
  const interventions = items.filter((item) => item.entityType === "intervention");
  const completed = interventions.filter((item) => item.status === "completed");
  const riskReductions = completed
    .map((item) => Number(item.initialRisk) - Number(item.observedRisk))
    .filter(Number.isFinite);

  return {
    interventions: interventions.length,
    completed: completed.length,
    averageRiskReduction: riskReductions.length
      ? Math.round(riskReductions.reduce((sum, value) => sum + value, 0) / riskReductions.length)
      : 0,
    items: interventions,
  };
}
