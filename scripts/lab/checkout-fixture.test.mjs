// Browser test of the Checkout automation against a LOCAL fixture (scripts/lab/fixtures/checkout-fixture.mjs).
// Run by the lab setup (needs Playwright + Chromium): node --test scripts/lab/checkout-fixture.test.mjs
// It never contacts Stripe and certifies nothing about the real Checkout; it guards the automation logic only.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fillAndSubmit, checkoutDomInventory, loadPlaywright } from './checkout-browser.mjs';
import { startCheckoutFixture, CAPTCHA_TEST_HOST } from './fixtures/checkout-fixture.mjs';

let fx, browser;
before(async () => {
  fx = await startCheckoutFixture();
  browser = await (await loadPlaywright()).chromium.launch({ args: fx.browserArgs });
});
after(async () => { await browser?.close(); await fx?.close(); });

async function open(query) {
  fx.events.length = 0;
  const page = await browser.newPage({ locale: 'fr-FR' });
  const outside = [];
  page.on('request', r => {
    const u = new URL(r.url());
    if (!['127.0.0.1', 'localhost', CAPTCHA_TEST_HOST].includes(u.hostname) || Number(u.port) !== fx.port) outside.push(u.hostname);
  });
  await page.goto(`${fx.base}/checkout?${query}`);
  return { page, outside };
}
async function run(query) {
  const { page, outside } = await open(query);
  try {
    return { result: await fillAndSubmit(page, { successPrefix: fx.successPrefix, timeoutMs: 10000 }), page, outside };
  } catch (error) {
    return { error, page, outside };
  }
}

for (const [label, query] of [
  ['observed structure: radios currency-usd/currency-eur in an iframe without accessible name, payment iframe, Link opt-in', 'layout=iframe&currency=radios&link=real'],
  ['radio inputs covered by an overlay: the flag label is clicked (normal user action)', 'layout=iframe&currency=radios-covered&link=real'],
  ['top-level card fields, no currency choice (EUR), Link as a hidden input behind its label', 'layout=top&currency=eur&link=custom'],
  ['payment frame behind a "Carte" accordion button, no Link offer', 'layout=accordion&currency=radios&link=none']
]) {
  test(`fixture: pays in EUR with Link unchecked: ${label}`, async () => {
    const { result, error, page, outside } = await run(query);
    try {
      assert.equal(error, undefined, error?.message);
      assert.equal(result.paid, true);
      assert.deepEqual(fx.events, ['paid'], 'one accepted submission, phone field never typed into, no challenge');
      assert.ok(page.url().startsWith(fx.successPrefix));
      for (const step of ['currency', 'currency_before_submit']) assert.equal(result.steps.find(s => s.step === step).currency, 'EUR');
      assert.match(result.steps.find(s => s.step === 'link').link, /^(unchecked|absent)$/);
      assert.ok(!JSON.stringify(result.steps).match(/4242|75001|lab-linking|Laboratoire/), 'steps never contain typed data');
      assert.deepEqual(outside, [], 'no request leaves the fixture');
    } finally { await page.close(); }
  });
}

for (const [label, query, expected, submitted] of [
  ['EUR not offered (dollars only)', 'currency=usd-only', /^CHECKOUT_AMOUNT_NOT_29_EUR: an amount is not in EUR$/],
  ['EUR radio cannot be selected', 'currency=radios-stuck', /^CHECKOUT_AMOUNT_NOT_29_EUR: EUR radio not checked$/],
  ['EUR radio checked but the summary still in dollars', 'currency=radios-stale', /^CHECKOUT_AMOUNT_NOT_29_EUR: an amount is not in EUR$/],
  ['Link opt-in cannot be unchecked', 'link=stuck', /^CHECKOUT_LINK_SAVE_STILL_CHECKED$/],
  ['email not prefilled by Stripe (no invented address)', 'email=empty', /^CHECKOUT_EMAIL_NOT_PREFILLED$/],
  ['CAPTCHA challenge displayed before paying', 'captcha=before', /^CHECKOUT_CAPTCHA_REQUIRED$/],
  ['CAPTCHA challenge displayed after submitting (never answered)', 'captcha=after', /^CHECKOUT_CAPTCHA_REQUIRED$/, true]
]) {
  test(`fixture: refuses to pay: ${label}`, async () => {
    const { error, page, outside } = await run(query);
    await page.close();
    assert.match(error?.message || '', expected);
    assert.ok(!fx.events.includes('paid'), 'no payment');
    assert.ok(!fx.events.includes('phone_typed'), 'phone never typed');
    assert.equal(fx.events.some(e => e.startsWith('submit_refused')), false, 'never submitted an incomplete form');
    if (!submitted) assert.ok(!fx.events.includes('challenge_shown') || query === 'captcha=before');
    assert.deepEqual(outside, []);
  });
}

test('fixture: redacted DOM diagnostic reproduces the run-4 picture without any value', async () => {
  const { page } = await open('layout=iframe&currency=radios&link=real');
  try {
    const pay = page.frames().find(f => f.url().includes('/frame/payment'));
    await pay.locator('input[autocomplete="cc-number"]').waitFor();
    await pay.locator('input[autocomplete="cc-number"]').pressSequentially('4242424242424242');
    await pay.locator('input[autocomplete="billing postal-code"]').fill('75001');
    await pay.locator('input[autocomplete="cc-name"]').fill('Laboratoire Relanzio');
    const inv = await checkoutDomInventory(page);
    const json = JSON.stringify(inv);
    for (const secret of ['4242', '75001', 'Laboratoire Relanzio', 'lab-linking@example.com', '555-0123']) assert.ok(!json.includes(secret), `diagnostic leaks ${secret}`);
    const controls = inv.frames.flatMap(f => f.controls.map(c => ({ ...c, host: f.host, top: f.top })));
    assert.deepEqual(controls.filter(c => c.type === 'radio').map(c => [c.id, c.checked, c.host]), [['currency-usd', true, 'localhost'], ['currency-eur', false, 'localhost']]);
    assert.ok(controls.some(c => c.id === 'payment-linkOptInInput' && c.checked === true && !c.top));
    assert.ok(controls.some(c => c.autocomplete === 'cc-number' && !c.top));
    assert.deepEqual(inv.amounts, ['33,25 $US', '33,25 $US', '33,25 $US', '33,25 $US']);
    assert.equal(inv.captcha_challenge, false, 'the hidden hCaptcha frame is not a challenge');
  } finally { await page.close(); }
});
