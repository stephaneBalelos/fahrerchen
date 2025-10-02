-- COURSE ACTIVITY SCHEDULES ATTENDANCES
create table public.course_activity_schedules_attendances (
  id            uuid default uuid_generate_v4() primary key,
  -- activity schedule data remains, in the case activity is deleted or edited
  activity_name  text not null,
  activity_description text not null,
  activity_type  public.activity_types not null,
  activity_price        numeric default 0 not null check (activity_price >= 0),
  schedule_start_at     timestamp with time zone not null,
  schedule_end_at       timestamp with time zone not null,
  schedule_assigned_to_email  text not null,
  schedule_assigned_to_firstname text not null,
  schedule_assigned_to_lastname text not null,
  -- activity schedule data ends
  successfully_completed boolean default false not null, -- if the activity was an EXAM, this field is set to true if the student passed the exam
  course_activity_id    uuid references public.course_activities on delete set null,
  course_activity_schedule_id    uuid references public.course_activity_schedules on delete set null,
  schedule_assigned_to_id uuid references public.users on delete set null,
  course_subscription_id    uuid references public.course_subscriptions on delete cascade not null,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_activity_schedule_id, course_subscription_id)
);
comment on table public.course_activity_schedules_attendances is 'COURSE ACTIVITY SCHEDULES ATTENDEES.';
alter table public.course_activity_schedules_attendances enable row level security;
revoke update on table public.course_activity_schedules_attendances from authenticated, anon;
grant update (successfully_completed) on table public.course_activity_schedules_attendances to authenticated;

create policy "owner_manager_teacher_can_see_course_activity_schedules_attendances" on public.course_activity_schedules_attendances for select to authenticated using (public.authorize('course_activity_schedules_attendances.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.read'), ('manager', 'course_activity_schedules_attendances.read'), ('teacher', 'course_activity_schedules_attendances.read');

create policy "owner_manager_teacher_can_create_course_activity_schedules_attendances" on public.course_activity_schedules_attendances for insert to authenticated with check (public.authorize('course_activity_schedules_attendances.create', organization_id) and (public.is_subscription_active(course_subscription_id)));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.create'), ('manager', 'course_activity_schedules_attendances.create'), ('teacher', 'course_activity_schedules_attendances.create');

create policy "owner_manager_teacher_can_update_course_activity_schedules_attendances" on public.course_activity_schedules_attendances for update to authenticated using (public.authorize('course_activity_schedules_attendances.update', organization_id) and (public.is_schedule_active(course_activity_schedule_id)));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.update'), ('manager', 'course_activity_schedules_attendances.update'), ('teacher', 'course_activity_schedules_attendances.update');

create policy "owner_manager_teacher_can_delete_course_activity_schedules_attendances" on public.course_activity_schedules_attendances for delete to authenticated using (public.authorize('course_activity_schedules_attendances.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.delete'), ('manager', 'course_activity_schedules_attendances.delete'), ('teacher', 'course_activity_schedules_attendances.delete');

create policy "student_can_see_their_own_course_activity_schedules_attendances" on public.course_activity_schedules_attendances for select to authenticated using (public.course_subscription_belongs_to_student_user(course_subscription_id));


-- Trigger When a schedule is marked as COMPLETED, create in attendance record for each student in the schedule
create or replace function public.create_attendance_record_for_schedule()
returns trigger as $$
declare
  r_attendee record;
  v_activity record;
  a_user record;
begin

  a_user := (select email, firstname, lastname from public.users where id = new.assigned_to);
  if a_user is null then
    -- Throw an error if assigned_to user not found
    raise exception 'Assigned to user not found for schedule %', new.id;
  end if;

  for r_attendee in select * from public.course_activity_schedules_attendees where schedule_id = new.id loop
    select * into v_activity from public.course_activities where id = new.activity_id;
    insert into public.course_activity_schedules_attendances (
      activity_name,
      activity_description,
      activity_type,
      activity_price,
      schedule_start_at,
      schedule_end_at,
      schedule_assigned_to_email,
      schedule_assigned_to_firstname,
      schedule_assigned_to_lastname,
      course_activity_id,
      course_activity_schedule_id,
      schedule_assigned_to_id,
      course_subscription_id,
      organization_id
    ) values (
      v_activity.name,
      v_activity.description,
      v_activity.type,
      v_activity.price,
      new.start_at,
      new.start_at + (new.duration_minutes || ' minutes')::interval,
      a_user.email,
      a_user.firstname,
      a_user.lastname,
      new.activity_id,
      new.id,
      new.assigned_to,
      r_attendee.subscription_id,
      new.organization_id
    );
  end loop;

  return new;
end;
$$ language plpgsql security invoker set search_path = '';
create trigger create_attendance_record_for_schedule
after update on public.course_activity_schedules
for each row
when (old.status is distinct from new.status and new.status = 'COMPLETED')
execute procedure public.create_attendance_record_for_schedule();