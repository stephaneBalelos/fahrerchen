create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role, postgres;

create extension if not exists "unaccent" with schema private;

create or replace function public.slugify("value" text)
returns text as $$
-- removes accents (diacritic signs) from a given string --
    with "unaccented" as (
        select private.unaccent("value") as "value"
    ),
-- lowercases the string
    "lowercase" as (
        select lower("value") as "value"
        from "unaccented"
    ),
-- remove single and double quotes
    "removed_quotes" as (
        select regexp_replace("value", '[''"]+', '', 'gi') as "value"
        from "lowercase"
    ),
-- replaces anything that's not a letter, number, or hyphen('-') with a hyphen('-')
    "hyphenated" as (
        select regexp_replace("value", '[^a-z0-9\-]+', '-', 'gi') as "value"
        from "removed_quotes"
    ),
-- trims hyphens('-') if they exist on the head or tail of the string
    "trimmed" as (
        select regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') as "value"
        from "hyphenated"
    )
    select "value" from "trimmed";
$$ language sql strict immutable set search_path = '';