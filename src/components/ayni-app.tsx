"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { DashboardHome } from "@/components/dashboard-home";
import { AyniAnalysisTransition } from "@/components/ayni-analysis-transition";
import { AyniLoader } from "@/components/ayni-loader";
import { AyniSelect } from "@/components/ayni-select";
import { AyniToast } from "@/components/ayni-toast";
import { FutureLab } from "@/components/future-lab";
import { ImpactProof } from "@/components/impact-proof";
import { InterventionPlan } from "@/components/intervention-plan";
import { ResponsibleUseDialog } from "@/components/responsible-use-dialog";
import { StudentTwin } from "@/components/student-twin";
import { approveInterventionInApi, fetchStudentsFromApi, generatePlanFromApi, saveScenarioToApi } from "@/lib/api";
import { simulateScenario } from "@/lib/simulation";
import type { GeneratedInterventionPlan, RiskLevel, SimulationInput, Student } from "@/types/student";

type View = "dashboard" | "student" | "lab" | "plan" | "proof";
type Filter = "all" | RiskLevel | "improving";
type DataStatus = "connecting" | "aws" | "fallback";
type ToastState = { id: number; title: string; detail: string; tone?: "success" | "info" };

const transitionMessages: Record<View, string> = {
  dashboard: "Reuniendo el panorama actualizado",
  student: "Construyendo la lectura del Student Twin",
  lab: "Proyectando trayectorias posibles",
  plan: "Organizando el plan de acompañamiento",
  proof: "Contrastando estimación y evidencia",
};

export function AyniApp({ students: initialStudents }: { students: Student[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [dataStatus, setDataStatus] = useState<DataStatus>("connecting");
  const [isBooting, setIsBooting] = useState(true);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [period, setPeriod] = useState("2026-I");
  const [activityOpen, setActivityOpen] = useState(false);
  const [responsibleUseOpen, setResponsibleUseOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedId, setSelectedId] = useState("AT-031");
  const [approved, setApproved] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedInterventionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SimulationInput>({
    targetAttendance: 85,
    tutoringSessions: 2,
    recoveredAssignments: 3,
    familyContact: true,
    personalizedPlan: true,
  });
  const selectedStudent =
    students.find((student) => student.id === selectedId) ?? students[0];
  const visibleStudents = useMemo(() => students.filter((student) => {
    const matchesRisk = filter === "all"
      ? true
      : filter === "improving"
        ? student.status === "improving"
        : student.riskLevel === filter;
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("es");
    const matchesSearch = !normalizedQuery
      || student.displayName.toLocaleLowerCase("es").includes(normalizedQuery)
      || student.id.toLocaleLowerCase("es").includes(normalizedQuery);
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter;
    return matchesRisk && matchesSearch && matchesGrade;
  }), [filter, gradeFilter, searchQuery, students]);

  const showToast = (nextToast: Omit<ToastState, "id">) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), ...nextToast });
    toastTimer.current = window.setTimeout(() => setToast(null), 4_200);
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4_000);
    let active = true;
    const minimumDisplay = new Promise((resolve) => window.setTimeout(resolve, 1_850));
    Promise.allSettled([fetchStudentsFromApi(controller.signal), minimumDisplay])
      .then(([apiResult]) => {
        const remoteStudents = apiResult.status === "fulfilled" ? apiResult.value : null;
        if (remoteStudents?.length) {
          setStudents(remoteStudents);
          setDataStatus("aws");
        } else {
          setDataStatus("fallback");
        }
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) setIsBooting(false);
      });
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  if (isBooting) return <AyniLoader />;

  const navigate = (next: View) => {
    if (next === view || transitionMessage) return;
    setTransitionMessage(transitionMessages[next]);
    transitionTimer.current = window.setTimeout(() => {
      setView(next);
      setTransitionMessage(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1_500);
  };

  const createPlan = async (plan: SimulationInput) => {
    if (transitionMessage) return;
    setSelectedPlan(plan);
    setTransitionMessage("Generando un borrador explicable y verificando sus acciones");
    const [savedScenario, remotePlan] = await Promise.allSettled([
      saveScenarioToApi(selectedStudent.id, plan),
      generatePlanFromApi(selectedStudent.id, plan),
      new Promise((resolve) => window.setTimeout(resolve, 1_650)),
    ]);
    const planResult = remotePlan.status === "fulfilled" ? remotePlan.value : null;
    setGeneratedPlan(planResult);
    setView("plan");
    setTransitionMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const storedInAws = savedScenario.status === "fulfilled" && Boolean(savedScenario.value);
    showToast({
      title: planResult?.source === "bedrock" ? "Plan generado con Bedrock" : "Plan preparado para revisión",
      detail: storedInAws ? "El escenario quedó guardado en AWS." : "El modo local mantiene disponible toda la demostración.",
      tone: planResult?.source === "bedrock" ? "success" : "info",
    });
  };

  const approvePlan = async () => {
    const projected = simulateScenario(selectedStudent, selectedPlan).projectedRiskScore;
    let savedInAws = false;
    try {
      const intervention = await approveInterventionInApi({
        studentId: selectedStudent.id,
        planId: generatedPlan?.id,
        initialRisk: selectedStudent.riskScore,
        estimatedRisk: projected,
      });
      savedInAws = Boolean(intervention);
    } catch {
      savedInAws = false;
    }
    setApproved(true);
    showToast({
      title: "Plan aprobado",
      detail: savedInAws ? "La intervención quedó registrada en AWS para seguimiento." : "La intervención quedó registrada en el modo demostración local.",
      tone: "success",
    });
  };

  return (
    <div className="app-shell">
      {transitionMessage ? <AyniAnalysisTransition message={transitionMessage} /> : null}
      {toast ? <AyniToast key={toast.id} title={toast.title} detail={toast.detail} tone={toast.tone} onClose={() => setToast(null)} /> : null}
      <ResponsibleUseDialog open={responsibleUseOpen} dataMode={dataStatus} onClose={() => setResponsibleUseOpen(false)} />
      <aside className="sidebar">
        <div className="brand-block"><Image className="brand-logo" src="/img/AYNI-Twin-Logo-Primary.png" alt="AYNI Twin" width={181} height={60} priority /><p>Trayectorias de apoyo educativo</p></div>
        <nav className="side-nav" aria-label="Navegación principal">
          <button className={view === "dashboard" ? "active" : ""} type="button" onClick={() => navigate("dashboard")}>Panorama</button>
          <button className={view === "student" ? "active" : ""} type="button" onClick={() => navigate("student")}>Student Twin</button>
          <button className={view === "lab" ? "active" : ""} type="button" onClick={() => navigate("lab")}>Future Lab</button>
          <button className={view === "plan" ? "active" : ""} type="button" onClick={() => navigate("plan")}>Plan de apoyo</button>
          <button className={view === "proof" ? "active" : ""} type="button" disabled={!approved} onClick={() => navigate("proof")}>Impacto</button>
        </nav>
        <div className="demo-note"><strong>Modo demostración · {dataStatus === "aws" ? "AWS conectado" : "respaldo local"}</strong><span>Todos los nombres y registros son datos sintéticos.</span><button type="button" onClick={() => setResponsibleUseOpen(true)}>Privacidad y uso responsable</button></div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-context"><p>Colegio Demo AYNI</p><span>Secundaria · Seguimiento tutorial</span></div>
          <div className="topbar-actions">
            <AyniSelect className="period-control" label="Periodo" value={period} onChange={setPeriod} options={[{ value: "2026-I", label: "2026-I" }, { value: "2025-II", label: "2025-II" }]} />
            <span className={`sync-status ${dataStatus}`}><i aria-hidden="true" />{dataStatus === "aws" ? "AWS sincronizado" : dataStatus === "connecting" ? "Conectando" : "Datos demo locales"}</span>
            <div className="activity-menu">
              <button className="activity-button" type="button" aria-expanded={activityOpen} onClick={() => setActivityOpen((current) => !current)}>Actividad <b aria-label={approved ? "Tres eventos" : "Dos eventos"} /></button>
              {activityOpen ? <div className="activity-panel"><div><p>Actividad reciente</p><button type="button" onClick={() => setActivityOpen(false)}>Cerrar</button></div><article><i className="growth" /><span><strong>Datos actualizados</strong><small>30 trayectorias sintéticas · Hoy 09:40</small></span></article><article><i className="harvest" /><span><strong>Escenario base disponible</strong><small>Ana Torres · Simulación inicial</small></span></article>{approved ? <article><i className="teal" /><span><strong>Plan aprobado</strong><small>Listo para medir impacto</small></span></article> : null}</div> : null}
            </div>
            <div className="teacher"><span>Johan · Docente tutor</span><Image className="teacher-image" src="/img/AYNI-Teacher-Neutral.png" alt="Perfil visual del docente" width={38} height={38} /></div>
          </div>
        </header>
        <div className="content">
          {view === "dashboard" ? (
            <DashboardHome students={students} visibleStudents={visibleStudents} selectedStudent={selectedStudent} selectedId={selectedId} filter={filter} searchQuery={searchQuery} gradeFilter={gradeFilter} onFilterChange={setFilter} onSearchChange={setSearchQuery} onGradeChange={setGradeFilter} onResetFilters={() => { setFilter("all"); setSearchQuery(""); setGradeFilter("all"); }} onSelectStudent={setSelectedId} onOpenStudent={() => navigate("student")} />
          ) : view === "student" ? (
            <StudentTwin student={selectedStudent} onBack={() => navigate("dashboard")} onOpenLab={() => navigate("lab")} />
          ) : view === "lab" ? (
            <FutureLab student={selectedStudent} onBack={() => navigate("student")} onCreatePlan={createPlan} />
          ) : view === "plan" ? (
            <InterventionPlan student={selectedStudent} plan={selectedPlan} approved={approved} generatedPlan={generatedPlan} onApprove={approvePlan} onBack={() => navigate("lab")} onOpenProof={() => navigate("proof")} />
          ) : (
            <ImpactProof student={selectedStudent} plan={selectedPlan} approved={approved} onBack={() => navigate("plan")} onRestart={() => navigate("dashboard")} />
          )}
        </div>
      </main>
    </div>
  );
}
