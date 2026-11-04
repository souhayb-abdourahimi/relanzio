// DNS checks used before any commercial email (MX of the recipient, SPF / DMARC / DKIM of relanzio.com).
// The container's resolver can fail on MX/TXT queries while ordinary lookups work; a failure of the resolver is not
// an answer. Each query goes to the system resolver first, then to public resolvers, and the result says which case:
//   ok          records found
//   none        a resolver answered that the name or record does not exist (and no resolver found records)
//   unavailable no resolver could answer: retry later, never treat as "no MX"
import { Resolver } from 'node:dns/promises';

export const PUBLIC_DNS_SERVERS=['1.1.1.1','8.8.8.8','9.9.9.9'];
const DEFINITIVE=new Set(['ENOTFOUND','ENODATA','ENONAME','NXDOMAIN']);

function makeResolver(servers){
  const r=new Resolver({timeout:4000,tries:2});
  if(servers)r.setServers(servers);
  return r;
}

const defaultAttempts=kind=>[
  {via:'system',run:name=>makeResolver()[kind](name)},
  {via:'public',run:name=>makeResolver(PUBLIC_DNS_SERVERS)[kind](name)}
];

// attempts: [{via,run(name)}], injectable for tests.
export async function robustResolve(kind,name,{attempts=defaultAttempts(kind)}={}){
  const errors=[];let definitive=null;
  for(const attempt of attempts){
    try{
      const records=await attempt.run(name);
      if(Array.isArray(records)&&records.length)return {status:'ok',records,via:attempt.via};
      definitive=definitive||{code:'ENODATA',via:attempt.via};
    }catch(error){
      const code=String(error?.code||'DNS_ERROR');
      if(DEFINITIVE.has(code))definitive=definitive||{code,via:attempt.via};
      else errors.push(`${attempt.via}:${code}`);
    }
  }
  if(definitive)return {status:'none',code:definitive.code,via:definitive.via,errors};
  return {status:'unavailable',errors};
}

export const resolveMxRobust=(domain,opts)=>robustResolve('resolveMx',domain,opts);
export const resolveTxtRobust=(name,opts)=>robustResolve('resolveTxt',name,opts);

// TXT records as strings; [] when there are none or DNS is unavailable (callers treat both as "not proven").
export async function txtRecords(name,opts){
  const r=await resolveTxtRobust(name,opts);
  return r.status==='ok'?r.records.map(parts=>Array.isArray(parts)?parts.join(''):String(parts)):[];
}
