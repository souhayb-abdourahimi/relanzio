// Single source of truth for Relanzio commercial values.
// Imported by the server, the Vite client and the tests: change a price or a limit here only.
export const FREE_ACTIVE_QUOTES_LIMIT=5;
export const PRO_ACTIVE_QUOTES_LIMIT=100;
export const PRO_MONTHLY_PRICE=29;
export const TRIAL_DAYS=7;
// Days of Pro kept after a failed renewal (Stripe past_due), counted from the start of the unpaid period.
export const PAST_DUE_GRACE_DAYS=14;
export const VAT_NOTICE='TVA non applicable, art. 293 B du CGI';

export const PRO_PRICE_TEXT=`${PRO_MONTHLY_PRICE} € / mois`;
export const PRO_PRICE_LABEL=`${PRO_PRICE_TEXT}. ${VAT_NOTICE}`;
export const UPGRADE_LABEL=`Passer à Pro — ${PRO_PRICE_TEXT}`;
export const FREE_LIMIT_TEXT=`${FREE_ACTIVE_QUOTES_LIMIT} devis actifs`;
export const PRO_LIMIT_TEXT=`${PRO_ACTIVE_QUOTES_LIMIT} devis actifs`;
export const TRIAL_TEXT=`Essai Pro ${TRIAL_DAYS} jours sans carte bancaire`;

export function activeQuoteLimitFor(proAccess=false){return proAccess?PRO_ACTIVE_QUOTES_LIMIT:FREE_ACTIVE_QUOTES_LIMIT;}
export function monthlyRecurringRevenue(payingCount=0){return Number(payingCount||0)*PRO_MONTHLY_PRICE;}
