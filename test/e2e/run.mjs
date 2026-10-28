// Browser E2E for Relanzio, driven against the real React app with a faked API/Auth backend.
// Usage: node test/e2e/run.mjs [screenshots|flows] [--prefix before|after] [--app-dir path]
// Requires Playwright (preinstalled: NODE_PATH=/opt/node-tools/node_modules) and Chromium.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createFakeBackend } from './fake-backend.mjs';

const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const args=process.argv.slice(2);
const mode=args[0]||'flows';
const opt=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:null;};
const prefix=opt('--prefix')||'after';
const appDir=resolve(opt('--app-dir')||'.');
const port=Number(opt('--port')||5179);
const shotsDir=resolve('docs/screenshots');
const SUPABASE_HOST='e2e-project.supabase.co';
const BASE=`http://127.0.0.1:${port}`;
const DESKTOP={width:1366,height:900},MOBILE={width:390,height:844};
const DAY=86400000;

function startVite(){
  const env={...process.env,VITE_SUPABASE_URL:`https://${SUPABASE_HOST}`,VITE_SUPABASE_ANON_KEY:'e2e-anon-key',VITE_BILLING_ENABLED:'true'};
  const child=spawn('npx',['vite','--config','client/vite.config.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:appDir,env,stdio:['ignore','pipe','pipe']});
  let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
  return {child,log:()=>log};
}
async function waitFor(url,ms=30000){
  const end=Date.now()+ms;
  while(Date.now()<end){try{const r=await fetch(url);if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}
  throw new Error('Vite did not start: '+url);
}
function seed(){
  const now=Date.now(),at=(d,h=7)=>{const x=new Date(now+d*DAY);x.setUTCHours(h,0,0,0);return x.toISOString();};
  return [
    {id:'late',client_name:'Dupont Toitures',client_email:'contact@dupont-toitures.test',client_phone:'06 12 34 56 78',title:'Réfection toiture garage',amount:4800,followup_step:1,next_followup_at:at(-3),note:'Attend l’accord du conjoint'},
    {id:'today',client_name:'Martin',client_email:'martin@example.test',title:'Remplacement chauffe-eau',amount:2100,followup_step:0,next_followup_at:at(0,8)},
    {id:'terminal',client_name:'Bernard Rénovation',client_email:'b.bernard@example.test',title:'Salle de bain complète',amount:9400,followup_step:3,next_followup_at:null},
    {id:'future',client_name:'Studio Nova',client_email:'hello@studionova.test',title:'Site vitrine',amount:1850,followup_step:2,next_followup_at:at(4)},
    {id:'won',client_name:'Claire Robert',client_email:'claire@example.test',title:'Tableau électrique',amount:950,status:'won',followup_step:1,next_followup_at:null}
  ];
}
async function newContext(browser,viewport,backend,{loggedIn=false}={}){
  const context=await browser.newContext({viewport,locale:'fr-FR',timezoneId:'Europe/Paris',deviceScaleFactor:1,isMobile:viewport.width<700,hasTouch:viewport.width<700});
  await backend.install(context,{supabaseHost:SUPABASE_HOST});
  if(loggedIn)await context.addInitScript(([key,value])=>localStorage.setItem(key,value),[`sb-${SUPABASE_HOST.split('.')[0]}-auth-token`,JSON.stringify(backend.session())]);
  await context.addInitScript(()=>{window.__copied=[];try{Object.defineProperty(navigator,'clipboard',{value:{writeText:t=>{window.__copied.push(t);return Promise.resolve();}}});}catch{}});
  return context;
}
const shot=(page,name)=>page.screenshot({path:`${shotsDir}/${prefix}-${name}.png`,fullPage:false});

async function screenshots(browser){
  mkdirSync(shotsDir,{recursive:true});
  for(const [label,vp] of [['desktop',DESKTOP],['mobile',MOBILE]]){
    let backend=createFakeBackend();
    let ctx=await newContext(browser,vp,backend);
    let page=await ctx.newPage();
    await page.goto(BASE+'/');await page.waitForSelector('h1');await shot(page,`landing-${label}`);
    await page.goto(BASE+'/pricing');await page.waitForSelector('h1');await shot(page,`pricing-${label}`);
    await ctx.close();
    backend=createFakeBackend({seedQuotes:seed(),profile:{company_name:'Toitures Martin',onboarding_completed:true}});
    ctx=await newContext(browser,vp,backend,{loggedIn:true});
    page=await ctx.newPage();
    await page.goto(BASE+'/');await page.waitForSelector('.dash');await page.waitForTimeout(300);
    await shot(page,`today-${label}`);
    await page.locator('button',{hasText:/^Relancer$/}).first().click();
    await page.waitForSelector('.preview-modal');await page.waitForTimeout(200);
    await shot(page,`followup-modal-${label}`);
    await ctx.close();
  }
  console.log(`screenshots written to docs/screenshots/${prefix}-*.png`);
}

async function flows(browser){
  const results=[];
  const step=async(name,fn)=>{const t=Date.now();await fn();results.push(`PASS ${name} (${Date.now()-t} ms)`);};
  for(const [label,vp] of [['desktop',DESKTOP],['mobile',MOBILE]]){
    const backend=createFakeBackend();
    const ctx=await newContext(browser,vp,backend);
    const page=await ctx.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await step(`${label}: landing is readable and links to signup/login`,async()=>{
      await page.goto(BASE+'/');
      await assert.doesNotReject(page.waitForSelector('h1'));
      assert.ok(await page.locator('a[href="/login"]').first().isVisible(),'Connexion visible');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);assert.equal(overflow,false,'no horizontal overflow');
    });
    await step(`${label}: signup → onboarding → first quote → trial starts`,async()=>{
      const started=Date.now();
      await page.goto(BASE+'/signup');
      await page.getByLabel('Email').fill('artisan@example.test');
      await page.getByLabel('Mot de passe').fill('motdepasse-solide');
      await page.locator('.legal-check input').check();
      await page.getByRole('button',{name:'Créer mon espace'}).click();
      await page.getByLabel('Entreprise').fill('Toitures Martin');
      await page.getByRole('button',{name:/Accéder au tableau de bord/}).click();
      await page.getByRole('button',{name:/Ajouter (un|mon premier) devis/}).first().click();
      await page.getByLabel('Client',{exact:true}).fill('Mme Leroy');
      await page.getByLabel(/Téléphone/).fill('06 11 22 33 44');
      await page.getByLabel('Objet').fill('Réfection gouttières');
      await page.getByLabel(/Montant/).fill('1850');
      await page.getByRole('button',{name:'Créer le suivi'}).click();
      await page.waitForSelector('.today-card');
      assert.ok(backend.state.profile.trial_started_at,'trial started at first quote');
      await page.waitForSelector('.trial-banner');
      assert.match(await page.locator('.trial-banner').innerText(),/Essai Pro : 7 jours restants/);
      results.push(`INFO ${label}: signup → first quote in ${Math.round((Date.now()-started)/1000)} s (scripted)`);
    });
    await step(`${label}: Relance faite in one gesture advances the step`,async()=>{
      const q=backend.state.quotes[0];q.next_followup_at=new Date().toISOString();
      await page.reload();await page.waitForSelector('.today-card');
      await page.locator('.today-card').first().getByRole('button',{name:'Relancer'}).click();
      await page.waitForSelector('.preview-modal');
      assert.ok(await page.getByRole('link',{name:'SMS'}).isVisible(),'SMS link');
      assert.ok(await page.getByRole('link',{name:'Appeler'}).isVisible(),'tel link');
      await page.locator('.preview-modal textarea').fill('Bonjour, avez-vous pu regarder le devis ?');
      await page.getByRole('button',{name:'Relance faite'}).click();
      await page.waitForSelector('.preview-modal',{state:'detached'});
      assert.equal(backend.state.quotes[0].followup_step,1);
      await page.getByText('Relance marquée comme faite').waitFor();
    });
    await step(`${label}: Repousser +3 j, then Gagné`,async()=>{
      const q=backend.state.quotes[0];q.next_followup_at=new Date().toISOString();
      await page.reload();await page.waitForSelector('.today-card');
      const card=page.locator('.today-card').first();
      await card.getByRole('button',{name:'Repousser'}).click();
      await card.getByRole('button',{name:'+3 j'}).click();
      await page.getByText(/Devis repoussé au/).waitFor();
      const patch=backend.state.calls.filter(c=>c.method==='PATCH').pop();
      assert.equal(patch.body.followup_schedule_mode,'custom');
      q.next_followup_at=new Date().toISOString();
      await page.reload();await page.waitForSelector('.today-card');
      const card2=page.locator('.today-card').first();
      if(label==='mobile')await card2.getByRole('button',{name:'Résultat'}).click();
      await card2.getByRole('button',{name:'Gagné'}).click();
      await page.waitForTimeout(300);
      assert.equal(backend.state.quotes[0].status,'won');
    });
    await step(`${label}: checkout (simulated Stripe) and portal links`,async()=>{
      await page.goto(BASE+'/');await page.waitForSelector('.trial-banner');
      await page.locator('.trial-banner').getByRole('button').first().click();
      await page.waitForURL(/__e2e\/stripe-checkout/);
      assert.ok(backend.state.calls.some(c=>c.path==='/billing/checkout'));
    });
    assert.deepEqual(errors,[],`${label}: no page errors`);
    await ctx.close();
  }
  for(const r of results)console.log(r);
}

const vite=startVite();
try{
  await waitFor(BASE+'/');
  const browser=await chromium.launch();
  try{ if(mode==='screenshots')await screenshots(browser);else await flows(browser); }
  finally{ await browser.close(); }
}catch(e){console.error(e);console.error(vite.log().slice(-2000));process.exitCode=1;}
finally{vite.child.kill();}
