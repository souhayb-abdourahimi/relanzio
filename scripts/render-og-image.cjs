// Regenerates client/public/og-image.png (1200×630) from scripts/og-image.html.
// Usage: NODE_PATH=/opt/node-tools/node_modules node scripts/render-og-image.cjs
const { chromium }=require('playwright');
const { resolve }=require('path');
(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.goto('file://'+resolve(__dirname,'og-image.html'));
  await page.screenshot({path:resolve(__dirname,'../client/public/og-image.png')});
  await browser.close();
})();
