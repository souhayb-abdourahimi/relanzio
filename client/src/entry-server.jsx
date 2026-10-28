import React from 'react';
import { renderToString } from 'react-dom/server';
import { publicPageFor } from './PublicSite.jsx';
export { ROUTE_META, PRERENDER_ROUTES, SITE_URL, OG_IMAGE } from './public-meta.js';

// Build-time only (scripts/prerender.mjs): static HTML for public routes, readable without JavaScript.
export function render(path){
  const page=publicPageFor(path);
  if(!page)throw new Error(`No public page for ${path}`);
  return renderToString(page);
}
