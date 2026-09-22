"use client";

import Image from "next/image";
import { useState } from "react";

import { simulateScenario } from "@/lib/simulation";
import type { GeneratedInterventionPlan, SimulationInput, Student } from "@/types/student";

type PlanAction = {
  id: number;
  action: string;
  responsible: string;
  deadline: string;
  indicator: string;
};

type InterventionPlanProps = {
  student: Student;
  plan: SimulationInput;
  approved: boolean;
  generatedPlan: GeneratedInterventionPlan | null;
  onApprove: () => void | Promise<void>;
  onBack: () => void;
  onOpenProof: () => void;
};

export function InterventionPlan({
  student,
  plan,
  approved,
  generatedPlan,
  onApprove,
  onBack,
  onOpenProof,
}: InterventionPlanProps) {
  const scenario = simulateScenario(student, plan);
  const [editing, setEditing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [objective, setObjective] = useState(
    generatedPlan?.objective ?? `Recuperar la continuidad académica de ${student.displayName.split(" ")[0]} mediante asistencia sostenida, acompañamiento en Matemática y cierre gradual de actividades pendientes.`,
  );
  const [actions, setActions] = useState<PlanAction[]>(() => (generatedPlan?.actions ?? [
      { action: `Coordinar ${plan.tutoringSessions} tutorías de Matemática`, responsible: "Docente de Matemática", deadline: "Día 3", indicator: "Dos sesiones registradas" },
      { action: `Recuperar ${plan.recoveredAssignments} actividades prioritarias`, responsible: student.displayName.split(" ")[0], deadline: "Día 9", indicator: "Tres entregas validadas" },
      { action: "Acordar una rutina de asistencia", responsible: "Docente tutor y familia", deadline: "Día 2", indicator: `Asistencia mínima de ${plan.targetAttendance} %` },
      { action: "Revisar avances y ajustar el apoyo", responsible: "Docente tutor", deadline: "Día 14", indicator: "Comparación registrada" },
    ]).map((action, index) => ({ id: index + 1, ...action })));

  const updateAction = (id: number, field: keyof PlanAction, value: string) => {
    setActions((current) => current.map((action) => action.id === id ? { ...action, [field]: value } : action));
  };

  return (
    <>
      <section className="page-heading twin-heading">
        <div>
          <button className="text-action" type="button" onClick={onBack}>Volver a Future Lab</button>
          <p className="eyebrow">Plan de intervención · 14 días</p>
          <h1>Convertir el escenario en acciones</h1>
          <p className="lede">Un borrador concreto para revisar, editar y aprobar antes de acompañar a la estudiante.</p>
        </div>
        <div className={`approval-state ${approved ? "approved" : "draft"}`}><span>{approved ? "Plan aprobado" : "Borrador docente"}</span><strong>{approved ? "Listo para seguimiento" : "Revisión necesaria"}</strong></div>
      </section>

      <div className="plan-grid">
        <section className="plan-document">
          <div className="plan-provenance">
            <Image src="/img/AYNI-Twin-App-Icon.png" alt="Símbolo de AYNI Twin" width={38} height={38} />
            <p><strong>Borrador local · Datos sintéticos</strong><span>{generatedPlan?.disclaimer ?? "La decisión final pertenece al docente y toda acción requiere revisión humana."}</span></p>
          </div>

          <div className="plan-objective">
            <p className="section-kicker">Objetivo</p>
            {editing ? <textarea aria-label="Objetivo del plan" value={objective} onChange={(event) => setObjective(event.target.value)} /> : <h2>{objective}</h2>}
          </div>

          <div className="plan-action-list">
            {actions.map((action) => (
              <article key={action.id}>
                <span className="action-number">{action.id}</span>
                <div className="action-content">
                  {editing ? <input aria-label={`Acción ${action.id}`} value={action.action} onChange={(event) => updateAction(action.id, "action", event.target.value)} /> : <h3>{action.action}</h3>}
                  <dl>
                    <div><dt>Responsable</dt>{editing ? <input aria-label={`Responsable ${action.id}`} value={action.responsible} onChange={(event) => updateAction(action.id, "responsible", event.target.value)} /> : <dd>{action.responsible}</dd>}</div>
                    <div><dt>Fecha límite</dt>{editing ? <input aria-label={`Fecha límite ${action.id}`} value={action.deadline} onChange={(event) => updateAction(action.id, "deadline", event.target.value)} /> : <dd>{action.deadline}</dd>}</div>
                    <div><dt>Indicador</dt>{editing ? <input aria-label={`Indicador ${action.id}`} value={action.indicator} onChange={(event) => updateAction(action.id, "indicator", event.target.value)} /> : <dd>{action.indicator}</dd>}</div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="plan-review">
          <Image className="plan-teacher-image" src="/img/AYNI-Teacher-Neutral.png" alt="Representación del docente responsable" width={84} height={84} />
          <p className="section-kicker">Revisión humana</p>
          <h2>Johan · Docente tutor</h2>
          <dl>
            <div><dt>Riesgo inicial</dt><dd>{Math.round(student.riskScore)}%</dd></div>
            <div><dt>Riesgo esperado</dt><dd>{Math.round(scenario.projectedRiskScore)}%</dd></div>
            <div><dt>Fecha de revisión</dt><dd>En 14 días</dd></div>
            <div><dt>Acciones</dt><dd>{actions.length}</dd></div>
          </dl>
          <p className="responsible-note">Aprobar confirma que el docente revisó el objetivo, los responsables y los indicadores.</p>
          {!approved ? (
            <>
              <button className="secondary-action" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Guardar cambios" : "Editar antes de aprobar"}</button>
              <button className="solid-action full" type="button" disabled={isApproving} onClick={async () => { setEditing(false); setIsApproving(true); try { await onApprove(); } finally { setIsApproving(false); } }}>{isApproving ? "Registrando…" : "Aprobar plan"}</button>
            </>
          ) : (
            <button className="solid-action full" type="button" onClick={onOpenProof}>Ver Impact Proof</button>
          )}
        </aside>
      </div>

      <footer className="phase-footer"><span className="phase-line step-four" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Paso 4 de 5 · Intervenir</p></footer>
    </>
  );
}
