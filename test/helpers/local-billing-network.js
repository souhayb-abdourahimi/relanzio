// Test preload only. All Stripe SDK traffic is redirected to the isolated HTTP lab.
// No production code reads these variables or imports this file.
import Stripe from 'stripe';
import http from 'node:http';
import https from 'node:https';
const localhost=host=>['127.0.0.1','localhost','::1'].includes(host);
const request=http.request;
http.request=function(options,...args){
 const host=typeof options==='string'?new URL(options).hostname:options.hostname||options.host;
 if(!localhost(host))throw Error('LAB_EXTERNAL_NETWORK_FORBIDDEN');
 return request.call(this,options,...args);
};
https.request=()=>{throw Error('LAB_EXTERNAL_NETWORK_FORBIDDEN');};
const fetchOriginal=globalThis.fetch;
globalThis.fetch=(url,...args)=>{
 if(!localhost(new URL(typeof url==='string'||url instanceof URL?url:url.url).hostname))throw Error('LAB_EXTERNAL_NETWORK_FORBIDDEN');
 return fetchOriginal(url,...args);
};
const prototype=Object.getPrototypeOf(Stripe.createNodeHttpClient()),makeRequest=prototype.makeRequest;
prototype.makeRequest=function(_host,_port,path,method,headers,data,_protocol,timeout){
 return makeRequest.call(this,'127.0.0.1',Number(process.env.LAB_STRIPE_PORT),path,method,headers,data,'http',timeout);
};
