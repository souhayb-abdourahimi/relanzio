// Activation funnel for the admin cockpit, from first-party data only (no third-party tracker):
// visits (landing_view events) → sign-ups (profiles) → first quote → first follow-up done → paying.
// "since" restricts every step to the same period (events and accounts created after it).
const DONE=['sent','delivered','opened','clicked','bounced'];

export function buildFunnel({events=[],profiles=[],followups=[],since=null}={}){
  const t=since?new Date(since).getTime():-Infinity;
  const after=v=>v&&new Date(v).getTime()>=t;
  const cohort=profiles.filter(p=>after(p.created_at));
  const ids=new Set(cohort.map(p=>p.id));
  const firstQuote=new Set(events.filter(e=>e.event==='first_quote_added'&&ids.has(e.user_id)).map(e=>e.user_id));
  for(const p of cohort)if(p.activated_at)firstQuote.add(p.id);
  const firstFollowup=new Set(followups.filter(f=>DONE.includes(f.status)&&ids.has(f.user_id)).map(f=>f.user_id));
  const paying=cohort.filter(p=>p.plan==='pro'&&p.subscription_status==='active').length;
  const steps=[
    ['Visites (accueil)',events.filter(e=>e.event==='landing_view'&&after(e.created_at)).length],
    ['Inscrits',cohort.length],
    ['1er devis ajouté',firstQuote.size],
    ['1re relance faite',firstFollowup.size],
    ['Payants',paying],
  ];
  return steps.map(([label,count],i)=>({label,count,rate:i===0||!steps[i-1][1]?null:Math.round(count/steps[i-1][1]*1000)/10}));
}

export function countEvents(events=[],since=null){
  const t=since?new Date(since).getTime():-Infinity;
  const out={};
  for(const e of events)if(new Date(e.created_at).getTime()>=t)out[e.event]=(out[e.event]||0)+1;
  return out;
}

export const FUNNEL_EVENTS=Object.freeze(['landing_view','signup_started','signup_completed','first_quote_added','followup_marked_done','snoozed','quote_won','digest_opened','trial_started','checkout_started','subscription_active','payment_failed','subscription_canceled']);
