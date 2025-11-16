create or replace function process_notifications_job()
returns void as $$
begin
  perform private.call_edge_function(
    'process_notifications',
    jsonb_build_object(
      'timestamp', now()
    )
  );
end;
$$ language plpgsql security definer set search_path = '';

select
  cron.schedule(
    'process_notifications_job',
    '30 seconds', -- Every 30 seconds
    $$ select process_notifications_job(); $$
  );