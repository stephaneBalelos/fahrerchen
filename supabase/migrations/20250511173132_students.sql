-- STUDENTS
create table public.students (
  id          uuid default uuid_generate_v4(),
  email       text not null unique,
  firstname    text not null,
  lastname    text not null,
  full_name   text generated always as (firstname || ' '::text || lastname) stored,
  avatar_path    text,
  birth_date   date not null,
  phone_number  text,
  address_street  text,
  address_zip    text,
  address_city  text,
  address_country text,
  has_a_license  boolean default false not null,
  user_id      uuid references public.users,
  organization_id    uuid references public.organizations on delete cascade not null,
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, organization_id),
  unique (email, organization_id),
  primary key (organization_id, id)
);
comment on table public.students is 'Profile data for each student.';
alter table public.students enable row level security;
revoke update on table public.students from authenticated, anon;
grant update (email, firstname, lastname, avatar_path, birth_date, phone_number, address_street, address_zip, address_city, address_country, has_a_license) on table public.students to authenticated;

-- Indexes for faster lookups
create index idx_students_organization_id on public.students(organization_id);
create index idx_students_user_id on public.students(user_id);


-- Students Policies
create policy "students_can_see_their_own_data" on public.students for select to authenticated using ((select auth.uid()) = user_id);

create policy "owner_manager_teacher_can_see_students" on public.students for select to authenticated using (public.authorize('students.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students.read'), ('manager', 'students.read'), ('teacher', 'students.read');

create policy "student_can_update_their_own_data" on public.students for update to authenticated using ((select auth.uid()) = user_id) with check (public.authorize('students.update', organization_id));
insert into public.role_permissions (role, permission) values ('student', 'students.update');

create policy "students_can_create_their_own_data" on public.students for insert to authenticated with check (public.authorize('students.create', organization_id) and (select auth.uid()) = user_id);
insert into public.role_permissions (role, permission) values ('student', 'students.create');

create policy "owner_manager_can_create_students" on public.students for insert to authenticated with check (public.authorize('students.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students.create'), ('manager', 'students.create');

create policy "owner_manager_can_update_students" on public.students for update to authenticated using (public.authorize('students.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students.update'), ('manager', 'students.update');

create policy "owner_can_delete_students" on public.students for delete to authenticated using (public.authorize('students.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students.delete');

    -- Student Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('student_documents', 'student_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB