import { calculateRisk } from "@/lib/risk";
import type { RiskLevel, Student } from "@/types/student";
import Image from "next/image";
import { AyniSelect } from "@/components/ayni-select";

type Filter = "all" | RiskLevel | "improving";

const riskLabels: Record<RiskLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

type DashboardHomeProps = {
  students: Student[];
  visibleStudents: Student[];
  selectedStudent: Student;
  selectedId: string;
  filter: Filter;
  searchQuery: string;
  gradeFilter: string;
  onFilterChange: (filter: Filter) => void;
  onSearchChange: (query: string) => void;
  onGradeChange: (grade: string) => void;
  onResetFilters: () => void;
  onSelectStudent: (id: string) => void;
  onOpenStudent: () => void;
};

export function DashboardHome({
  students,
  visibleStudents,
  selectedStudent,
  selectedId,
  filter,
  searchQuery,
  gradeFilter,
  onFilterChange,
  onSearchChange,
  onGradeChange,
  onResetFilters,
  onSelectStudent,
  onOpenStudent,
}: DashboardHomeProps) {
  const grades = Array.from(new Set(students.map((student) => student.grade))).sort();
  const distribution = students.reduce(
    (total, student) => {
      total[student.riskLevel] += 1;
      return total;
    },
    { low: 0, medium: 0, high: 0 },
  );
  const improving = students.filter(
    (student) => student.status === "improving",
  ).length;
  const selectedRisk = calculateRisk(selectedStudent);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Panorama de hoy</p>
          <h1>¿Quién necesita apoyo ahora?</h1>
          <p className="lede">
            Prioriza acciones concretas antes de que una dificultad se
            convierta en una barrera.
          </p>
        </div>
        <div className="date-chip">
          <span>Última actualización</span>
          <strong>Hoy · 09:40</strong>
        </div>
      </section>

      <section className="metric-ribbon" aria-label="Resumen de impacto">
        <article><span>Estudiantes analizados</span><strong>{students.length}</strong><small>Datos sintéticos</small></article>
        <article className="attention"><span>Necesitan atención</span><strong>{distribution.high}</strong><small>Riesgo alto</small></article>
        <article className="recovery"><span>Con mejora reciente</span><strong>{improving}</strong><small>Últimos 14 días</small></article>
        <article className="operations"><span>Acompañamiento en curso</span><strong>4 planes</strong><small>3.5 h de gestión recuperadas</small></article>
        <div className="distribution" aria-label="Distribución de riesgo">
          <span style={{ flex: distribution.low }} className="low" />
          <span style={{ flex: distribution.medium }} className="medium" />
          <span style={{ flex: distribution.high }} className="high" />
        </div>
      </section>

      <section className="student-toolbar" aria-label="Buscar y filtrar estudiantes">
        <label className="student-search">
          <span>Buscar estudiante</span>
          <input type="search" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Nombre o código, por ejemplo AT-031" />
        </label>
        <AyniSelect className="grade-filter" label="Grado" value={gradeFilter} onChange={onGradeChange} options={[{ value: "all", label: "Todos los grados" }, ...grades.map((grade) => ({ value: grade, label: `${grade} de secundaria` }))]} />
        <div className="filter-result"><strong>{visibleStudents.length}</strong><span>resultados visibles</span></div>
      </section>

      <div className="dashboard-grid">
        <section className="priority-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Atención priorizada</p>
              <h2>Trayectorias que requieren acompañamiento</h2>
            </div>
            <div className="filter-row" aria-label="Filtrar estudiantes">
              {([[
                "all", "Todos",
              ], ["high", "Alto"], ["medium", "Medio"], ["improving", "Mejorando"]] as const).map(([value, label]) => (
                <button aria-pressed={filter === value} key={value} onClick={() => onFilterChange(value)} type="button">{label}</button>
              ))}
            </div>
          </div>

          <div className="student-list">
            {visibleStudents.slice(0, 10).map((student, index) => (
              <button className={student.id === selectedId ? "selected" : ""} key={student.id} onClick={() => onSelectStudent(student.id)} type="button">
                <span className="priority-index">{String(index + 1).padStart(2, "0")}</span>
                <Image className="student-row-image" src="/img/AYNI-Student-Neutral.png" alt="" width={38} height={38} aria-hidden="true" />
                <span className="student-main"><strong>{student.displayName}</strong><small>{calculateRisk(student).factors[0]}</small></span>
                <span className="student-grade">{student.grade} {student.section}</span>
                <span className={`risk-value ${student.riskLevel}`}><strong>{Math.round(student.riskScore)}</strong><small>{riskLabels[student.riskLevel]}</small></span>
              </button>
            ))}
            {visibleStudents.length === 0 ? (
              <div className="empty-students" role="status">
                <span aria-hidden="true"><i /><i /><i /></span>
                <h3>No encontramos trayectorias con estos filtros</h3>
                <p>Prueba otro nombre, grado o nivel de atención.</p>
                <button type="button" onClick={onResetFilters}>Limpiar filtros</button>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="student-focus" aria-live="polite">
          <div className="focus-thread" aria-hidden="true"><span /><span /><span /></div>
          <p className="section-kicker">Lectura del caso</p>
          <div className="student-identity">
            <Image className="student-focus-image" src="/img/AYNI-Student-Neutral.png" alt={`Representación visual sintética de ${selectedStudent.displayName}`} width={48} height={48} />
            <div><h2>{selectedStudent.displayName}</h2><p>{selectedStudent.grade} {selectedStudent.section} · {selectedStudent.id}</p></div>
          </div>
          <div className="risk-summary">
            <span>Riesgo académico estimado</span>
            <strong>{Math.round(selectedStudent.riskScore)}%</strong>
            <p>{riskLabels[selectedStudent.riskLevel]} · Revisión docente</p>
          </div>
          <div className="factor-list">
            {selectedRisk.factors.map((factor) => <div key={factor}><span aria-hidden="true" /><p>{factor}</p></div>)}
          </div>
          <p className="responsible-note">Esta estimación ayuda a priorizar apoyo. No diagnostica ni determina el futuro del estudiante.</p>
          <button className="primary-action" type="button" onClick={onOpenStudent}>Abrir Student Twin<span>Comprender el caso</span></button>
        </aside>
      </div>

      <footer className="phase-footer"><span className="phase-line" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Paso 1 de 5 · Detectar</p></footer>
    </>
  );
}
