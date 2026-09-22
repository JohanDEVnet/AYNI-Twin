"use client";

import { useEffect, useRef } from "react";

type ResponsibleUseDialogProps = {
  open: boolean;
  dataMode: "aws" | "fallback" | "connecting";
  onClose: () => void;
};

export function ResponsibleUseDialog({ open, dataMode, onClose }: ResponsibleUseDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="responsible-dialog-layer" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="responsible-dialog" role="dialog" aria-modal="true" aria-labelledby="responsible-title" aria-describedby="responsible-description">
        <div className="responsible-thread" aria-hidden="true"><i /><i /><i /></div>
        <header>
          <div>
            <p className="section-kicker">Privacidad y uso responsable</p>
            <h2 id="responsible-title">Las señales orientan; las personas deciden.</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose}>Cerrar</button>
        </header>
        <p className="responsible-dialog-intro" id="responsible-description">AYNI Twin organiza evidencia educativa para priorizar apoyo. No diagnostica, no etiqueta y no ejecuta decisiones automáticamente.</p>

        <div className="responsible-principles">
          <article><span>01</span><div><strong>Datos de demostración</strong><p>Los treinta perfiles y todos sus registros son completamente sintéticos.</p></div></article>
          <article><span>02</span><div><strong>Modelo transparente</strong><p>El riesgo usa asistencia, rendimiento y pendientes con pesos visibles.</p></div></article>
          <article><span>03</span><div><strong>Revisión humana</strong><p>Todo plan puede editarse y necesita aprobación docente antes del seguimiento.</p></div></article>
          <article><span>04</span><div><strong>Incertidumbre visible</strong><p>Los escenarios son supuestos configurables, nunca resultados garantizados.</p></div></article>
        </div>

        <div className="responsible-data-path">
          <p>Qué ocurre con la información</p>
          <ol>
            <li><span>Señales mínimas</span><small>Solo indicadores educativos necesarios.</small></li>
            <li><span>Plan estructurado</span><small>Bedrock o fallback validado.</small></li>
            <li><span>Decisión docente</span><small>Edición, aprobación y seguimiento.</small></li>
          </ol>
        </div>

        <footer>
          <p><strong>Modo actual</strong><span>{dataMode === "aws" ? "AWS conectado" : dataMode === "connecting" ? "Comprobando conexión" : "Demostración local"}</span></p>
          <small>Antes de usar datos reales se requieren consentimiento, autenticación, autorización institucional, auditoría y una política de retención.</small>
        </footer>
      </section>
    </div>
  );
}
