import Image from "next/image";

export function AyniLoader() {
  return (
    <div className="ayni-loader" role="status" aria-live="polite" aria-label="AYNI Twin está preparando las trayectorias">
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-stage" aria-hidden="true">
        <span className="loader-orbit orbit-one"><i /></span>
        <span className="loader-orbit orbit-two"><i /></span>
        <span className="loader-orbit orbit-three"><i /></span>
        <span className="loader-pulse" />
        <span className="loader-core">
          <Image src="/img/AYNI-Twin-App-Icon.png" alt="" width={72} height={72} priority />
        </span>
      </div>
      <div className="loader-copy">
        <p>AYNI TWIN</p>
        <h1>Conectando señales, futuros y apoyo</h1>
        <div className="loader-messages" aria-hidden="true">
          <span>LEYENDO SEÑALES</span>
          <span>TRAZANDO FUTUROS</span>
          <span>PREPARANDO APOYO</span>
        </div>
        <div className="loader-progress" aria-hidden="true"><i /></div>
      </div>
      <span className="sr-only">Cargando AYNI Twin.</span>
    </div>
  );
}
