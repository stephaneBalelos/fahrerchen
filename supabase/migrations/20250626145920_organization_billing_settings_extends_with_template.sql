-- Extends the organization_billing_settings table with a template_name
-- to allow for different billing templates per organization.
-- Add template_name column to organization_billing_settings table
-- and set default value to 'default'.
-- template_name is a varchar(255) field. should not be null.
-- template_name should not contain any special characters. only alphanumeric characters, underscores are allowed. 
alter table public.organization_billing_settings
    add column template_name varchar(255) not null default 'default' check (template_name ~ '^[a-zA-Z0-9_]+$');

-- Update existing rows to set template_name to 'default'
update public.organization_billing_settings
    set template_name = 'default'
    where template_name is null;

-- grant update privileges on the new column to authenticated users
grant update (template_name) on table public.organization_billing_settings to authenticated;