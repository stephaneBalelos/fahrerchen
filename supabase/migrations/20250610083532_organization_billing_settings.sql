-- Organization billing settings table
-- This table stores the billing settings for each organization, including VAT rates and other billing-related configurations.
-- It is used to manage how billing is handled for different organizations, especially in relation to VAT compliance.
create table if not exists public.organization_billing_settings (
    id uuid references public.organizations on delete cascade not null primary key,
    vat_rate numeric(5, 2) default 19.0 not null,
    vat_exempt boolean default false not null,
    bank_account_name text not null,
    bank_account_number text not null,
    bank_account_iban text not null,
    bank_account_bic text not null,
    tax_id text not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);
comment on table public.organization_billing_settings is 'Stores billing settings for each organization, including VAT rates and bank account details.';
alter table public.organization_billing_settings enable row level security;
revoke update on table public.organizations from authenticated, anon;
grant update (vat_rate, vat_exempt, bank_account_name, bank_account_number, bank_account_iban, bank_account_bic, tax_id) on table public.organization_billing_settings to authenticated;

alter type public.app_permission add value if not exists 'organization_billing_settings.read';
alter type public.app_permission add value if not exists 'organization_billing_settings.create';
alter type public.app_permission add value if not exists 'organization_billing_settings.update';
alter type public.app_permission add value if not exists 'organization_billing_settings.delete';




