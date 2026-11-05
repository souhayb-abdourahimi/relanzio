-- Essais Pro (7 jours sans carte) par mois de démarrage et conversion vers un abonnement payant (état actuel du compte).
with real as (
  select * from public.profiles where email not like 'relanzio-cert-%@example.com' and trial_started_at is not null
)
select date_trunc('month', trial_started_at)::date as trial_month,
       count(*)                                                                                          as trials_started,
       count(*) filter (where trial_ends_at > now())                                                     as trials_running,
       count(*) filter (where stripe_subscription_id is not null and subscription_status in ('active','trialing','past_due')) as converted_now_paying,
       round(100.0 * count(*) filter (where stripe_subscription_id is not null and subscription_status in ('active','trialing','past_due'))
             / nullif(count(*) filter (where trial_ends_at <= now()), 0), 1)                            as conversion_pct_of_finished_trials
from real
group by 1 order by 1;
