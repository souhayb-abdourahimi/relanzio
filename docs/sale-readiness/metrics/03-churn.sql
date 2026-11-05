-- Churn mensuel approximatif : résiliations du mois / (abonnés actifs actuels + résiliations du mois).
-- Pour un churn exact par cohorte, utiliser l'export Stripe.
with ended as (
  select date_trunc('month', created_at)::date as month, count(*) as ended
  from public.stripe_webhook_events where event_type='customer.subscription.deleted' group by 1
), paying as (
  select count(*) as n from public.profiles
  where email not like 'relanzio-cert-%@example.com' and plan='pro' and subscription_status in ('active','trialing')
)
select e.month, e.ended, round(100.0 * e.ended / nullif(p.n + e.ended, 0), 1) as churn_pct_approx
from ended e cross join paying p order by e.month;

-- Situation actuelle des abonnements.
select subscription_status, plan, count(*)
from public.profiles where email not like 'relanzio-cert-%@example.com'
group by 1,2 order by 1,2;
