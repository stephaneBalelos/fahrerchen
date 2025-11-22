-- COURSE COSTS
create table public.course_costs (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  description   text not null,
  price        numeric default 0 not null check (price >= 0),
  inserted_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_costs is 'COURSE COSTS.';
alter table public.course_costs enable row level security;
revoke update on table public.course_costs from authenticated, anon;
grant update (name, description, price) on table public.course_costs to authenticated;

-- Course Costs Policies
create policy "owner_manager_teacher_student_can_see_course_costs" on public.course_costs for select to authenticated using (public.authorize('course_costs.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.read'), ('manager', 'course_costs.read'), ('teacher', 'course_costs.read'), ('student', 'course_costs.read');

create policy "owner_can_create_course_costs" on public.course_costs for insert to authenticated with check (public.authorize('course_costs.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.create');

create policy "owner_manager_can_update_course_costs" on public.course_costs for update to authenticated using (public.authorize('course_costs.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.update'), ('manager', 'course_costs.update');

create policy "owner_can_delete_course_costs" on public.course_costs for delete to authenticated using (public.authorize('course_costs.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.delete');

-- Indexes for faster lookups
create index idx_course_costs_organization_id on public.course_costs(organization_id);


-- Course Costs Combinations
create table public.course_costs_combinations (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  cost_id      uuid references public.course_costs on delete cascade not null,
  price        numeric default null check (price >= 0),
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_id, cost_id)
);
comment on table public.course_costs_combinations is 'COURSE COSTS COMBINATIONS.';
alter table public.course_costs_combinations enable row level security;
revoke update on table public.course_costs_combinations from authenticated, anon;
grant update (price) on table public.course_costs_combinations to authenticated;

-- Indexes for faster lookups
create index idx_course_costs_combinations_organization_id on public.course_costs_combinations(organization_id);

-- COURSE COSTS COMBINATIONS POLICIES
create policy "owner_manager_teacher_student_can_see_course_costs_combinations" on public.course_costs_combinations for select to authenticated using (public.authorize('course_costs_combinations.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs_combinations.read'), ('manager', 'course_costs_combinations.read'), ('teacher', 'course_costs_combinations.read'), ('student', 'course_costs_combinations.read');

create policy "owner_manager_can_update_course_costs_combinations" on public.course_costs_combinations for update to authenticated using (public.authorize('course_costs_combinations.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs_combinations.update'), ('manager', 'course_costs_combinations.update');

create policy "owner_can_create_course_costs_combinations" on public.course_costs_combinations for insert to authenticated with check (public.authorize('course_costs_combinations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs_combinations.create');

create policy "owner_can_delete_course_costs_combinations" on public.course_costs_combinations for delete to authenticated using (public.authorize('course_costs_combinations.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs_combinations.delete');


