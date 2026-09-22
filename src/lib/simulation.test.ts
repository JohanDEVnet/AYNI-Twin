import { describe, expect, it } from "vitest";

import { students } from "@/data/students";
import { createScenarioComparison, simulateScenario } from "./simulation";

const ana = students.find((student) => student.id === "AT-031")!;

describe("simulateScenario", () => {
  it("reduces risk when the configured support improves the inputs", () => {
    const result = simulateScenario(ana, {
      targetAttendance: 85,
      tutoringSessions: 2,
      recoveredAssignments: 3,
      familyContact: true,
      personalizedPlan: true,
    });

    expect(result.projectedRiskScore).toBeLessThan(ana.riskScore);
    expect(result.projectedPendingAssignments).toBe(1);
    expect(result.assumptions).toHaveLength(5);
    expect(result.confidence).toBe("medium");
  });

  it("never projects impossible academic values", () => {
    const result = simulateScenario(ana, {
      targetAttendance: 100,
      tutoringSessions: 20,
      recoveredAssignments: 99,
      familyContact: true,
      personalizedPlan: true,
    });

    expect(result.projectedAttendance).toBeLessThanOrEqual(98);
    expect(result.projectedAverage).toBeLessThanOrEqual(20);
    expect(result.projectedPendingAssignments).toBe(0);
  });
});

describe("createScenarioComparison", () => {
  it("returns the three futures in presentation order", () => {
    const scenarios = createScenarioComparison(ana, {
      targetAttendance: 85,
      tutoringSessions: 2,
      recoveredAssignments: 3,
      familyContact: true,
      personalizedPlan: true,
    });

    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "baseline",
      "partial",
      "plan",
    ]);
    expect(scenarios[0].projectedRiskScore).toBeGreaterThan(
      scenarios[1].projectedRiskScore,
    );
    expect(scenarios[1].projectedRiskScore).toBeGreaterThan(
      scenarios[2].projectedRiskScore,
    );
  });
});
