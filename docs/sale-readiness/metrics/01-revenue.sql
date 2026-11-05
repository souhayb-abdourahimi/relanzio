-- Clients payants et revenu récurrent estimé (état actuel). Lecture seule.
with real as (
  select * from public.profiles where email not like 'relanzio-cert-%@example.com'
)
select
  count(*) filter (where plan='pro' and subscription_status in ('active','trialing'))                as paying_customers,
  count(*) filter (where plan='pro' and subscription_status='past_due')                              as past_due_customers,
  count(*) filter (where plan='pro' and subscription_status in ('active','trialing')) * 29           as mrr_eur_estimate,
  count(*) filter (where plan='pro' and subscription_status in ('active','trialing')) * 29 * 12      as arr_eur_estimate,
  29                                                                                                 as arpu_eur_per_paying_customer
from real;

-- Nouveaux abonnements et résiliations par mois (événements Stripe reçus).
select date_trunc('month', created_at)::date as month,
       count(*) filter (where event_type='checkout.session.completed')     as checkouts_completed,
       count(*) filter (where event_type='invoice.paid')                   as invoices_paid,
       count(*) filter (where event_type='invoice.payment_failed')         as payments_failed,
       count(*) filter (where event_type='customer.subscription.deleted')  as subscriptions_ended
from public.stripe_webhook_events
group by 1 order by 1;
