-- Fix the function to support old and new records for delete operations
-- The old record is needed to get the organization_id for delete operations
-- without relying on the new record which is null in that case
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