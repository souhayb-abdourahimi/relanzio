// Explicit operator command. No cron, no dotenv, no inherited SaaS credentials.
import { createClient } from '@supabase/supabase-js';
import { pilotRepository } from '../server/maintenance-pilot/repository.js';
if(process.argv[2]!=='--confirm-pilot-database-purge'){
 console.error('Refused. This removes expired pilot records only. Read docs/maintenance-pilot/operations.md.');process.exitCode=1;
}else if(!process.env.MAINTENANCE_PILOT_DB_URL||!process.env.MAINTENANCE_PILOT_DB_KEY){
 console.error('Explicit MAINTENANCE_PILOT_DB_URL and MAINTENANCE_PILOT_DB_KEY required; no fallback to SaaS credentials.');process.exitCode=1;
}else{
 try{const db=createClient(process.env.MAINTENANCE_PILOT_DB_URL,process.env.MAINTENANCE_PILOT_DB_KEY,{auth:{persistSession:false,autoRefreshToken:false}});console.log(JSON.stringify(await pilotRepository(db).purge()));}
 catch{console.error('PURGE_FAILED: no deletion certificate issued. Retry after investigating storage access.');process.exitCode=1;}
}
