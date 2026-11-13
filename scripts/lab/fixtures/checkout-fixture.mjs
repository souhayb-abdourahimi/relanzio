// LOCAL imitation of the Stripe Checkout page observed in the lab (failed run 3 screenshot), used ONLY to test the
// automation in scripts/lab/checkout-browser.mjs. It is NOT Stripe and passing against it certifies nothing about the
// real Checkout: it proves that the automation fills fields inside a cross-origin iframe, selects EUR, unchecks
// Link without typing a phone number, and refuses to pay otherwise.
//
// Options (query string of /checkout):
//   layout   = iframe (card fields in a cross-origin iframe) | top (#cardNumber... on the page) | accordion
//   currency = toggle (USD preselected, EUR button) | toggle-amounts (buttons show the amounts) | eur | usd-only
//   link     = checkbox (pre-checked, reveals a phone field) | custom (hidden input + label) | stuck (cannot uncheck) | none
//   email    = readonly (prefilled) | empty
import http from 'node:http';

const page = (o, frameOrigin) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Relanzio - Laboratoire CI</title>
<style>body{font-family:sans-serif;max-width:900px;margin:20px auto} .hidden{display:none} input,select,button{display:block;margin:6px 0;padding:6px}</style></head><body>
<h1>Relanzio - Laboratoire CI</h1><p>Environnement de test</p>
<div id="amount"></div>
${o.currency.startsWith('toggle') ? `<div role="group" aria-label="Devise">
  <button type="button" id="usd" aria-pressed="true">${o.currency === 'toggle-amounts' ? '33,25 $US' : 'USD'}</button>
  <button type="button" id="eur" aria-pressed="false">${o.currency === 'toggle-amounts' ? '29,00 €' : 'EUR'}</button></div>` : ''}
<p>29 € / mois. TVA non applicable, art. 293 B du CGI</p>
<form id="f">
  <label for="email">E-mail</label><input id="email" type="email" ${o.email === 'readonly' ? 'value="lab-linking@example.com" readonly' : ''}>
  ${o.layout === 'accordion' ? '<button type="button" id="cardMethod">Carte</button>' : ''}
  <div id="cardBlock" class="${o.layout === 'accordion' ? 'hidden' : ''}">
  ${o.layout === 'iframe' || o.layout === 'accordion'
    ? `<iframe id="cardFrame" title="Champs de carte sécurisés" src="${frameOrigin}/frame/card" style="width:100%;height:170px;border:0"></iframe>`
    : `<input id="cardNumber" name="cardNumber" autocomplete="cc-number" placeholder="1234 1234 1234 1234">
       <input id="cardExpiry" name="cardExpiry" autocomplete="cc-exp" placeholder="MM / AA">
       <input id="cardCvc" name="cardCvc" autocomplete="cc-csc" placeholder="CVC">`}
  </div>
  <input id="billingName" name="billingName" autocomplete="cc-name" placeholder="Prénom et nom">
  <select id="billingCountry" name="billingCountry" autocomplete="country"><option value="US" selected>États-Unis</option><option value="FR">France</option></select>
  <input id="billingPostalCode" name="billingPostalCode" autocomplete="postal-code" placeholder="Code postal">
  ${o.link === 'none' ? '' : `<div>
    <input type="checkbox" id="enableStripePass" name="enableStripePass" checked ${o.link === 'custom' ? 'style="display:none"' : ''} ${o.link === 'stuck' ? 'disabled' : ''}>
    <label for="enableStripePass">Enregistrer mes informations pour un paiement plus rapide</label>
    <input type="tel" id="phoneNumber" name="phoneNumber" autocomplete="tel" placeholder="(201) 555-0123"></div>`}
  <button type="submit" class="SubmitButton" data-testid="hosted-payment-submit-button">S'abonner</button>
  <p id="err"></p>
</form>
<script>
const ev = n => fetch('/event/' + n);
let currency = ${JSON.stringify(o.currency === 'eur' ? 'EUR' : 'USD')};
const card = { number: false, expiry: false, cvc: false };
const render = () => {
  document.getElementById('amount').textContent = currency === 'EUR' ? '29,00 € par mois' : '33,25 $US par mois';
  const u = document.getElementById('usd'), e = document.getElementById('eur');
  if (u) { u.setAttribute('aria-pressed', String(currency === 'USD')); e.setAttribute('aria-pressed', String(currency === 'EUR')); }
};
render();
document.getElementById('eur')?.addEventListener('click', () => { currency = 'EUR'; render(); });
document.getElementById('usd')?.addEventListener('click', () => { currency = 'USD'; render(); });
document.getElementById('cardMethod')?.addEventListener('click', () => document.getElementById('cardBlock').classList.remove('hidden'));
const link = document.getElementById('enableStripePass'), phone = document.getElementById('phoneNumber');
const syncPhone = () => phone && phone.classList.toggle('hidden', !link.checked);
link?.addEventListener('change', syncPhone); syncPhone();
phone?.addEventListener('input', () => ev('phone_typed'));
addEventListener('message', m => { if (m.origin === ${JSON.stringify(frameOrigin)}) Object.assign(card, m.data); });
const digits = id => (document.getElementById(id)?.value || '').replace(/\\D/g, '');
document.querySelectorAll('#cardNumber,#cardExpiry,#cardCvc').forEach(i => i.addEventListener('input', () => {
  card.number = digits('cardNumber') === '4242424242424242'; card.expiry = digits('cardExpiry').length === 4; card.cvc = digits('cardCvc').length === 3;
}));
document.getElementById('f').addEventListener('submit', e => {
  e.preventDefault();
  const reasons = [];
  if (currency !== 'EUR') reasons.push('currency');
  if (!card.number || !card.expiry || !card.cvc) reasons.push('card');
  if (link && link.checked) reasons.push('link');
  if (phone && phone.value) reasons.push('phone');
  if (!document.getElementById('email').value) reasons.push('email');
  if (!document.getElementById('billingName').value || document.getElementById('billingCountry').value !== 'FR' || !document.getElementById('billingPostalCode').value) reasons.push('billing');
  if (reasons.length) { document.getElementById('err').textContent = 'refusé'; ev('submit_refused_' + reasons.join('_')); return; }
  ev('paid').then(() => { location.href = '/app/billing?checkout=success'; });
});
</script></body></html>`;

const cardFrame = parentOrigin => `<!doctype html><html><head><meta charset="utf-8"></head><body>
<input name="cardnumber" autocomplete="cc-number" placeholder="Numéro de carte" aria-label="Numéro de carte">
<input name="exp-date" autocomplete="cc-exp" placeholder="MM / AA" aria-label="Date d'expiration">
<input name="cvc" autocomplete="cc-csc" placeholder="Code de sécurité" aria-label="Code de sécurité">
<script>
const [n, x, c] = document.querySelectorAll('input');
const d = el => el.value.replace(/\\D/g, '');
n.addEventListener('input', () => { const v = d(n).slice(0, 16); n.value = v.replace(/(\\d{4})(?=\\d)/g, '$1 '); });
x.addEventListener('input', () => { const v = d(x).slice(0, 4); x.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v; });
const post = () => parent.postMessage({ number: d(n) === '4242424242424242', expiry: d(x).length === 4, cvc: d(c).length === 3 }, ${JSON.stringify(parentOrigin)});
[n, x, c].forEach(el => el.addEventListener('input', post));
</script></body></html>`;

export async function startCheckoutFixture() {
  const events = [];
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const port = server.address().port;
    const send = (body, type = 'text/html; charset=utf-8') => { res.writeHead(200, { 'content-type': type }); res.end(body); };
    if (u.pathname === '/checkout') {
      const o = { layout: 'iframe', currency: 'toggle', link: 'checkbox', email: 'readonly', ...Object.fromEntries(u.searchParams) };
      return send(page(o, `http://localhost:${port}`));
    }
    if (u.pathname === '/frame/card') return send(cardFrame(`http://127.0.0.1:${port}`));
    if (u.pathname.startsWith('/event/')) { events.push(u.pathname.slice(7)); return send('ok', 'text/plain'); }
    if (u.pathname === '/app/billing') return send('<!doctype html><title>Relanzio</title><p>Abonnement en cours</p>');
    res.writeHead(404); res.end();
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { base: `http://127.0.0.1:${port}`, successPrefix: `http://127.0.0.1:${port}/app/`, events, close: () => new Promise(r => server.close(r)) };
}
