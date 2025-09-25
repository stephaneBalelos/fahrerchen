-- COURSES
create table public.courses (
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  name          text not null,
  description       text not null,
  type         public.course_type not null,
  is_active     boolean default true not null,
  create_bill_on_subscription  boolean default true not null,
  allow_self_registration  boolean default true not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.courses is 'COURSES AVAILABLE.';
alter table public.courses enable row level security;
revoke update on table public.courses from authenticated, anon;
grant update (name, description, is_active, create_bill_on_subscription, allow_self_registration) on table public.courses to authenticated;

-- Indexes for faster lookups
create index idx_courses_organization_id on public.courses(organization_id);
create index idx_courses_type on public.courses(type);

-- COURSE REQUIRED DOCUMENTS
create table public.course_required_documents (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  name          text not null,
  name_slug     text generated always as (replace(lower(name), ' ', '_')) stored,
  description   text not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_required_documents is 'COURSE REQUIRED DOCUMENTS.';
alter table public.course_required_documents enable row level security;
revoke update on table public.course_required_documents from authenticated, anon;
grant update (name, description) on table public.course_required_documents to authenticated;

-- COURSE COSTS
create table public.course_costs (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  name          text not null,
  description   text not null,
  price        numeric default 0 not null check (price >= 0),
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_costs is 'COURSE COSTS.';
alter table public.course_costs enable row level security;
revoke update on table public.course_costs from authenticated, anon;
grant update (name, description, price) on table public.course_costs to authenticated;

-- Courses Policies
create policy "owner_manager_teacher_student_can_see_courses" on public.courses for select to authenticated using (public.authorize('courses.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.read'), ('manager', 'courses.read'), ('teacher', 'courses.read'), ('student', 'courses.read');

create policy "owner_can_create_courses" on public.courses for insert to authenticated with check (public.authorize('courses.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.create');

create policy "owner_manager_can_update_courses" on public.courses for update to authenticated using (public.authorize('courses.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.update'), ('manager', 'courses.update');

create policy "owner_can_delete_courses" on public.courses for delete to authenticated using (public.authorize('courses.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'courses.delete');

-- Course Required Documents Policies
create policy "owner_manager_teacher_student_can_see_course_required_documents" on public.course_required_documents for select to authenticated using (public.authorize('course_required_documents.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.read'), ('manager', 'course_required_documents.read'), ('teacher', 'course_required_documents.read'), ('student', 'course_required_documents.read');

create policy "owner_can_create_course_required_documents" on public.course_required_documents for insert to authenticated with check (public.authorize('course_required_documents.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.create');

create policy "owner_manager_can_update_course_required_documents" on public.course_required_documents for update to authenticated using (public.authorize('course_required_documents.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.update'), ('manager', 'course_required_documents.update');

create policy "owner_can_delete_course_required_documents" on public.course_required_documents for delete to authenticated using (public.authorize('course_required_documents.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.delete');

-- Course Costs Policies
create policy "owner_manager_teacher_student_can_see_course_costs" on public.course_costs for select to authenticated using (public.authorize('course_costs.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.read'), ('manager', 'course_costs.read'), ('teacher', 'course_costs.read'), ('student', 'course_costs.read');

create policy "owner_can_create_course_costs" on public.course_costs for insert to authenticated with check (public.authorize('course_costs.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.create');

create policy "owner_manager_can_update_course_costs" on public.course_costs for update to authenticated using (public.authorize('course_costs.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.update'), ('manager', 'course_costs.update');

create policy "owner_can_delete_course_costs" on public.course_costs for delete to authenticated using (public.authorize('course_costs.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.delete');


-- check if the course allows self registration
create or replace function public.course_allows_self_registration(course_id uuid)
returns boolean as $$
declare
    course_allows_self_registration boolean;
begin
    select allow_self_registration into course_allows_self_registration from public.courses where id = course_id;
    if course_allows_self_registration is null then
        return false;
    end if;

    return course_allows_self_registration;
end;
$$ language plpgsql security definer set search_path = '';

-- check if the the course should create a bill on subscription
create or replace function public.should_course_create_bill_on_subscription(course_id uuid)
returns boolean as $$
declare
    course_create_bill_on_subscription boolean;
begin
    select create_bill_on_subscription into course_create_bill_on_subscription from public.courses where id = course_id;
    if course_create_bill_on_subscription is null then
        return false;
    end if;

    return course_create_bill_on_subscription;
end;
$$ language plpgsql security definer set search_path = '';

