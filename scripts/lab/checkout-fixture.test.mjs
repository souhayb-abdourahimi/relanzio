// Browser test of the Checkout automation against a LOCAL fixture (scripts/lab/fixtures/checkout-fixture.mjs).
// Run by the lab setup (needs Playwright + Chromium): node --test scripts/lab/checkout-fixture.test.mjs
// It never contacts Stripe and certifies nothing about the real Checkout; it guards the automation logic only.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fillAndSubmit, checkoutDomInventory, loadPlaywright } from './checkout-browser.mjs';
import { startCheckoutFixture } from './fixtures/checkout-fixture.mjs';

let fx, browser;
before(async () => { fx = await startCheckoutFixture(); browser = (await loadPlaywright()).chromium.launch(); browser = await browser; });
after(async () => { await browser?.close(); await fx?.close(); });

async function run(query, opts = {}) {
  fx.events.length = 0;
  const page = await browser.newPage({ locale: 'fr-FR' });
  await page.goto(`${fx.base}/checkout?${query}`);
  try {
    const result = await fillAndSubmit(page, { successPrefix: fx.successPrefix, timeoutMs: 10000, ...opts });
    return { result, page };
  } catch (error) {
    return { error, page };
  }
}

for (const [label, query] of [
  ['card fields in a cross-origin iframe, USD preselected, Link pre-checked (observed layout)', 'layout=iframe&currency=toggle&link=checkbox'],
  ['currency buttons that show the amounts in both currencies', 'layout=iframe&currency=toggle-amounts&link=checkbox'],
  ['top-level card fields, EUR only, Link as a hidden input behind its label', 'layout=top&currency=eur&link=custom'],
  ['card method behind an accordion button, no Link offer', 'layout=accordion&currency=toggle&link=none']
]) {
  test(`fixture: pays in EUR with Link unchecked: ${label}`, async () => {
    const { result, error, page } = await run(query);
    try {
      assert.equal(error, undefined, error?.message);
      assert.equal(result.paid, true);
      assert.deepEqual(fx.events, ['paid'], 'one accepted submission, phone field never typed into');
      assert.ok(page.url().startsWith(fx.successPrefix));
      assert.equal(result.steps.find(s => s.step === 'currency').currency, 'EUR');
      assert.equal(result.steps.find(s => s.step === 'currency_before_submit').currency, 'EUR');
      assert.match(result.steps.find(s => s.step === 'link').link, /^(unchecked|absent)$/);
      assert.ok(!JSON.stringify(result.steps).includes('4242'), 'steps never contain typed data');
    } finally { await page.close(); }
  });
}

test('fixture: refuses to pay when EUR is not offered (USD only), nothing submitted', async () => {
  const { error, page } = await run('layout=iframe&currency=usd-only&link=checkbox');
  await page.close();
  assert.match(error?.message || '', /^CHECKOUT_AMOUNT_NOT_29_EUR/);
  assert.deepEqual(fx.events, []);
});

test('fixture: refuses to pay when Link saving cannot be unchecked, phone never typed', async () => {
  const { error, page } = await run('layout=iframe&currency=toggle&link=stuck');
  await page.close();
  assert.equal(error?.message, 'CHECKOUT_LINK_SAVE_STILL_CHECKED');
  assert.deepEqual(fx.events, []);
});

test('fixture: refuses when the email is not prefilled by Stripe (no invented address)', async () => {
  const { error, page } = await run('layout=iframe&currency=toggle&email=empty');
  await page.close();
  assert.equal(error?.message, 'CHECKOUT_EMAIL_NOT_PREFILLED');
  assert.deepEqual(fx.events, []);
});

test('fixture: redacted DOM diagnostic lists the controls of every frame, never their values', async () => {
  const page = await browser.newPage({ locale: 'fr-FR' });
  try {
    await page.goto(`${fx.base}/checkout?layout=iframe&currency=toggle&link=checkbox`);
    const frame = page.frames().find(f => f !== page.mainFrame());
    await frame.locator('input[autocomplete="cc-number"]').pressSequentially('4242424242424242');
    await page.locator('#billingPostalCode').fill('75001');
    await page.locator('#billingName').fill('Laboratoire Relanzio');
    const inv = await checkoutDomInventory(page);
    const json = JSON.stringify(inv);
    for (const secret of ['4242', '75001', 'Laboratoire Relanzio', 'lab-linking@example.com', '555-0123']) assert.ok(!json.includes(secret), `diagnostic leaks ${secret}`);
    assert.ok(inv.frames.length >= 2);
    assert.ok(inv.frames.some(f => !f.top && f.host === 'localhost' && f.controls.some(c => c.autocomplete === 'cc-number')), 'card field found inside the iframe');
    assert.ok(inv.frames[0].controls.some(c => c.id === 'enableStripePass' && c.checked === true));
    assert.deepEqual(inv.amounts, ['33,25 $US']);
  } finally { await page.close(); }
});
