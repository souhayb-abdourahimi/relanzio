-- Délivrabilité des relances envoyées par Relanzio pour les artisans, par mois.
with real as (select id from public.profiles where email not like 'relanzio-cert-%@example.com')
select date_trunc('month', coalesce(sent_at, created_at))::date as month,
  count(*) filter (where status in ('sent','delivered','opened','clicked','bounced'))                    as sent,
  count(*) filter (where status in ('delivered','opened','clicked'))                                    as delivered_or_better,
  count(*) filter (where status='bounced')                                                              as bounced,
  round(100.0*count(*) filter (where status='bounced')/nullif(count(*) filter (where status in ('sent','delivered','opened','clicked','bounced')),0),2) as bounce_pct
from public.followups where channel='relanzio' and user_id in (select id from real)
group by 1 order by 1;

-- Adresses en liste de suppression par raison (aucune adresse affichée).
select reason, count(*) from public.suppressions group by 1 order by 2 desc;
