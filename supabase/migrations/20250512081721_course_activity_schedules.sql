-- COURSE ACTIVITY SCHEDULES
create table public.course_activity_schedules (
  id            uuid default uuid_generate_v4(),
  activity_id    uuid not null,
  assigned_to   uuid references public.users on delete set null,
  organization_id    uuid references public.organizations on delete cascade not null,
  status        public.schedule_status default 'PLANNED'::public.schedule_status not null,
  start_at     timestamp with time zone not null,
  duration_minutes int not null default 45,
  inserted_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  recurrence_rule_id uuid,
  attendees_count int default 0 not null,
  primary key (organization_id, id),
  foreign key (organization_id, activity_id) references public.course_activities(organization_id, id) on delete cascade,
  foreign key (organization_id, recurrence_rule_id) references public.activity_recurrence_rules(organization_id, id) on delete set null
);
comment on table public.course_activity_schedules is 'ACTIVITY SCHEDULES.';
alter table public.course_activity_schedules enable row level security;
revoke update on table public.course_activity_schedules from authenticated, anon;
grant update (assigned_to, status, start_at, duration_minutes, updated_at) on table public.course_activity_schedules to authenticated;


-- COURSE ACTIVITY SCHEDULES ATTENDEES
create table public.course_activity_schedules_attendees (
  id            uuid default uuid_generate_v4(),
  schedule_id   uuid not null,
  subscription_id uuid not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  primary key (organization_id, id),
  foreign key (organization_id, schedule_id) references public.course_activity_schedules(organization_id, id) on delete cascade,
  foreign key (organization_id, subscription_id) references public.course_subscriptions(organization_id, id) on delete cascade
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

-- Allow students to insert themselves as attendees to schedules if the activity allows self-registration
create or replace function public.can_student_insert_itself(schedule_id uuid, subscription_id uuid)
returns boolean as $$
declare org_id uuid;
        a_id uuid;
        a_allow_self_registration boolean;
        u_role public.app_role;
        u_id uuid;
begin

    select auth.uid() into u_id;

    select organization_id, activity_id into org_id, a_id from public.course_activity_schedules where id = schedule_id;
    select allow_self_registration into a_allow_self_registration from public.course_activities where id = a_id;

    select role into u_role from public.organization_members
    where organization_id = org_id and user_id = u_id;

    if u_role != 'student' then
        return false;
    end if;

    if not a_allow_self_registration then
        return false;
    end if;
    if not public.course_subscription_belongs_to_student_user(subscription_id) then
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

create policy "owner_manager_teacher_student_can_create_course_activity_schedules_attendees" on public.course_activity_schedules_attendees for insert to authenticated with check ((public.authorize('course_activity_schedules_attendees.create', organization_id) or (public.can_student_insert_itself(schedule_id, subscription_id))) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendees.create'), ('manager', 'course_activity_schedules_attendees.create'), ('teacher', 'course_activity_schedules_attendees.create');

create policy "owner_manager_teacher_can_delete_course_activity_schedules_attendees" on public.course_activity_schedules_attendees for delete to authenticated using (public.authorize('course_activity_schedules_attendees.delete', organization_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendees.delete'), ('manager', 'course_activity_schedules_attendees.delete'), ('teacher', 'course_activity_schedules_attendees.delete');


-- Aggregate trigger to update attendees_count on course_activity_schedules
create or replace function public.update_attendees_count_on_schedule_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.course_activity_schedules
    set attendees_count = attendees_count + 1
    where id = new.schedule_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.course_activity_schedules
    set attendees_count = attendees_count - 1
    where id = old.schedule_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = '';
create trigger trg_update_attendees_count_on_schedule_change
after insert or delete on public.course_activity_schedules_attendees
for each row
execute function public.update_attendees_count_on_schedule_change();

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

-- Automatically Updated past Schedule Status to Completed or Canceled
-- If the schedule is in the past and still PLANNED, we update its status
-- If the past schedule has attendees, set to COMPLETED, else CANCELED
-- If no one is assigned and no attendees, delete the schedule
create or replace function auto_update_past_schedule_status()
returns void as $$
declare
  rec record;
begin

  for rec in
    select id, attendees_count from public.course_activity_schedules
    where start_at + (duration_minutes || ' minutes')::interval < timezone('utc'::text, now())
      and status = 'PLANNED'
  loop
    if rec.attendees_count > 0 then
      update public.course_activity_schedules
      set status = 'COMPLETED', updated_at = timezone('utc'::text, now())
      where id = rec.id;
    else
      update public.course_activity_schedules
      set status = 'CANCELED', updated_at = timezone('utc'::text, now())
      where id = rec.id;
    end if;

    -- If no one is assigned and no attendees, delete the schedule
    if rec.attendees_count = 0 then
      delete from public.course_activity_schedules
      where id = rec.id and assigned_to is null;
    end if;
  end loop;

end;
$$ language plpgsql security definer set search_path = '';

-- Run the auto update function every hour
select cron.schedule(
  'auto_update_past_activity_schedules_status',
  '5 * * * *',  -- Every hour at minute 5
  $$ select auto_update_past_schedule_status() $$
);



-- Update the updated_at timestamp on activity schedules when certain fields are updated
create or replace function public.update_activity_schedule_timestamp()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  -- Detach from recurrence rule if any of the key fields are changed
  if old.start_at is distinct from new.start_at
     or old.duration_minutes is distinct from new.duration_minutes then
    new.recurrence_rule_id = null;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger trg_update_activity_schedule_timestamp
before update on public.course_activity_schedules
for each row
when (old.assigned_to is distinct from new.assigned_to
      or old.status is distinct from new.status
      or old.start_at is distinct from new.start_at
      or old.duration_minutes is distinct from new.duration_minutes)
execute function public.update_activity_schedule_timestamp();

-- Recreate Activity Schedules when the Occurrence Rule is Updated
create or replace function public.recreate_schedules_on_recurrence_rule_update()
returns trigger as $$
begin
  -- Delete existing PLANNED with no attendees schedules linked to this recurrence rule that are in the future
  delete from public.course_activity_schedules
  where recurrence_rule_id = old.id and status = 'PLANNED' and start_at > timezone('utc'::text, now()) and attendees_count = 0;

  -- Notify the edge function to recreate schedules
  perform private.call_edge_function(
    'extend-activity-schedules-occurences',
    jsonb_build_object(
      'recurrence_rule_id', new.id
    )
  );
  return old;
end;
$$ language plpgsql security invoker set search_path = '';
create trigger trg_recreate_schedules_on_recurrence_rule_update
after update on public.activity_recurrence_rules
for each row
when (old.rrule is distinct from new.rrule)
execute function public.recreate_schedules_on_recurrence_rule_update();

-- Delete Linked Incoming Schedules with no attendees when the Occurrence Rule is Deleted
create or replace function public.delete_schedules_on_recurrence_rule_delete()
returns trigger as $$
begin
  delete from public.course_activity_schedules
  where recurrence_rule_id = old.id and status = 'PLANNED' and start_at > timezone('utc'::text, now()) and attendees_count = 0;

  return old;
end;
$$ language plpgsql security invoker set search_path = '';
create trigger trg_delete_schedules_on_recurrence_rule_delete
before delete on public.activity_recurrence_rules
for each row
execute function public.delete_schedules_on_recurrence_rule_delete();


-- Notifications Triggers for Course Activity Schedules
-- Trigger for course_activity_schedules_attendees table to create notifications when a new attendee is inserted
create trigger course_activity_schedules_attendees_insert_trigger
    after insert on public.course_activity_schedules_attendees
    for each row execute procedure public.enqueue_notification_job('course_activity_schedules_attendees.inserted');

-- Trigger for course_activity_schedules_attendees table to create notifications when an attendee is removed
create trigger course_activity_schedules_attendees_delete_trigger
    after delete on public.course_activity_schedules_attendees
    for each row execute procedure public.enqueue_notification_job('course_activity_schedules_attendees.removed');

-- Trigger for course_activity_schedules table to create notifications when a schedule assigned_to is updated
create trigger course_activity_schedules_assigned_to_update_trigger
    after update on public.course_activity_schedules
    for each row when ((old.assigned_to is null and new.assigned_to is not null) or (old.assigned_to <> new.assigned_to))
    execute procedure public.enqueue_notification_job('course_activity_schedules.assigned_to.updated');

-- Trigger for course_activity_schedules table to create notifications when a schedule's status is updated
create trigger course_activity_schedules_status_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.status <> new.status)
    execute procedure public.enqueue_notification_job('course_activity_schedules.status.updated');

-- Trigger for course_activity_schedules table to create notifications when a schedule's start time is updated
create trigger course_activity_schedules_start_at_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.start_at <> new.start_at)
    execute procedure public.enqueue_notification_job('course_activity_schedules.start_at.updated');

-- Trigger for course_activity_schedules table to create notifications when a schedule is deleted
create trigger course_activity_schedules_delete_trigger
    after delete on public.course_activity_schedules
    for each row execute procedure public.enqueue_notification_job('course_activity_schedules.deleted');
