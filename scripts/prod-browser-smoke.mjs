// Read-only browser pass on the public pages of a deployed Relanzio (no form is submitted, no account is created).
import { chromium } from '@playwright/test';
const base=(process.env.SMOKE_BASE_URL||'').replace(/\/$/,'');if(!base)throw new Error('SMOKE_BASE_URL required');
const PROMISE='Tout s’arrête dès que le client répond';
const browser=await chromium.launch();const report=[];let failed=false;
const check=(ok,name,detail='')=>{report.push(`${ok?'PASS':'FAIL'} ${name}${detail?' — '+detail:''}`);if(!ok)failed=true;};
try{
  for(const [label,viewport] of [['390',{width:390,height:844}],['1366',{width:1366,height:900}]]){
    const ctx=await browser.newContext({viewport,locale:'fr-FR',isMobile:viewport.width<700});const page=await ctx.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(String(e.message).slice(0,160)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,160));});
    for(const path of ['/','/pricing','/faq','/login','/signup']){
      const t=Date.now();const r=await page.goto(base+path,{waitUntil:'networkidle'});await page.waitForSelector('h1');
      const text=await page.locator('body').innerText();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
      check(r.status()===200&&!overflow,`${label} ${path} rendered`,`HTTP ${r.status()} · ${Date.now()-t} ms · overflow=${overflow}`);
      check(!text.includes(PROMISE),`${label} ${path} reply promise hidden`);
      check(!text.includes('Bonjour M.,')&&!text.includes('J+7'),`${label} ${path} no "Bonjour M.," / no J+7`);
      if(path==='/'){check(text.includes('Vos devis relancés'),`${label} / new landing live`);check((await page.title()).includes('Vos devis relancés au bon moment'),`${label} / new title`,await page.title());}
      if(path==='/pricing')for(const s of ['29 € / mois','TVA non applicable, art. 293 B du CGI','Jusqu’à 5 devis actifs','Jusqu’à 100 devis actifs','Relanzio relance pour vous','Vous gardez la main'])check(text.includes(s),`${label} /pricing "${s}"`);
      if(path==='/login'||path==='/signup')check(await page.locator('input[type=email]').count()>0,`${label} ${path} email field`);
    }
    check(errors.length===0,`${label} no JS/console errors`,errors.slice(0,3).join(' | '));
    await ctx.close();
  }
}finally{await browser.close();}
console.log(report.join('\n'));
if(failed)process.exit(1);
