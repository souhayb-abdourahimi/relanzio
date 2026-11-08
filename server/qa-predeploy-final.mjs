// Railway runs this in a separate container. This entry point must never import
// the application, destructive QA, migrations, database clients or schedulers.
import {runPredeployCheck} from './predeploy-check.js';
const result=await runPredeployCheck();
console.log('PREDEPLOY_CHECK '+JSON.stringify(result));
if(!result.ok)process.exitCode=1;
// Railway subsequently checks /api/readiness on the actual new process.
