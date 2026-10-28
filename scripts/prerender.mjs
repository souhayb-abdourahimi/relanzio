// Prerenders public routes to static HTML after `vite build`, so search engines and visitors without
// JavaScript get the full page (not just meta tags). The SPA shell (dist/index.html) is kept for the app.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd(),dist=resolve(root,'dist'),ssrOut=resolve(root,'dist-ssr');
execFileSync(process.execPath,[resolve(root,'node_modules/vite/bin/vite.js'),'build','--config','client/vite.config.js','--ssr','src/entry-server.jsx','--outDir',ssrOut,'--emptyOutDir','--logLevel','warn'],{stdio:'inherit'});
const { render, ROUTE_META, PRERENDER_ROUTES, SITE_URL, OG_IMAGE }=await import(pathToFileURL(resolve(ssrOut,'entry-server.js')).href);
const template=readFileSync(resolve(dist,'index.html'),'utf8');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const setTag=(html,re,tag)=>{if(!re.test(html))throw new Error(`Template tag missing: ${re}`);return html.replace(re,tag);};

mkdirSync(resolve(dist,'prerender'),{recursive:true});
for(const path of PRERENDER_ROUTES){
  const meta=ROUTE_META[path],url=SITE_URL+path;
  let html=template;
  html=setTag(html,/<title>[^<]*<\/title>/,`<title>${esc(meta.title)}</title>`);
  html=setTag(html,/<meta name="description" content="[^"]*" \/>/,`<meta name="description" content="${esc(meta.description)}" />`);
  html=setTag(html,/<link rel="canonical" href="[^"]*" \/>/,`<link rel="canonical" href="${esc(url)}" />`);
  html=setTag(html,/<meta property="og:title" content="[^"]*" \/>/,`<meta property="og:title" content="${esc(meta.title)}" />`);
  html=setTag(html,/<meta property="og:description" content="[^"]*" \/>/,`<meta property="og:description" content="${esc(meta.description)}" />`);
  html=setTag(html,/<meta property="og:url" content="[^"]*" \/>/,`<meta property="og:url" content="${esc(url)}" />`);
  html=setTag(html,/<meta name="twitter:title" content="[^"]*" \/>/,`<meta name="twitter:title" content="${esc(meta.title)}" />`);
  html=setTag(html,/<meta name="twitter:description" content="[^"]*" \/>/,`<meta name="twitter:description" content="${esc(meta.description)}" />`);
  if(!html.includes(`content="${SITE_URL}${OG_IMAGE}"`))throw new Error('og:image must point to the absolute share image');
  const body=render(path);
  if(!/<h1[\s>]/.test(body)||body.length<500||/undefined|\[object Object\]/.test(body))throw new Error(`Prerender of ${path} looks empty or broken`);
  html=setTag(html,/<div id="root"><\/div>/,`<div id="root" data-prerendered="1">${body}</div>`);
  const name=path==='/'?'index':path.slice(1);
  writeFileSync(resolve(dist,'prerender',`${name}.html`),html);
}
rmSync(ssrOut,{recursive:true,force:true});
console.log(`Prerendered ${PRERENDER_ROUTES.length} public routes to dist/prerender/`);
