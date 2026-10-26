import 'dotenv/config';
import { resolveTxt, resolveMx } from 'node:dns/promises';
import { getBrevoPilotSenderStatus } from './pilot-outreach.js';

const headers={accept:'application/json','api-key':process.env.BREVO_API_KEY||''};
const safeTxt=async name=>{try{return (await resolveTxt(name)).map(parts=>parts.join(''))}catch{return[]}};
const safeMx=async name=>{try{return await resolveMx(name)}catch{return[]}};
const getJson=async url=>{
  const r=await fetch(url,{headers});
  let body=null;try{body=await r.json()}catch{}
  return {ok:r.ok,status:r.status,body};
};

const [domainRes,txWebhooks,inboundWebhooks,inboundEvents,spfTxt,dmarcTxt,mx]=await Promise.all([
  getJson('https://api.brevo.com/v3/senders/domains/relanzio.com'),
  getJson('https://api.brevo.com/v3/webhooks?type=transactional&sort=desc'),
  getJson('https://api.brevo.com/v3/webhooks?type=inbound&sort=desc'),
  getJson('https://api.brevo.com/v3/inbound/events?limit=10'),
  safeTxt('relanzio.com'),
  safeTxt('_dmarc.relanzio.com'),
  safeMx('relanzio.com')
]);

const rawDomain=domainRes.body||{};
const rawDomainRoot=rawDomain&&typeof rawDomain.domain==='object'?rawDomain.domain:rawDomain;
const rawDns=rawDomainRoot?.dns_records||rawDomain?.dns_records||{};
const relevantDns=Object.fromEntries(Object.entries(rawDns).map(([key,value])=>[
  key,
  value&&typeof value==='object'?{
    status:value.status??null,
    type:value.type??null,
    host_name:value.host_name??null,
    code:value.code??null,
    verified:value.verified??null,
    authenticated:value.authenticated??null
  }:value
]));
console.log('BREVO_DOMAIN_RAW_RELEVANT '+JSON.stringify({
  http_status:domainRes.status,
  top_level_keys:Object.keys(rawDomain),
  domain_object_keys:rawDomainRoot&&typeof rawDomainRoot==='object'?Object.keys(rawDomainRoot):[],
  verified:rawDomainRoot?.verified??rawDomain?.verified??null,
  authenticated:rawDomainRoot?.authenticated??rawDomain?.authenticated??null,
  dns_record_keys:Object.keys(rawDns),
  dns_records:relevantDns
}));

const sender=await getBrevoPilotSenderStatus();

const tx=(txWebhooks.body?.webhooks||[]).map(w=>({
  id:w.id,type:w.type,url:w.url,events:w.events,description:w.description||null,
  has_auth:Boolean(w.auth),has_custom_secret_header:Array.isArray(w.headers)&&w.headers.some(h=>String(h.key||'').toLowerCase()==='x-webhook-secret')
}));
const inbound=(inboundWebhooks.body?.webhooks||[]).map(w=>({
  id:w.id,type:w.type,url:w.url,events:w.events,domain:w.domain||null,description:w.description||null,
  has_auth:Boolean(w.auth),has_custom_secret_header:Array.isArray(w.headers)&&w.headers.some(h=>String(h.key||'').toLowerCase()==='x-webhook-secret')
}));
const spf=spfTxt.find(v=>/^v=spf1\b/i.test(v))||null;
const dmarc=dmarcTxt.find(v=>/^v=DMARC1\b/i.test(v))||null;
const result={
  sender:{
    active:sender.active===true,
    from:sender.from,
    reply_to:sender.reply_to,
    domain_verified:sender.domain_verified===true,
    domain_authenticated:sender.domain_authenticated===true
  },
  dns:{
    spf_present:Boolean(spf),
    spf_authorizes_brevo:Boolean(spf&&/(sendinblue|brevo)/i.test(spf)),
    dmarc_present:Boolean(dmarc),
    dmarc_policy:dmarc?.match(/(?:^|;)\s*p=([^;]+)/i)?.[1]?.trim()||null,
    mx_count:mx.length,
    mx_hosts:mx.map(x=>x.exchange).sort()
  },
  brevo:{
    domain_endpoint_ok:domainRes.ok,
    domain_verified:domainRes.body?.verified===true,
    domain_authenticated:domainRes.body?.authenticated===true,
    transactional_webhook_count:tx.length,
    transactional_webhooks:tx,
    inbound_webhook_count:inbound.length,
    inbound_webhooks:inbound,
    inbound_events_endpoint_ok:inboundEvents.ok,
    inbound_recent_event_count:(inboundEvents.body?.events||[]).length
  }
};
console.log('OUTREACH_PROVIDER_QA '+JSON.stringify(result));
