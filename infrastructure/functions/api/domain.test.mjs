import { describe, expect, it } from "vitest";

import {
  HttpError,
  buildBedrockPrompt,
  createFallbackPlan,
  extractBedrockPlan,
  parseJsonBody,
  summarizeImpact,
  validateScenario,
} from "./domain.mjs";

const student = {
  displayName: "Ana Torres",
  grade: "3.º",
  section: "A",
  attendancePercent: 68,
  currentAverage: 10.5,
  pendingAssignments: 4,
};
const scenario = {
  targetAttendance: 88,
  tutoringSessions: 2,
  recoveredAssignments: 3,
  familyContact: true,
  personalizedPlan: true,
};

describe("API domain", () => {
  it("valida y normaliza escenarios", () => {
    expect(validateScenario({ ...scenario, targetAttendance: "88" })).toEqual(scenario);
    expect(() => validateScenario({ ...scenario, targetAttendance: 120 })).toThrow(HttpError);
  });

  it("rechaza JSON inválido", () => {
    expect(() => parseJsonBody({ body: "{" })).toThrow("JSON válido");
  });

  it("crea un plan de respaldo revisable", () => {
    const plan = createFallbackPlan(student, scenario);
    expect(plan.source).toBe("fallback");
    expect(plan.actions).toHaveLength(4);
    expect(plan.humanReviewRequired).toBe(true);
  });

  it("extrae un plan JSON de Converse", () => {
    const response = {
      output: { message: { content: [{ text: JSON.stringify({
        objective: "Mejorar continuidad",
        actions: Array.from({ length: 3 }, (_, index) => ({
          action: `Acción ${index}`,
          responsible: "Docente",
          deadline: "Día 7",
          indicator: "Registro completo",
        })),
      }) }] } },
    };
    expect(extractBedrockPlan(response).source).toBe("bedrock");
  });

  it("limita el prompt a datos educativos necesarios", () => {
    const prompt = buildBedrockPrompt(student, scenario);
    expect(prompt).toContain("Estudiante sintético");
    expect(prompt).toContain("No diagnostiques");
  });

  it("resume únicamente intervenciones", () => {
    const result = summarizeImpact([
      { entityType: "student" },
      { entityType: "intervention", status: "completed", initialRisk: 78, observedRisk: 31 },
      { entityType: "intervention", status: "active", initialRisk: 50 },
    ]);
    expect(result).toMatchObject({ interventions: 2, completed: 1, averageRiskReduction: 47 });
  });
});
