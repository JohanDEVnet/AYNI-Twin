import Image from "next/image";

export function AyniAnalysisTransition({ message }: { message: string }) {
  return (
    <div className="analysis-transition" role="status" aria-live="polite" aria-label={message}>
      <div className="analysis-card">
        <div className="analysis-visual" aria-hidden="true">
          <span className="analysis-scan" />
          <span className="analysis-node node-one" />
          <span className="analysis-node node-two" />
          <span className="analysis-node node-three" />
          <span className="analysis-symbol"><Image src="/img/AYNI-Twin-App-Icon.png" alt="" width={50} height={50} /></span>
        </div>
        <p>AYNI ESTÁ ANALIZANDO</p>
        <h2>{message}</h2>
        <div className="analysis-steps" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <span>Conectando señales educativas con el siguiente paso</span>
      </div>
    </div>
  );
}
