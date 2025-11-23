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
    invoice_title text default '' not null,
    invoice_subtitle text default '',
    invoice_message text default '',
    invoice_footer text default '',
    template_name varchar(255) not null default 'default' check (template_name ~ '^[a-zA-Z0-9_]+$'),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    auto_generate_invoices boolean default false not null -- Whether to automatically generate invoices for this organization
);
comment on table public.organization_billing_settings is 'Stores billing settings for each organization, including VAT rates and bank account details.';
alter table public.organization_billing_settings enable row level security;
revoke update on table public.organization_billing_settings from authenticated, anon;
grant update (id, vat_rate, vat_exempt, bank_account_name, bank_account_number, bank_account_iban, bank_account_bic, tax_id, invoice_title, invoice_subtitle, invoice_message, invoice_footer, template_name, auto_generate_invoices) on table public.organization_billing_settings to authenticated;

alter type public.app_permission add value if not exists 'organization_billing_settings.read';
alter type public.app_permission add value if not exists 'organization_billing_settings.create';
alter type public.app_permission add value if not exists 'organization_billing_settings.update';
alter type public.app_permission add value if not exists 'organization_billing_settings.delete';

-- Job for generating bill for subscriptions if auto_generate_invoices is true
create or replace function generate_invoices_for_organizations()
returns void as $$
declare
    sub_record record;
begin
    -- Loop through all active subscriptions
    for sub_record in
        select s.id, s.organization_id, obs.auto_generate_invoices
        from public.subscriptions s
        join public.organization_billing_settings obs on s.organization_id = obs.id
        where public.is_subscription_active(s.id) and obs.auto_generate_invoices = true
    loop
        -- Call the invoice generation function (assumed to exist)
        perform public.generate_bill_for_subscription(sub_record.id);
    end loop;
end;
$$ language plpgsql security definer set search_path = '';

-- Add permissions for the organization_billing_settings table
create policy "members_can_read_organization_billing_settings" on public.organization_billing_settings 
    for select to authenticated using (public.authorize('organization_billing_settings.read', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.read'),
           ('manager', 'organization_billing_settings.read'),
           ('teacher', 'organization_billing_settings.read'),
           ('student', 'organization_billing_settings.read');

create policy "owner_can_create_organization_billing_settings" on public.organization_billing_settings
    for insert to authenticated with check (public.authorize('organization_billing_settings.create', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.create');

create policy "owner_can_update_organization_billing_settings" on public.organization_billing_settings
    for update to authenticated using (public.authorize('organization_billing_settings.update', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.update');

create policy "owner_can_delete_organization_billing_settings" on public.organization_billing_settings
    for delete to authenticated using (public.authorize('organization_billing_settings.delete', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.delete');

-- Schedule the invoice generation function to run every month at 2 AM on the 1st day of the month
select cron.schedule(
    'Generate Invoices for Organizations',
    '0 2 1 * *',
    $$ select generate_invoices_for_organizations(); $$
);