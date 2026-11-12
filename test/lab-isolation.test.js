import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEnvironment } from '../scripts/lab/isolation-check.mjs';

const good = {
  NODE_ENV: 'development', SUPABASE_URL: 'http://127.0.0.1:54321', APP_URL: 'http://127.0.0.1:3000',
  SUPABASE_SERVICE_ROLE_KEY: 'local-demo-key', STRIPE_EXPECTED_MODE: 'test', STRIPE_SECRET_KEY: 'sk_test_fictional',
  STRIPE_EXPECTED_ACCOUNT_ID: 'acct_labSandbox1', PRODUCTION_STRIPE_ACCOUNT_ID: 'acct_production1', STRIPE_PRO_PRICE_ID: 'price_lab'
};

test('a lab environment passes', () => assert.deepEqual(checkEnvironment(good), []));
test('the lab also passes without any Stripe key (infrastructure-only run)', () => {
  const { STRIPE_SECRET_KEY, ...noKey } = good;
  assert.deepEqual(checkEnvironment(noKey), []);
});

test('production identifiers anywhere are refused', () => {
  for (const [k, v] of [['SUPABASE_URL', 'https://uwgvnhnpvxoebabayqac.supabase.co'], ['APP_URL', 'https://relanzio.com'], ['X', 'https://relanzio-production.up.railway.app/api'],
    ['STRIPE_SECRET_KEY', 'sk_live_x'], ['SOME_URL', 'https://api.brevo.com/v3'], ['MAIL', 'ssl0.ovh.net']]) {
    assert.ok(checkEnvironment({ ...good, [k]: v }).length > 0, `${k}=${v}`);
  }
});

test('the production Stripe account (whose Test mode still sends to production) is refused', () => {
  assert.match(checkEnvironment({ ...good, STRIPE_EXPECTED_ACCOUNT_ID: 'acct_production1' }).join(), /equals the production account/);
  assert.match(checkEnvironment({ ...good, PRODUCTION_STRIPE_ACCOUNT_ID: '' }).join(), /PRODUCTION_STRIPE_ACCOUNT_ID: required/);
});

test('real service credentials and production modes are refused', () => {
  assert.match(checkEnvironment({ ...good, BREVO_API_KEY: 'x' }).join(), /BREVO_API_KEY/);
  assert.match(checkEnvironment({ ...good, NODE_ENV: 'production' }).join(), /NODE_ENV/);
  assert.match(checkEnvironment({ ...good, STRIPE_EXPECTED_MODE: 'live' }).join(), /STRIPE_EXPECTED_MODE/);
  assert.match(checkEnvironment({ ...good, SUPABASE_URL: 'http://10.0.0.5:54321' }).join(), /SUPABASE_URL/);
  assert.match(checkEnvironment({ ...good, DATABASE_URL: 'postgres://x' }).join(), /DATABASE_URL/);
});
