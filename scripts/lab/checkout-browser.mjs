// Pays a REAL Stripe Checkout (TEST mode) page in a headless Chromium, as a customer would, with the Stripe test
// card 4242 4242 4242 4242. Used only by the lab (scripts/lab/stripe-run.mjs). Refuses anything that is not a
// test-mode Checkout URL on checkout.stripe.com.
// Returns once the browser has been redirected to successPrefix (the app's success_url), or throws with a
// screenshot path for diagnosis (test data only: example.com customer, test card).
export async function payCheckout(url, { successPrefix, screenshotPath = 'lab-checkout-failure.png', timeoutMs = 120000 } = {}) {
  const u = new URL(url);
  if (u.hostname !== 'checkout.stripe.com' || !/\/c\/pay\/cs_test_/.test(u.pathname)) throw new Error('CHECKOUT_URL_NOT_TEST_MODE');
  if (!successPrefix) throw new Error('CHECKOUT_SUCCESS_PREFIX_REQUIRED');
  const { chromium } = await import('@playwright/test'); // loaded only when a real Checkout is paid
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
    throw Object.assign(new Error(`CHECKOUT_BROWSER_FAILED: ${e.message.split('\n')[0]}`), { screenshotPath });
  } finally {
    await browser.close();
  }
}
