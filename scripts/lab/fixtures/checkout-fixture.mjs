// LOCAL imitation of the Stripe Checkout page as reported by LAB_CHECKOUT_DOM in lab run 4, used ONLY to test the
// automation in scripts/lab/checkout-browser.mjs. It is NOT Stripe and passing against it certifies nothing about the
// real Checkout. Structure reproduced:
//   - currency radios input#currency-usd (checked) / input#currency-eur, name="currency", alone in a cross-origin
//     iframe, with no usable accessible name (flag labels only);
//   - the order summary on the page itself, four amounts (33,25 $US in USD, 29,00 € in EUR), plus the product
//     description "29 € / mois" shown in every currency;
//   - email, card number / expiry / CVC, holder name, billing country, postal code, Link opt-in
//     input#payment-linkOptInInput (pre-checked) revealing input#payment-linkMobilePhoneInput, and the submit button,
//     in another cross-origin iframe;
//   - an hCaptcha frame (host newassets.hcaptcha.com, mapped to 127.0.0.1 by the test browser), hidden unless a
//     challenge is displayed.
// Options (query string of /checkout):
//   layout   = iframe (observed) | top (fields on the page) | accordion (payment frame behind a "Carte" button)
//   currency = radios (observed) | radios-covered (inputs covered, flag label clickable) | radios-stale (EUR checks
//              but the summary stays in dollars) | radios-stuck (EUR cannot be selected) | eur | usd-only
//   link     = real (observed) | custom (hidden input behind its label, top layout) | stuck (cannot uncheck) | none
//   email    = prefilled | empty
//   captcha  = none | before (challenge displayed at load) | after (challenge displayed on submit, no payment)
import http from 'node:http';

export const CAPTCHA_TEST_HOST = 'newassets.hcaptcha.com';

const amountsHtml = () => `<section id="summary">
  <p class="price"><span class="amt"></span> par mois</p>
  <p>Relanzio Pro <span class="amt"></span></p>
  <p>29 € / mois. TVA non applicable, art. 293 B du CGI</p>
  <p>Sous-total <span class="amt"></span></p>
  <p>Total dû aujourd'hui <span class="amt"></span></p></section>`;

const paymentFields = o => `
  <label for="linkAuthentication-emailInput">E-mail</label>
  <input type="text" id="linkAuthentication-emailInput" name="email" autocomplete="email" ${o.email === 'prefilled' ? 'value="lab-linking@example.com"' : ''}>
  <input type="text" id="payment-numberInput" name="number" autocomplete="cc-number" aria-label="Numéro de carte" placeholder="Numéro de carte">
  <input type="text" id="payment-expiryInput" name="expiry" autocomplete="cc-exp" aria-label="Date d'expiration (MM/AA)" placeholder="MM / AA">
  <input type="text" id="payment-cvcInput" name="cvc" autocomplete="cc-csc" aria-label="Code de sécurité" placeholder="Code de sécurité">
  <input type="text" id="payment-nameInput" name="name" autocomplete="cc-name" aria-label="Nom du titulaire de la carte" placeholder="Prénom et nom">
  <select id="payment-countryInput" name="country" autocomplete="billing country" aria-label="Pays"><option value="US" selected>États-Unis</option><option value="FR">France</option></select>
  <input type="text" id="payment-postalCodeInput" name="postalCode" autocomplete="billing postal-code" aria-label="Code postal" placeholder="Code postal">
  ${o.link === 'none' ? '' : `<div><input type="checkbox" id="payment-linkOptInInput" name="linkOptIn" checked ${o.link === 'stuck' ? 'disabled' : ''}>
    <label for="payment-linkOptInInput">Enregistrer mes informations pour un paiement plus rapide</label>
    <input type="text" id="payment-linkMobilePhoneInput" name="linkMobilePhone" autocomplete="billing tel" aria-label="Numéro de téléphone portable" placeholder="(201) 555-0123"></div>`}`;

// Shared validation of the payment fields (runs in the payment frame, or on the page for layout=top).
const validateJs = `
const $ = id => document.getElementById(id);
const digits = el => (el?.value || '').replace(/\\D/g, '');
const formatCard = () => { const n = $(CARD), x = $(EXP); if (!n) return;
  n.addEventListener('input', () => { n.value = digits(n).slice(0, 16).replace(/(\\d{4})(?=\\d)/g, '$1 '); });
  x.addEventListener('input', () => { const v = digits(x).slice(0, 4); x.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v; }); };
const linkBox = () => $('payment-linkOptInInput') || $('enableStripePass');
const phone = () => $('payment-linkMobilePhoneInput') || $('phoneNumber');
const syncPhone = () => { const p = phone(), b = linkBox(); if (p) p.style.display = b && b.checked ? '' : 'none'; };
linkBox()?.addEventListener('change', syncPhone);
phone()?.addEventListener('input', () => fetch('/event/phone_typed'));
const fieldProblems = () => { const r = [];
  if (digits($(CARD)) !== '4242424242424242' || digits($(EXP)).length !== 4 || digits($(CVC)).length !== 3) r.push('card');
  if (!$(NAME).value || $(COUNTRY).value !== 'FR' || !$(POSTAL).value) r.push('billing');
  if (!$(EMAIL).value) r.push('email');
  if (linkBox()?.checked) r.push('link');
  if (phone()?.value) r.push('phone');
  return r; };`;
const ids = layout => layout === 'top'
  ? { CARD: 'cardNumber', EXP: 'cardExpiry', CVC: 'cardCvc', NAME: 'billingName', COUNTRY: 'billingCountry', POSTAL: 'billingPostalCode', EMAIL: 'email' }
  : { CARD: 'payment-numberInput', EXP: 'payment-expiryInput', CVC: 'payment-cvcInput', NAME: 'payment-nameInput', COUNTRY: 'payment-countryInput', POSTAL: 'payment-postalCodeInput', EMAIL: 'linkAuthentication-emailInput' };
const idsJs = layout => Object.entries(ids(layout)).map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`).join('\n');

const topPage = (o, frameOrigin, port, qs) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Relanzio - Laboratoire CI</title>
<style>body{font-family:sans-serif;max-width:900px;margin:20px auto} input,select,button{display:block;margin:6px 0;padding:6px} iframe{border:0;width:100%}
#captcha{position:absolute;top:40px;left:40px;width:400px;height:500px;visibility:hidden}</style></head><body>
<h1>Relanzio - Laboratoire CI</h1><p>Environnement de test</p>
${amountsHtml()}
${o.currency.startsWith('radios') ? `<iframe id="currencyFrame" title="Devise" src="${frameOrigin}/frame/currency?${qs}" style="height:60px"></iframe>` : ''}
<input type="text" id="promotionCode" name="promotionCode" autocomplete="off" aria-label="Ajouter un code promotionnel" placeholder="Ajouter un code promotionnel">
${o.layout === 'accordion' ? '<button type="button" id="cardMethod">Carte</button>' : ''}
${o.layout === 'top' ? `<form id="f">
  <label for="email">E-mail</label><input id="email" type="email" ${o.email === 'prefilled' ? 'value="lab-linking@example.com" readonly' : ''}>
  <input id="cardNumber" autocomplete="cc-number" placeholder="1234 1234 1234 1234"><input id="cardExpiry" autocomplete="cc-exp" placeholder="MM / AA"><input id="cardCvc" autocomplete="cc-csc" placeholder="CVC">
  <input id="billingName" autocomplete="cc-name" placeholder="Prénom et nom">
  <select id="billingCountry" autocomplete="country"><option value="US" selected>États-Unis</option><option value="FR">France</option></select>
  <input id="billingPostalCode" autocomplete="postal-code" placeholder="Code postal">
  ${o.link === 'custom' ? `<input type="checkbox" id="enableStripePass" name="enableStripePass" checked style="display:none"><label for="enableStripePass">Enregistrer mes informations pour un paiement plus rapide</label>
    <input type="tel" id="phoneNumber" placeholder="(201) 555-0123">` : ''}
  <button type="submit" class="SubmitButton">S'abonner</button></form>`
  : `<div id="payBlock" style="${o.layout === 'accordion' ? 'display:none' : ''}"><iframe id="paymentFrame" title="Paiement sécurisé" src="${frameOrigin}/frame/payment?${qs}" style="height:620px"></iframe></div>`}
<iframe id="captcha" title="hCaptcha" src="http://${CAPTCHA_TEST_HOST}:${port}/frame/captcha"></iframe>
<script>
const ev = n => fetch('/event/' + n);
let currency = ${JSON.stringify(o.currency === 'eur' ? 'EUR' : 'USD')};
const render = () => document.querySelectorAll('.amt').forEach(s => { s.textContent = currency === 'EUR' ? '29,00 €' : '33,25 $US'; });
render();
const showCaptcha = () => { document.getElementById('captcha').style.visibility = 'visible'; ev('challenge_shown'); };
if (${JSON.stringify(o.captcha)} === 'before') showCaptcha();
document.getElementById('cardMethod')?.addEventListener('click', () => { document.getElementById('payBlock').style.display = ''; });
const decide = problems => {
  if (currency !== 'EUR') problems.push('currency');
  if (document.getElementById('captcha').style.visibility === 'visible') problems.push('captcha');
  if (problems.length) { ev('submit_refused_' + problems.join('_')); return; }
  if (${JSON.stringify(o.captcha)} === 'after') { showCaptcha(); return; }
  ev('paid').then(() => { location.href = '/app/billing?checkout=success'; });
};
addEventListener('message', m => {
  if (m.origin !== ${JSON.stringify(frameOrigin)}) return;
  if (m.data.type === 'currency' && ${JSON.stringify(o.currency)} !== 'radios-stale') { currency = m.data.value; render(); }
  if (m.data.type === 'currency' && ${JSON.stringify(o.currency)} === 'radios-stale') { currency = m.data.value; }
  if (m.data.type === 'submit') decide(m.data.problems);
});
${o.layout === 'top' ? `${idsJs('top')}${validateJs}formatCard(); syncPhone();
document.getElementById('f').addEventListener('submit', e => { e.preventDefault(); decide(fieldProblems()); });` : ''}
</script></body></html>`;

const currencyFrame = (o, parentOrigin) => `<!doctype html><html><head><meta charset="utf-8">
<style>.opt{display:inline-block;margin:6px 12px} .box{position:relative;display:inline-block} .cover{position:absolute;inset:-4px;background:#fff;opacity:.01}</style></head><body>
${['usd', 'eur'].map(c => `<span class="opt"><span class="box"><input type="radio" id="currency-${c}" name="currency" value="${c}" ${c === 'usd' ? 'checked' : ''} ${c === 'eur' && o.currency === 'radios-stuck' ? 'disabled' : ''}>${o.currency === 'radios-covered' ? '<span class="cover"></span>' : ''}</span>
  <label for="currency-${c}">${c === 'usd' ? '🇺🇸' : '🇪🇺'}</label></span>`).join('')}
<button type="button" aria-hidden="true"></button>
<script>
document.querySelectorAll('input[name=currency]').forEach(r => r.addEventListener('change', () => {
  parent.postMessage({ type: 'currency', value: r.value.toUpperCase() }, ${JSON.stringify(parentOrigin)});
}));
</script></body></html>`;

const paymentFrame = (o, parentOrigin) => `<!doctype html><html><head><meta charset="utf-8">
<style>input,select,button{display:block;margin:6px 0;padding:6px}</style></head><body>
<button type="button" name="pay_with_link_arrow" aria-label="Payer en toute sécurité avec Link">Link</button>
<form id="f">${paymentFields(o)}<button type="submit">S'abonner</button></form>
<script>${idsJs('iframe')}${validateJs}formatCard(); syncPhone();
document.getElementById('f').addEventListener('submit', e => { e.preventDefault();
  parent.postMessage({ type: 'submit', problems: fieldProblems() }, ${JSON.stringify(parentOrigin)}); });
</script></body></html>`;

const captchaFrame = () => `<!doctype html><html><body><button id="menu-info" role="button" aria-label="About hCaptcha &amp; Accessibility Options">i</button>
<p>Veuillez résoudre ce défi</p></body></html>`;

export async function startCheckoutFixture() {
  const events = [];
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const port = server.address().port;
    const o = { layout: 'iframe', currency: 'radios', link: 'real', email: 'prefilled', captcha: 'none', ...Object.fromEntries(u.searchParams) };
    const send = (body, type = 'text/html; charset=utf-8') => { res.writeHead(200, { 'content-type': type }); res.end(body); };
    const top = `http://127.0.0.1:${port}`, frames = `http://localhost:${port}`;
    if (u.pathname === '/checkout') return send(topPage(o, frames, port, u.searchParams.toString()));
    if (u.pathname === '/frame/currency') return send(currencyFrame(o, top));
    if (u.pathname === '/frame/payment') return send(paymentFrame(o, top));
    if (u.pathname === '/frame/captcha') return send(captchaFrame());
    if (u.pathname.startsWith('/event/')) { events.push(u.pathname.slice(7)); return send('ok', 'text/plain'); }
    if (u.pathname === '/app/billing') return send('<!doctype html><title>Relanzio</title><p>Abonnement en cours</p>');
    res.writeHead(404); res.end();
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return {
    base: `http://127.0.0.1:${port}`, port, successPrefix: `http://127.0.0.1:${port}/app/`, events,
    // Chromium options keeping every request local: the CAPTCHA host resolves to the fixture, no proxy is used.
    browserArgs: [`--host-resolver-rules=MAP ${CAPTCHA_TEST_HOST} 127.0.0.1`, '--no-proxy-server'],
    close: () => new Promise(r => server.close(r))
  };
}
