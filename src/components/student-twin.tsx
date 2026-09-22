"use client";

import Image from "next/image";
import { useState } from "react";

import { calculateRisk } from "@/lib/risk";
import type { Student } from "@/types/student";

type StudentTwinProps = {
  student: Student;
  onBack: () => void;
  onOpenLab: () => void;
};

type TwinTab = "summary" | "subjects" | "record";

const clamp = (value: number, min = 0, max = 20) => Math.min(max, Math.max(min, value));

export function StudentTwin({ student, onBack, onOpenLab }: StudentTwinProps) {
  const [tab, setTab] = useState<TwinTab>("summary");
  const [noteDraft, setNoteDraft] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const risk = calculateRisk(student);
  const change = Math.round((student.currentAverage - student.previousAverage) * 10) / 10;
  const factorRows = [
    { label: "Asistencia", value: `${student.attendancePercent}%`, risk: risk.attendanceRisk },
    { label: "Rendimiento", value: student.currentAverage.toFixed(1), risk: risk.gradeRisk },
    { label: "Pendientes", value: String(student.pendingAssignments), risk: risk.assignmentRisk },
  ];
  const subjects = [
    { name: "Matemática", score: student.currentAverage, delta: change, attendance: student.attendancePercent, tone: "attention" },
    { name: "Comunicación", score: clamp(student.currentAverage + 2.8), delta: 0.4, attendance: Math.min(100, student.attendancePercent + 12), tone: "steady" },
    { name: "Ciencia y Tecnología", score: clamp(student.currentAverage + 1.6), delta: -0.3, attendance: Math.min(100, student.attendancePercent + 8), tone: "watch" },
    { name: "Ciencias Sociales", score: clamp(student.currentAverage + 3.2), delta: 0.6, attendance: Math.min(100, student.attendancePercent + 16), tone: "steady" },
  ];

  const saveNote = () => {
    const cleanNote = noteDraft.trim();
    if (!cleanNote) return;
    setSavedNotes((current) => [cleanNote, ...current]);
    setNoteDraft("");
  };

  return (
    <>
      <section className="page-heading twin-heading">
        <div>
          <button className="text-action" type="button" onClick={onBack}>Volver al panorama</button>
          <p className="eyebrow">Student Twin · {student.id}</p>
          <h1>{student.displayName}</h1>
          <p className="lede">Una lectura explicable de su trayectoria, organizada para comprender antes de intervenir.</p>
        </div>
        <button className="solid-action" type="button" onClick={onOpenLab}>Explorar futuros</button>
      </section>

      <nav className="twin-tabs" aria-label="Secciones del Student Twin">
        {([['summary', 'Resumen'], ['subjects', 'Asignaturas'], ['record', 'Registro docente']] as const).map(([value, label]) => (
          <button type="button" role="tab" aria-selected={tab === value} className={tab === value ? "active" : ""} key={value} onClick={() => setTab(value)}>{label}</button>
        ))}
      </nav>

      <div className="twin-grid">
        <section className="twin-story">
          <div className="identity-line">
            <Image className="student-profile-image" src="/img/AYNI-Student-Neutral.png" alt="Representación visual sintética de la estudiante" width={58} height={58} />
            <div><h2>{student.grade} {student.section} · Secundaria</h2><p>Actualizado hoy, 09:40 · Datos sintéticos</p></div>
            <span className={`trajectory-state ${student.status}`}>{student.status === "improving" ? "Mejorando" : student.status === "active" ? "Acompañamiento activo" : "En observación"}</span>
          </div>

          {tab === "summary" ? (
            <>
              <div className="story-section">
                <p className="section-kicker">Cómo se compone la estimación</p>
                <h2>Factores observables, no etiquetas</h2>
                <div className="risk-factors">
                  {factorRows.map((factor) => (
                    <div className="risk-factor-row" key={factor.label}>
                      <span>{factor.label}</span><div className="factor-track"><i style={{ width: `${factor.risk}%` }} /></div><strong>{factor.value}</strong>
                    </div>
                  ))}
                </div>
                <p className="explanation-copy">La señal aumentó porque la asistencia es {student.attendancePercent}%, el promedio cambió {Math.abs(change).toFixed(1)} puntos y existen {student.pendingAssignments} actividades pendientes.</p>
              </div>

              <div className="story-section trajectory-section">
                <div className="section-row"><div><p className="section-kicker">Tendencia académica</p><h2>Promedio de las últimas cuatro semanas</h2></div><span className={change < 0 ? "negative" : "positive"}>{change > 0 ? "+" : ""}{change} pts</span></div>
                <svg className="twin-trend-chart" viewBox="0 0 700 220" role="img" aria-label={`El promedio cambió de ${student.previousAverage} a ${student.currentAverage}`}>
                  <g className="trend-grid"><line x1="48" y1="45" x2="655" y2="45" /><line x1="48" y1="100" x2="655" y2="100" /><line x1="48" y1="155" x2="655" y2="155" /></g>
                  <path d="M55 50 C145 53, 205 76, 252 82 S390 113, 452 126 S570 151, 646 159 L646 176 L55 176 Z" className="trend-area" />
                  <path pathLength="100" d="M55 50 C145 53, 205 76, 252 82 S390 113, 452 126 S570 151, 646 159" className="trend-line" />
                  {[{x:55,y:50},{x:252,y:82},{x:452,y:126},{x:646,y:159}].map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="6" className="trend-point" />)}
                  <g className="trend-labels"><text x="45" y="197">Sem. 1</text><text x="230" y="197">Sem. 2</text><text x="430" y="197">Sem. 3</text><text x="618" y="197">Hoy</text></g>
                  <text x="45" y="34" className="trend-value">{student.previousAverage}</text><text x="618" y="148" className="trend-value">{student.currentAverage}</text>
                </svg>
              </div>

              <div className="story-section">
                <p className="section-kicker">Trayectoria reciente</p><h2>Qué cambió y cuándo</h2>
                <div className="academic-timeline">
                  <article><span>Hace 21 días</span><strong>Primera caída sostenida del promedio</strong><p>Matemática comenzó a separarse de la tendencia anterior.</p></article>
                  <article><span>Hace 8 días</span><strong>Se acumularon nuevas barreras</strong><p>Dos inasistencias y dos actividades pendientes.</p></article>
                  <article><span>Hoy</span><strong>El caso requiere revisión docente</strong><p>La señal cruzó el umbral de atención prioritaria.</p></article>
                </div>
              </div>
            </>
          ) : tab === "subjects" ? (
            <div className="story-section subjects-view">
              <p className="section-kicker">Detalle por asignatura</p><h2>La dificultad no aparece igual en todos los cursos</h2>
              <p className="view-intro">Esta separación ayuda a focalizar el apoyo sin convertir una señal puntual en una etiqueta general.</p>
              <div className="subject-grid">
                {subjects.map((subject) => <article className={subject.tone} key={subject.name}>
                  <div><span>{subject.name}</span><strong>{subject.score.toFixed(1)}</strong></div>
                  <div className="subject-spark" aria-hidden="true"><i /><i /><i /><i /></div>
                  <dl><div><dt>Cambio</dt><dd className={subject.delta < 0 ? "negative" : "positive"}>{subject.delta > 0 ? "+" : ""}{subject.delta.toFixed(1)}</dd></div><div><dt>Asistencia</dt><dd>{subject.attendance}%</dd></div></dl>
                </article>)}
              </div>
              <div className="pending-work">
                <div className="section-row"><div><p className="section-kicker">Trabajo pendiente</p><h2>Entregas que requieren seguimiento</h2></div><span>{student.pendingAssignments} abiertas</span></div>
                <div className="pending-list"><article><span>Matemática</span><strong>Resolución de ecuaciones</strong><small>Prioridad alta · Venció hace 3 días</small></article><article><span>Ciencia</span><strong>Informe de laboratorio</strong><small>En progreso · Entrega mañana</small></article><article><span>Comunicación</span><strong>Comprensión lectora</strong><small>Puede recuperarse esta semana</small></article></div>
              </div>
            </div>
          ) : (
            <div className="story-section record-view">
              <p className="section-kicker">Registro docente</p><h2>Observaciones y acuerdos del acompañamiento</h2>
              <p className="view-intro">Solo se registran hechos útiles para el apoyo educativo, con lenguaje respetuoso y fecha.</p>
              <div className="note-composer">
                <label htmlFor="teacher-note">Nueva observación</label>
                <textarea id="teacher-note" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Describe un hecho observado, acuerdo o próximo paso…" />
                <div><small>{noteDraft.length}/280</small><button type="button" disabled={!noteDraft.trim() || noteDraft.length > 280} onClick={saveNote}>Guardar observación</button></div>
              </div>
              <div className="record-timeline">
                {savedNotes.map((note, index) => <article key={`${note}-${index}`}><span>Ahora · Johan</span><strong>Observación docente</strong><p>{note}</p></article>)}
                <article><span>Hoy · 09:15</span><strong>Acuerdo de seguimiento</strong><p>Revisar las actividades prioritarias y coordinar la primera tutoría.</p></article>
                <article><span>Ayer · 16:30</span><strong>Contacto con la familia</strong><p>Se acordó reforzar una rutina de llegada y comunicar ausencias previstas.</p></article>
                <article><span>Hace 8 días</span><strong>Evidencia académica</strong><p>Se registraron dos entregas pendientes en Matemática.</p></article>
              </div>
            </div>
          )}
        </section>

        <aside className="twin-summary">
          <p>Riesgo académico estimado</p><strong>{Math.round(student.riskScore)}%</strong><span>Necesita atención</span><hr />
          <dl><div><dt>Asistencia</dt><dd>{student.attendancePercent}%</dd></div><div><dt>Promedio actual</dt><dd>{student.currentAverage}</dd></div><div><dt>Cambio reciente</dt><dd className={change < 0 ? "negative" : "positive"}>{change > 0 ? "+" : ""}{change}</dd></div><div><dt>Actividades pendientes</dt><dd>{student.pendingAssignments} de {student.totalAssignments}</dd></div></dl>
          <p className="responsible-note">AYNI Twin orienta la revisión humana. No diagnostica ni garantiza un resultado.</p>
          <button className="primary-action" type="button" onClick={onOpenLab}>Abrir Future Lab<span>Simular apoyos</span></button>
        </aside>
      </div>

      <footer className="phase-footer"><span className="phase-line step-two" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Paso 2 de 5 · Comprender</p></footer>
    </>
  );
}
