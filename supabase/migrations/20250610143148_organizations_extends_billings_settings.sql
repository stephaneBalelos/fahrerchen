alter table public.organization_billing_settings
    add column if not exists invoice_title text default '' not null,
    add column if not exists invoice_subtitle text default '',
    add column if not exists invoice_message text default '',
    add column if not exists invoice_footer text default '';
comment on column public.organization_billing_settings.invoice_title is 'Title to be displayed on invoices for the organization.';
comment on column public.organization_billing_settings.invoice_subtitle is 'Subtitle to be displayed on invoices for the organization.';
comment on column public.organization_billing_settings.invoice_message is 'Message to be displayed on invoices for the organization.';
comment on column public.organization_billing_settings.invoice_footer is 'Footer to be displayed on invoices for the organization.';

grant update (invoice_title, invoice_subtitle, invoice_message, invoice_footer) on table public.organization_billing_settings to authenticated;
-- Ensure row-level security is enabled for the new columns

