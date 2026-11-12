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

// Pays a Checkout page ONLY with a positive verification for that exact URL.
export async function payCheckout(url, { successPrefix, verified, screenshotPath = 'lab-checkout-failure.png', timeoutMs = 120000 } = {}) {
  if (!verified?.ok || verified.url !== url) throw new Error('CHECKOUT_NOT_VERIFIED');
  const u = new URL(url);
  if (u.protocol !== 'https:' || u.hostname !== CHECKOUT_HOST || /cs_live_/i.test(url)) throw new Error('CHECKOUT_URL_REFUSED'); // defence in depth
  if (!successPrefix) throw new Error('CHECKOUT_SUCCESS_PREFIX_REQUIRED');
  const { chromium } = await import('@playwright/test'); // loaded only when a verified Checkout is paid
  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: 'fr-FR' });
  const visible = async (selector, ms = 2000) => { try { await page.locator(selector).first().waitFor({ state: 'visible', timeout: ms }); return true; } catch { return false; } };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Card form: directly visible, or behind a "Card" accordion when several methods are offered.
    if (!(await visible('#cardNumber', 15000))) {
      for (const s of ['[data-testid="card-accordion-item-button"]', 'button[aria-label*="Carte"]', 'button[aria-label*="Card"]']) if (await visible(s, 1000)) { await page.locator(s).first().click(); break; }
      await page.locator('#cardNumber').waitFor({ state: 'visible', timeout: 15000 });
    }
    if (await visible('#email', 500) && await page.locator('#email').isEditable().catch(() => false) && !(await page.locator('#email').inputValue())) await page.fill('#email', 'lab-checkout@example.com');
    await page.fill('#cardNumber', '4242424242424242');
    await page.fill('#cardExpiry', '12 / 34');
    await page.fill('#cardCvc', '123');
    if (await visible('#billingName', 500)) await page.fill('#billingName', 'Laboratoire Relanzio');
    if (await visible('#billingCountry', 500)) await page.selectOption('#billingCountry', 'FR').catch(() => {});
    if (await visible('#billingPostalCode', 500)) await page.fill('#billingPostalCode', '75001');
    // Never enrol the lab customer in Link (it would ask for a phone number).
    for (const s of ['#enableStripePass', 'input[name="enableStripePass"]']) if (await visible(s, 300) && await page.locator(s).isChecked().catch(() => false)) await page.locator(s).uncheck().catch(() => {});
    await page.locator('button[type="submit"], .SubmitButton').first().click();
    await page.waitForURL(target => target.href.startsWith(successPrefix), { timeout: timeoutMs });
    return { paid: true, redirectedTo: new URL(page.url()).origin };
  } catch (e) {
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    throw Object.assign(new Error(`CHECKOUT_BROWSER_FAILED: ${e.message.split('\n')[0].replace(/https?:\/\/\S+/g, '<url>')}`), { screenshotPath });
  } finally {
    await browser.close();
  }
}
