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
  const child=spawn('npx',['vite','--config','client/vite.config.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:appDir,env,stdio:['ignore','pipe','pipe'],detached:true});
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
      await page.getByRole('dialog').getByRole('button',{name:'Relance faite'}).click();
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
    if(label==='mobile')await step('mobile: 3 relances processed from the Today view (taps counted)',async()=>{
      const due=[0,1,2].map(i=>({id:`d${i}`,client_name:`Client ${i}`,client_phone:'06 12 34 56 7'+i,title:`Devis ${i}`,amount:1500,followup_step:0,next_followup_at:new Date(Date.now()-DAY).toISOString()}));
      const b5=createFakeBackend({seedQuotes:due,profile:{company_name:'Toitures Martin',onboarding_completed:true}});
      const c5=await newContext(browser,vp,b5,{loggedIn:true});const p5=await c5.newPage();
      await p5.goto(BASE+'/');await p5.waitForSelector('.today-card');
      const started=Date.now();let taps=0;
      for(let i=0;i<3;i++){
        await p5.locator('.today-card').filter({hasText:'Relance 1/3'}).first().getByRole('button',{name:'Relancer'}).tap();taps++;
        await p5.waitForSelector('.preview-modal');
        assert.ok(await p5.getByRole('link',{name:'SMS'}).isVisible());
        await p5.getByRole('dialog').getByRole('button',{name:'Relance faite'}).tap();taps++;
        await p5.waitForSelector('.preview-modal',{state:'detached'});
      }
      await p5.waitForFunction(()=>!document.body.innerText.includes('Relance 1/3'));
      assert.ok(b5.state.quotes.every(q=>q.followup_step===1));
      results.push(`INFO mobile: 3 relances recorded with ${taps} taps (+1 tap per SMS/call in the user's own app), scripted run ${Date.now()-started} ms`);
      await c5.close();
    });
    if(label==='desktop')await step('desktop: keyboard only — Tab to Relancer, Enter opens, Escape closes and focus returns',async()=>{
      const b6=createFakeBackend({seedQuotes:seed(),profile:{company_name:'Toitures Martin',onboarding_completed:true}});
      const c6=await newContext(browser,vp,b6,{loggedIn:true});const p6=await c6.newPage();
      await p6.goto(BASE+'/');await p6.waitForSelector('.today-card');
      let found=false;
      for(let i=0;i<40&&!found;i++){await p6.keyboard.press('Tab');found=await p6.evaluate(()=>document.activeElement?.textContent?.trim()==='Relancer');}
      assert.ok(found,'Relancer reachable with Tab');
      const ring=await p6.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle);
      assert.notEqual(ring,'none','visible focus ring');
      await p6.keyboard.press('Enter');await p6.waitForSelector('.preview-modal');
      assert.equal(await p6.evaluate(()=>document.activeElement?.tagName),'TEXTAREA','focus moves into the dialog');
      await p6.keyboard.press('Escape');await p6.waitForSelector('.preview-modal',{state:'detached'});
      assert.equal(await p6.evaluate(()=>document.activeElement?.textContent?.trim()),'Relancer','focus returns to the opener');
      await c6.close();
    });
    await step(`${label}: free account above the limit sees read-only quotes and can still close them`,async()=>{
      const quotes=Array.from({length:7},(_,i)=>({id:`l${i}`,client_name:`Client ${i}`,client_email:`c${i}@example.test`,title:`Devis ${i}`,amount:1000+i,followup_step:0,next_followup_at:new Date(Date.now()-DAY).toISOString(),created_at:new Date(Date.now()-(10-i)*DAY).toISOString()}));
      const b2=createFakeBackend({seedQuotes:quotes,profile:{company_name:'Toitures Martin',onboarding_completed:true,trial_started_at:new Date(Date.now()-10*DAY).toISOString(),trial_ends_at:new Date(Date.now()-3*DAY).toISOString(),trial_expired_at:new Date(Date.now()-3*DAY).toISOString()}});
      const c2=await newContext(browser,vp,b2,{loggedIn:true});const p2=await c2.newPage();
      await p2.goto(BASE+'/');await p2.waitForSelector('.today-card');
      assert.match(await p2.locator('.trial-banner').innerText(),/2 devis en lecture seule/);
      const locked=p2.locator('.today-card.locked');
      assert.equal(await locked.count(),2);
      assert.equal(await locked.first().getByRole('button',{name:'Relancer'}).count(),0,'no follow-up on a locked quote');
      if(label==='mobile')await locked.first().getByRole('button',{name:'Résultat'}).click();
      await locked.first().getByRole('button',{name:'Perdu'}).click();
      await p2.getByText('Devis marqué perdu').waitFor();
      assert.equal(b2.state.quotes.find(q=>q.id==='l0').status,'lost');
      await c2.close();
    });
    await step(`${label}: past_due shows the payment banner and opens the Stripe portal`,async()=>{
      const b3=createFakeBackend({seedQuotes:seed(),profile:{company_name:'Toitures Martin',onboarding_completed:true,plan:'free',subscription_status:'past_due',stripe_customer_id:'cus_e2e',stripe_subscription_id:'sub_e2e',trial_started_at:new Date(Date.now()-40*DAY).toISOString(),trial_ends_at:new Date(Date.now()-33*DAY).toISOString(),trial_expired_at:new Date(Date.now()-33*DAY).toISOString()}});
      const c3=await newContext(browser,vp,b3,{loggedIn:true});const p3=await c3.newPage();
      await p3.goto(BASE+'/');await p3.waitForSelector('.banner-past_due');
      await p3.getByRole('button',{name:'Mettre à jour ma carte'}).click();
      await p3.waitForURL(/__e2e\/stripe-portal/);
      await c3.close();
    });
    await step(`${label}: past_due in grace keeps Pro (no read-only quotes) and asks to update the card`,async()=>{
      const quotes=Array.from({length:7},(_,i)=>({id:`g${i}`,client_name:`Client ${i}`,client_email:`g${i}@example.test`,title:`Devis ${i}`,amount:1000,followup_step:0,next_followup_at:new Date(Date.now()-DAY).toISOString(),created_at:new Date(Date.now()-(10-i)*DAY).toISOString()}));
      const b7=createFakeBackend({seedQuotes:quotes,profile:{company_name:'Toitures Martin',onboarding_completed:true,plan:'pro',subscription_status:'past_due',stripe_customer_id:'cus_e2e',stripe_subscription_id:'sub_e2e',subscription_current_period_start:new Date(Date.now()-2*DAY).toISOString(),subscription_current_period_end:new Date(Date.now()+28*DAY).toISOString()}});
      const c7=await newContext(browser,vp,b7,{loggedIn:true});const p7=await c7.newPage();
      await p7.goto(BASE+'/');await p7.waitForSelector('.banner-past_due');
      assert.match(await p7.locator('.banner-past_due').innerText(),/mettez à jour votre carte avant le/);
      assert.equal(await p7.locator('.today-card.locked').count(),0,'no read-only quote during grace');
      await p7.getByRole('button',{name:'Mettre à jour ma carte'}).click();
      await p7.waitForURL(/__e2e\/stripe-portal/);
      await c7.close();
    });
    await step(`${label}: paying customer manages the subscription from Formules`,async()=>{
      const b4=createFakeBackend({seedQuotes:seed(),profile:{company_name:'Toitures Martin',onboarding_completed:true,plan:'pro',subscription_status:'active',stripe_customer_id:'cus_e2e',stripe_subscription_id:'sub_e2e',subscription_cancel_at_period_end:true,subscription_current_period_end:new Date(Date.now()+12*DAY).toISOString()}});
      const c4=await newContext(browser,vp,b4,{loggedIn:true});const p4=await c4.newPage();
      await p4.goto(BASE+'/?view=plans');await p4.waitForSelector('.plans-view');
      assert.match(await p4.locator('.plans-view').innerText(),/Abonnement résilié : Pro jusqu’au/);
      await p4.getByRole('button',{name:'Gérer mon abonnement'}).click();
      await p4.waitForURL(/__e2e\/stripe-portal/);
      await c4.close();
    });
    assert.deepEqual(errors,[],`${label}: no page errors`);
    await ctx.close();
  }
  for(const r of results)console.log(r);
}

// Accessibility pass with axe-core (path in AXE_PATH, e.g. node_modules/axe-core/axe.min.js) on key screens.
async function a11y(browser){
  const { readFileSync }=await import('node:fs');
  const axe=readFileSync(process.env.AXE_PATH,'utf8');
  const report=[];
  const audit=async(page,name)=>{
    await page.addScriptTag({content:axe});
    const r=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    const bad=r.violations.filter(v=>['serious','critical'].includes(v.impact));
    report.push(`${bad.length?'FAIL':'PASS'} ${name}: ${bad.length} serious/critical, ${r.violations.length-bad.length} minor`);
    for(const v of r.violations){report.push(`   - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);if(process.env.A11Y_VERBOSE)for(const n of v.nodes)report.push(`       ${n.target.join(' ')} :: ${(n.any[0]?.message||'').slice(0,140)}`);}
  };
  for(const [label,vp] of [['desktop',DESKTOP],['mobile',MOBILE]]){
    let backend=createFakeBackend();
    let ctx=await newContext(browser,vp,backend);let page=await ctx.newPage();
    for(const path of ['/','/pricing','/faq','/terms','/signup']){await page.goto(BASE+path);await page.waitForSelector('h1');await audit(page,`${label} ${path}`);}
    await ctx.close();
    backend=createFakeBackend({seedQuotes:seed(),profile:{company_name:'Toitures Martin',onboarding_completed:true}});
    ctx=await newContext(browser,vp,backend,{loggedIn:true});page=await ctx.newPage();
    await page.goto(BASE+'/');await page.waitForSelector('.today-card');await audit(page,`${label} Aujourd’hui`);
    await page.locator('.today-card').first().getByRole('button',{name:'Relancer'}).click();await page.waitForSelector('.preview-modal');await audit(page,`${label} fenêtre de relance`);
    await page.keyboard.press('Escape');
    await page.goto(BASE+'/?view=plans');await page.waitForSelector('.plans-view');await audit(page,`${label} Formules`);
    await ctx.close();
  }
  for(const r of report)console.log(r);
  if(report.some(r=>r.startsWith('FAIL')))process.exitCode=1;
}

const vite=startVite();
try{
  await waitFor(BASE+'/');
  const browser=await chromium.launch();
  try{ if(mode==='screenshots')await screenshots(browser);else if(mode==='a11y')await a11y(browser);else await flows(browser); }
  finally{ await browser.close(); }
}catch(e){console.error(e);console.error(vite.log().slice(-2000));process.exitCode=1;}
finally{try{process.kill(-vite.child.pid,'SIGTERM');}catch{}setTimeout(()=>process.exit(process.exitCode||0),200);}
