import { timingSafeEqual } from 'node:crypto';
const buckets = new Map();

function cleanup(now){if(buckets.size<5000)return;for(const[k,v]of buckets)if(v.resetAt<=now)buckets.delete(k);if(buckets.size>10000){let n=0;for(const k of buckets.keys()){buckets.delete(k);if(++n>=1000)break}}}
export function rateLimit({ windowMs = 60_000, max = 120 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown'; const now = Date.now(); cleanup(now);
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) { buckets.set(key,{count:1,resetAt:now+windowMs}); return next(); }
    current.count += 1;
    if (current.count > max) { res.setHeader('Retry-After',Math.ceil((current.resetAt-now)/1000)); return res.status(429).json({error:'Trop de requêtes. Réessayez dans un instant.'}); }
    next();
  };
}
export function safeEqual(a='',b='') { const aa=Buffer.from(String(a)),bb=Buffer.from(String(b)); return aa.length===bb.length && aa.length>0 && timingSafeEqual(aa,bb); }
