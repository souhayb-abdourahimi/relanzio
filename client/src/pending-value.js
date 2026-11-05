// "Combien de devis attendent une réponse ?" — a plain multiplication of what the visitor types.
// No conversion rate, no estimated gain, no revenue promise: only the value of quotes still waiting.
export const PENDING_DEFAULTS=Object.freeze({count:8,average:3000});
export const PENDING_MAX=Object.freeze({count:1000,average:1000000});

function toInt(value,max){
  const n=Math.round(Number(String(value??'').replace(/[\s  ]/g,'').replace(',','.')));
  return Number.isFinite(n)?Math.min(max,Math.max(0,n)):0;
}

export function pendingTotal(count,average){
  return toInt(count,PENDING_MAX.count)*toInt(average,PENDING_MAX.average);
}

const EUR=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
export const formatEuros=value=>EUR.format(Number(value)||0);
