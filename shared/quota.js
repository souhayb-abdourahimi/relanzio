import { FREE_ACTIVE_QUOTES_LIMIT, PRO_ACTIVE_QUOTES_LIMIT } from './plans.js';

// Read-only rule when an account has more active quotes than its plan allows (e.g. after the trial):
// active quotes (open or paused) are ranked by creation date, most recent first (id breaks ties);
// the first <limit> stay fully usable, the others are locked. Nothing is deleted. A locked quote can
// still be marked won or lost, or deleted — each of those frees a place and unlocks the next one.
export const ACTIVE_STATUSES=Object.freeze(['open','paused']);
export const LOCKED_ALLOWED_STATUSES=Object.freeze(['won','lost']);

export function rankActiveQuotes(quotes=[]){
  return quotes.filter(q=>ACTIVE_STATUSES.includes(q.status))
    .sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()||String(b.id).localeCompare(String(a.id)));
}

export function lockedQuoteIds(quotes=[],proAccess=false){
  const limit=proAccess?PRO_ACTIVE_QUOTES_LIMIT:FREE_ACTIVE_QUOTES_LIMIT;
  return new Set(rankActiveQuotes(quotes).slice(limit).map(q=>q.id));
}

export function withLocks(quotes=[],proAccess=false){
  const locked=lockedQuoteIds(quotes,proAccess);
  return quotes.map(q=>({...q,locked:locked.has(q.id)}));
}

// What a PATCH may change on a locked quote: only its status, and only to won or lost.
export function isAllowedLockedPatch(body={}){
  const keys=Object.keys(body);
  return keys.length===1&&keys[0]==='status'&&LOCKED_ALLOWED_STATUSES.includes(body.status);
}
