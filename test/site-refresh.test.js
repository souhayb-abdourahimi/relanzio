import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PENDING_DEFAULTS, formatEuros, pendingTotal } from '../client/src/pending-value.js';
import * as plans from '../shared/plans.js';

test('pending calculator: a plain multiplication, bounded, tolerant of French input', () => {
  assert.equal(pendingTotal(PENDING_DEFAULTS.count, PENDING_DEFAULTS.average), 24000);
  assert.equal(pendingTotal('12', '2 500'), 30000);
  assert.equal(pendingTotal('3', '1250,4'), 3750);
  assert.equal(pendingTotal('', '3000'), 0);
  assert.equal(pendingTotal('-4', '3000'), 0);
  assert.equal(pendingTotal('abc', 'xyz'), 0);
  assert.equal(pendingTotal('5000', '9999999'), 1000 * 1000000, 'capped');
  assert.match(formatEuros(24000).replace(/[\s  ]/g, ' '), /^24 000 €$/);
});

test('pending calculator promises nothing: no rate, gain or recovered revenue', () => {
  const src = readFileSync(new URL('../client/src/PendingCalculator.jsx', import.meta.url), 'utf8') + readFileSync(new URL('../client/src/pending-value.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src.replace(/^\/\/.*$/gm, ''), /taux|gagn|récupér|recuper|chiffre d.affaires|%/i);
});

test('pricing source: values only from shared/plans.js, trial end note present, VAT notice on the comparison', () => {
  const src = readFileSync(new URL('../client/src/PricingCards.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /\b29 ?€|\b(5|100) devis actifs|293 B du CGI|\bEssai Pro 7 jours/);
  for (const name of ['FREE_LIMIT_TEXT', 'PRO_LIMIT_TEXT', 'PRO_PRICE_TEXT', 'TRIAL_DAYS', 'VAT_NOTICE']) assert.match(src, new RegExp(name));
  assert.match(src, /rien n’est supprimé/);
  assert.match(src, /REPLY_STOP_LIVE\?\[\['Arrêt automatique/, 'automatic stop row only when the feature is live');
  assert.equal(plans.PRO_MONTHLY_PRICE, 29);
});

test('full-bleed backgrounds never create horizontal scrolling or clip the demo dialogs', () => {
  const css = readFileSync(new URL('../client/src/styles.css', import.meta.url), 'utf8');
  const tail = css.slice(css.indexOf('/* Site refresh'));
  assert.doesNotMatch(tail, /clip-path|100vw|overflow-x/);
  assert.match(tail, /\.hero\{border-image:conic-gradient\(var\(--soft\) 0 0\) fill 0\/\/0 100vmax\}/);
});
