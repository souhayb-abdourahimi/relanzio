// Public pages must be readable without JavaScript: serves dist/ with the production server
// (fake Supabase URL, no external calls needed for static pages) and loads each route with JS disabled.
// Usage: npm run build && node test/e2e/no-js.mjs
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const PORT=3998,BASE=`http://127.0.0.1:${PORT}`;
const server=spawn(process.execPath,['server/index.js'],{env:{...process.env,NODE_ENV:'production',PORT:String(PORT),SUPABASE_URL:'http://127.0.0.1:9',SUPABASE_ANON_KEY:'x',SUPABASE_SERVICE_ROLE_KEY:'x',APP_URL:BASE,STRIPE_SECRET_KEY:''},stdio:'ignore'});
const checks={'/':'Chaque matin, les devis à relancer','/pricing':'Tarifs simples','/faq':'Qui êtes-vous ?','/docs':'La vue Aujourd’hui','/contact':'Contact général','/legal':'131 068 603','/privacy':'Sous-traitants','/dpa':'Télécharger le DPA','/terms':'L223-8','/logiciel-relance-devis':'sans construire un CRM','/relance-devis-agence':'petite agence','/modele-email-relance-devis':'Dernier suivi'};
try{
  for(let i=0;i<40;i++){try{if((await fetch(BASE+'/pricing')).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
  const browser=await chromium.launch();
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const [path,text] of Object.entries(checks)){
    await page.goto(BASE+path);
    const h1=await page.locator('h1').first().innerText();
    assert.ok(h1.length>3,`${path}: h1`);
    assert.ok((await page.content()).includes(text),`${path}: "${text}"`);
    console.log(`PASS no-JS ${path} — ${h1.replace(/\s+/g,' ').slice(0,60)}`);
  }
  await browser.close();
}catch(e){console.error(e);process.exitCode=1;}
finally{server.kill();}
