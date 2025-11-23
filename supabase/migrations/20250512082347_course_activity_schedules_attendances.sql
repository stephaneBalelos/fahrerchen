-- COURSE ACTIVITY SCHEDULES ATTENDANCES
create table public.course_activity_schedules_attendances (
  id            uuid default uuid_generate_v4(),
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
  course_activity_id    uuid,
  course_activity_schedule_id    uuid,
  schedule_assigned_to_id uuid references public.users on delete set null,
  course_subscription_id    uuid not null,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_activity_schedule_id, course_subscription_id),
  primary key (organization_id, id),
  foreign key (organization_id, course_activity_id) references public.course_activities(organization_id, id) on delete set null,
  foreign key (organization_id, course_activity_schedule_id) references public.course_activity_schedules(organization_id, id) on delete set null,
  foreign key (organization_id, course_subscription_id) references public.course_subscriptions(organization_id, id) on delete cascade

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
  v_course_id uuid;
  c_activity_price numeric;
  a_firstname text;
  a_lastname text;
  a_email text;
begin

  select firstname, lastname, email into a_firstname, a_lastname, a_email from public.users where id = new.assigned_to;
  if a_firstname is null or a_lastname is null or a_email is null then
    -- Throw an error if assigned_to user not found
    raise exception 'Assigned to user not found for schedule %', new.id;
  end if;

  for r_attendee in select * from public.course_activity_schedules_attendees where schedule_id = new.id loop
    -- Get course id from subscription
    select course_id into v_course_id from public.course_subscriptions where id = r_attendee.subscription_id;
    if v_course_id is null then
      raise exception 'Course subscription not found for attendance record creation, subscription id: %', r_attendee.subscription_id;
    end if;

    -- Get course activity combination to check if the activity belongs to the course and get the alternative price if set
    select price into c_activity_price from public.course_activities_combinations where course_id = v_course_id and activity_id = new.activity_id;

    -- If price is null in the combination, use the default activity price
    if c_activity_price is null then
      select price into c_activity_price from public.course_activities where id = new.activity_id;
    end if;
    
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
      v_activity.activity_type,
      c_activity_price,
      new.start_at,
      new.start_at + (new.duration_minutes || ' minutes')::interval,
      a_email,
      a_firstname,
      a_lastname,
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


-- Notifications Trigger for course_activity_schedules_attendances table to create notifications when an attendance is inserted
-- Trigger for course_activity_schedules_attendances table to create notifications when a new attendance is inserted
create trigger course_activity_schedules_attendances_insert_trigger
    after insert on public.course_activity_schedules_attendances
    for each row execute procedure public.enqueue_notification_job('course_activity_schedules_attendances.inserted');