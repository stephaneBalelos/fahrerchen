-- COURSE ACTIVITY SCHEDULES
create table public.course_activity_schedules (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  activity_id    uuid references public.course_activities on delete cascade not null,
  assigned_to   uuid references public.users on delete set null,
  organization_id    uuid references public.organizations on delete cascade not null,
  status        public.schedule_status default 'PLANNED'::public.schedule_status not null,
  start_at     timestamp with time zone not null,
  end_at       timestamp with time zone not null,
  attendees     uuid[] default '{}'::uuid[] not null -- should be an array of unique subscription ids
);
comment on table public.course_activity_schedules is 'ACTIVITY SCHEDULES.';
alter table public.course_activity_schedules enable row level security;
revoke update on table public.course_activity_schedules from authenticated, anon;
revoke insert (attendees, status) on table public.course_activity_schedules from authenticated, anon; -- prevent direct insert of attendees, use the function "add_attendee_to_schedule"
grant update (assigned_to, status, start_at, end_at, attendees) on table public.course_activity_schedules to authenticated;

-- check if schedule is COMPLETED or CANCELED
create or replace function public.is_schedule_active(
  schedule_id uuid
)
returns boolean as $$
declare s_status public.schedule_status;
begin
  select status into s_status from public.course_activity_schedules where id = schedule_id;
  if s_status = 'COMPLETED' or s_status = 'CANCELED' then
    return false;
  end if;
  return true;
end;
$$ language plpgsql security definer set search_path = public;

-- COURSE ACTIVITY SCHEDULES POLICIES
create policy "owner_manager_teacher_student_can_see_course_activity_schedules" on public.course_activity_schedules for select to authenticated using (public.authorize('course_activity_schedules.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.read'), ('manager', 'course_activity_schedules.read'), ('teacher', 'course_activity_schedules.read'), ('student', 'course_activity_schedules.read');

create policy "owner_manager_teacher_can_create_course_activity_schedules" on public.course_activity_schedules for insert to authenticated with check (public.authorize('course_activity_schedules.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.create'), ('manager', 'course_activity_schedules.create'), ('teacher', 'course_activity_schedules.create');

create policy "owner_manager_teacher_can_update_course_activity_schedules" on public.course_activity_schedules for update to authenticated using (public.authorize('course_activity_schedules.update', organization_id) and public.is_schedule_active(id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.update'), ('manager', 'course_activity_schedules.update'), ('teacher', 'course_activity_schedules.update');

create policy "owner_manager_teacher_can_delete_course_activity_schedules" on public.course_activity_schedules for delete to authenticated using (public.authorize('course_activity_schedules.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.delete'), ('manager', 'course_activity_schedules.delete'), ('teacher', 'course_activity_schedules.delete');


-- Add an attendee to schedule
create or replace function public.add_attendee_to_schedule(
  course_schedule_id uuid,
  course_subscription_id uuid
)
returns boolean as $$
declare
  schedule_attendees uuid[];
begin

  select attendees into schedule_attendees from public.course_activity_schedules where id = course_schedule_id;

  -- Check if the subscription is active
  if not public.is_subscription_active(course_subscription_id) then
    raise exception 'Subscription is not active';
  end if;

  -- Check if the course_subscription_id is already in the attendees
  if course_subscription_id = any(schedule_attendees) then
    raise exception 'Subscription is already in the attendees';
  end if;

  -- Check if the schedule is active
  if not public.is_schedule_active(course_schedule_id) then
    raise exception 'Schedule is not active';
  end if;

  update public.course_activity_schedules
  set attendees = array_append(attendees, course_subscription_id)
  where id = course_schedule_id;

  return true;
end;
$$ language plpgsql security invoker set search_path = public;

-- Remove an attendee from schedule
create or replace function public.remove_attendee_from_schedule(
  course_schedule_id uuid,
  course_subscription_id uuid
)
returns boolean as $$
declare
  schedule_attendees uuid[];
begin
  select attendees into schedule_attendees from public.course_activity_schedules where id = course_schedule_id;

  -- Check if the subscription is active
  if not public.is_subscription_active(course_subscription_id) then
    raise exception 'Subscription is not active';
  end if;

  -- Check if the course_subscription_id is already in the attendees
  if not course_subscription_id = any(schedule_attendees) then
    raise exception 'Subscription is not in the attendees';
  end if;

  -- Check if the schedule is active
  if not public.is_schedule_active(course_schedule_id) then
    raise exception 'Schedule is not active';
  end if;

  update public.course_activity_schedules
  set attendees = array_remove(attendees, course_subscription_id)
  where id = course_schedule_id;

  return true;
end;
$$ language plpgsql security invoker set search_path = public;


