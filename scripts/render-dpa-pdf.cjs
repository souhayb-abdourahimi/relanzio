// Regenerates client/public/relanzio-dpa.pdf from the prerendered /dpa page (run after `npm run build`).
// Usage: NODE_PATH=/opt/node-tools/node_modules node scripts/render-dpa-pdf.cjs
const { chromium }=require('playwright');
const { readFileSync, readdirSync }=require('fs');
const { resolve }=require('path');
(async()=>{
  const dist=resolve(__dirname,'../dist');
  let html=readFileSync(resolve(dist,'prerender/dpa.html'),'utf8');
  const css=readdirSync(resolve(dist,'assets')).filter(f=>f.endsWith('.css')).map(f=>readFileSync(resolve(dist,'assets',f),'utf8')).join('\n');
  html=html.replace(/<link rel="stylesheet"[^>]*>/g,'').replace(/<script[\s\S]*?<\/script>/g,'').replace('</head>',`<style>${css}</style></head>`);
  const browser=await chromium.launch();
  const page=await browser.newPage();
  await page.setContent(html,{waitUntil:'load'});
  await page.emulateMedia({media:'print'});
  await page.pdf({path:resolve(__dirname,'../client/public/relanzio-dpa.pdf'),format:'A4',printBackground:false,margin:{top:'18mm',bottom:'18mm',left:'16mm',right:'16mm'}});
  await browser.close();
  console.log('client/public/relanzio-dpa.pdf written');
})();
