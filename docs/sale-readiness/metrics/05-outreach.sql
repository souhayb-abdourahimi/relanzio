-- Prospection de Relanzio par mois : D0, J+3, livraisons, bounces, réponses, opt-out (agrégats uniquement).
with real as (select id from public.prospects where email not like 'qa.outreach.safety.%')
select date_trunc('month', e.created_at)::date as month,
  count(*) filter (where e.type='sent' and coalesce((e.metadata->>'sequence_step')::int,0)=0) as d0_sent,
  count(*) filter (where e.type='sent' and (e.metadata->>'sequence_step')::int=1)             as j3_sent,
  count(*) filter (where e.type='sent' and (e.metadata->>'sequence_step')::int>=2)            as step2_or_more_sent_must_be_0,
  count(*) filter (where e.type='delivered')                                                  as delivered,
  count(*) filter (where e.type='bounced')                                                    as bounced,
  count(*) filter (where e.type='replied')                                                    as replied,
  count(*) filter (where e.type='opt_out')                                                    as opt_out
from public.outreach_events e where e.prospect_id in (select id from real)
group by 1 order by 1;

-- Statuts des prospects et des candidats (backlog).
select 'prospect' as kind, status, count(*) from public.prospects where email not like 'qa.outreach.safety.%' group by 2
union all
select 'candidate', status, count(*) from public.outreach_candidates group by 2
order by 1,2;

-- File de la séquence (une étape >= 2 ne doit être que "canceled").
select sequence_step, status, count(*) from public.outreach_queue group by 1,2 order by 1,2;

-- Suivis humains ouverts après une réponse positive.
select status, count(*) from public.sales_followups group by 1;
