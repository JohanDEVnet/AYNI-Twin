import { describe, expect, it } from "vitest";

import { students } from "./students";

describe("synthetic student dataset", () => {
  it("contains 30 unique fictional students", () => {
    expect(students).toHaveLength(30);
    expect(new Set(students.map((student) => student.id)).size).toBe(30);
  });

  it("keeps the required risk distribution", () => {
    const distribution = students.reduce(
      (total, student) => {
        total[student.riskLevel] += 1;
        return total;
      },
      { low: 0, medium: 0, high: 0 },
    );

    expect(distribution).toEqual({ low: 14, medium: 10, high: 6 });
  });
});
