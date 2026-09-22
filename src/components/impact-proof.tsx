import Image from "next/image";
import type { CSSProperties } from "react";

import { simulateScenario } from "@/lib/simulation";
import type { SimulationInput, Student } from "@/types/student";

type ImpactProofProps = {
  student: Student;
  plan: SimulationInput;
  approved: boolean;
  onBack: () => void;
  onRestart: () => void;
};

export function ImpactProof({ student, plan, approved, onBack, onRestart }: ImpactProofProps) {
  const scenario = simulateScenario(student, plan);
  const initialRisk = Math.round(student.riskScore);
  const estimatedRisk = Math.round(scenario.projectedRiskScore);
  const observedRisk = Math.min(100, estimatedRisk + 3);
  const improvement = initialRisk - observedRisk;
  const observedAttendance = Math.min(100, plan.targetAttendance - 1);
  const attendanceGain = observedAttendance - student.attendancePercent;
  const recoveredAssignments = Math.min(plan.recoveredAssignments, student.pendingAssignments);
  const observedAverage = Math.min(20, Math.round((student.currentAverage + 1.6) * 10) / 10);
  const planCompletion = 88;

  const indicators = [
    { label: "Asistencia", before: student.attendancePercent, after: observedAttendance, maximum: 100, suffix: "%", tone: "teal", inverse: false },
    { label: "Promedio", before: student.currentAverage, after: observedAverage, maximum: 20, suffix: "/20", tone: "harvest", inverse: false },
    { label: "Pendientes", before: student.pendingAssignments, after: student.pendingAssignments - recoveredAssignments, maximum: student.totalAssignments, suffix: "", tone: "terracotta", inverse: true },
  ];

  return (
    <>
      <section className="page-heading twin-heading impact-heading">
        <div>
          <button className="text-action" type="button" onClick={onBack}>Volver al plan</button>
          <p className="eyebrow">Impact Proof · Ejemplo de 14 días</p>
          <h1>Así podría revisarse el impacto</h1>
          <p className="lede">Compara la estimación con un resultado hipotético. Todos los cambios que ves aquí son datos sintéticos, no mediciones reales.</p>
        </div>
        <div className="impact-result"><span>Mejora simulada</span><strong>−{improvement} puntos</strong><small>Riesgo académico hipotético</small></div>
      </section>

      {!approved ? <div className="preview-notice"><strong>Vista previa</strong><span>Aprueba primero el plan para explorar este ejemplo de seguimiento.</span></div> : null}

      <section className="impact-kpis" aria-label="Resumen del impacto simulado">
        <article className="risk-drop"><span>Riesgo reducido</span><strong>{initialRisk}% <i>→</i> {observedRisk}%</strong><small>{improvement} puntos menos en 14 días</small></article>
        <article><span>Diferencia entre escenarios</span><strong>±{Math.abs(observedRisk - estimatedRisk)} pts</strong><small>Comparación ilustrativa</small></article>
        <article><span>Asistencia recuperada</span><strong>+{attendanceGain} pts</strong><small>De {student.attendancePercent}% a {observedAttendance}%</small></article>
        <article><span>Actividades cerradas</span><strong>{recoveredAssignments}/{plan.recoveredAssignments}</strong><small>Meta del periodo completada</small></article>
      </section>

      <div className="proof-grid enhanced">
        <section className="proof-story">
          <div className="proof-heading">
            <Image src="/img/AYNI-Student-Neutral.png" alt="Representación visual sintética de la estudiante" width={72} height={72} />
            <div><p className="section-kicker">Trayectoria de {student.displayName}</p><h2>Un ejemplo para revisar el acompañamiento</h2><span>Seguimiento hipotético · Datos sintéticos</span></div>
          </div>

          <div className="proof-values">
            <article><span>Riesgo inicial</span><strong>{initialRisk}%</strong><small>Antes del plan</small></article>
            <article><span>Riesgo estimado</span><strong>{estimatedRisk}%</strong><small>Escenario aprobado</small></article>
            <article><span>Resultado simulado</span><strong>{observedRisk}%</strong><small>Ejemplo de 14 días</small></article>
          </div>

          <div className="chart-heading"><div><p className="section-kicker">Evolución hipotética del riesgo</p><h3>Estimación frente a resultado simulado</h3></div><span className="chart-badge">Diferencia final · {observedRisk - estimatedRisk} pts</span></div>
          <svg className="proof-chart" viewBox="0 0 760 300" role="img" aria-label={`El riesgo bajó de ${initialRisk} a ${observedRisk} por ciento, frente a una estimación de ${estimatedRisk} por ciento`}>
            <defs><linearGradient id="observed-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4e8c63" stopOpacity="0.2" /><stop offset="1" stopColor="#4e8c63" stopOpacity="0" /></linearGradient></defs>
            <g className="chart-grid-lines"><line x1="68" y1="55" x2="706" y2="55" /><line x1="68" y1="120" x2="706" y2="120" /><line x1="68" y1="185" x2="706" y2="185" /><line x1="68" y1="250" x2="706" y2="250" /></g>
            <text x="20" y="60" className="axis-label">80</text><text x="20" y="125" className="axis-label">60</text><text x="20" y="190" className="axis-label">40</text><text x="20" y="255" className="axis-label">20</text>
            <path d="M70 61 C190 75, 215 115, 282 126 S430 187, 494 201 S630 231, 704 237 L704 250 L70 250 Z" className="proof-area" />
            <path pathLength="100" d="M70 61 C190 75, 215 115, 282 126 S430 187, 494 201 S630 231, 704 237" className="proof-observed" />
            <path pathLength="100" d="M70 61 C190 84, 215 122, 282 139 S430 194, 494 214 S630 241, 704 247" className="proof-expected" />
            {[{ x: 70, y: 61 }, { x: 282, y: 126 }, { x: 494, y: 201 }, { x: 704, y: 237 }].map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="7" className="proof-point observed" />)}
            <circle cx="704" cy="247" r="7" className="proof-point expected" />
            <g className="axis-dates"><text x="55" y="283">Inicio</text><text x="256" y="283">Día 4</text><text x="468" y="283">Día 9</text><text x="674" y="283">Día 14</text></g>
          </svg>
          <div className="scenario-legend"><span className="plan"><i />Estimación · {estimatedRisk}%</span><span className="observed"><i />Resultado simulado · {observedRisk}%</span></div>
        </section>

        <aside className="proof-learning">
          <div className="completion-ring" style={{ "--completion": `${planCompletion * 3.6}deg` } as CSSProperties}><div><strong>{planCompletion}%</strong><span>del plan cumplido</span></div></div>
          <p className="section-kicker">Lectura del resultado</p>
          <h2>La comparación muestra cómo ajustar un plan</h2>
          <div className="learning-list">
            <article><strong>La asistencia respondió primero</strong><p>Subió {attendanceGain} puntos y sostuvo el resto del avance.</p></article>
            <article><strong>La meta de entregas se cumplió</strong><p>Se recuperaron {recoveredAssignments} actividades prioritarias.</p></article>
            <article><strong>El riesgo quedó {observedRisk - estimatedRisk} puntos sobre lo esperado</strong><p>No invalida el plan: indica dónde ajustar el siguiente ciclo.</p></article>
          </div>
          <div className="continue-support"><strong>Siguiente decisión sugerida</strong><p>Mantener una tutoría semanal y revisar asistencia nuevamente en siete días.</p></div>
          <button className="secondary-action full" type="button" onClick={onRestart}>Volver al panorama</button>
        </aside>
      </div>

      <section className="impact-detail-grid">
        <article className="indicator-panel">
          <div className="detail-heading"><div><p className="section-kicker">Cambio hipotético por indicador</p><h2>Antes y después simulados</h2></div><span>14 días</span></div>
          <div className="indicator-list">
            {indicators.map((indicator) => {
              const beforeWidth = Math.max(6, (indicator.before / indicator.maximum) * 100);
              const afterWidth = Math.max(6, (indicator.after / indicator.maximum) * 100);
              return <div className="indicator-row" key={indicator.label}>
                <div className="indicator-label"><strong>{indicator.label}</strong><span>{indicator.inverse ? "Menos es mejor" : "Más es mejor"}</span></div>
                <div className="paired-bars">
                  <span><i style={{ width: `${beforeWidth}%` }} /><b>Antes · {indicator.before}{indicator.suffix}</b></span>
                  <span className={`after ${indicator.tone}`}><i style={{ width: `${afterWidth}%` }} /><b>Ahora · {indicator.after}{indicator.suffix}</b></span>
                </div>
              </div>;
            })}
          </div>
        </article>

        <article className="contribution-panel">
          <p className="section-kicker">Qué impulsó el cambio</p><h2>Aporte estimado por señal</h2>
          <div className="contribution-bars" aria-label="Contribución estimada de cada señal">
            <div><span><b>Asistencia</b><strong>42%</strong></span><i style={{ "--value": "42%" } as CSSProperties} /></div>
            <div><span><b>Entregas</b><strong>34%</strong></span><i style={{ "--value": "34%" } as CSSProperties} /></div>
            <div><span><b>Tutorías</b><strong>24%</strong></span><i style={{ "--value": "24%" } as CSSProperties} /></div>
          </div>
          <p className="model-note">Atribución orientativa del modelo transparente. No representa causalidad comprobada.</p>
        </article>

        <article className="milestone-panel">
          <p className="section-kicker">Hitos de ejemplo</p><h2>Qué podría ocurrir durante el plan</h2>
          <div className="milestone-line">
            <div><span>Día 2</span><strong>Acuerdo familiar</strong><p>Rutina de asistencia confirmada.</p></div>
            <div><span>Día 4</span><strong>Primera tutoría</strong><p>Se reforzó la base de Matemática.</p></div>
            <div><span>Día 9</span><strong>Entregas recuperadas</strong><p>{recoveredAssignments} actividades fueron validadas.</p></div>
            <div><span>Día 14</span><strong>Revisión docente</strong><p>Resultado simulado y posible ajuste.</p></div>
          </div>
        </article>
      </section>

      <footer className="phase-footer"><span className="phase-line step-five" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Paso 5 de 5 · Medir, comprender y aprender</p></footer>
    </>
  );
}
