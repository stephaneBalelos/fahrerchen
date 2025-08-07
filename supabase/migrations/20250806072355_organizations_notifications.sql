-- Manage notifications for organizations
-- This migration script creates a table to store notifications for organizations, allowing for better management of communication and alerts.
-- Notifications will include the organization ID, type, target user, the user who created the notification, and the payload as JSON.
-- Notification can be marked as read or unread.

-- drop type public.notification_type cascade;

drop type if exists public.notification_type cascade;

create type public.notification_type as enum (
    'organization_members.inserted',
    'students.inserted',
    'course_documents.inserted',
    'course_documents.updated',
    'course_subscriptions.inserted',
    'course_activities.inserted',
    'course_activities.price.updated',
    'course_activity_schedules.inserted',
    'course_activity_schedules.assigned_to.updated',
    'course_activity_schedules.attendees.updated',
    'course_activity_schedules.status.updated',
    'course_activity_schedules.start_at.updated',
    'course_activity_schedules.end_at.updated',
    'course_activity_schedules.deleted',
    'course_activity_schedules_attendances.inserted',
    'course_activity_schedules_attendances.completed.updated',
    'course_activity_schedules_attendances.deleted',
    'course_subscription_bills.inserted',
    'course_subscription_bills.paid_at.updated',
    'course_subscription_bills.ready_to_pay.updated',
    'course_subscription_bills.canceled_at.updated',
    'students_registration_requests.inserted'
);

create or replace function public.create_organization_notification(
    org_id uuid,
    type public.notification_type,
    author_id uuid,
    resource_id uuid,
    payload_old jsonb,
    payload_new jsonb
) returns void as $$
declare
    notification_id int;
    notification_payload jsonb;
begin
    -- If author_id is not provided, do not create a notification
    if author_id is null then
        return;
    end if;

    -- Check if the organization exists
    if not exists (select 1 from public.organizations where id = org_id) then
        raise exception 'Organization with ID % does not exist', org_id;
    end if;

    notification_payload := jsonb_build_object(
        'org_id', org_id,
        'type', type,
        'author_id', author_id,
        'old', payload_old,
        'new', payload_new
    );

    select * into notification_id from pgmq.send(
        'organization_notifications',
        notification_payload
    );

end;
$$ language plpgsql security invoker set search_path = '';

create table public.organization_notifications (
    id            uuid default extensions.uuid_generate_v4() primary key,
    type          public.notification_type not null,
    target_user_id uuid references public.users(id) on delete cascade not null,
    author_id     uuid references public.users(id) on delete set null,
    payload jsonb not null,
    read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.organization_notifications is 'Table to store notifications for organizations';
-- Enable row-level security for the organization_notifications table
alter table public.organization_notifications enable row level security;
revoke update on public.organization_notifications from authenticated, anon;
grant update (read) on public.organization_notifications to authenticated;
-- Create policies for organization_notifications table
create policy "Allow all users to read their own notifications"
    on public.organization_notifications
    for select to authenticated
    using (target_user_id = auth.uid());

create policy "Allow users to update their own notifications"
    on public.organization_notifications
    for update to authenticated
    using (target_user_id = auth.uid());

-- Indexes for performance
create index idx_organization_notifications_target_user_id on public.organization_notifications(target_user_id);
create index idx_organization_notifications_organization_id on public.organization_notifications(organization_id);
create index idx_organization_notifications_created_at on public.organization_notifications(created_at);




-- Trigger for organization_members table to create notifications when a new member is inserted
create or replace function public.organization_members_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'organization_members.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger organization_members_insert_trigger
    after insert on public.organization_members
    for each row execute procedure public.organization_members_insert_trigger_function();


-- Trigger for students table to create notifications when a new student is inserted
create or replace function public.students_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'students.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger students_insert_trigger
    after insert on public.students
    for each row execute procedure public.students_insert_trigger_function();


-- Trigger for course_documents table to create notifications when a new document is inserted
create or replace function public.course_documents_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_documents.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_documents_insert_trigger
    after insert on public.course_documents
    for each row execute procedure public.course_documents_insert_trigger_function();

-- Trigger for course_documents table to create notifications when a document is updated
create or replace function public.course_documents_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_documents.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_documents_update_trigger
    after update on public.course_documents
    for each row when (old.path <> new.path) execute procedure public.course_documents_update_trigger_function();


-- Trigger for course_subscriptions table to create notifications when a new subscription is inserted
create or replace function public.course_subscriptions_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_subscriptions.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_subscriptions_insert_trigger
    after insert on public.course_subscriptions
    for each row execute procedure public.course_subscriptions_insert_trigger_function();


-- Trigger for course_activities table to create notifications when a new activity is inserted
create or replace function public.course_activities_insert_trigger_function()
    returns trigger as $$
begin

    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activities.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activities_insert_trigger
    after insert on public.course_activities
    for each row execute procedure public.course_activities_insert_trigger_function();


-- Trigger for course_activities table to create notifications when an activity's price is updated
create or replace function public.course_activities_price_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activities.price.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activities_price_update_trigger
    after update on public.course_activities
    for each row when (old.price <> new.price)
    execute procedure public.course_activities_price_update_trigger_function();



-- Trigger for course_activity_schedules table to create notifications when a new schedule is inserted
create or replace function public.course_activity_schedules_insert_trigger_function()
    returns trigger as $$
declare
    should_notify_students boolean;
begin
    select allow_self_registration into should_notify_students
    from public.course_activities
    where id = new.activity_id;

    if should_notify_students then
        perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    end if;

    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_insert_trigger
    after insert on public.course_activity_schedules
    for each row execute procedure public.course_activity_schedules_insert_trigger_function();


-- Trigger for course_activity_schedules table to create notifications when a schedule is updated
create or replace function public.course_activity_schedules_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.assigned_to.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.assigned_to <> new.assigned_to)
    execute procedure public.course_activity_schedules_update_trigger_function();


-- Trigger for course_activity_schedules table to create notifications when a schedule is assigned to a user
create or replace function public.course_activity_schedules_attendees_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.attendees.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_attendees_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.attendees <> new.attendees)
    execute procedure public.course_activity_schedules_attendees_update_trigger_function();


-- Trigger for course_activity_schedules table to create notifications when a schedule's status is updated
create or replace function public.course_activity_schedules_status_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.status.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_status_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.status <> new.status)
    execute procedure public.course_activity_schedules_status_update_trigger_function();


-- Trigger for course_activity_schedules table to create notifications when a schedule's start time is updated
create or replace function public.course_activity_schedules_start_at_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.start_at.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_start_at_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.start_at <> new.start_at)
    execute procedure public.course_activity_schedules_start_at_update_trigger_function();


-- Trigger for course_activity_schedules table to create notifications when a schedule's end time is updated
create or replace function public.course_activity_schedules_end_at_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules.end_at.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_end_at_update_trigger
    after update on public.course_activity_schedules
    for each row when (old.end_at <> new.end_at)
    execute procedure public.course_activity_schedules_end_at_update_trigger_function();

-- Trigger for course_activity_schedules table to create notifications when a schedule is deleted
create or replace function public.course_activity_schedules_delete_trigger_function()
    returns trigger as $$
begin

    perform public.create_organization_notification(
        org_id := old.organization_id,
        type := 'course_activity_schedules.deleted',
        author_id := (select auth.uid()),
        resource_id := old.id,
        payload_old := to_jsonb(old),
        payload_new := null
    );
    return old;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_delete_trigger
    after delete on public.course_activity_schedules
    for each row execute procedure public.course_activity_schedules_delete_trigger_function();

-- Trigger for course_activity_schedules_attendances table to create notifications when a new attendance is inserted
create or replace function public.course_activity_schedules_attendances_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules_attendances.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_attendances_insert_trigger
    after insert on public.course_activity_schedules_attendances
    for each row execute procedure public.course_activity_schedules_attendances_insert_trigger_function();


-- Trigger for course_activity_schedules_attendances table to create notifications when an attendance is marked as completed
create or replace function public.course_activity_schedules_attendances_completed_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_activity_schedules_attendances.completed.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_attendances_completed_update_trigger
    after update on public.course_activity_schedules_attendances
    for each row when (old.successfully_completed <> new.successfully_completed)
    execute procedure public.course_activity_schedules_attendances_completed_update_trigger_function();


-- Trigger for course_activity_schedules_attendances table to create notifications when an attendance is deleted
create or replace function public.course_activity_schedules_attendances_delete_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := old.organization_id,
        type := 'course_activity_schedules_attendances.deleted',
        author_id := (select auth.uid()),
        resource_id := old.id,
        payload_old := to_jsonb(old),
        payload_new := null
    );
    return old;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_activity_schedules_attendances_delete_trigger
    after delete on public.course_activity_schedules_attendances
    for each row execute procedure public.course_activity_schedules_attendances_delete_trigger_function();


-- Trigger for course_subscription_bills table to create notifications when a new bill is inserted
create or replace function public.course_subscription_bills_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_subscription_bills.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_subscription_bills_insert_trigger
    after insert on public.course_subscription_bills
    for each row execute procedure public.course_subscription_bills_insert_trigger_function();

-- Trigger for course_subscription_bills table to create notifications when a bill's paid_at is updated
create or replace function public.course_subscription_bills_paid_at_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_subscription_bills.paid_at.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_subscription_bills_paid_at_update_trigger
    after update on public.course_subscription_bills
    for each row when (old.paid_at <> new.paid_at)
    execute procedure public.course_subscription_bills_paid_at_update_trigger_function();

-- Trigger for course_subscription_bills table to create notifications when a bill's ready_to_pay is updated
create or replace function public.course_subscription_bills_ready_to_pay_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_subscription_bills.ready_to_pay.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_subscription_bills_ready_to_pay_update_trigger
    after update on public.course_subscription_bills
    for each row when (old.ready_to_pay <> new.ready_to_pay)
    execute procedure public.course_subscription_bills_ready_to_pay_update_trigger_function();


-- Trigger for course_subscription_bills table to create notifications when a bill's canceled_at is updated
create or replace function public.course_subscription_bills_canceled_at_update_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'course_subscription_bills.canceled_at.updated',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := to_jsonb(old),
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger course_subscription_bills_canceled_at_update_trigger
    after update on public.course_subscription_bills
    for each row when (old.canceled_at <> new.canceled_at)
    execute procedure public.course_subscription_bills_canceled_at_update_trigger_function();
    
-- Trigger for students_registration_requests table to create notifications when a new registration request is inserted
create or replace function public.students_registration_requests_insert_trigger_function()
    returns trigger as $$
begin
    perform public.create_organization_notification(
        org_id := new.organization_id,
        type := 'students_registration_requests.inserted',
        author_id := (select auth.uid()),
        resource_id := new.id,
        payload_old := null,
        payload_new := to_jsonb(new)
    );
    return new;
end;
$$ language plpgsql security definer set search_path = '';
create trigger students_registration_requests_insert_trigger
    after insert on public.students_registration_requests
    for each row execute procedure public.students_registration_requests_insert_trigger_function();