import React,{useState} from 'react';
import { PENDING_DEFAULTS, PENDING_MAX, formatEuros, pendingTotal } from './pending-value.js';

// Landing section. Prerendered with the default values, so it reads correctly without JavaScript.
export default function PendingCalculator(){
  const[count,setCount]=useState(String(PENDING_DEFAULTS.count));
  const[average,setAverage]=useState(String(PENDING_DEFAULTS.average));
  const total=pendingTotal(count,average);
  return <section className="section container" id="en-attente" aria-labelledby="pending-title">
    <div className="pending-box">
      <div>
        <div className="section-head left"><span>VOS DEVIS EN ATTENTE</span><h2 id="pending-title">Combien de devis attendent une réponse ?</h2><p>Comptez vos devis envoyés restés sans réponse.</p></div>
        <div className="pending-fields">
          <label>Devis envoyés sans réponse<input type="number" inputMode="numeric" min="0" max={PENDING_MAX.count} value={count} onChange={e=>setCount(e.target.value)}/></label>
          <label>Montant moyen d’un devis (€)<input type="number" inputMode="numeric" min="0" max={PENDING_MAX.average} step="100" value={average} onChange={e=>setAverage(e.target.value)}/></label>
        </div>
      </div>
      <div className="pending-result" aria-live="polite">
        <strong>{formatEuros(total)}</strong>
        <span>de devis en attente de réponse</span>
        <p>Relanzio vous aide à n’en oublier aucun.</p>
      </div>
    </div>
  </section>;
}
