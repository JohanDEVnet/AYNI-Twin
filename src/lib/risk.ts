import type { RiskBreakdown, RiskLevel } from "@/types/student";

type RiskInput = {
  attendancePercent: number;
  currentAverage: number;
  previousAverage: number;
  pendingAssignments: number;
  totalAssignments: number;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const round = (value: number) => Math.round(value * 10) / 10;

export function classifyRisk(score: number): RiskLevel {
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function calculateRisk(input: RiskInput): RiskBreakdown {
  const attendanceRisk = clamp(
    ((95 - clamp(input.attendancePercent, 0, 100)) / 35) * 100,
  );
  const averageRisk = ((17 - clamp(input.currentAverage, 0, 20)) / 8) * 100;
  const downwardTrend = Math.max(
    0,
    input.previousAverage - input.currentAverage,
  );
  const gradeRisk = clamp(averageRisk + downwardTrend * 8);
  const assignmentRisk =
    input.totalAssignments > 0
      ? clamp((input.pendingAssignments / input.totalAssignments) * 100)
      : 0;
  const score = round(
    attendanceRisk * 0.4 + gradeRisk * 0.35 + assignmentRisk * 0.25,
  );
  const factors: string[] = [];

  if (input.attendancePercent < 85) {
    factors.push(`Asistencia actual de ${input.attendancePercent} %`);
  }
  if (downwardTrend >= 0.5) {
    factors.push(`El promedio bajó ${round(downwardTrend)} puntos`);
  } else if (input.currentAverage < 13) {
    factors.push(`Promedio actual de ${input.currentAverage}`);
  }
  if (input.pendingAssignments > 0) {
    factors.push(
      `${input.pendingAssignments} ${input.pendingAssignments === 1 ? "actividad pendiente" : "actividades pendientes"}`,
    );
  }
  if (factors.length === 0) {
    factors.push("Indicadores académicos estables");
  }

  return {
    score,
    level: classifyRisk(score),
    attendanceRisk: round(attendanceRisk),
    gradeRisk: round(gradeRisk),
    assignmentRisk: round(assignmentRisk),
    factors,
  };
}

