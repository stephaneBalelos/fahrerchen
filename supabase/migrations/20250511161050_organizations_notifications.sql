create table public.notifications_jobs (
    id serial primary key,
    organization_id uuid references public.organizations on delete cascade not null,
    actor_id uuid references public.users on delete set null,
    notification_type public.notification_type not null,
    payload jsonb not null,
    batch_key text, -- Used to group related jobs
    status public.notification_job_status not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.notifications_jobs is 'Table to store notification jobs for organizations';
alter table public.notifications_jobs enable row level security;
revoke update on public.notifications_jobs from authenticated, anon;

-- Create a policy to allow actor to insert notifications
create policy "Allow actors to insert notifications"
    on public.notifications_jobs
    for insert to authenticated
    with check (actor_id = auth.uid());

create table public.organization_notifications (
    id            uuid default extensions.uuid_generate_v4() primary key,
    notification_type public.notification_type not null,
    target_user_ids uuid[] not null, -- Array of user IDs to whom the notification is targeted
    author_id     uuid references public.users(id) on delete set null,
    payload jsonb not null,
    updated_at    timestamp with time zone default timezone('utc'::text, now()) not null,
    batch_key    text, -- Used to group related notifications
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.organization_notifications is 'Table to store notifications for organizations';
-- Enable row-level security for the organization_notifications table
alter table public.organization_notifications enable row level security;
revoke update on public.organization_notifications from authenticated, anon;

-- Prevent updates of batch_key and organization_id after creation
create or replace function public.prevent_organization_notifications_update()
returns trigger as $$
begin
    if old.batch_key is distinct from new.batch_key then
        raise exception 'batch_key cannot be updated';
    end if;
    if old.organization_id is distinct from new.organization_id then
        raise exception 'organization_id cannot be updated';
    end if;
    new.updated_at := timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security invoker set search_path = '';
create trigger prevent_organization_notifications_update_trigger
    before update on public.organization_notifications
    for each row execute procedure public.prevent_organization_notifications_update();

-- Create policies for organization_notifications table
create policy "Allow all users to read their own notifications"
    on public.organization_notifications
    for select to authenticated
    using (target_user_ids @> array[auth.uid()]);

-- Indexes for performance
create index idx_organization_notifications_target_user_ids on public.organization_notifications(target_user_ids);
create index idx_organization_notifications_organization_id on public.organization_notifications(organization_id);
create index idx_organization_notifications_created_at on public.organization_notifications(created_at);


-- Trigger function to enqueue Notifications Jobs
create or replace function public.enqueue_notification_job()
returns trigger as $$
declare
    actor_id uuid;
    batch_key text;
    org_id uuid;
begin
    actor_id := (select auth.uid());

    if actor_id is null then
        return new; -- If no actor, do not create a notification
    end if;

    if TG_OP = 'DELETE' then
        org_id := old.organization_id;
    else
        org_id := new.organization_id;
    end if;

    -- Set the batch key as <organization_id>.<notification_type>.<resource_id>
    batch_key := org_id::text || '.' || TG_ARGV[0] || '.' || new.id::text;

    insert into public.notifications_jobs (
        organization_id,
        actor_id,
        notification_type,
        payload,
        batch_key,
        status
    ) values (
        org_id,
        actor_id,
        TG_ARGV[0]::public.notification_type,
        jsonb_build_object(
            'resource_id', new.id,
            'old', to_jsonb(old),
            'new', to_jsonb(new)
        ),
        batch_key,
        'PENDING'
    );
    return new;
end;
$$ language plpgsql security invoker set search_path = '';

