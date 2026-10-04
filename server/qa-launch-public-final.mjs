const base='https://relanzio.com';
const paths=['/','/pricing','/contact','/legal','/privacy','/terms','/login','/signup','/reset-password','/api/health','/api/readiness'];
const result={paths:{},cookies:{},bundle:{},seo:{},ok:true};
const cookieNames=new Set();
async function get(path){
  const r=await fetch(base+path,{redirect:'manual'});
  const setCookies=typeof r.headers.getSetCookie==='function'?r.headers.getSetCookie():[r.headers.get('set-cookie')].filter(Boolean);
  for(const raw of setCookies){const name=String(raw).split('=',1)[0].trim();if(name)cookieNames.add(name)}
  const body=await r.text();
  result.paths[path]={status:r.status,location:r.headers.get('location')||null,contentType:r.headers.get('content-type')||null};
  return {r,body};
}
try{
  let home;
  for(const p of paths){const x=await get(p);if(p==='/')home=x.body}
  result.cookies.names=[...cookieNames].sort();
  const jsMatch=home.match(/<script[^>]+src="([^"]+\.js[^"]*)"/i);
  if(!jsMatch)throw new Error('NO_JS_ASSET');
  const jsUrl=new URL(jsMatch[1],base).href;
  const jr=await fetch(jsUrl);
  const js=await jr.text();
  const emails=[...new Set(js.match(/[A-Z0-9._%+-]+@relanzio\.com/gi)||[])].sort();
  const urls=[...new Set(js.match(new RegExp('https?://[^"\\'\\s<>)}]+','gi'))||[])];
  const localhostUrls=urls.filter(u=>/\\/\\/(?:localhost|127\\.0\\.0\\.1)(?::|\\/|$)/i.test(u));
  const railwayUrls=urls.filter(u=>/\\.railway\\.app|up\\.railway\\.app/i.test(u));
  result.bundle={
    status:jr.status,
    emails,
    localhostUrls:localhostUrls.slice(0,20),
    railwayUrls:railwayUrls.slice(0,20),
    hasVisibleStagingCopy:/phase staging|environnement staging|staging uniquement/i.test(js),
    hasVisibleQaCopy:/données QA|mode QA|quality assurance|pilot readiness/i.test(js),
    hasPrice29:/29\\s*€\\/?mois|29\\s*€.{0,20}mois/i.test(js),
    hasPilotBillingCopy:/facturation activée après la phase pilote/i.test(js),
    hasSupport:/support@relanzio\\.com/i.test(js),
    hasContact:/contact@relanzio\\.com/i.test(js),
    hasNotifications:/notifications@relanzio\\.com/i.test(js)
  };
  result.seo={
    title:/<title>Relanzio — Vos devis méritent une réponse<\/title>/i.test(home),
    description:/<meta[^>]+name="description"/i.test(home),
    canonical:/<link[^>]+rel="canonical"[^>]+https:\/\/relanzio\.com\//i.test(home),
    ogTitle:/<meta[^>]+property="og:title"/i.test(home),
    ogUrl:/<meta[^>]+property="og:url"[^>]+https:\/\/relanzio\.com\//i.test(home),
    favicon:/<link[^>]+rel="icon"/i.test(home)
  };
  const publicOk=['/','/pricing','/contact','/legal','/privacy','/terms','/login','/signup','/reset-password'].every(p=>result.paths[p].status===200);
  const health=await (await fetch(base+'/api/health')).json();
  const readiness=await (await fetch(base+'/api/readiness')).json();
  result.health={ok:health?.ok===true};
  result.readiness={ready:readiness?.ready===true,integrations:readiness?.integrations,automation:readiness?.automation};
  result.ok=publicOk&&jr.ok&&Object.values(result.seo).every(Boolean)&&result.bundle.railwayUrls.length===0&&!result.bundle.hasVisibleStagingCopy&&!result.bundle.hasVisibleQaCopy&&result.bundle.hasPrice29&&result.bundle.hasSupport&&result.bundle.hasContact&&health?.ok===true&&readiness?.ready===true;
}catch(e){result.ok=false;result.error=String(e?.message||e)}
console.log('LAUNCH_PUBLIC_QA='+JSON.stringify(result));
process.exit(result.ok?0:1);
