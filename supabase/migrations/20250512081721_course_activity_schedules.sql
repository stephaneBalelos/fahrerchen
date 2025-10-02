-- COURSE ACTIVITY SCHEDULES
create table public.course_activity_schedules (
  id            uuid default uuid_generate_v4() primary key,
  activity_id    uuid references public.course_activities on delete cascade not null,
  assigned_to   uuid references public.users on delete set null,
  organization_id    uuid references public.organizations on delete cascade not null,
  status        public.schedule_status default 'PLANNED'::public.schedule_status not null,
  start_at     timestamp with time zone not null,
  duration_minutes int not null
);
comment on table public.course_activity_schedules is 'ACTIVITY SCHEDULES.';
alter table public.course_activity_schedules enable row level security;
revoke update on table public.course_activity_schedules from authenticated, anon;
grant update (assigned_to, status, start_at, duration_minutes) on table public.course_activity_schedules to authenticated;

create table public.course_activity_schedules_attendees (
  id            uuid default uuid_generate_v4() primary key,
  schedule_id   uuid references public.course_activity_schedules on delete cascade not null,
  subscription_id uuid references public.course_subscriptions on delete cascade not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_activity_schedules_attendees is 'Join table for course activity schedules and their attendees (course subscriptions).';
alter table public.course_activity_schedules_attendees enable row level security;
revoke all on table public.course_activity_schedules_attendees from authenticated, anon;
grant select, insert, delete on table public.course_activity_schedules_attendees to authenticated;
create unique index idx_unique_schedule_attendee on public.course_activity_schedules_attendees (schedule_id, subscription_id);

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
$$ language plpgsql security definer set search_path = '';

-- COURSE ACTIVITY SCHEDULES POLICIES
create policy "owner_manager_teacher_student_can_see_course_activity_schedules" on public.course_activity_schedules for select to authenticated using (public.authorize('course_activity_schedules.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.read'), ('manager', 'course_activity_schedules.read'), ('teacher', 'course_activity_schedules.read'), ('student', 'course_activity_schedules.read');

create policy "owner_manager_teacher_can_create_course_activity_schedules" on public.course_activity_schedules for insert to authenticated with check (public.authorize('course_activity_schedules.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.create'), ('manager', 'course_activity_schedules.create'), ('teacher', 'course_activity_schedules.create');

create policy "owner_manager_teacher_can_update_course_activity_schedules" on public.course_activity_schedules for update to authenticated using (public.authorize('course_activity_schedules.update', organization_id) and public.is_schedule_active(id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.update'), ('manager', 'course_activity_schedules.update'), ('teacher', 'course_activity_schedules.update');

create policy "owner_manager_teacher_can_delete_course_activity_schedules" on public.course_activity_schedules for delete to authenticated using (public.authorize('course_activity_schedules.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.delete'), ('manager', 'course_activity_schedules.delete'), ('teacher', 'course_activity_schedules.delete');

-- COURSE ACTIVITY SCHEDULES ATTENDEES POLICIES
create policy "owner_manager_teacher_student_can_see_course_activity_schedules_attendees" on public.course_activity_schedules_attendees for select to authenticated using (public.authorize('course_activity_schedules_attendees.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendees.read'), ('manager', 'course_activity_schedules_attendees.read'), ('teacher', 'course_activity_schedules_attendees.read'), ('student', 'course_activity_schedules_attendees.read');

create policy "owner_manager_teacher_can_create_course_activity_schedules_attendees" on public.course_activity_schedules_attendees for insert to authenticated with check (public.authorize('course_activity_schedules_attendees.create', organization_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendees.create'), ('manager', 'course_activity_schedules_attendees.create'), ('teacher', 'course_activity_schedules_attendees.create');

create policy "owner_manager_teacher_can_delete_course_activity_schedules_attendees" on public.course_activity_schedules_attendees for delete to authenticated using (public.authorize('course_activity_schedules_attendees.delete', organization_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendees.delete'), ('manager', 'course_activity_schedules_attendees.delete'), ('teacher', 'course_activity_schedules_attendees.delete');


-- When a Course Subscription is Archived, remove it from all active schedules
create or replace function public.remove_archived_subscription_from_schedules()
returns trigger as $$
begin
  -- Get all active schedules where the subscription is an attendee
  delete from public.course_activity_schedules_attendees
  where subscription_id = new.id
    and schedule_id in (
      select id from public.course_activity_schedules
      where status = 'PLANNED'
    );

  return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger trg_remove_archived_subscription_from_schedules
after update on public.course_subscriptions
for each row
when (old.archived_at is null and new.archived_at is not null)
execute function public.remove_archived_subscription_from_schedules();


