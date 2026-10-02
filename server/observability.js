import { db } from './db.js';

export function log(level, scope, message, metadata = {}) {
  const payload = { ts:new Date().toISOString(), level, scope, message:String(message || ''), metadata };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else if (level === 'warn') console.warn(line); else console.log(line);
}

export async function reportError(scope, error, metadata = {}) {
  const message = String(error?.message || error || 'Unknown error').slice(0, 1000);
  log('error', scope, message, metadata);
  try {
    await db.from('system_events').insert({ level:'error', scope:String(scope).slice(0,80), message, metadata });
  } catch (loggingError) {
    console.error(JSON.stringify({ ts:new Date().toISOString(), level:'error', scope:'observability', message:String(loggingError?.message || loggingError) }));
  }
}
