-- 20251019093717_course_activity_schedule_requests.sql
-- Migration: Add course_activity_schedule_requests table

create table course_activity_schedule_requests (
    id            uuid default uuid_generate_v4() primary key,
    activity_id   uuid references public.course_activities on delete cascade not null,
    subscription_id uuid references public.course_subscriptions on delete cascade not null,
    requested_by uuid references public.users on delete set null,
    start_at     timestamp with time zone not null,
    inserted_at  timestamp with time zone default now() not null,
    status       public.schedule_request_statuses default 'pending'::public.schedule_request_statuses not null,
    organization_id uuid references public.organizations on delete cascade not null
);
comment on table public.course_activity_schedule_requests is 'Requests for scheduling course activities.';
alter table public.course_activity_schedule_requests enable row level security;
revoke all on table public.course_activity_schedule_requests from authenticated, anon;
grant select, insert, delete on table public.course_activity_schedule_requests to authenticated;
grant update (start_at, status) on table public.course_activity_schedule_requests to authenticated;

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

-- Handle status changes
create or replace function public.handle_course_activity_schedule_request_status_change()
returns trigger as $$
begin

    if new.status = 'approved' then
        -- Create a course activity schedule when the request is approved
        insert into public.course_activity_schedules (activity_id, subscription_id, start_at, organization_id)
        values (new.activity_id, new.subscription_id, new.start_at, new.organization_id);
    end if;
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger trg_handle_course_activity_schedule_request_status_change
after update of status on public.course_activity_schedule_requests
for each row execute function public.handle_course_activity_schedule_request_status_change();





