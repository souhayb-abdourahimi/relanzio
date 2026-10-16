// Single Railway pre-deploy entrypoint: outreach gates first; auth is last because it exits the process.
await import('./qa-outreach-safety.mjs');
await import('./qa-outreach-provider.mjs');
console.log('OUTREACH_PREDEPLOY_QA_PASS');
await import('./qa-auth-domain-final.mjs');
