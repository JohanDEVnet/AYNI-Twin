"use client";

import { useMemo, useState } from "react";

import { createScenarioComparison } from "@/lib/simulation";
import type { SimulationInput, Student } from "@/types/student";

type FutureLabProps = {
  student: Student;
  onBack: () => void;
  onCreatePlan: (plan: SimulationInput) => void | Promise<void>;
};

const confidenceLabels = { low: "Baja", medium: "Media", high: "Alta" };

export function FutureLab({ student, onBack, onCreatePlan }: FutureLabProps) {
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [plan, setPlan] = useState<SimulationInput>({
    targetAttendance: 85,
    tutoringSessions: 2,
    recoveredAssignments: 3,
    familyContact: true,
    personalizedPlan: true,
  });
  const scenarios = useMemo(
    () => createScenarioComparison(student, plan),
    [plan, student],
  );
  const currentPlan = scenarios[2];
  const improvement = Math.round(student.riskScore - currentPlan.projectedRiskScore);
  const update = <Key extends keyof SimulationInput>(
    key: Key,
    value: SimulationInput[Key],
  ) => setPlan((current) => ({ ...current, [key]: value }));

  const yForRisk = (risk: number) => 42 + ((100 - risk) / 100) * 210;
  const pathForRisk = (risk: number, bend: number) => {
    const end = yForRisk(risk);
    return `M42 92 C190 ${92 + bend}, 360 ${Math.round(end - bend)}, 610 ${Math.round(end)}`;
  };

  const createPlan = async () => {
    if (isCreatingPlan) return;
    setIsCreatingPlan(true);
    try {
      await onCreatePlan(plan);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  return (
    <>
      <section className="page-heading twin-heading">
        <div>
          <button className="text-action" type="button" onClick={onBack}>Volver a Student Twin</button>
          <p className="eyebrow">Future Lab · {student.displayName}</p>
          <h1>Explora cómo podría cambiar la trayectoria</h1>
          <p className="lede">Modifica las acciones y compara tres futuros posibles. Son supuestos configurables para apoyar una decisión docente.</p>
        </div>
        <div className="simulation-delta"><span>Cambio estimado</span><strong>−{improvement} puntos</strong></div>
      </section>

      <div className="lab-grid">
        <section className="lab-controls" aria-label="Controles del escenario">
          <div className="control-intro"><p className="section-kicker">Intervenciones</p><h2>Construye el escenario</h2></div>
          <label className="range-control">
            <span><b>Asistencia objetivo</b><output>{plan.targetAttendance}%</output></span>
            <input type="range" min={student.attendancePercent} max="95" value={plan.targetAttendance} onChange={(event) => update("targetAttendance", Number(event.target.value))} />
          </label>
          <label className="range-control">
            <span><b>Tutorías por semana</b><output>{plan.tutoringSessions}</output></span>
            <input type="range" min="0" max="3" value={plan.tutoringSessions} onChange={(event) => update("tutoringSessions", Number(event.target.value))} />
          </label>
          <label className="range-control">
            <span><b>Actividades recuperadas</b><output>{plan.recoveredAssignments}</output></span>
            <input type="range" min="0" max={student.pendingAssignments} value={plan.recoveredAssignments} onChange={(event) => update("recoveredAssignments", Number(event.target.value))} />
          </label>
          <label className="switch-control"><input type="checkbox" checked={plan.familyContact} onChange={(event) => update("familyContact", event.target.checked)} /><span><b>Contacto con la familia</b><small>Coordinación respetuosa y orientada a barreras.</small></span></label>
          <label className="switch-control"><input type="checkbox" checked={plan.personalizedPlan} onChange={(event) => update("personalizedPlan", event.target.checked)} /><span><b>Plan personalizado</b><small>Metas graduales durante catorce días.</small></span></label>
        </section>

        <section className="future-canvas" aria-live="polite">
          <div className="canvas-heading">
            <div><p className="section-kicker">Línea de futuros</p><h2>Tres trayectorias, una decisión humana</h2></div>
            <div className="projected-score"><span>Plan completo</span><strong>{Math.round(currentPlan.projectedRiskScore)}%</strong></div>
          </div>

          <svg className="future-lines" viewBox="0 0 660 300" role="img" aria-label={`Comparación de riesgo: sin intervención ${Math.round(scenarios[0].projectedRiskScore)} %, apoyo parcial ${Math.round(scenarios[1].projectedRiskScore)} % y plan completo ${Math.round(scenarios[2].projectedRiskScore)} %`}>
            <line x1="42" y1="252" x2="620" y2="252" className="axis-line" />
            <line x1="42" y1="42" x2="620" y2="42" className="axis-line" />
            <path d={pathForRisk(scenarios[0].projectedRiskScore, -18)} className="future-path baseline-path" />
            <path d={pathForRisk(scenarios[1].projectedRiskScore, 8)} className="future-path partial-path" />
            <path d={pathForRisk(scenarios[2].projectedRiskScore, 26)} className="future-path plan-path" />
            <circle cx="42" cy="92" r="7" className="origin-point" />
            {scenarios.map((scenario) => (
              <g key={scenario.id}>
                <circle cx="610" cy={yForRisk(scenario.projectedRiskScore)} r="8" className={`end-point ${scenario.id}`} />
                <text x="626" y={yForRisk(scenario.projectedRiskScore) + 4} className="end-label">{Math.round(scenario.projectedRiskScore)}%</text>
              </g>
            ))}
            <text x="40" y="73" className="origin-label">Hoy · {Math.round(student.riskScore)}%</text>
            <text x="42" y="278" className="axis-label">Inicio</text>
            <text x="565" y="278" className="axis-label">Día 14</text>
          </svg>

          <div className="scenario-legend">
            {scenarios.map((scenario) => <span className={scenario.id} key={scenario.id}><i />{scenario.name}</span>)}
          </div>
          <div className="confidence-row">
            <span>Confianza {confidenceLabels[currentPlan.confidence]}</span>
            <p>Simulación para apoyo a decisiones — no es un resultado garantizado.</p>
          </div>
        </section>
      </div>

      <section className="scenario-comparison" aria-label="Comparación de escenarios">
        {scenarios.map((scenario) => (
          <article className={scenario.id} key={scenario.id}>
            <div><p>{scenario.name}</p><strong>{Math.round(scenario.projectedRiskScore)}%</strong></div>
            <dl>
              <div><dt>Asistencia</dt><dd>{scenario.projectedAttendance}%</dd></div>
              <div><dt>Promedio</dt><dd>{scenario.projectedAverage}</dd></div>
              <div><dt>Pendientes</dt><dd>{scenario.projectedPendingAssignments}</dd></div>
            </dl>
            <small>{scenario.assumptions.slice(0, 2).join(" · ")}</small>
          </article>
        ))}
      </section>

      <div className="lab-next-step">
        <div><p className="section-kicker">Escenario seleccionado</p><h2>Plan completo · {Math.round(currentPlan.projectedRiskScore)} % de riesgo estimado</h2></div>
        <button className="solid-action" type="button" disabled={isCreatingPlan} onClick={createPlan}>{isCreatingPlan ? "Preparando plan…" : "Crear plan de 14 días"}</button>
      </div>

      <footer className="phase-footer"><span className="phase-line step-three" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Paso 3 de 5 · Simular</p></footer>
    </>
  );
}
