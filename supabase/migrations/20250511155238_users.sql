create type public.user_status as enum ('ONLINE', 'OFFLINE');

-- USERS
create table if not exists public.users (
  id          uuid references auth.users on delete cascade not null primary key, -- UUID from auth.users
  email       text not null unique,
  firstname    text,
  lastname    text,
  fullname    text generated always as (coalesce(firstname, '') || ' ' || coalesce(lastname, '')) stored,
  avatar_path  text,
  status      user_status default 'OFFLINE'::public.user_status,
  updated_at timestamp with time zone default now()
);
comment on table public.users is 'Profile data for each user.';
comment on column public.users.id is 'References the internal Supabase Auth user.';
alter table public.users enable row level security;
revoke update on table public.users from authenticated, anon;
grant update (firstname, lastname, avatar_path, updated_at) on table public.users to authenticated;

-- Handle email updates from auth.users
create or replace function public.update_user_email()
returns trigger
language plpgsql
as $$
begin
  update public.users set email = new.email where id = new.id;
  return new;
end;
$$ security definer set search_path = '';
create trigger on_auth_user_email_update
after update of email on auth.users
for each row
execute procedure public.update_user_email();

-- Handle USER UPDATES
create or replace function public.update_user_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ security definer set search_path = '';
create trigger on_user_data_update
before update on public.users
for each row
execute procedure public.update_user_updated_at();

-- Users Policies
create policy "user_can_see_their_own_data" on public.users for select to authenticated using ((select auth.uid()) = id);
create policy "user_can_updated_their_own_data" on public.users for update to authenticated using ((select auth.uid()) = id);
create policy "user_can_insert_their_own_data" on public.users for insert to authenticated with check ((select auth.uid()) = id);
create policy "user_can_delete_their_own_data" on public.users for delete to authenticated using ((select auth.uid()) = id);

-- Handle new user creation
create function public.handle_new_user() 
returns trigger as $$
declare org_id uuid;
declare role_name public.app_role;
begin
  insert into public.users (id, email)
  values (new.id, new.email);

  return new;
end;
$$ language plpgsql security definer set search_path = '';
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('users_avatars', 'users_avatars', true, '{image/*}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB

-- Users Storage Policies
create policy "allow_users_to_see_their_profile_pictures" on storage.objects for select to authenticated using (
  bucket_id = 'users_avatars'
);
create policy "allow_users_to_insert_their_profile_pictures" on storage.objects for insert to authenticated with check (
  bucket_id = 'users_avatars' and (select auth.uid())::text = owner_id
);
create policy "allow_users_to_update_their_profile_pictures" on storage.objects for update to authenticated with check (
  bucket_id = 'users_avatars' and (select auth.uid())::text = owner_id
);
create policy "allow_users_to_delete_their_profile_pictures" on storage.objects for delete to authenticated using (
  bucket_id = 'users_avatars' and (select auth.uid())::text = owner_id
);

-- Add, Update or clear avatar_path in public.users when a new avatar is uploaded or deleted
create or replace function public.handle_user_avatar()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    update public.users set avatar_path = null where avatar_path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    update public.users set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.users set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
end;
$$ language plpgsql security definer set search_path = '';

create trigger "handle_user_avatar_create" after insert on storage.objects
for each row
when (new.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();

create trigger "handle_user_avatar_update" after update on storage.objects
for each row
when (new.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();

create trigger "handle_user_avatar_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();