// Real Stripe Checkout (TEST mode) for the lab: strict verification of the session, then payment in a headless
// Chromium with the Stripe test card 4242 4242 4242 4242. Used only by scripts/lab/stripe-run.mjs.
//
// Security model: the URL format alone proves nothing. A Checkout URL is accepted only when ALL of these hold:
//   - https, exact host checkout.stripe.com (no other domain, no port, no credentials);
//   - it is EXACTLY the url Stripe itself returns, through the API of the lab sandbox, for a Checkout Session whose
//     id starts with cs_test_, livemode=false, status open, mode subscription, for the expected customer and user,
//     with one line item: the lab Pro price (TEST, 29.00 EUR, monthly, quantity 1);
//   - no cs_live_ anywhere, and any session id visible in the path is that same session.
// Nothing sensitive is ever logged: describeCheckoutUrl() keeps the host and the path STRUCTURE only (identifiers
// and tokens replaced by placeholders, no query, no fragment).

export const CHECKOUT_HOST = 'checkout.stripe.com';
const SESSION_ID = /^cs_test_[A-Za-z0-9]+$/;

// Redacted description of a URL, safe for logs.
export function describeCheckoutUrl(url) {
  let u;
  try { u = new URL(url); } catch { return { valid_url: false }; }
  const path = u.pathname.split('/').map(seg => {
    if (!seg) return seg;
    if (/^cs_(test|live)_/.test(seg)) return `<${seg.slice(0, 8)}id>`;
    if (/^[a-z]{1,12}$/.test(seg)) return seg;          // short lowercase words such as "c", "pay"
    return '<token>';
  }).join('/');
  return { valid_url: true, scheme: u.protocol.replace(':', ''), host: u.hostname, port: u.port || null, path, has_query: u.search.length > 0, has_fragment: u.hash.length > 0 };
}

// Pure decision (unit-tested). session: the Checkout Session read from the Stripe API with the lab key;
// lineItems: its line items; expected: { customerId, userId, priceId }.
export function verifyCheckoutSession(url, session, lineItems, expected) {
  const problems = [];
  let u = null;
  try { u = new URL(url); } catch { problems.push('URL invalid'); }
  if (u) {
    if (u.protocol !== 'https:') problems.push('URL not https');
    if (u.hostname !== CHECKOUT_HOST) problems.push(`unknown domain ${u.hostname}`);
    if (u.port || u.username || u.password) problems.push('URL with port or credentials');
    if (/cs_live_/i.test(url)) problems.push('live session id in the URL');
    const pathIds = u.pathname.split('/').filter(seg => /^cs_(test|live)_/.test(seg));
    if (pathIds.some(id => id !== session?.id)) problems.push('session id in the path differs from the verified session');
  }
  if (!session) problems.push('session not found through the lab sandbox API');
  else {
    if (!SESSION_ID.test(session.id || '')) problems.push('session id is not cs_test_');
    if (session.livemode !== false) problems.push('session livemode is not false');
    if (session.object !== 'checkout.session') problems.push('not a Checkout Session');
    if (session.url !== url) problems.push('URL is not the one Stripe issued for this session');
    if (session.status !== 'open') problems.push(`session status ${session.status}`);
    if (session.mode !== 'subscription') problems.push(`session mode ${session.mode}`);
    const customer = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    if (!expected?.customerId || customer !== expected.customerId) problems.push('session customer is not the lab user\'s customer');
    if (!expected?.userId || session.client_reference_id !== expected.userId || session.metadata?.user_id !== expected.userId) problems.push('session is not for the lab user');
  }
  const items = lineItems?.data || [];
  const price = items[0]?.price;
  if (lineItems?.has_more || items.length !== 1 || items[0]?.quantity !== 1) problems.push('session must have exactly one line item, quantity 1');
  else if (!price || price.id !== expected?.priceId || price.livemode !== false || price.currency !== 'eur' || price.unit_amount !== 2900 || price.recurring?.interval !== 'month' || price.recurring?.interval_count !== 1)
    problems.push('line item is not the lab TEST price of 29.00 EUR per month');
  return { ok: problems.length === 0, problems, url: problems.length === 0 ? url : null, sessionId: session?.id || null };
}

// ---------------------------------------------------------------------------------------------------------------
// Page automation, adapted to the Checkout actually observed in the lab (screenshot of the failed run 3):
//   - an Adaptive Pricing currency choice (USD preselected, EUR offered): EUR is selected and the page must then
//     show the amount 29,00 € (with decimals: the product description "29 € / mois" is on the page in EVERY
//     currency, so it proves nothing) and no US dollar amount, or a currency control that reports EUR as selected;
//   - card number, expiry and security code may be top-level inputs or Stripe secure fields inside an iframe: every
//     field is looked up in the page AND in every frame, and awaited explicitly before each action;
//   - "Enregistrer mes informations pour un paiement plus rapide" (Link) is pre-checked and reveals a phone field:
//     it is unchecked, its state is re-read, and the phone field is never typed into.
// Test data only: Stripe test card, fictitious name, French postal code. Nothing typed is ever logged.

export const TEST_CARD = Object.freeze({ number: '4242424242424242', expiry: '1234', cvc: '123', name: 'Laboratoire Relanzio', country: 'FR', postal: '75001' });
export const FIELD_SELECTORS = Object.freeze({
  cardNumber: ['input[autocomplete="cc-number"]', 'input[name="cardnumber"]', 'input[name="number"]', '#cardNumber'],
  expiry: ['input[autocomplete="cc-exp"]', 'input[name="exp-date"]', 'input[name="expiry"]', '#cardExpiry'],
  cvc: ['input[autocomplete="cc-csc"]', 'input[name="cvc"]', '#cardCvc'],
  name: ['input[autocomplete="cc-name"]', 'input[name="billingName"]', '#billingName'],
  country: ['select[autocomplete="country"]', 'select[autocomplete="billing country"]', 'select[name="billingCountry"]', '#billingCountry'],
  postal: ['input[autocomplete="postal-code"]', 'input[autocomplete="billing postal-code"]', 'input[name="billingPostalCode"]', '#billingPostalCode'],
  email: ['input[type="email"]', '#email'],
  linkSave: ['input[type="checkbox"][name="enableStripePass"]', '#enableStripePass', 'input[type="checkbox"][name*="link" i]', 'input[type="checkbox"][id*="link" i]'],
  submit: ['button[data-testid="hosted-payment-submit-button"]', 'button[type="submit"]', '.SubmitButton']
});
export const LINK_SAVE_LABEL = /enregistrer mes informations|save my info/i;
export const SUBMIT_LABEL = /s['’]abonner|subscribe/i;
export const CARD_METHOD_LABEL = /^\s*(carte(?: bancaire)?|card)\s*$/i;
export const EUR_OPTION_LABEL = /(^|\s)EUR(\s|$)|€\s*29[.,]00|29[,.]00\s*€/;

const norm = t => String(t || '').replace(/[  ]/g, ' ');
// The Stripe-formatted amount 29,00 € / €29.00 (decimals required, see above).
export function isExpectedEuroAmount(text) {
  const t = norm(text);
  return /(^|[^\d,.])29,00\s*€/.test(t) || /€\s*29\.00(?!\d)/.test(t);
}
// A US dollar AMOUNT (33,25 $US, $33.25, US$33.25), not just the word USD on a currency switch.
export function hasUsdAmount(text) {
  const t = norm(text);
  return /\d[\d\s]*[,.]\d{2}\s*(\$\s*US|US\s*\$|\$)/.test(t) || /(US\s*)?\$\s*\d+[.,]\d{2}/.test(t);
}
// Pure rule (unit-tested): may the page be paid, currency-wise?
export function euroDecision({ text, eurSelected = null }) {
  if (!isExpectedEuroAmount(text)) return { ok: false, reason: 'no 29,00 € amount on the page' };
  if (eurSelected === true) return { ok: true, reason: 'EUR selected, 29,00 € shown' };
  if (eurSelected === false) return { ok: false, reason: 'currency control does not report EUR selected' };
  if (hasUsdAmount(text)) return { ok: false, reason: 'a US dollar amount is still shown' };
  return { ok: true, reason: '29,00 € shown, no US dollar amount' };
}

// Redacted description of a form control for diagnostics: attributes and states only, never values.
export function redactControl(c) {
  const cut = v => (v == null || v === '' ? null : String(v).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '<email>').replace(/\d[\d\s-]{5,}\d/g, '<digits>').slice(0, 40));
  return { tag: c.tag, type: c.type || null, id: cut(c.id), name: cut(c.name), autocomplete: cut(c.autocomplete), aria: cut(c.aria), placeholder: cut(c.placeholder), role: cut(c.role), checked: typeof c.checked === 'boolean' ? c.checked : null, visible: !!c.visible };
}
// Amounts visible on the page (prices, never user data), to diagnose the currency.
export function visibleAmounts(text) {
  return [...norm(text).matchAll(/(?:€|US\s*\$|\$)\s*\d+[.,]\d{2}|\d+[,.]\d{2}\s*(?:€|\$\s*US|US\s*\$|\$)/g)].map(m => m[0].replace(/\s+/g, ' ').trim()).slice(0, 10);
}

export async function checkoutDomInventory(page) {
  const frames = [];
  for (const [i, f] of page.frames().entries()) {
    let host = null; try { host = new URL(f.url()).hostname || null; } catch { /* about:blank */ }
    const controls = await f.evaluate(() => [...document.querySelectorAll('input,select,button,textarea,[role="checkbox"],[role="radio"]')].slice(0, 60).map(el => ({
      tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), id: el.id, name: el.getAttribute('name'), autocomplete: el.getAttribute('autocomplete'),
      aria: el.getAttribute('aria-label'), placeholder: el.getAttribute('placeholder'), role: el.getAttribute('role'),
      checked: el.type === 'checkbox' || el.type === 'radio' ? el.checked : (el.getAttribute('aria-checked') ? el.getAttribute('aria-checked') === 'true' : undefined),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    }))).catch(() => []);
    frames.push({ frame: i, top: f === page.mainFrame(), host, title: i === 0 ? (await page.title().catch(() => '')).slice(0, 60) : undefined, controls: controls.map(redactControl) });
  }
  return { frames, amounts: visibleAmounts(await page.locator('body').innerText().catch(() => '')) };
}

// A frame is usable only if its <iframe> element is itself visible (inside a hidden iframe, fields still report
// themselves visible to their own document but cannot be clicked).
async function frameShown(page, frame) {
  if (frame === page.mainFrame()) return true;
  const el = await frame.frameElement().catch(() => null);
  return !!el && (await el.isVisible().catch(() => false));
}
// First match among `selectors`, in the page or any frame, waiting up to `timeoutMs`.
async function findField(page, selectors, { timeoutMs = 20000, visible = true } = {}) {
  const end = Date.now() + timeoutMs;
  for (;;) {
    for (const frame of page.frames()) {
      if (visible && !(await frameShown(page, frame))) continue;
      for (const sel of selectors) {
        const loc = frame.locator(sel).first();
        const ok = visible ? await loc.isVisible().catch(() => false) : (await loc.count().catch(() => 0)) > 0;
        if (ok) return loc;
      }
    }
    if (Date.now() >= end) return null;
    await page.waitForTimeout(250);
  }
}
async function mustField(page, key, timeoutMs = 20000) {
  const loc = await findField(page, FIELD_SELECTORS[key], { timeoutMs });
  if (!loc) throw new Error(`CHECKOUT_FIELD_NOT_FOUND:${key}`);
  await loc.waitFor({ state: 'visible', timeout: 5000 });
  return loc;
}
async function typeInto(loc, value) {
  await loc.click();
  await loc.fill('');
  await loc.pressSequentially(value, { delay: 25 }); // Stripe fields format as you type
}

async function eurSelectedState(page) {
  for (const frame of page.frames()) {
    for (const role of ['radio', 'tab', 'button', 'option']) {
      const opt = frame.getByRole(role, { name: EUR_OPTION_LABEL }).first();
      if (!(await opt.isVisible().catch(() => false))) continue;
      for (const attr of ['aria-checked', 'aria-pressed', 'aria-selected']) {
        const v = await opt.getAttribute(attr).catch(() => null);
        if (v === 'true') return true;
        if (v === 'false') return false;
      }
      if (role === 'radio') return await opt.isChecked().catch(() => null);
      return null;
    }
  }
  return null;
}
async function clickEurIfOffered(page) {
  for (const frame of page.frames()) {
    for (const role of ['radio', 'tab', 'button', 'option']) {
      const opt = frame.getByRole(role, { name: EUR_OPTION_LABEL }).first();
      if (await opt.isVisible().catch(() => false)) { await opt.click(); return true; }
    }
  }
  return false;
}
// Selects EUR when a currency choice is offered, then requires 29,00 € before anything is paid.
async function ensureEuro(page, { timeoutMs = 20000 } = {}) {
  const offered = await clickEurIfOffered(page);
  const end = Date.now() + timeoutMs;
  let last;
  for (;;) {
    last = euroDecision({ text: await page.locator('body').innerText().catch(() => ''), eurSelected: await eurSelectedState(page) });
    if (last.ok) return { currency: 'EUR', selector_offered: offered, reason: last.reason };
    if (Date.now() >= end) throw new Error(`CHECKOUT_AMOUNT_NOT_29_EUR: ${last.reason}`);
    await page.waitForTimeout(250);
  }
}

// Unchecks the optional Link enrolment. The phone field it reveals is never typed into.
async function disableLinkSave(page) {
  let box = await findField(page, FIELD_SELECTORS.linkSave, { timeoutMs: 1500, visible: false });
  if (!box) {
    for (const frame of page.frames()) {
      const byLabel = frame.getByRole('checkbox', { name: LINK_SAVE_LABEL }).first();
      if ((await byLabel.count().catch(() => 0)) > 0) { box = byLabel; break; }
    }
  }
  if (!box) return { link: 'absent' };
  const checked = async () => (await box.isChecked().catch(() => null));
  if ((await checked()) === true) {
    await box.uncheck({ force: true, timeout: 5000 }).catch(() => {});
    if ((await checked()) === true) { // custom checkbox: click its visible label instead
      for (const frame of page.frames()) {
        const label = frame.getByText(LINK_SAVE_LABEL).first();
        if (await label.isVisible().catch(() => false)) { await label.click({ timeout: 5000 }).catch(() => {}); break; }
      }
    }
  }
  if ((await checked()) !== false) throw new Error('CHECKOUT_LINK_SAVE_STILL_CHECKED');
  return { link: 'unchecked' };
}

// Fills the observed Checkout form with test data and submits it. Exported for the local fixture test (a fixture
// proves the automation logic only; it does not certify the real Stripe Checkout).
export async function fillAndSubmit(page, { successPrefix, timeoutMs = 120000 } = {}) {
  if (!successPrefix) throw new Error('CHECKOUT_SUCCESS_PREFIX_REQUIRED');
  const steps = [];
  steps.push({ step: 'currency', ...(await ensureEuro(page)) });
  const email = await findField(page, FIELD_SELECTORS.email, { timeoutMs: 1000 });
  if (email && (await email.isEditable().catch(() => false)) && !(await email.inputValue().catch(() => ''))) throw new Error('CHECKOUT_EMAIL_NOT_PREFILLED');
  let card = await findField(page, FIELD_SELECTORS.cardNumber, { timeoutMs: 8000 });
  if (!card) { // payment methods shown as an accordion: open "Carte"
    for (const frame of page.frames()) {
      const method = frame.locator('[data-testid="card-accordion-item-button"]').or(frame.getByRole('button', { name: CARD_METHOD_LABEL })).or(frame.getByRole('radio', { name: CARD_METHOD_LABEL })).first();
      if (await method.isVisible().catch(() => false)) { await method.click(); steps.push({ step: 'card_method_opened' }); break; }
    }
  }
  await typeInto(await mustField(page, 'cardNumber'), TEST_CARD.number);
  await typeInto(await mustField(page, 'expiry'), TEST_CARD.expiry);
  await typeInto(await mustField(page, 'cvc'), TEST_CARD.cvc);
  const name = await findField(page, FIELD_SELECTORS.name, { timeoutMs: 3000 });
  if (name) await name.fill(TEST_CARD.name);
  const country = await findField(page, FIELD_SELECTORS.country, { timeoutMs: 3000 });
  if (country) await country.selectOption(TEST_CARD.country);
  const postal = await findField(page, FIELD_SELECTORS.postal, { timeoutMs: 3000 });
  if (postal) await postal.fill(TEST_CARD.postal);
  steps.push({ step: 'fields', card: 'test', name: !!name, country: !!country, postal: !!postal });
  steps.push({ step: 'link', ...(await disableLinkSave(page)) });
  steps.push({ step: 'currency_before_submit', ...(await ensureEuro(page, { timeoutMs: 5000 })) });
  let submit = await findField(page, FIELD_SELECTORS.submit, { timeoutMs: 3000 });
  if (!submit) submit = page.getByRole('button', { name: SUBMIT_LABEL }).first();
  await submit.waitFor({ state: 'visible', timeout: 10000 });
  await submit.click();
  await page.waitForURL(target => target.href.startsWith(successPrefix), { timeout: timeoutMs });
  return { paid: true, steps, redirectedTo: new URL(page.url()).origin };
}

const defaultLog = (label, data) => console.log(`${label} ${JSON.stringify(data)}`);

// Pays a Checkout page ONLY with a positive verification for that exact URL.
export async function payCheckout(url, { successPrefix, verified, screenshotPath = 'lab-checkout-failure.png', timeoutMs = 120000, log = defaultLog } = {}) {
  if (!verified?.ok || verified.url !== url) throw new Error('CHECKOUT_NOT_VERIFIED');
  const u = new URL(url);
  if (u.protocol !== 'https:' || u.hostname !== CHECKOUT_HOST || /cs_live_/i.test(url)) throw new Error('CHECKOUT_URL_REFUSED'); // defence in depth
  if (!successPrefix) throw new Error('CHECKOUT_SUCCESS_PREFIX_REQUIRED');
  const { chromium } = await loadPlaywright(); // loaded only when a verified Checkout is paid
  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: 'fr-FR' });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const result = await fillAndSubmit(page, { successPrefix, timeoutMs });
    log('LAB_CHECKOUT_STEPS', result.steps);
    return result;
  } catch (e) {
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    log('LAB_CHECKOUT_DOM', await checkoutDomInventory(page).catch(() => ({ frames: [] })));
    throw Object.assign(new Error(`CHECKOUT_BROWSER_FAILED: ${e.message.split('\n')[0].replace(/https?:\/\/\S+/g, '<url>')}`), { screenshotPath });
  } finally {
    await browser.close();
  }
}

export async function loadPlaywright() {
  try { return await import('@playwright/test'); } catch { return await import('playwright'); }
}
