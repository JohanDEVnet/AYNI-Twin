import { describe, expect, it } from "vitest";

import { calculateRisk, classifyRisk } from "./risk";

describe("classifyRisk", () => {
  it("uses the agreed risk boundaries", () => {
    expect(classifyRisk(0)).toBe("low");
    expect(classifyRisk(34)).toBe("low");
    expect(classifyRisk(35)).toBe("medium");
    expect(classifyRisk(64)).toBe("medium");
    expect(classifyRisk(65)).toBe("high");
    expect(classifyRisk(100)).toBe("high");
  });
});

describe("calculateRisk", () => {
  it("applies the transparent 40/35/25 weighting", () => {
    const result = calculateRisk({
      attendancePercent: 95,
      currentAverage: 17,
      previousAverage: 17,
      pendingAssignments: 5,
      totalAssignments: 10,
    });

    expect(result.attendanceRisk).toBe(0);
    expect(result.gradeRisk).toBe(0);
    expect(result.assignmentRisk).toBe(50);
    expect(result.score).toBe(12.5);
  });

  it("keeps every component and the final score between 0 and 100", () => {
    const result = calculateRisk({
      attendancePercent: -20,
      currentAverage: -5,
      previousAverage: 20,
      pendingAssignments: 25,
      totalAssignments: 4,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.attendanceRisk).toBe(100);
    expect(result.gradeRisk).toBe(100);
    expect(result.assignmentRisk).toBe(100);
  });

  it("explains Ana's factors without deterministic language", () => {
    const result = calculateRisk({
      attendancePercent: 68,
      currentAverage: 10.5,
      previousAverage: 12.9,
      pendingAssignments: 4,
      totalAssignments: 8,
    });

    expect(result.score).toBe(78.4);
    expect(result.level).toBe("high");
    expect(result.factors).toEqual([
      "Asistencia actual de 68 %",
      "El promedio bajó 2.4 puntos",
      "4 actividades pendientes",
    ]);
  });
});
