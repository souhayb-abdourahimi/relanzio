// Single Railway pre-deploy entrypoint: fail closed if any certification step fails.
await import('./qa-auth-domain-final.mjs');
await import('./qa-outreach-safety.mjs');
await import('./qa-outreach-provider.mjs');
console.log('FINAL_PREDEPLOY_QA_PASS');
