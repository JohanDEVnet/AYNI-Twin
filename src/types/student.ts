export type RiskLevel = "low" | "medium" | "high";

export type Student = {
  id: string;
  displayName: string;
  grade: string;
  section: string;
  attendancePercent: number;
  currentAverage: number;
  previousAverage: number;
  pendingAssignments: number;
  totalAssignments: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: "watch" | "active" | "improving";
  createdAt: string;
  updatedAt: string;
};

export type RiskBreakdown = {
  score: number;
  level: RiskLevel;
  attendanceRisk: number;
  gradeRisk: number;
  assignmentRisk: number;
  factors: string[];
};

export type SimulationInput = {
  targetAttendance: number;
  tutoringSessions: number;
  recoveredAssignments: number;
  familyContact: boolean;
  personalizedPlan: boolean;
};

export type ScenarioResult = {
  id: "baseline" | "partial" | "plan";
  name: string;
  projectedRiskScore: number;
  projectedAttendance: number;
  projectedAverage: number;
  projectedPendingAssignments: number;
  assumptions: string[];
  confidence: "low" | "medium" | "high";
};

export type InterventionActionDraft = {
  action: string;
  responsible: string;
  deadline: string;
  indicator: string;
};

export type GeneratedInterventionPlan = {
  id?: string;
  source: "bedrock" | "fallback";
  objective: string;
  actions: InterventionActionDraft[];
  humanReviewRequired: boolean;
  disclaimer: string;
};
