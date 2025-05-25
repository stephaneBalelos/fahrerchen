create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role, postgres;

alter database postgres
set timezone to 'Europe/Berlin';