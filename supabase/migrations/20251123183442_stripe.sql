-- ORGANIZATIONS STRIPE ACCOUNTS
create table if not exists public.organizations_stripe_accounts (
  id            uuid references public.organizations on delete restrict not null primary key,
  stripe_account_id  text not null,
  payment_methods    jsonb
);
comment on table public.organizations_stripe_accounts is 'Stripe account data for each organization.';
alter table public.organizations_stripe_accounts enable row level security;
revoke update on table public.organizations_stripe_accounts from authenticated, anon;
grant update (payment_methods) on table public.organizations_stripe_accounts to authenticated;

-- Organizations Stripe Accounts Policies
create policy "members_can_read_their_organizations_stripe_accounts" on public.organizations_stripe_accounts for select to authenticated using (public.authorize('organizations_stripe_accounts.read', id));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organizations_stripe_accounts.read'),
    ('manager', 'organizations_stripe_accounts.read'),
    ('teacher', 'organizations_stripe_accounts.read'),
    ('student', 'organizations_stripe_accounts.read');


create policy "main_owner_can_insert_organizations_stripe_accounts" on public.organizations_stripe_accounts for insert to authenticated with check (public.is_main_owner(id));

create policy "owner_and_manager_can_update_organizations_stripe_accounts" on public.organizations_stripe_accounts for update to authenticated using (public.authorize('organizations_stripe_accounts.update', id));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organizations_stripe_accounts.update'),
    ('manager', 'organizations_stripe_accounts.update');

create policy "main_owner_can_delete_organizations_stripe_accounts" on public.organizations_stripe_accounts for delete to authenticated using (public.is_main_owner(id));


-- Update course_subscription_bills
alter table public.course_subscription_bills add column stripe_payment_intent_id text; -- Stripe Payment Intent ID
grant update (stripe_payment_intent_id) on table public.course_subscription_bills to authenticated;