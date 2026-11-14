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
// Page automation, adapted to the REAL Checkout DOM reported by LAB_CHECKOUT_DOM in lab run 4:
//   - the Adaptive Pricing currency choice is a pair of radios, input#currency-usd (checked) and input#currency-eur,
//     name="currency", alone in a js.stripe.com iframe and WITHOUT a usable accessible name;
//   - the order summary on the page itself shows the payable amounts (four times 33,25 $US in USD);
//   - card number, expiry, CVC, holder name, billing country and postal code are in another js.stripe.com iframe,
//     with the standard autocomplete attributes;
//   - Link enrolment is input#payment-linkOptInInput (pre-checked), which reveals a phone field;
//   - hCaptcha frames are loaded (invisible unless Stripe decides to challenge).
// Rules: every field is looked up in the page and in every displayed frame and awaited before each action; only
// normal Playwright interactions (check/uncheck/click/type, never force, never setting a state by script); payment
// is refused unless EUR is the only selected currency AND every amount of the summary is 29,00 € (the description
// "29 € / mois" is on the page in every currency and proves nothing), Link is unchecked with an empty phone field,
// and no CAPTCHA challenge is displayed. Test data only. Nothing typed is ever logged.

export const TEST_CARD = Object.freeze({ number: '4242424242424242', expiry: '1234', cvc: '123', name: 'Laboratoire Relanzio', country: 'FR', postal: '75001' });
export const FIELD_SELECTORS = Object.freeze({
  cardNumber: ['input[autocomplete="cc-number"]', 'input[name="cardnumber"]', 'input[name="number"]', '#cardNumber'],
  expiry: ['input[autocomplete="cc-exp"]', 'input[name="exp-date"]', 'input[name="expiry"]', '#cardExpiry'],
  cvc: ['input[autocomplete="cc-csc"]', 'input[name="cvc"]', '#cardCvc'],
  name: ['input[autocomplete="cc-name"]', 'input[name="billingName"]', '#billingName'],
  country: ['select[autocomplete="billing country"]', 'select[autocomplete="country"]', 'select[name="billingCountry"]', '#billingCountry'],
  postal: ['input[autocomplete="billing postal-code"]', 'input[autocomplete="postal-code"]', 'input[name="billingPostalCode"]', '#billingPostalCode'],
  email: ['input[type="email"]', 'input[autocomplete="email"]', '#email'],
  currency: ['input[type="radio"][name="currency"]', 'input[type="radio"][id^="currency-"]'],
  linkSave: ['#payment-linkOptInInput', 'input[type="checkbox"][name="linkOptIn"]', 'input[type="checkbox"][name="enableStripePass"]', '#enableStripePass'],
  linkPhone: ['#payment-linkMobilePhoneInput', 'input[name="linkMobilePhone"]', '#phoneNumber'],
  submit: ['button[data-testid="hosted-payment-submit-button"]', 'button[type="submit"]', '.SubmitButton']
});
export const SUBMIT_LABEL = /s['’]abonner|subscribe/i;
export const CARD_METHOD_LABEL = /^\s*(carte(?: bancaire)?|card)\s*$/i;
export const CAPTCHA_HOSTS = /(^|\.)(hcaptcha\.com|recaptcha\.net)$|^www\.google\.com$/;
export const EXPECTED = Object.freeze({ currency: 'EUR', cents: 2900 });

const norm = t => String(t || '').replace(/[  ]/g, ' ');
// Stripe-formatted amounts (decimals required): "29,00 €", "€29.00", "33,25 $US", "$33.25", "US$33.25".
const AMOUNT = /(?:€|US\s*\$|\$)\s*\d{1,3}(?:[ .,]\d{3})*[.,]\d{2}(?!\d)|(?<![\d.,])\d{1,3}(?:[ .]\d{3})*[,.]\d{2}\s*(?:€|\$\s*US|US\s*\$|\$)/g;
export function visibleAmounts(text) {
  return [...norm(text).matchAll(AMOUNT)].map(m => m[0].replace(/\s+/g, ' ').trim()).slice(0, 12);
}
export function parseAmount(s) {
  const t = norm(s);
  const currency = t.includes('€') ? 'EUR' : t.includes('$') ? 'USD' : null;
  const m = t.match(/(\d{1,3}(?:[ .,]\d{3})*)[.,](\d{2})(?!\d)/);
  if (!currency || !m) return null;
  return { currency, cents: Number(m[1].replace(/[ .,]/g, '')) * 100 + Number(m[2]) };
}
// Pure rule (unit-tested). radios: [{ key: 'eur'|'usd'|..., checked: bool }] found on the page (empty when Stripe
// offers no currency choice); amounts: the Stripe-formatted amounts shown by the order summary of the page.
export function currencyDecision({ radios = [], amounts = [] }) {
  if (radios.length) {
    const eur = radios.filter(r => r.key === 'eur');
    if (eur.length !== 1) return { ok: false, reason: 'currency radios present but no single EUR radio' };
    if (eur[0].checked !== true) return { ok: false, reason: 'EUR radio not checked' };
    if (radios.some(r => r.key !== 'eur' && r.checked !== false)) return { ok: false, reason: 'another currency radio is still checked' };
  }
  const parsed = amounts.map(parseAmount);
  if (!parsed.length) return { ok: false, reason: 'no payable amount shown' };
  if (parsed.some(a => !a || a.currency !== EXPECTED.currency)) return { ok: false, reason: 'an amount is not in EUR' };
  if (parsed.some(a => a.cents !== EXPECTED.cents)) return { ok: false, reason: 'an amount differs from 29,00 €' };
  return { ok: true, reason: radios.length ? 'EUR radio checked, other currencies unchecked, every amount 29,00 €' : 'no currency choice, every amount 29,00 €' };
}

// Redacted description of a form control for diagnostics: attributes and states only, never values.
export function redactControl(c) {
  const cut = v => (v == null || v === '' ? null : String(v).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '<email>').replace(/\d[\d\s-]{5,}\d/g, '<digits>').slice(0, 40));
  return { tag: c.tag, type: c.type || null, id: cut(c.id), name: cut(c.name), autocomplete: cut(c.autocomplete), aria: cut(c.aria), placeholder: cut(c.placeholder), role: cut(c.role), checked: typeof c.checked === 'boolean' ? c.checked : null, visible: !!c.visible };
}

// Is this element really displayed (no hidden/transparent ancestor, non-trivial size)? Runs in the element's frame.
const DISPLAYED = (e, min) => {
  for (let n = e; n; n = n.parentElement) { const st = getComputedStyle(n); if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return false; }
  const r = e.getBoundingClientRect(); return r.width >= min.w && r.height >= min.h;
};
// A frame is usable only if its <iframe> and every ancestor iframe are displayed.
async function frameShown(page, frame, min = { w: 1, h: 1 }) {
  for (let f = frame; f && f !== page.mainFrame(); f = f.parentFrame()) {
    const el = await f.frameElement().catch(() => null);
    if (!el || !(await el.evaluate(DISPLAYED, f === frame ? min : { w: 1, h: 1 }).catch(() => false))) return false;
  }
  return true;
}
const hostOf = f => { try { return new URL(f.url()).hostname; } catch { return ''; } };

export async function checkoutDomInventory(page) {
  const frames = [];
  for (const [i, f] of page.frames().entries()) {
    const controls = await f.evaluate(() => [...document.querySelectorAll('input,select,button,textarea,[role="checkbox"],[role="radio"]')].slice(0, 60).map(el => ({
      tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), id: el.id, name: el.getAttribute('name'), autocomplete: el.getAttribute('autocomplete'),
      aria: el.getAttribute('aria-label'), placeholder: el.getAttribute('placeholder'), role: el.getAttribute('role'),
      checked: el.type === 'checkbox' || el.type === 'radio' ? el.checked : (el.getAttribute('aria-checked') ? el.getAttribute('aria-checked') === 'true' : undefined),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    }))).catch(() => []);
    frames.push({ frame: i, top: f === page.mainFrame(), host: hostOf(f) || null, shown: await frameShown(page, f).catch(() => false),
      title: i === 0 ? (await page.title().catch(() => '')).slice(0, 60) : undefined, controls: controls.map(redactControl) });
  }
  return { frames, amounts: visibleAmounts(await page.locator('body').innerText().catch(() => '')), captcha_challenge: await captchaChallengeShown(page).catch(() => null) };
}

// First match among `selectors`, in the page or any displayed frame, waiting up to `timeoutMs`.
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
// Normal check/uncheck; if the input is covered by its styled <label>, click that label (still a user action).
// The state is always re-read afterwards by the caller; nothing is forced.
async function setChecked(frame, input, wanted) {
  try { await (wanted ? input.check({ timeout: 5000 }) : input.uncheck({ timeout: 5000 })); return; } catch { /* covered input */ }
  const id = await input.getAttribute('id').catch(() => null);
  if (id) await frame.locator(`label[for="${id.replace(/"/g, '')}"]`).first().click({ timeout: 5000 }).catch(() => {});
}

// Currency radios on the page: [{ frame, input, key, checked }].
async function currencyRadios(page) {
  const out = [];
  for (const frame of page.frames()) {
    if (!(await frameShown(page, frame))) continue;
    const inputs = frame.locator(FIELD_SELECTORS.currency.join(', '));
    const n = await inputs.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
      const input = inputs.nth(i);
      const id = (await input.getAttribute('id').catch(() => '')) || '';
      const value = (await input.getAttribute('value').catch(() => '')) || '';
      const key = (id.replace(/^currency-/i, '') || value).toLowerCase();
      out.push({ frame, input, key, checked: await input.isChecked().catch(() => null) });
    }
  }
  return out;
}
async function readCurrency(page) {
  const radios = await currencyRadios(page);
  const amounts = visibleAmounts(await page.locator('body').innerText().catch(() => ''));
  return { radios, amounts, decision: currencyDecision({ radios: radios.map(({ key, checked }) => ({ key, checked })), amounts }) };
}
// Selects EUR when offered (real radio #currency-eur), then requires the confirmed state before anything is paid.
async function ensureEuro(page, { timeoutMs = 20000 } = {}) {
  let clicked = false;
  const end = Date.now() + timeoutMs;
  for (;;) {
    const state = await readCurrency(page);
    if (state.decision.ok) return { currency: 'EUR', choice_offered: state.radios.length > 0, clicked, amounts: state.amounts.length, reason: state.decision.reason };
    const eur = state.radios.find(r => r.key === 'eur');
    if (eur && eur.checked === false && !clicked) { await setChecked(eur.frame, eur.input, true); clicked = true; continue; }
    if (Date.now() >= end) throw new Error(`CHECKOUT_AMOUNT_NOT_29_EUR: ${state.decision.reason}`);
    await page.waitForTimeout(300);
  }
}

// Unchecks the optional Link enrolment and requires its phone field to be empty. Never types a phone number.
async function linkState(page) {
  const box = await findField(page, FIELD_SELECTORS.linkSave, { timeoutMs: 1500, visible: false });
  if (!box) return { box: null, checked: null };
  return { box, checked: await box.isChecked().catch(() => null) };
}
async function phoneEmpty(page) {
  const phone = await findField(page, FIELD_SELECTORS.linkPhone, { timeoutMs: 500 });
  return !phone || (await phone.inputValue().catch(() => 'unknown')) === '';
}
async function ownerFrame(page, loc) {
  const handle = await loc.elementHandle({ timeout: 2000 });
  try { return (await handle.ownerFrame()) || page.mainFrame(); } finally { await handle.dispose(); }
}
async function disableLinkSave(page) {
  let { box, checked } = await linkState(page);
  if (!box) return { link: 'absent' };
  if (checked === true) {
    await setChecked(await ownerFrame(page, box), box, false);
    ({ checked } = await linkState(page));
  }
  if (checked !== false) throw new Error('CHECKOUT_LINK_SAVE_STILL_CHECKED');
  if (!(await phoneEmpty(page))) throw new Error('CHECKOUT_LINK_PHONE_NOT_EMPTY');
  return { link: 'unchecked', phone_empty: true };
}

// A CAPTCHA challenge is displayed when a frame from a CAPTCHA host is shown at a challenge-like size. The invisible
// widgets Stripe always loads are hidden and do not count. The lab never answers a CAPTCHA.
export async function captchaChallengeShown(page) {
  for (const frame of page.frames()) {
    if (CAPTCHA_HOSTS.test(hostOf(frame)) && (await frameShown(page, frame, { w: 100, h: 60 }))) return true;
  }
  return false;
}

// Fills the observed Checkout form with test data and submits it. Exported for the local fixture test (a fixture
// proves the automation logic only; it does not certify the real Stripe Checkout).
export async function fillAndSubmit(page, { successPrefix, timeoutMs = 120000 } = {}) {
  if (!successPrefix) throw new Error('CHECKOUT_SUCCESS_PREFIX_REQUIRED');
  const steps = [];
  if (await captchaChallengeShown(page)) throw new Error('CHECKOUT_CAPTCHA_REQUIRED'); // never interact under a challenge
  steps.push({ step: 'currency', ...(await ensureEuro(page)) });
  let card = await findField(page, FIELD_SELECTORS.cardNumber, { timeoutMs: 8000 });
  if (!card) { // payment methods shown as an accordion: open "Carte"
    for (const frame of page.frames()) {
      const method = frame.locator('[data-testid="card-accordion-item-button"]').or(frame.getByRole('button', { name: CARD_METHOD_LABEL })).or(frame.getByRole('radio', { name: CARD_METHOD_LABEL })).first();
      if (await method.isVisible().catch(() => false)) { await method.click(); steps.push({ step: 'card_method_opened' }); break; }
    }
  }
  const email = await findField(page, FIELD_SELECTORS.email, { timeoutMs: 1000 });
  if (email && (await email.isEditable().catch(() => false)) && !(await email.inputValue().catch(() => ''))) throw new Error('CHECKOUT_EMAIL_NOT_PREFILLED');
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
  // Final checks right before paying: currency and amount again (a country change may re-render the summary),
  // Link still unchecked with an empty phone field, no CAPTCHA challenge.
  steps.push({ step: 'currency_before_submit', ...(await ensureEuro(page, { timeoutMs: 8000 })) });
  const link = await linkState(page);
  if (link.box && link.checked !== false) throw new Error('CHECKOUT_LINK_SAVE_STILL_CHECKED');
  if (!(await phoneEmpty(page))) throw new Error('CHECKOUT_LINK_PHONE_NOT_EMPTY');
  if (await captchaChallengeShown(page)) throw new Error('CHECKOUT_CAPTCHA_REQUIRED');
  let submit = await findField(page, FIELD_SELECTORS.submit, { timeoutMs: 3000 });
  if (!submit) submit = page.getByRole('button', { name: SUBMIT_LABEL }).first();
  await submit.waitFor({ state: 'visible', timeout: 10000 });
  await submit.click();
  steps.push({ step: 'submitted' });
  // Success redirect, or stop at once if a CAPTCHA challenge appears (never answered by the lab).
  const end = Date.now() + timeoutMs;
  for (;;) {
    if (page.url().startsWith(successPrefix)) break;
    if (await captchaChallengeShown(page).catch(() => false)) throw new Error('CHECKOUT_CAPTCHA_REQUIRED');
    if (Date.now() >= end) throw new Error('CHECKOUT_NO_SUCCESS_REDIRECT');
    await page.waitForTimeout(500);
  }
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
