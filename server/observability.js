import { db } from './db.js';

const SECRET_KEY=/secret|password|authorization|cookie|api[_-]?key|service[_-]?role/i;
const SECRET_VALUE=/(?:sk_(?:live|test)_[A-Za-z0-9_-]+|whsec_[A-Za-z0-9_-]+|xkeysib-[A-Za-z0-9_-]+|sb_secret_[A-Za-z0-9_-]+|Bearer\s+[A-Za-z0-9._-]+)/gi;

function redactString(value=''){
  return String(value).replace(SECRET_VALUE,'[REDACTED]');
}
export function sanitizeLogValue(value,depth=0){
  if(depth>5)return '[MAX_DEPTH]';
  if(typeof value==='string')return redactString(value).slice(0,2000);
  if(value===null||value===undefined||typeof value==='number'||typeof value==='boolean')return value;
  if(Array.isArray(value))return value.slice(0,50).map(x=>sanitizeLogValue(x,depth+1));
  if(typeof value==='object'){
    const out={};
    for(const [key,item] of Object.entries(value).slice(0,100))out[key]=SECRET_KEY.test(key)?'[REDACTED]':sanitizeLogValue(item,depth+1);
    return out;
  }
  return redactString(value);
}

export function log(level, scope, message, metadata = {}) {
  const payload = { ts:new Date().toISOString(), level, scope:String(scope||'').slice(0,80), message:redactString(message).slice(0,1000), metadata:sanitizeLogValue(metadata) };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else if (level === 'warn') console.warn(line); else console.log(line);
}

export async function reportError(scope, error, metadata = {}) {
  const message = redactString(error?.message || error || 'Unknown error').slice(0, 1000);
  const safeMetadata=sanitizeLogValue(metadata);
  log('error', scope, message, safeMetadata);
  try {
    await db.from('system_events').insert({ level:'error', scope:String(scope).slice(0,80), message, metadata:safeMetadata });
  } catch (loggingError) {
    console.error(JSON.stringify({ ts:new Date().toISOString(), level:'error', scope:'observability', message:redactString(loggingError?.message || loggingError).slice(0,1000) }));
  }
}
