-- DB Function to call edge functions securely
create or replace function private.call_edge_function(
  function_name text,
  payload jsonb
)
returns void as $$
declare
  project_url text;
  sb_db_secret text;
  anon_key text;
  function_url text;
  function_body jsonb;
  request_id uuid;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'project_url';
  select decrypted_secret into anon_key from vault.decrypted_secrets where name = 'anon_key';
  select decrypted_secret into sb_db_secret from vault.decrypted_secrets where name = 'db_webhook_secret'; -- Secret to verify edge function calls

  function_url := project_url || '/functions/v1/' || function_name;
  function_body := payload;

  perform
    net.http_post(
      url:= function_url,
      headers:= jsonb_build_object(
        'Content-type', 'application/json',
        'Authorization', 'Bearer ' || anon_key,
        'X-DB-Webhook-Secret', sb_db_secret
      ),
      body:= jsonb_build_object(
        'payload', function_body,
        'timestamp', now()
      )::jsonb
    );
end;
$$ language plpgsql security definer set search_path = '';