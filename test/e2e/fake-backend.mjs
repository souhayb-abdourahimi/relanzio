// In-memory stand-in for the Relanzio API and Supabase Auth, used only by the browser E2E run.
// It mirrors the HTTP contract of server/index.js so the real React app can be driven end to end
// without Supabase, Stripe or Brevo. Business rules themselves are covered by the unit/SQL tests.
import { quoteMetrics, valueProof, parisLocalDateTimeToIso } from '../../server/logic.js';
import { parisBusinessDate, addDaysToDateKey, skipWeekendDateKey } from '../../server/followup-policy.js';
import { followupMessage } from '../../shared/followup-templates.js';
import { withEntitlements } from '../../server/entitlements.js';
import { activeQuoteLimitFor, TRIAL_DAYS } from '../../shared/plans.js';
import { withLocks } from '../../shared/quota.js';

const DAY=86400000;
const json=(route,status,body)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});

export function createFakeBackend({now=()=>new Date(),seedQuotes=[],profile={},capabilities={}}={}){
  const user={id:'00000000-0000-4000-8000-000000000001',email:'artisan@example.test',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
  const state={
    profile:{id:user.id,email:user.email,company_name:'',role:'',plan:'free',subscription_status:'none',email_mode:'review',onboarding_completed:false,marketing_opt_in:false,trial_started_at:null,trial_ends_at:null,trial_expired_at:null,stripe_customer_id:null,morning_digest_enabled:true,...profile},
    quotes:seedQuotes.map((q,i)=>({id:q.id||`q-${i}`,user_id:user.id,status:'open',followup_step:0,followup_schedule_mode:'recommended',auto_send:false,client_email:null,client_phone:null,note:null,sent_at:new Date(now().getTime()-5*DAY).toISOString().slice(0,10),created_at:new Date(now().getTime()-(seedQuotes.length-i)*60000).toISOString(),...q})),
    followups:[],
    replies:[],
    events:[],
    calls:[]
  };
  const session=()=>({access_token:'e2e-access-token',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:'e2e-refresh',user});
  const caps={reply_detection:false,automatic_sending:false,morning_digest:false,billing_emails:false,...capabilities};
  const profileOut=()=>({...withEntitlements(state.profile,now()),is_admin:false,capabilities:caps});
  // Same rule as the server: 09:00 Paris, weekends moved to Monday.
  const nextAt=days=>parisLocalDateTimeToIso(skipWeekendDateKey(addDaysToDateKey(parisBusinessDate(now()),days)),9,0);

  async function handleAuth(route){
    const url=new URL(route.request().url());
    if(url.pathname.endsWith('/signup')||url.pathname.endsWith('/token'))return json(route,200,session());
    if(url.pathname.endsWith('/logout'))return route.fulfill({status:204,body:''});
    if(url.pathname.endsWith('/user'))return json(route,200,user);
    return json(route,200,{});
  }

  async function handleApi(route){
    const req=route.request(),url=new URL(req.url()),path=url.pathname.replace(/^\/api/,''),method=req.method();
    const body=(()=>{try{return JSON.parse(req.postData()||'{}')}catch{return {}}})();
    state.calls.push({method,path,body});
    if(path==='/events'||path==='/activity'){state.events.push(body.event||'app_active');return json(route,202,{ok:true});}
    if(path==='/profile'&&method==='GET')return json(route,200,{profile:profileOut()});
    if(path==='/profile'&&method==='PATCH'){Object.assign(state.profile,body);return json(route,200,{profile:profileOut()});}
    if(path.startsWith('/admin'))return json(route,403,{error:'Forbidden'});
    if(path==='/quotes'&&method==='GET'){
      const hydrated=withLocks(state.quotes,profileOut().pro_access).map(q=>({...q,followups:state.followups.filter(f=>f.quote_id===q.id),replies:state.replies.filter(r=>r.quote_id===q.id)}));
      return json(route,200,{quotes:hydrated,metrics:{...quoteMetrics(state.quotes,now()),proof:valueProof(state.quotes,state.followups,state.replies)}});
    }
    if(path==='/quotes'&&method==='POST'){
      const active=state.quotes.filter(q=>['open','paused'].includes(q.status)).length;
      const p=profileOut();
      if(active>=activeQuoteLimitFor(p.pro_access))return json(route,403,{error:`Votre formule est limitée à ${activeQuoteLimitFor(p.pro_access)} devis actifs (en attente ou en pause).`});
      const q={id:`q-${state.quotes.length+1}`,user_id:user.id,status:'open',followup_step:0,followup_schedule_mode:body.followup_schedule_mode||'recommended',auto_send:false,client_name:body.client_name,client_email:body.client_email||null,client_phone:body.client_phone||null,note:body.note||null,title:body.title,amount:Number(String(body.amount).replace(',','.')),sent_at:body.sent_at,next_followup_at:body.next_followup_at||nextAt(body.start_today?0:2),created_at:now().toISOString()};
      state.quotes.unshift(q);
      if(!state.profile.trial_started_at&&state.profile.subscription_status==='none'){
        state.profile.trial_started_at=now().toISOString();state.profile.trial_ends_at=new Date(now().getTime()+TRIAL_DAYS*DAY).toISOString();state.profile.plan='pro';
      }
      return json(route,201,{quote:q,profile:profileOut()});
    }
    const m=path.match(/^\/quotes\/([^/]+)(\/.*)?$/);
    if(m){
      const q=state.quotes.find(x=>x.id===m[1]);
      if(!q)return json(route,404,{error:'Devis introuvable.'});
      const sub=m[2]||'';
      if(!sub&&method==='PATCH'){
        if(q.reply_received_at&&['recommended','custom'].includes(body.followup_schedule_mode))q.reply_received_at=null;
        if(body.followup_schedule_mode==='recommended'&&!body.next_followup_at)body.next_followup_at=nextAt(2);
        Object.assign(q,body);
        if(['won','lost'].includes(q.status)){q.next_followup_at=null;q.followup_schedule_mode='none';}
        return json(route,200,{quote:q});
      }
      if(!sub&&method==='DELETE'){state.quotes=state.quotes.filter(x=>x!==q);return json(route,200,{deleted:true});}
      if(sub==='/followup-preview'){
        if(q.reply_received_at)return json(route,409,{error:'Le client a répondu : les relances de ce devis sont arrêtées. Repoussez-le pour les reprendre.'});
        return json(route,200,{preview:followupMessage({clientName:q.client_name,title:q.title,companyName:state.profile.company_name},q.followup_step)});
      }
      if(sub==='/client-replied'){
        if(!['open','paused'].includes(q.status))return json(route,409,{error:'Ce devis est déjà marqué gagné ou perdu.'});
        state.replies.push({id:`r-${state.replies.length+1}`,quote_id:q.id,source:'manual',channel:body.channel||'other',category:'received',effect:'stop',excerpt:null,received_at:now().toISOString()});
        Object.assign(q,{reply_received_at:now().toISOString(),next_followup_at:null,followup_schedule_mode:'none',auto_send:false});
        state.events.push('client_reply_received');
        return json(route,200,{recorded:true,quote:q});
      }
      if(sub==='/send-followup'){
        if(!profileOut().pro_access)return json(route,403,{error:'L’envoi depuis Relanzio nécessite des droits Pro actifs.'});
        if(q.reply_received_at)return json(route,409,{error:'Le client a répondu : les relances de ce devis sont arrêtées.'});
        q.followup_step+=1;q.next_followup_at=q.followup_step>=3?null:nextAt(3);
        state.followups.push({id:`f-${state.followups.length+1}`,quote_id:q.id,step:q.followup_step,status:'sent',channel:'relanzio',subject:body.subject,body:body.body,sent_at:now().toISOString(),created_at:now().toISOString()});
        return json(route,200,{sent:true,result:{step:q.followup_step}});
      }
      if(sub==='/confirm-manual-followup'){
        if(q.reply_received_at)return json(route,409,{error:'Le client a répondu : les relances de ce devis sont arrêtées.'});
        if(q.followup_step+1!==Number(body.step))return json(route,409,{error:'Cette relance a déjà été traitée ou le devis n’est plus éligible.'});
        q.followup_step+=1;
        const gaps={1:3,2:5};
        q.next_followup_at=q.followup_step>=3?null:nextAt(gaps[q.followup_step]);
        q.followup_schedule_mode=q.followup_step>=3?'none':'recommended';
        state.followups.push({id:`f-${state.followups.length+1}`,quote_id:q.id,step:q.followup_step,status:'sent',channel:'manual',sent_at:now().toISOString(),created_at:now().toISOString()});
        return json(route,200,{confirmed:true,quote:q});
      }
    }
    if(path==='/billing/checkout'){state.events.push('checkout_started');return json(route,200,{url:'/__e2e/stripe-checkout'});}
    if(path==='/billing/portal')return json(route,200,{url:'/__e2e/stripe-portal'});
    if(path==='/support/tickets')return json(route,200,{tickets:[]});
    return json(route,404,{error:`E2E fake: ${method} ${path} not implemented`});
  }

  async function install(context,{supabaseHost}){
    await context.route(`https://${supabaseHost}/**`,handleAuth);
    await context.route('**/api/**',handleApi);
    await context.route('**/__e2e/**',route=>route.fulfill({status:200,contentType:'text/html',body:`<!doctype html><title>${route.request().url().includes('portal')?'Portail Stripe (simulé)':'Stripe Checkout (simulé)'}</title><h1>${route.request().url().includes('portal')?'Portail Stripe (simulé)':'Stripe Checkout (simulé)'}</h1>`}));
  }
  return {state,install,session,user};
}
