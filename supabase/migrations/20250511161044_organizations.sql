-- ORGANIZATIONS
create table if not exists public.organizations(
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  -- handle        text not null unique check (handle ~ '^[a-z0-9_]+$'),
  avatar_path    text,
  name          text not null,
  description       text,
  email         text,
  phone_number    text,
  website       text,
  allow_self_registration  boolean default true not null,
  preferred_language    text default 'de' not null,
  address_street  text,
  address_zip    text,
  address_city  text,
  address_country text,
  owner_id      uuid references public.users not null
);
comment on table public.organizations is 'organization data.';
alter table public.organizations enable row level security;
revoke update on table public.organizations from authenticated, anon;
grant update (name, description, avatar_path, email, phone_number, website, address_street, address_zip, address_city, address_country, preferred_language, allow_self_registration) on table public.organizations to authenticated;

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

-- ORGANIZATIONS INVITATIONS
create table if not exists public.organizations_invitations (
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  email         text not null,
  role         app_role not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  status        integer default 0 not null check (status >= 0 and status <= 2), -- 0: pending, 1: accepted, 2: rejected
  unique (email, organization_id) 
);
comment on table public.organizations_invitations is 'Invitations to join an organization.';
alter table public.organizations_invitations enable row level security;
revoke update on table public.organizations_invitations from authenticated, anon;

-- ORGANIZATION MEMBERS
create table if not exists public.organization_members (
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  user_id    uuid references public.users on delete cascade not null,
  role     app_role not null,
  unique (organization_id, user_id)
);
comment on table public.organization_members is 'Members of each organization, users can be in multiple organizations.';
alter table public.organization_members enable row level security;
revoke update on table public.organization_members from authenticated, anon;
grant update (role) on table public.organization_members to authenticated;


-- Helpers Functions
-- Check if the user is the main owner of the organization
create or replace function is_main_owner(
  org_id uuid
)
returns boolean as $$
declare
  owner uuid;
begin
  select owner_id into owner from public.organizations where id = org_id;

  return owner = auth.uid();
end;
$$ language plpgsql security definer set search_path = public;

-- 2 users are in the same organization
create or replace function public.are_users_in_same_organization(
  user_id_1 uuid,
  user_id_2 uuid
)
returns boolean as $$
declare
  org_id_1 uuid;
  org_id_2 uuid;
begin

  return exists (select 1 from organization_members member_1 join organization_members member_2 on member_1.organization_id = member_2.organization_id
  where member_1.user_id = user_id_1 and member_2.user_id = user_id_2); 
end;
$$ language plpgsql security definer set search_path = public;

-- Check if the user has the requested permission
-- This function checks if the user has the requested permission for the given organization.
create or replace function public.authorize(
    requested_permission app_permission,
    org_id uuid
)
returns boolean as $$
declare
    is_user_main_owner boolean;
    bind_permissions int;
    user_role public.app_role;
    owner uuid;
begin
    -- Check if the user is the main owner of the organization
    is_user_main_owner := public.is_main_owner(org_id);

    if is_user_main_owner then
        return true;
    end if;

    -- Fetch user role once and store it to reduce number of calls
    select role into user_role from public.organization_members where organization_id = org_id and user_id = auth.uid() limit 1;

    if user_role is null then
        return false;
    end if;

    select count(*)
    into bind_permissions
    from public.role_permissions
    where role_permissions.permission = requested_permission
        and role_permissions.role = user_role;

    return bind_permissions > 0;
end;
$$ language plpgsql security definer set search_path = public;

-- 2 users are in the same organization
create or replace function public.are_users_in_same_organization(
  user_id_1 uuid,
  user_id_2 uuid
)
returns boolean as $$
declare
  org_id_1 uuid;
  org_id_2 uuid;
begin

  return exists (select 1 from organization_members member_1 join organization_members member_2 on member_1.organization_id = member_2.organization_id
  where member_1.user_id = user_id_1 and member_2.user_id = user_id_2); 
end;
$$ language plpgsql security definer set search_path = public;



-- Organizations Policies
create policy "Everyone can see organizations avatars" on storage.objects for select to authenticated, anon using (true);

create policy "members_can_read_their_organizations" on public.organizations for select to authenticated, anon using (public.authorize('organizations.read', id));
insert into public.role_permissions
    (role, permission) 
values 
    ('owner', 'organizations.read'),
    ('manager', 'organizations.read'),
    ('teacher', 'organizations.read'),
    ('student', 'organizations.read');

create policy "owner_and_manager_can_updated_their_organizations" on public.organizations for update to authenticated using ((public.authorize('organizations.update', id)));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organizations.update'),
    ('manager', 'organizations.update');

create policy "user_can_insert_organizations_only_if_they_are_main_owner" on public.organizations for insert to authenticated with check (auth.uid() = owner_id);

create policy "main_owner_can_delete_organizations" on public.organizations for delete to authenticated using (public.is_main_owner(id));

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

-- Organizations Members Policies
create policy "members_can_read_their_organizations_memberships" on public.organization_members for select to authenticated using (public.authorize('organization_members.read', organization_id));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organization_members.read'),
    ('manager', 'organization_members.read'),
    ('teacher', 'organization_members.read'),
    ('student', 'organization_members.read');

create policy "owners_can_update_organizations_memberships" on public.organization_members for update to authenticated using (public.authorize('organization_members.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'organization_members.update');

create policy "owner_can_delete_organizations_memberships" on public.organization_members for delete to authenticated using (public.authorize('organization_members.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'organization_members.delete');

create policy "users_can_insert_their_own_membership" on public.organization_members for insert to authenticated with check (user_id = auth.uid());

create policy "users_can_update_their_own_membership" on public.organization_members for update to authenticated using (user_id = auth.uid());

create policy "users_can_delete_their_own_membership" on public.organization_members for delete to authenticated using (user_id = auth.uid());

-- Organizations Invitations Policies
create policy "owners_and_manager_can_read_organizations_invitations" on public.organizations_invitations for select to authenticated using (public.authorize('organization_invitations.read', organization_id));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organization_invitations.read'),
    ('manager', 'organization_invitations.read');

create policy "owners_can_insert_organizations_invitations" on public.organizations_invitations for insert to authenticated with check (public.authorize('organization_invitations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'organization_invitations.create');

create policy "owners_and_manager_can_delete_organizations_invitations" on public.organizations_invitations for delete to authenticated using (public.authorize('organization_invitations.delete', organization_id));
insert into public.role_permissions
    (role, permission)
values 
    ('owner', 'organization_invitations.delete'),
    ('manager', 'organization_invitations.delete');


-- When a new organization is created, we want to automatically add the owner as a member with the role 'owner'.
create or replace function public.handle_new_organization() 
returns trigger as $$
declare org_id uuid;
begin

  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.owner_id, 'owner');

  return new;
end;
$$ language plpgsql security invoker set search_path = public;
-- trigger the function every time a Org is created
create trigger on_org_created
  after insert on public.organizations
  for each row execute procedure public.handle_new_organization();

-- Handle New Invitations
create or replace function public.handle_new_invitation()
returns trigger as $$
declare
  payload jsonb;
  invited_user_id uuid;
begin

  -- check if user already exists
  select id into invited_user_id from public.users where email = new.email;

  -- if user exist, check if the user is already a member of the organization
  if invited_user_id is not null then
    if exists (select 1 from public.organization_members where user_id = invited_user_id and organization_id = new.organization_id) then
      raise exception 'User is already a member of the organization';
    end if;
  end if;

  return new;

end;
$$ language plpgsql security invoker set search_path = public;
create or replace trigger new_invitation_webhook
  after insert on public.organizations_invitations
  for each row execute function public.handle_new_invitation();


    -- Organisations Profile Pictures
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('organizations_avatars', 'organizations_avatars', true, '{image/*}', 1 * 1024 * 1024) on conflict (id) do nothing; -- 1MB

-- Add, Update or clear avatar_path in public.organizations when a new avatar is uploaded or deleted
create or replace function public.handle_organization_avatar()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    update public.organizations set avatar_path = null where avatar_path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    update public.organizations set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.organizations set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
end;
$$ language plpgsql security invoker;

create trigger "handle_organization_avatar_create" after insert on storage.objects
for each row
when (new.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();

create trigger "handle_organization_avatar_update" after update on storage.objects
for each row
when (new.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();

create trigger "handle_organization_avatar_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();