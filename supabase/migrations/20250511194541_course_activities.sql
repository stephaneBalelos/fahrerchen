-- COURSE ACTIVITIES
create table public.course_activities (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  description   text not null,
  activity_type  public.activity_types not null,
  required     integer default 0 not null check (required >= 0),
  price        numeric default 0 not null check (price >= 0),
  sorting_order  integer default 0 not null check (sorting_order >= 0),
  allow_self_registration boolean default false not null,
  allow_requests boolean default false not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_activities is 'COURSE ACTIVITIES.';
alter table public.course_activities enable row level security;
revoke update on table public.course_activities from authenticated, anon;
grant update (name, description, activity_type, required, price, sorting_order, allow_self_registration, allow_requests) on table public.course_activities to authenticated;

-- COURSE ACTIVITIES POLICIES
create policy "owner_manager_teacher_student_can_see_course_activities" on public.course_activities for select to authenticated using (public.authorize('course_activities.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities.read'), ('manager', 'course_activities.read'), ('teacher', 'course_activities.read'), ('student', 'course_activities.read');

create policy "owner_manager_can_create_course_activities" on public.course_activities for insert to authenticated with check (public.authorize('course_activities.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities.create'), ('manager', 'course_activities.create');

create policy "owner_manager_can_update_course_activities" on public.course_activities for update to authenticated using (public.authorize('course_activities.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities.update'), ('manager', 'course_activities.update');

create policy "owner_can_delete_course_activities" on public.course_activities for delete to authenticated using (public.authorize('course_activities.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities.delete');


-- COURSE ACTIVITIES COMBINATIONS
create table public.course_activities_combinations (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  activity_id    uuid references public.course_activities on delete cascade not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_id, activity_id)
);
comment on table public.course_activities_combinations is 'COURSE ACTIVITIES COMBINATIONS.';
alter table public.course_activities_combinations enable row level security;
revoke update on table public.course_activities_combinations from authenticated, anon;

-- Indexes for faster lookups
create index idx_course_activities_combinations_organization_id on public.course_activities_combinations(organization_id);

-- COURSE ACTIVITIES COMBINATIONS POLICIES
create policy "owner_manager_teacher_student_can_see_course_activities_combinations" on public.course_activities_combinations for select to authenticated using (public.authorize('course_activities_combinations.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.read'), ('manager', 'course_activities_combinations.read'), ('teacher', 'course_activities_combinations.read'), ('student', 'course_activities_combinations.read');

create policy "owner_can_create_course_activities_combinations" on public.course_activities_combinations for insert to authenticated with check (public.authorize('course_activities_combinations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.create');

create policy "owner_can_delete_course_activities_combinations" on public.course_activities_combinations for delete to authenticated using (public.authorize('course_activities_combinations.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.delete');