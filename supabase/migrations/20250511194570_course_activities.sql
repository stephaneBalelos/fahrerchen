-- COURSE ACTIVITIES
create table public.course_activities (
  id            uuid default uuid_generate_v4(),
  name          text not null,
  description   text not null,
  activity_type  public.activity_types not null,
  required     integer default 0 not null check (required >= 0),
  price        numeric default 0 not null check (price >= 0),
  sorting_order  integer default 0 not null check (sorting_order >= 0),
  allow_self_registration boolean default false not null,
  allow_requests boolean default false not null,
  inserted_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  duration_minutes int default 45 not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  primary key (organization_id, id)
);
comment on table public.course_activities is 'COURSE ACTIVITIES.';
alter table public.course_activities enable row level security;
revoke update on table public.course_activities from authenticated, anon;
grant update (name, description, activity_type, required, price, sorting_order, allow_self_registration, allow_requests, duration_minutes, updated_at) on table public.course_activities to authenticated;

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
  id            uuid default uuid_generate_v4(),
  course_id    uuid not null,
  activity_id    uuid not null,
  price        numeric default null check (price >= 0),
  required     integer default null check (required >= 0),
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_id, activity_id),
  primary key (organization_id, id),
  foreign key (organization_id, course_id) references public.courses(organization_id, id) on delete cascade,
  foreign key (organization_id, activity_id) references public.course_activities(organization_id, id) on delete cascade
);
comment on table public.course_activities_combinations is 'COURSE ACTIVITIES COMBINATIONS.';
alter table public.course_activities_combinations enable row level security;
revoke update on table public.course_activities_combinations from authenticated, anon;
grant update (price, required) on table public.course_activities_combinations to authenticated;

-- Indexes for faster lookups
create index idx_course_activities_combinations_organization_id on public.course_activities_combinations(organization_id);

-- COURSE ACTIVITIES COMBINATIONS POLICIES
create policy "owner_manager_teacher_student_can_see_course_activities_combinations" on public.course_activities_combinations for select to authenticated using (public.authorize('course_activities_combinations.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.read'), ('manager', 'course_activities_combinations.read'), ('teacher', 'course_activities_combinations.read'), ('student', 'course_activities_combinations.read');

create policy "owner_can_create_course_activities_combinations" on public.course_activities_combinations for insert to authenticated with check (public.authorize('course_activities_combinations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.create');

create policy "owner_manager_can_update_course_activities_combinations" on public.course_activities_combinations for update to authenticated using (public.authorize('course_activities_combinations.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.update'), ('manager', 'course_activities_combinations.update');

create policy "owner_can_delete_course_activities_combinations" on public.course_activities_combinations for delete to authenticated using (public.authorize('course_activities_combinations.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.delete');


-- Trigger to populate allowed courses when a new activity is created
create or replace function public.populate_allowed_courses_on_activity_insert() returns trigger as $$
declare
  org_id uuid;
begin
    -- Get all active courses in the same organization as the new activity
    select organization_id into org_id from public.course_activities where id = new.id;
    if org_id is null then
        raise exception 'Activity not found' using errcode = 'P0002';
    end if;

    -- Insert combinations for all active courses
    insert into public.course_activities_combinations (course_id, activity_id, organization_id)
    select c.id, new.id, org_id
    from public.courses c
    where c.organization_id = org_id and c.is_active = true;

    return new;
end 
$$ language plpgsql security invoker set search_path = '';

create trigger trg_populate_allowed_courses_on_activity_insert
after insert on public.course_activities
for each row
execute function public.populate_allowed_courses_on_activity_insert();


-- Activities Recurrence Rules
create table public.activity_recurrence_rules (
  id            uuid default uuid_generate_v4(),
  activity_id    uuid not null,
  rrule         text not null, -- iCal RRULE format
  is_valid     boolean default true not null, -- Indicates if the recurrence rule is valid, will be set to false if parsing fails when trying to generate occurrences
  organization_id    uuid references public.organizations on delete cascade not null,
  inserted_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (activity_id, rrule),
  primary key (organization_id, id),
  foreign key (organization_id, activity_id) references public.course_activities(organization_id, id) on delete cascade
);
comment on table public.activity_recurrence_rules is 'Recurrence rules for course activities.';
alter table public.activity_recurrence_rules enable row level security;
revoke update on table public.activity_recurrence_rules from authenticated, anon;
grant update (rrule, updated_at) on table public.activity_recurrence_rules to authenticated;


-- ACTIVITY RECURRENCE RULES POLICIES
create policy "owner_manager_teacher_student_can_see_activity_recurrence_rules" on public.activity_recurrence_rules for select to authenticated using (public.authorize('course_activities_recurrence_rules.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_recurrence_rules.read'), ('manager', 'course_activities_recurrence_rules.read'), ('teacher', 'course_activities_recurrence_rules.read'), ('student', 'course_activities_recurrence_rules.read');

create policy "owner_manager_can_create_activity_recurrence_rules" on public.activity_recurrence_rules for insert to authenticated with check (public.authorize('course_activities_recurrence_rules.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_recurrence_rules.create'), ('manager', 'course_activities_recurrence_rules.create');

create policy "owner_manager_can_update_activity_recurrence_rules" on public.activity_recurrence_rules for update to authenticated using (public.authorize('course_activities_recurrence_rules.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_recurrence_rules.update'), ('manager', 'course_activities_recurrence_rules.update');

create policy "owner_manager_can_delete_activity_recurrence_rules" on public.activity_recurrence_rules for delete to authenticated using (public.authorize('course_activities_recurrence_rules.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_recurrence_rules.delete'), ('manager', 'course_activities_recurrence_rules.delete');

-- Call Edge Function to extend occurrences when a recurrence rule is created
create or replace function public.extend_activity_schedules_occurrences() returns trigger as $$
begin
  perform private.call_edge_function(
    'extend-activity-schedules-occurences',
    jsonb_build_object(
      'recurrence_rule_id', new.id
    )
  );
  return new;
end;
$$ language plpgsql security invoker set search_path = '';

create trigger trg_extend_activity_schedules_occurrences
after insert on public.activity_recurrence_rules
for each row
execute function public.extend_activity_schedules_occurrences();

-- Set Cron Job every day at 2 AM to extend activity schedules occurrences if the last linked occurrence is within 1 Month
create or replace function extend_activity_schedules_occurrences_job()
returns void as $$
declare
  rec record;
begin
  -- Loop through all active recurrence rules
  for rec in
    select arr.id
    from public.activity_recurrence_rules arr
    join public.course_activities ca on ca.id = arr.activity_id
    where arr.is_valid = true
  loop
    -- Call Edge Function to extend occurrences
    perform private.call_edge_function(
      'extend-activity-schedules-occurences',
      jsonb_build_object(
        'recurrence_rule_id', rec.id
      )
    );
  end loop;
end;
$$ language plpgsql security definer set search_path = '';

select
  cron.schedule(
    'extend_activity_schedules_occurrences_job',
    '0 1 * * *', -- Every day at 1 AM
    $$ select extend_activity_schedules_occurrences_job(); $$
  );



