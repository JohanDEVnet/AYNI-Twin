type AyniToastProps = {
  title: string;
  detail: string;
  tone?: "success" | "info";
  onClose: () => void;
};

export function AyniToast({ title, detail, tone = "success", onClose }: AyniToastProps) {
  return (
    <div className={`ayni-toast ${tone}`} role="status" aria-live="polite">
      <span className="toast-mark" aria-hidden="true" />
      <div><strong>{title}</strong><p>{detail}</p></div>
      <button type="button" onClick={onClose} aria-label="Cerrar notificación">Cerrar</button>
    </div>
  );
}
