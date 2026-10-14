import test from 'node:test';
import assert from 'node:assert/strict';
import {checkoutConfigFingerprint,checkoutMetadata,isReusableCheckoutSession,checkoutIdempotencyKey} from '../server/checkout-policy.js';

test('checkout fingerprint changes when price or app configuration changes',()=>{
  const a=checkoutConfigFingerprint({priceId:'price_a',appUrl:'https://relanzio.com'});
  const b=checkoutConfigFingerprint({priceId:'price_b',appUrl:'https://relanzio.com'});
  assert.notEqual(a,b);
  assert.equal(checkoutMetadata({priceId:'price_a',appUrl:'https://relanzio.com'}).checkout_config,a);
});

test('only an open card session with the exact current fingerprint is reusable',()=>{
  const fp='abc123';
  const base={status:'open',mode:'subscription',url:'https://checkout.stripe.test/x',payment_method_types:['card'],metadata:{checkout_config:fp}};
  assert.equal(isReusableCheckoutSession(base,fp),true);
  assert.equal(isReusableCheckoutSession({...base,status:'expired'},fp),false);
  assert.equal(isReusableCheckoutSession({...base,metadata:{checkout_config:'old'}},fp),false);
  assert.equal(isReusableCheckoutSession({...base,payment_method_types:['link']},fp),false);
});

test('checkout idempotency key is per claimed attempt and configuration',()=>{
  const a=checkoutIdempotencyKey({userId:'u',fingerprint:'fp1',claimedAt:'2026-10-15T00:00:00Z'});
  const same=checkoutIdempotencyKey({userId:'u',fingerprint:'fp1',claimedAt:'2026-10-15T00:00:00Z'});
  const changed=checkoutIdempotencyKey({userId:'u',fingerprint:'fp2',claimedAt:'2026-10-15T00:00:00Z'});
  const later=checkoutIdempotencyKey({userId:'u',fingerprint:'fp1',claimedAt:'2026-10-15T00:01:00Z'});
  assert.equal(a,same);
  assert.notEqual(a,changed);
  assert.notEqual(a,later);
});
