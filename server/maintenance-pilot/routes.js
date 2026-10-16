import express from 'express';
import Stripe from 'stripe';
import { createHash } from 'node:crypto';
import { pilotConfig, problem } from './config.js';
import { exact, validateDiagnostic, diagnose, validateCampaign } from './validation.js';
import { checkoutRequest, verifyPayment, prepareCheckout } from './billing.js';
import { approveCampaign, recordSignal, simulate } from './campaign.js';
import { report, csv } from './report.js';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const pilotPageGate=config=>(req,res,next)=>config.visible?next():res.status(404).send('Page indisponible.');
function limiter(){const hits=new Map();return(req,res,next)=>{const now=Date.now(),key=req.ip;for(const[k,v]of hits)if(v.until<now)hits.delete(k);const item=hits.get(key)||{n:0,until:now+60000};item.n++;hits.set(key,item);if(item.n>20){res.set('Retry-After','60');return res.status(429).json({error:'TOO_MANY_REQUESTS'});}next();};}
export function createPilotRouter({repo,requireUser,config=pilotConfig()}) {
 const router=express.Router();
 router.use((req,res,next)=>{res.set('Cache-Control','no-store');if(!config.visible)return res.status(404).json({error:'PILOT_UNAVAILABLE'});next();});
 // Hard locks precede ALL body parsers. No URL upload or provider adapter exists.
 router.all(['/files','/send','/recipient/:token/stop','/recipient/:token/appointment'],(_req,res)=>res.status(423).json({error:'REAL_DATA_AND_SENDS_LOCKED'}));
 router.get('/config',(_req,res)=>res.json({visible:true,personalData:false,sends:false,livePayments:false,identity:config.identity,publicationApproved:config.publicationApproved}));
 router.post('/stripe/webhook',express.raw({type:'application/json',limit:'32kb'}),async(req,res,next)=>{
  try{
   if(!config.payments||!/^(sk|rk)_test_/.test(config.testKey)||!config.webhookSecret)throw problem('TEST_PAYMENTS_UNAVAILABLE',423);
   let event;try{event=Stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],config.webhookSecret);}catch{throw problem('INVALID_SIGNATURE');}
   const payment=verifyPayment(event);if(payment)await repo.paid(payment);res.json({received:true,testOnly:true});
  }catch(e){next(e)}
 });
 router.use(express.json({limit:'16kb',strict:true}));
 router.post('/diagnostic',limiter(),async(req,res,next)=>{
  try{
   if(!config.publicationApproved||!Object.values(config.identity).every(Boolean))throw problem('PUBLICATION_REVIEW_REQUIRED',503);
   if(!req.is('application/json'))throw problem('JSON_REQUIRED',415);
   const d=validateDiagnostic(req.body),key=req.headers['idempotency-key'];if(!UUID.test(key||''))throw problem('REQUEST_KEY_REQUIRED');
   const hash=createHash('sha256').update(JSON.stringify(d)).digest('hex');
   const {company,email,...counts}=d;
   const result=await repo.submit({request_key:key,payload_hash:hash,company,email,diagnostic:counts});
   res.status(201).json({reference:result.id,diagnostic:diagnose(d),message:'Demande enregistrée. Estimation déclarative à vérifier sous 48 h ouvrées ; aucun client ne sera contacté.'});
  }catch(e){next(e)}
 });
 router.use(requireUser,(req,res,next)=>{
  if(!UUID.test(req.user?.id||'')||!config.operators.has(req.user.id))return res.status(403).json({error:'OPERATOR_REQUIRED'});next();
 });
 router.param('id',(req,res,next,id)=>UUID.test(id)?next():next(problem('INVALID_CASE_ID')));
 router.get('/cases',async(req,res,next)=>{try{res.json({cases:await repo.list(req.user.id)})}catch(e){next(e)}});
 router.post('/cases/:id/claim',async(req,res,next)=>{try{res.json(await repo.claim(req.params.id,req.user.id))}catch(e){next(e)}});
 router.get('/cases/:id',async(req,res,next)=>{try{res.json(await repo.get(req.params.id,req.user.id))}catch(e){next(e)}});
 const change=(path,fn)=>router.post('/cases/:id/'+path,async(req,res,next)=>{try{const record=await repo.get(req.params.id,req.user.id);const state=fn(record.state,req.body);res.json(await repo.update(record,req.user.id,state));}catch(e){next(e)}});
 change('campaign',(state,body)=>{
  if(state.deliveries?.length)throw problem('CAMPAIGN_ALREADY_STARTED',409);
  return {...state,campaign:validateCampaign(body),version:(state.version||0)+1,approved:false,approvalHash:null,repliesCheckedAt:null};
 });
 change('approve',(state,body)=>{exact(body,[]);return approveCampaign(state)});
 change('review-replies',(state,body)=>{exact(body,[]);return {...state,repliesCheckedAt:new Date().toISOString()};});
 change('signal',(state,body)=>{exact(body,['address','kind']);return recordSignal(state,body.address,body.kind)});
 change('simulate',(state,body)=>{exact(body,['addresses','step','at','outcome']);return simulate(state,body.addresses,body.step,body.at,body.outcome)});
 router.get('/cases/:id/report',async(req,res,next)=>{try{const record=await repo.get(req.params.id,req.user.id);const data=report(record.state);if(req.query.format==='csv'){res.type('text/csv').attachment('rapport-simulation.csv').send(csv([['mesure','valeur'],...Object.entries(data)]));}else res.json(data);}catch(e){next(e)}});
 router.post('/cases/:id/checkout',async(req,res,next)=>{
  try{
   if(!config.payments)throw problem('TEST_PAYMENTS_UNAVAILABLE',423);
   exact(req.body,[]);
   const record=await repo.get(req.params.id,req.user.id);
   checkoutRequest({...record.state,id:record.id},config.testKey,config.origin);
   res.json(await prepareCheckout({record,key:config.testKey,origin:config.origin,repo,stripe:new Stripe(config.testKey)}));
  }catch(e){next(e)}
 });
 router.post('/purge',async(req,res,next)=>{try{exact(req.body,[]);res.json(await repo.purge())}catch(e){next(e)}});
 router.use((err,_req,res,_next)=>{
  const code=err.code&&/^[A-Z_]+$/.test(err.code)?err.code:'PILOT_REQUEST_FAILED';
  const status=err.type==='entity.too.large'?413:err.type==='entity.parse.failed'?400:err.status||503;
  // Deliberately no request bodies, provider messages, or personal data in logs.
  res.status(status).json({error:code,message:status>=500?'Service momentanément indisponible. Réessayez.':'Demande refusée. Vérifiez les champs et les autorisations.'});
 });
 return router;
}
