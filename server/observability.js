import { db } from './db.js';
import { redactLogString, sanitizeLogValue } from './log-redaction.js';

export function log(level, scope, message, metadata = {}) {
  const payload = { ts:new Date().toISOString(), level, scope:String(scope||'').slice(0,80), message:redactLogString(message).slice(0,1000), metadata:sanitizeLogValue(metadata) };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else if (level === 'warn') console.warn(line); else console.log(line);
}

export async function reportError(scope, error, metadata = {}) {
  const message = redactLogString(error?.message || error || 'Unknown error').slice(0, 1000);
  const safeMetadata=sanitizeLogValue(metadata);
  log('error', scope, message, safeMetadata);
  try {
    await db.from('system_events').insert({ level:'error', scope:String(scope).slice(0,80), message, metadata:safeMetadata });
  } catch (loggingError) {
    console.error(JSON.stringify({ ts:new Date().toISOString(), level:'error', scope:'observability', message:redactLogString(loggingError?.message || loggingError).slice(0,1000) }));
  }
}
