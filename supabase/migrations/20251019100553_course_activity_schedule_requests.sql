-- 20251019093717_course_activity_schedule_requests.sql
-- Migration: Add course_activity_schedule_requests table

alter type public.notification_type add value if not exists 'course_activity_schedule_requests.inserted';
alter type public.notification_type add value if not exists 'course_activity_schedule_requests.status.updated';
alter type public.notification_type add value if not exists 'course_activity_schedule_requests.deleted';

create table course_activity_schedule_requests (
    id            uuid default uuid_generate_v4() primary key,
    activity_id   uuid references public.course_activities on delete cascade not null,
    subscription_id uuid references public.course_subscriptions on delete cascade not null,
    requested_by uuid references public.users on delete set null,
    start_at     timestamp with time zone not null,
    inserted_at  timestamp with time zone default now() not null,
    status       public.schedule_request_statuses default 'pending'::public.schedule_request_statuses not null,
    schedule_id uuid references public.course_activity_schedules on delete cascade,
    organization_id uuid references public.organizations on delete cascade not null
);
comment on table public.course_activity_schedule_requests is 'Requests for scheduling course activities.';
alter table public.course_activity_schedule_requests enable row level security;
revoke all on table public.course_activity_schedule_requests from authenticated, anon;
grant select, insert, delete on table public.course_activity_schedule_requests to authenticated;
grant update (start_at, status) on table public.course_activity_schedule_requests to authenticated;

-- Constrain to ensure that a schedule is linked only when the request is approved
alter table public.course_activity_schedule_requests
add constraint chk_course_activity_schedule_requests_schedule_id_required_if_approved
check ((status = 'approved' and schedule_id is not null) or (status <> 'approved' and schedule_id is null));


-- Check if activity allows requests
create or replace function public.activity_allows_requests(activity_id uuid)
returns boolean as $$
begin
    return coalesce((select allow_requests from public.course_activities where id = activity_id), false);
end;
$$ language plpgsql security definer set search_path = '';

-- COURSE ACTIVITY SCHEDULE REQUESTS POLICIES
create policy "owner_manager_teacher_student_can_see_course_activity_schedule_requests" on public.course_activity_schedule_requests for select to authenticated using (public.authorize('course_activity_schedule_requests.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedule_requests.read'), ('manager', 'course_activity_schedule_requests.read'), ('teacher', 'course_activity_schedule_requests.read'), ('student', 'course_activity_schedule_requests.read');

create policy "owner_manager_teacher_can_update_course_activity_schedule_requests" on public.course_activity_schedule_requests for update to authenticated using (public.authorize('course_activity_schedule_requests.update', organization_id)) with check (public.authorize('course_activity_schedule_requests.update', organization_id) and (status in ('approved', 'rejected') or (status = 'pending' and requested_by = (select auth.uid()))));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedule_requests.update'), ('manager', 'course_activity_schedule_requests.update'), ('teacher', 'course_activity_schedule_requests.update');

create policy "owner_manager_teacher_student_can_create_course_activity_schedule_requests" on public.course_activity_schedule_requests for insert to authenticated with check (public.authorize('course_activity_schedule_requests.create', organization_id) and public.is_subscription_active(subscription_id) and requested_by = (select auth.uid()) and public.activity_allows_requests(activity_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedule_requests.create'), ('manager', 'course_activity_schedule_requests.create'), ('teacher', 'course_activity_schedule_requests.create'), ('student', 'course_activity_schedule_requests.create');

create policy "owner_manager_teacher_can_delete_course_activity_schedule_requests" on public.course_activity_schedule_requests for delete to authenticated using (public.authorize('course_activity_schedule_requests.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedule_requests.delete'), ('manager', 'course_activity_schedule_requests.delete'), ('teacher', 'course_activity_schedule_requests.delete');

create policy "student_can_see_their_own_course_activity_schedule_requests" on public.course_activity_schedule_requests for select to authenticated using (public.course_subscription_belongs_to_student_user(subscription_id));
create policy "student_can_create_their_own_course_activity_schedule_requests" on public.course_activity_schedule_requests for insert to authenticated with check (public.course_subscription_belongs_to_student_user(subscription_id) and requested_by = (select auth.uid()) and public.activity_allows_requests(activity_id));

create index idx_course_activity_schedule_requests_subscription_id on public.course_activity_schedule_requests (subscription_id);
create index idx_course_activity_schedule_requests_requested_by on public.course_activity_schedule_requests (requested_by);
create index idx_course_activity_schedule_requests_organization_id on public.course_activity_schedule_requests (organization_id);


create or replace function public.approve_schedule_request(request_id uuid)
returns uuid as $$
declare
    s_id uuid;
    request_record record;
begin
    -- Fetch the request details
    select * into request_record from public.course_activity_schedule_requests where id = request_id;
    if request_record is null then
        raise exception 'Schedule request not found';
    end if;
    
    -- Check if the request is already processed
    if request_record.status <> 'pending' then
        raise exception 'Schedule request is already processed';
    end if;

    -- Check if the request start_at is in the future
    if request_record.start_at <= now() then
        raise exception 'Cannot approve a schedule request for a past time';
    end if;

    -- Create a new schedule for the approved request
    insert into public.course_activity_schedules (activity_id, organization_id, start_at, assigned_to, duration_minutes)
    values (request_record.activity_id, request_record.organization_id, request_record.start_at, (select auth.uid()), 45)
    returning id into s_id;

    -- Link the created schedule to the request
    update public.course_activity_schedule_requests
    set schedule_id = s_id,
        status = 'approved'
    where id = request_id;

    return s_id;

end;
$$ language plpgsql security definer set search_path = '';

-- Trigger for course_activity_schedule_requests to create notifications when new request is made
create trigger notify_on_new_course_activity_schedule_request_trigger
    after insert on public.course_activity_schedule_requests
    for each row execute procedure  public.enqueue_notification_job('course_activity_schedule_requests.inserted');

-- Trigger for course_activity_schedule_requests to create notifications when request status is updated
create trigger notify_on_update_course_activity_schedule_request_trigger
    after update on public.course_activity_schedule_requests
    for each row when (old.status <> new.status)
    execute procedure  public.enqueue_notification_job('course_activity_schedule_requests.status.updated');






