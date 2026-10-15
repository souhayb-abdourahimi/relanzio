const SECRET_KEY=/secret|password|authorization|cookie|api[_-]?key|service[_-]?role/i;
const SECRET_VALUE=/(?:sk_(?:live|test)_[A-Za-z0-9_-]+|whsec_[A-Za-z0-9_-]+|xkeysib-[A-Za-z0-9_-]+|sb_secret_[A-Za-z0-9_-]+|Bearer\s+[A-Za-z0-9._-]+)/gi;

export function redactLogString(value=''){
  return String(value).replace(SECRET_VALUE,'[REDACTED]');
}

export function sanitizeLogValue(value,depth=0){
  if(depth>5)return '[MAX_DEPTH]';
  if(typeof value==='string')return redactLogString(value).slice(0,2000);
  if(value===null||value===undefined||typeof value==='number'||typeof value==='boolean')return value;
  if(Array.isArray(value))return value.slice(0,50).map(x=>sanitizeLogValue(x,depth+1));
  if(typeof value==='object'){
    const out={};
    for(const [key,item] of Object.entries(value).slice(0,100))out[key]=SECRET_KEY.test(key)?'[REDACTED]':sanitizeLogValue(item,depth+1);
    return out;
  }
  return redactLogString(value);
}
