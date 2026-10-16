export function report(state={}) {
 const deliveries=state.deliveries||[],signals=Object.values(state.signals||{}).flat();
 return {mode:'simulation_only',simulated:deliveries.filter(d=>d.status==='simulated').length,unknown_delivery:deliveries.filter(d=>d.status==='unknown_delivery').length,
 bounces:signals.filter(x=>x==='bounce').length,complaints:signals.filter(x=>x==='complaint').length,stop:signals.filter(x=>x==='stop').length,replies:signals.filter(x=>x==='reply').length,appointments:signals.filter(x=>x==='appointment').length,
 delivered:null,bookedAppointments:null,reportDueAt:deliveries.length?new Date(Math.min(...deliveries.map(d=>Date.parse(d.at)))+21*86400000).toISOString():null};
}
export function csv(rows) { return rows.map(row=>row.map(v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(',')).join('\r\n'); }
