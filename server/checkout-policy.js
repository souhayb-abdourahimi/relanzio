import { createHash } from 'node:crypto';

export const CHECKOUT_CONFIG_VERSION='pro-card-v3';

export function checkoutConfigFingerprint({priceId='',appUrl=''}) {
  const raw=[CHECKOUT_CONFIG_VERSION,String(priceId),String(appUrl),'subscription','card'].join('|');
  return createHash('sha256').update(raw).digest('hex').slice(0,24);
}

export function checkoutMetadata({priceId='',appUrl=''}) {
  return { checkout_config:checkoutConfigFingerprint({priceId,appUrl}), checkout_version:CHECKOUT_CONFIG_VERSION };
}

export function isReusableCheckoutSession(session,fingerprint) {
  return Boolean(
    session?.status==='open' &&
    session?.mode==='subscription' &&
    session?.url &&
    Array.isArray(session?.payment_method_types) &&
    session.payment_method_types.includes('card') &&
    session?.metadata?.checkout_config===fingerprint
  );
}

export function checkoutIdempotencyKey({userId,fingerprint,claimedAt}) {
  const stamp=new Date(claimedAt).getTime();
  if(!userId||!fingerprint||!Number.isFinite(stamp))throw new Error('INVALID_CHECKOUT_ATTEMPT');
  return `relanzio-checkout-v3-${userId}-${fingerprint}-${stamp}`;
}
