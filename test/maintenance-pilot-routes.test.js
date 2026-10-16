import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import Stripe from 'stripe';
import { createPilotRouter, pilotPageGate } from '../server/maintenance-pilot/routes.js';
import { pilotConfig } from '../server/maintenance-pilot/config.js';
const op='11111111-1111-4111-8111-111111111111';
const input={company:'Fixture',email:'artisan@example.invalid',team:1,tool:'none',total:120,contract:120,review:0,unknown:0,excluded:0};
async function serve(config,repo,run){const app=express();app.use('/api/maintenance-pilot',createPilotRouter({config,repo,requireUser:(req,res,next)=>{if(!req.headers.authorization)return res.sendStatus(401);req.user={id:req.headers.authorization};next();}}));app.get('/rappel-entretien',pilotPageGate(config),(_,res)=>res.send('page'));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{await run('http://127.0.0.1:'+server.address().port)}finally{await new Promise(r=>server.close(r))}}
test('HTTP pilot disabled never touches storage; direct dangerous endpoints always locked',async()=>{
 const repo=new Proxy({},{get(){throw Error('storage touched')}});
 await serve(pilotConfig({}),repo,async base=>{
 assert.equal((await fetch(base+'/rappel-entretien')).status,404);
 assert.equal((await fetch(base+'/api/maintenance-pilot/diagnostic',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})).status,404);
 });
 await serve(pilotConfig({MAINTENANCE_PILOT_VISIBLE:'true',MAINTENANCE_PILOT_SENDS_ENABLED:'true',MAINTENANCE_PILOT_PERSONAL_DATA_ENABLED:'true'}),repo,async base=>{
 for(const p of ['files','send','recipient/token/stop','recipient/token/appointment'])assert.equal((await fetch(base+'/api/maintenance-pilot/'+p,{method:'POST',body:'nominative rejected before parsing'})).status,423);
 assert.equal((await fetch(base+'/api/maintenance-pilot/cases')).status,401);
 assert.equal((await fetch(base+'/api/maintenance-pilot/cases',{headers:{authorization:op}})).status,403);
 });
});
test('HTTP questionnaire validation and safe errors; webhook signature and live-key lock',async()=>{
 let writes=0,paid=0;
 const config=pilotConfig({MAINTENANCE_PILOT_VISIBLE:'true',MAINTENANCE_PILOT_PUBLICATION_APPROVED:'true',VITE_LEGAL_NAME:'Fixture',VITE_LEGAL_REGISTRATION:'Fixture',VITE_LEGAL_EMAIL:'hello@example.invalid',MAINTENANCE_PILOT_PAYMENTS_ENABLED:'true',MAINTENANCE_PILOT_STRIPE_TEST_KEY:'sk_test_fake',MAINTENANCE_PILOT_STRIPE_TEST_WEBHOOK_SECRET:'whsec_fixture'});
 await serve(config,{submit:async()=>{writes++;return{id:'fixture'}},paid:async()=>paid++},async base=>{
 const post=body=>fetch(base+'/api/maintenance-pilot/diagnostic',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':'33333333-3333-4333-8333-333333333333'},body:JSON.stringify(body)});
 assert.equal((await post({...input,client_name:'Reject'})).status,400);assert.equal(writes,0);
 const r=await post(input);assert.equal(r.status,201);assert.equal((await r.json()).diagnostic.sendable,0);assert.equal(writes,1);
 assert.equal((await fetch(base+'/api/maintenance-pilot/stripe/webhook',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,400);assert.equal(paid,0);
 const payload=JSON.stringify({id:'evt_test',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_fixture',livemode:false,mode:'payment',payment_status:'paid',amount_total:19000,currency:'eur',metadata:{purpose:'maintenance_pilot',pilot_case_id:'33333333-3333-4333-8333-333333333333'}}}});
 const signature=Stripe.webhooks.generateTestHeaderString({payload,secret:'whsec_fixture'});
 const response=await fetch(base+'/api/maintenance-pilot/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':signature},body:payload});assert.equal(response.status,200);assert.equal(paid,1);
 });
});
