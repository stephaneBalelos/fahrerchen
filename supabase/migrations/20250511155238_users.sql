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

-- -- Handle USER UPDATES
create or replace function public.update_user_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger on_user_data_update
before update on public.users
for each row
execute procedure public.update_user_updated_at();

-- Users Policies
create policy "user_can_see_their_own_data" on public.users for select to authenticated using (auth.uid() = id);
create policy "user_can_updated_their_own_data" on public.users for update to authenticated using (auth.uid() = id);
create policy "user_can_insert_their_own_data" on public.users for insert to authenticated with check (auth.uid() = id);
create policy "user_can_delete_their_own_data" on public.users for delete to authenticated using (auth.uid() = id);

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
$$ language plpgsql security definer set search_path = auth, public;
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('users_avatars', 'users_avatars', true, '{image/*}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB


