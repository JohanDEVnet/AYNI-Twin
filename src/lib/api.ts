import type {
  GeneratedInterventionPlan,
  SimulationInput,
  Student,
} from "@/types/student";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  signal?: AbortSignal,
): Promise<T | null> {
  if (!apiUrl) return null;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        accept: "application/json",
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`AYNI API respondió ${response.status}`);
    return await response.json() as T;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

export async function fetchStudentsFromApi(signal?: AbortSignal): Promise<Student[] | null> {
  const payload = await requestJson<{ items?: Student[] }>("/students", {}, signal);
  return Array.isArray(payload?.items) ? payload.items : null;
}

export async function saveScenarioToApi(studentId: string, plan: SimulationInput) {
  return requestJson<{ id: string }>(`/students/${encodeURIComponent(studentId)}/scenarios`, {
    method: "POST",
    body: JSON.stringify(plan),
  });
}

export async function generatePlanFromApi(studentId: string, plan: SimulationInput) {
  return requestJson<GeneratedInterventionPlan>(
    `/students/${encodeURIComponent(studentId)}/intervention-plan`,
    { method: "POST", body: JSON.stringify(plan) },
  );
}

export async function approveInterventionInApi(input: {
  studentId: string;
  planId?: string;
  initialRisk: number;
  estimatedRisk: number;
}) {
  return requestJson<{ id: string; status: "active" }>("/interventions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
