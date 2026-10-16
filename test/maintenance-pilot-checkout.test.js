import test from 'node:test';import assert from 'node:assert/strict';
import { prepareCheckout } from '../server/maintenance-pilot/billing.js';
const record={id:'fixture',state:{approved:true,campaign:{},version:1}};
test('checkout reuses the registered session and refuses an expired session instead of issuing an untracked payment',async()=>{
 let creates=0;const stripe={checkout:{sessions:{retrieve:async()=>({id:'cs_test_old',livemode:false,status:'open',url:'https://checkout.stripe.com/test'}),create:async()=>{creates++;throw Error('unexpected')}}}};
 const repo={reserve:async()=>({session_id:'cs_test_old',paid:false})};
 const result=await prepareCheckout({record,key:'sk_test_fake',origin:'https://example.invalid',repo,stripe});assert.equal(result.url,'https://checkout.stripe.com/test');assert.equal(creates,0);
 stripe.checkout.sessions.retrieve=async()=>({id:'cs_test_old',livemode:false,status:'expired'});
 await assert.rejects(prepareCheckout({record,key:'sk_test_fake',origin:'https://example.invalid',repo,stripe}),/CHECKOUT_EXPIRED/);assert.equal(creates,0);
});
test('unregistered session is not returned when database write fails',async()=>{
 const repo={reserve:async()=>({session_id:null,paid:false}),saveSession:async()=>{throw Error('db down')}};
 const stripe={checkout:{sessions:{create:async()=>({id:'cs_test_new',livemode:false,url:'https://checkout.stripe.com/test'})}}};
 await assert.rejects(prepareCheckout({record,key:'sk_test_fake',origin:'https://example.invalid',repo,stripe}),/db down/);
});
test('one-time case cannot be charged again after a different version was paid',async()=>{
 const repo={reserve:async()=>({paid:true})};
 await assert.rejects(prepareCheckout({record:{...record,state:{...record.state,version:2}},key:'sk_test_fake',origin:'https://example.invalid',repo,stripe:{}}),/ALREADY_PAID/);
});
