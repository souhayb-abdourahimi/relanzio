import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDiagnostic, diagnose, validateCampaign } from '../server/maintenance-pilot/validation.js';
import { pilotConfig } from '../server/maintenance-pilot/config.js';
import { checkoutRequest, verifyPayment, isPilotEvent } from '../server/maintenance-pilot/billing.js';
import { simulate, approveCampaign, recordSignal } from '../server/maintenance-pilot/campaign.js';
import { report, csv } from '../server/maintenance-pilot/report.js';
const input={company:'Atelier fictif',email:'artisan@example.invalid',team:2,tool:'none',total:240,contract:120,review:60,unknown:20,excluded:40};
const campaign={senderName:'Atelier via Relanzio',senderEmail:'rappels@example.invalid',replyTo:'artisan@example.invalid',subject:'Entretien',body:'Bonjour, souhaitez-vous un rendez-vous ?',followup:'Souhaitez-vous un rendez-vous ?',startsAt:'2026-11-01T09:00:00Z',segment:'contract_only'};
test('diagnostic rejects personal-data fields, files, malformed and inconsistent counts',()=>{
 assert.equal(validateDiagnostic(input).email,'artisan@example.invalid');
 for(const x of [{...input,client_email:'person@example.com'},{...input,file:'data'},{...input,total:239},{...input,contract:-1},{...input,team:6},{...input,tool:'<script>'}])assert.throws(()=>validateDiagnostic(x));
 assert.deepEqual(diagnose(input),{contract_declared:120,pending_legal_validation:60,insufficient:20,excluded:40,sendable:0});
});
test('flags never grant live sends, real files or live billing',()=>{
 const c=pilotConfig({MAINTENANCE_PILOT_VISIBLE:'true',MAINTENANCE_PILOT_PERSONAL_DATA_ENABLED:'true',MAINTENANCE_PILOT_SENDS_ENABLED:'true'});
 assert.equal(c.visible,true);assert.equal(c.personalData,false);assert.equal(c.sends,false);assert.equal(c.livePayments,false);
 assert.equal(pilotConfig({}).visible,false);
});
test('checkout binds exact one-time amount and refuses live key before any network',()=>{
 const c={id:'abc',approved:true,campaign,version:1};
 assert.throws(()=>checkoutRequest(c,'sk_live_no','https://example.invalid'));
 const args=checkoutRequest(c,'sk_test_fake','https://example.invalid');
 assert.equal(args.mode,'payment');assert.equal(args.line_items[0].price_data.unit_amount,19000);assert.equal(args.line_items[0].price_data.currency,'eur');assert.equal(args.metadata.user_id,undefined);
 assert.throws(()=>checkoutRequest({...c,approved:false},'sk_test_fake','https://example.invalid'));
});
test('payment requires exact signed-event content and never accepts browser success or live events',()=>{
 const e={id:'evt_1',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_1',livemode:false,mode:'payment',payment_status:'paid',amount_total:19000,currency:'eur',metadata:{purpose:'maintenance_pilot',pilot_case_id:'abc'}}}};
 assert.equal(verifyPayment(e).caseId,'abc');assert.equal(isPilotEvent(e),true);
 for(const patch of [{livemode:true},{amount_total:1},{currency:'usd'},{mode:'subscription'},{payment_status:'unpaid'}])assert.throws(()=>verifyPayment({...e,data:{object:{...e.data.object,...patch}}}));
 assert.throws(()=>verifyPayment({...e,livemode:true}));
});
test('simulation stops duplicates, premature J10, replies and ambiguous outcomes',()=>{
 let state=approveCampaign({campaign,version:1,approved:false,deliveries:[],signals:{}});
 state=simulate(state,['a@example.invalid','A@example.invalid'],1,'2026-11-01T09:00:00Z');assert.equal(state.deliveries.length,1);
 assert.throws(()=>simulate(state,['a@example.invalid'],2,'2026-11-10T09:00:00Z'));
 assert.throws(()=>simulate(state,['real@example.com'],1,'2026-11-01T09:00:00Z'));
 assert.throws(()=>simulate(state,['a@example.invalid'],3,'2026-11-11T09:00:00Z'));
 assert.throws(()=>simulate(state,['a@example.invalid'],2,'2026-11-11T09:00:00Z'));
 state={...state,repliesCheckedAt:'2026-11-11T08:00:00Z'};
 let stopped=recordSignal(state,'a@example.invalid','stop');assert.equal(simulate(stopped,['a@example.invalid'],2,'2026-11-11T09:00:00Z').deliveries.length,1);
 const second=simulate(state,['a@example.invalid'],2,'2026-11-11T09:00:00Z');assert.equal(second.deliveries.length,2);
 assert.equal(simulate(second,['a@example.invalid'],2,'2026-11-11T09:00:00Z').deliveries.length,2);
 const uncertain=simulate(approveCampaign({campaign,version:1,deliveries:[],signals:{}}),['b@example.invalid'],1,'2026-11-01T09:00:00Z','unknown_delivery');
 assert.equal(simulate(uncertain,['b@example.invalid'],1,'2026-11-02T09:00:00Z').deliveries.length,1);
 assert.throws(()=>simulate({...state,campaign:{...campaign,body:'Changed'}},['b@example.invalid'],1,'2026-11-01T09:00:00Z'));
});
test('report separates simulated counts and neutralizes spreadsheet formulas',()=>{
 assert.equal(report({deliveries:[{status:'simulated',at:'2026-11-01T09:00:00Z'}],signals:{a:'stop'}}).simulated,1);
 assert.match(csv([['=SUM(1,2)','safe']]),/^"'=SUM/);
 assert.throws(()=>validateCampaign({...campaign,segment:'all'}));
});
test('preparing a second campaign cannot erase sent or ambiguous history',()=>{
 const state=approveCampaign({campaign,version:1,deliveries:[],signals:{}});
 const sent=simulate(state,['x@example.invalid'],1,'2026-11-01T09:00:00Z');
 assert.equal(simulate(sent,['x@example.invalid'],1,'2026-11-02T09:00:00Z').deliveries.length,1);
 for(const kind of ['stop','reply','bounce','complaint','appointment'])assert.equal(simulate(recordSignal(sent,'x@example.invalid',kind),['x@example.invalid'],2,'2026-11-11T09:00:00Z').deliveries.length,1);
 assert.throws(()=>simulate(state,Array.from({length:501},(_,i)=>`c${i}@example.invalid`),1,'2026-11-01T09:00:00Z'));
});
test('reply then appointment and stop preserve every report fact',()=>{
 let state=recordSignal({signals:{}},'a@example.invalid','reply');state=recordSignal(state,'a@example.invalid','appointment');state=recordSignal(state,'a@example.invalid','stop');state=recordSignal(state,'a@example.invalid','reply');
 const r=report(state);assert.equal(r.replies,1);assert.equal(r.appointments,1);assert.equal(r.stop,1);
});
