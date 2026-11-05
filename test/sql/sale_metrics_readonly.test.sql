-- The sale-readiness metrics queries run on the real schema, inside a read-only transaction (any write would fail).
\set ON_ERROR_STOP on
\o /dev/null
begin transaction read only;
\i docs/sale-readiness/metrics/01-revenue.sql
\i docs/sale-readiness/metrics/02-trials.sql
\i docs/sale-readiness/metrics/03-churn.sql
\i docs/sale-readiness/metrics/04-usage.sql
\i docs/sale-readiness/metrics/05-outreach.sql
\i docs/sale-readiness/metrics/06-deliverability.sql
rollback;
\o
