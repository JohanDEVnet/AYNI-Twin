import { calculateRisk } from "@/lib/risk";
import type {
  ScenarioResult,
  SimulationInput,
  Student,
} from "@/types/student";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number) => Math.round(value * 10) / 10;

export function simulateScenario(
  student: Student,
  input: SimulationInput,
  id: ScenarioResult["id"] = "plan",
  name = "Plan completo",
): ScenarioResult {
  const projectedAttendance = clamp(
    Math.max(student.attendancePercent, input.targetAttendance) +
      (input.familyContact ? 3 : 0),
    0,
    98,
  );
  const projectedAverage = clamp(
    student.currentAverage +
      input.tutoringSessions * 0.85 +
      (input.personalizedPlan ? 1 : 0),
    0,
    20,
  );
  const projectedPendingAssignments = clamp(
    student.pendingAssignments - input.recoveredAssignments,
    0,
    student.totalAssignments,
  );
  const projectedRisk = calculateRisk({
    attendancePercent: projectedAttendance,
    currentAverage: projectedAverage,
    previousAverage: student.currentAverage,
    pendingAssignments: projectedPendingAssignments,
    totalAssignments: student.totalAssignments,
  });
  const assumptions: string[] = [];

  if (input.targetAttendance > student.attendancePercent) {
    assumptions.push(`Asistencia objetivo de ${input.targetAttendance} %`);
  }
  if (input.tutoringSessions > 0) {
    assumptions.push(
      `${input.tutoringSessions} ${input.tutoringSessions === 1 ? "tutoría semanal" : "tutorías semanales"}`,
    );
  }
  if (input.recoveredAssignments > 0) {
    assumptions.push(
      `${input.recoveredAssignments} ${input.recoveredAssignments === 1 ? "actividad recuperada" : "actividades recuperadas"}`,
    );
  }
  if (input.familyContact) assumptions.push("Contacto coordinado con la familia");
  if (input.personalizedPlan) assumptions.push("Plan personalizado de 14 días");

  return {
    id,
    name,
    projectedRiskScore: projectedRisk.score,
    projectedAttendance,
    projectedAverage: round(projectedAverage),
    projectedPendingAssignments,
    assumptions,
    confidence:
      assumptions.length >= 4
        ? "medium"
        : assumptions.length >= 2
          ? "low"
          : "low",
  };
}

export function createScenarioComparison(
  student: Student,
  plan: SimulationInput,
): ScenarioResult[] {
  const baselineStudent = {
    ...student,
    attendancePercent: Math.max(0, student.attendancePercent - 3),
    currentAverage: Math.max(0, student.currentAverage - 0.6),
    previousAverage: student.currentAverage,
    pendingAssignments: Math.min(
      student.totalAssignments,
      student.pendingAssignments + 1,
    ),
  };
  const baselineRisk = calculateRisk(baselineStudent);

  const baseline: ScenarioResult = {
    id: "baseline",
    name: "Sin intervención",
    projectedRiskScore: baselineRisk.score,
    projectedAttendance: baselineStudent.attendancePercent,
    projectedAverage: baselineStudent.currentAverage,
    projectedPendingAssignments: baselineStudent.pendingAssignments,
    assumptions: ["Continuidad de la tendencia reciente"],
    confidence: "low",
  };
  const partial = simulateScenario(
    student,
    {
      targetAttendance: 78,
      tutoringSessions: 1,
      recoveredAssignments: 2,
      familyContact: false,
      personalizedPlan: false,
    },
    "partial",
    "Apoyo parcial",
  );
  const complete = simulateScenario(student, plan, "plan", "Plan completo");

  return [baseline, partial, complete];
}

