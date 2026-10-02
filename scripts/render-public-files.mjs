import { writeFileSync } from 'node:fs';
const base=(process.env.APP_URL||'http://localhost:3000').replace(/\/$/,'');
const paths=['/','/pricing','/docs','/faq','/contact','/logiciel-relance-devis','/relance-devis-agence','/modele-email-relance-devis','/privacy','/terms'];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
writeFileSync('client/public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p=>`  <url><loc>${esc(base+p)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('client/public/robots.txt',`User-agent: *\nAllow: /\nDisallow: /reset-password\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Public SEO files rendered for ${base}`);
