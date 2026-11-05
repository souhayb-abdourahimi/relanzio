// Retention: 30 days, with floors that make it impossible to lose the last good backup.
//  - never runs when the current backup is not fully verified (the caller enforces it);
//  - only touches keys under the v2 prefix (the legacy daily/ objects are left alone);
//  - always keeps the KEEP_MIN most recent backups, whatever their age;
//  - always keeps the most recent backup whose manifest says COMPLETE_AND_RESTORE_VERIFIED.
import { PREFIX } from './manifest.mjs';

const STAMP = /relanzio-(\d{8}T\d{9}Z)\.(rzbk2|manifest\.json)$/;
export const KEEP_MIN = 7;

const stampToMs = s => Date.parse(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}.${s.slice(15, 18)}Z`);

// objects: [{key}], verified: Set of stamps known to be fully verified. Returns the keys to delete.
export function planRetention({ objects, now, retentionDays = 30, verified = new Set(), keepMin = KEEP_MIN }) {
  if (!Number.isFinite(retentionDays) || retentionDays < 7) throw new Error('RETENTION_DAYS_TOO_LOW');
  const groups = new Map();
  for (const o of objects) {
    if (!o.key.startsWith(PREFIX)) continue;
    const m = o.key.match(STAMP);
    if (!m) continue;
    if (!groups.has(m[1])) groups.set(m[1], []);
    groups.get(m[1]).push(o.key);
  }
  const stamps = [...groups.keys()].sort().reverse();
  const keep = new Set(stamps.slice(0, keepMin));
  const lastVerified = stamps.find(s => verified.has(s));
  if (lastVerified) keep.add(lastVerified);
  const cutoff = now.getTime() - retentionDays * 86400000;
  const del = [];
  for (const s of stamps) {
    if (keep.has(s)) continue;
    if (stampToMs(s) < cutoff) del.push(...groups.get(s));
  }
  return del;
}

export const stampOf = key => key.match(STAMP)?.[1] ?? null;
