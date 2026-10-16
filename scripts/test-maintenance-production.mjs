// Local compiled-server smoke. Child environment has no provider credentials.
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import assert from 'node:assert/strict';
const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
for(const visible of ['false','true']){
 const child=spawn(process.execPath,['--input-type=module','-e',"globalThis.fetch=async()=>{throw Error('EXTERNAL_NETWORK_FORBIDDEN')}; await import('./server/index.js');"],{
 cwd:process.cwd(),env:{PATH:process.env.PATH,NODE_ENV:'production',PORT:String(port),APP_URL:`http://127.0.0.1:${port}`,SUPABASE_URL:'https://fixture.invalid',SUPABASE_ANON_KEY:'fixture',SUPABASE_SERVICE_ROLE_KEY:'fixture',MAINTENANCE_PILOT_VISIBLE:visible,DOTENV_CONFIG_PATH:'/dev/null'},stdio:['ignore','pipe','pipe']});
 let ready=false;child.stdout.on('data',chunk=>{if(String(chunk).includes('Relanzio running'))ready=true});child.stderr.on('data',()=>{});
 try{
  for(let i=0;i<100&&!ready;i++)await new Promise(r=>setTimeout(r,50));assert.equal(ready,true,'local server must start');
  const base=`http://127.0.0.1:${port}`;
  assert.equal((await fetch(base+'/api/health')).status,200);
  assert.equal((await fetch(base+'/')).status,200);
  const pilot=await fetch(base+'/rappel-entretien');assert.equal(pilot.status,visible==='true'?200:404,'compiled pilot page follows server gate');
  if(visible==='true')assert.match(await pilot.text(),/<div id="root"/);
  console.log(`compiled server: pilot visible=${visible} PASS`);
 }finally{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
}
