-- COURSES
create table public.courses (
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  type         public.course_type not null,
  is_active     boolean default false not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (organization_id, type)
);
comment on table public.courses is 'COURSES AVAILABLE.';
alter table public.courses enable row level security;
revoke update on table public.courses from authenticated, anon;

-- Indexes for faster lookups
create index idx_courses_organization_id on public.courses(organization_id);
create index idx_courses_type on public.courses(type);

-- Courses Policies
create policy "owner_manager_teacher_student_can_see_courses" on public.courses for select to authenticated using (public.authorize('courses.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.read'), ('manager', 'courses.read'), ('teacher', 'courses.read'), ('student', 'courses.read');

create policy "owner_can_create_courses" on public.courses for insert to authenticated with check (public.authorize('courses.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.create');

create policy "owner_manager_can_update_courses" on public.courses for update to authenticated using (public.authorize('courses.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.update'), ('manager', 'courses.update');

create policy "owner_can_delete_courses" on public.courses for delete to authenticated using (public.authorize('courses.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.delete');

-- Generate a default course for each available course type when a new organization is created
create or replace function public.create_default_courses_for_organization()
returns trigger as $$
declare
  course_type public.course_type;
begin
  for course_type in select unnest(enum_range(null::public.course_type)) loop
    insert into public.courses (organization_id, type)
    values (new.id, course_type)
    on conflict (organization_id, type) do nothing;
  end loop;
  return new;
end;
$$ language plpgsql security invoker set search_path = '';
create trigger create_default_courses_for_organization
after insert on public.organizations
for each row execute function public.create_default_courses_for_organization();
