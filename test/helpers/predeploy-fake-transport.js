// Test-only: block all real network and return fixed Stripe SDK responses in memory.
import Stripe from 'stripe';
import http from 'node:http';
import https from 'node:https';
http.request=()=>{throw Error('TEST_NETWORK_FORBIDDEN');};
https.request=()=>{throw Error('TEST_NETWORK_FORBIDDEN');};
globalThis.fetch=()=>{throw Error('TEST_NETWORK_FORBIDDEN');};
const proto=Object.getPrototypeOf(Stripe.createNodeHttpClient());
proto.makeRequest=async(_host,_port,path,method)=>{
 if(method!=='GET'||!['/v1/account','/v1/prices/price_fake'].includes(path))throw Error('TEST_UNEXPECTED_REQUEST');
 if(process.env.LAB_STRIPE_FAILURE==='true')throw Object.assign(new Error('secret_from_provider'),{code:'ECONNREFUSED'});
 const body=path==='/v1/account'?{id:'acct_fake'}:{id:'price_fake',active:true,livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}};
 return {getHeaders:()=>({}),getStatusCode:()=>200,toJSON:async()=>body,getRawResponse:()=>({})};
};
