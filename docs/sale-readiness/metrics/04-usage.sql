-- Utilisateurs et activité.
with real as (select id, created_at from public.profiles where email not like 'relanzio-cert-%@example.com')
select (select count(*) from real)                                                                     as users_total,
       (select count(distinct user_id) from public.product_events where created_at > now()-interval '7 days'
          and user_id in (select id from real))                                                          as active_users_7d,
       (select count(distinct user_id) from public.product_events where created_at > now()-interval '30 days'
          and user_id in (select id from real))                                                          as active_users_30d;

-- Inscriptions, devis, relances, réponses et devis gagnés par mois.
with real as (select id from public.profiles where email not like 'relanzio-cert-%@example.com'),
months as (select generate_series(date_trunc('month', (select min(created_at) from public.profiles)), date_trunc('month', now()), interval '1 month')::date as month)
select m.month,
  (select count(*) from public.profiles p where p.id in (select id from real) and date_trunc('month',p.created_at)=m.month)            as signups,
  (select count(*) from public.quotes q where q.user_id in (select id from real) and date_trunc('month',q.created_at)=m.month)         as quotes_created,
  (select count(*) from public.followups f where f.user_id in (select id from real) and f.status in ('sent','delivered','opened','clicked','bounced')
     and date_trunc('month',coalesce(f.sent_at,f.created_at))=m.month)                                                                 as followups_done,
  (select count(*) from public.followups f where f.user_id in (select id from real) and f.channel='relanzio' and f.status in ('sent','delivered','opened','clicked','bounced')
     and date_trunc('month',coalesce(f.sent_at,f.created_at))=m.month)                                                                 as followups_sent_by_relanzio,
  (select count(*) from public.quote_replies r where r.user_id in (select id from real) and r.effect='stop' and date_trunc('month',r.received_at)=m.month) as client_replies,
  (select count(*) from public.quotes q where q.user_id in (select id from real) and q.status='won' and date_trunc('month',q.won_at)=m.month)            as quotes_won,
  (select coalesce(sum(q.amount),0) from public.quotes q where q.user_id in (select id from real) and q.status='won' and date_trunc('month',q.won_at)=m.month) as won_amount_eur
from months m order by m.month;

-- Taux de relance : part des devis ayant reçu au moins une relance ; part des devis relancés ayant obtenu une réponse.
with real as (select id from public.profiles where email not like 'relanzio-cert-%@example.com'),
q as (select q.id, q.followup_step, q.reply_received_at, q.status from public.quotes q where q.user_id in (select id from real))
select count(*)                                                                  as quotes_total,
       round(100.0*count(*) filter (where followup_step>0)/nullif(count(*),0),1) as pct_quotes_followed_up,
       round(100.0*count(*) filter (where followup_step>0 and reply_received_at is not null)
             /nullif(count(*) filter (where followup_step>0),0),1)              as pct_followed_up_with_reply,
       round(100.0*count(*) filter (where status='won')/nullif(count(*) filter (where status in ('won','lost')),0),1) as win_rate_pct_of_decided
from q;
