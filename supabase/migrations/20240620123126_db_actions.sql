create or replace function public.create_student(firstname text, lastname text, email text, birth_date date, organization_id uuid)
returns public.students as $$
declare
  user_id uuid;
begin
    user_id := extensions.uuid_generate_v4();
    
    insert into public.students (firstname, lastname, email, birth_date, organization_id)
        values (firstname, lastname, email, birth_date, organization_id);
        
    return (select id from public.students where id = user_id);
end;
$$ language plpgsql security invoker set search_path = public;


-- Webhooks

-- send transactional email
create or replace function public.send_transactional_email(
  message_id uuid,
  payload jsonb
)
returns boolean as $$
declare
  secret_key text;
  webhook_url text;
  signature text;
  headers_json jsonb;
  message text;
  timestamp text;
begin
  -- get Secret from vault
  SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets WHERE name = 'mail_webhook_secret_key' LIMIT 1;
  SELECT decrypted_secret INTO webhook_url FROM vault.decrypted_secrets WHERE name = 'mail_webhook_url' LIMIT 1;

  -- get the Timestamp
  timestamp := cast(extract(epoch from current_timestamp) as integer)::text;

  -- create the message
  message = concat(message_id::text, '.', timestamp, '.', payload::text);

  -- sign the payload with secret 
  signature := encode(hmac(message, convert_from(decode(secret_key, 'base64'), 'UTF8'), 'sha256'), 'base64');

  -- send the payload to the webhook
  headers_json := jsonb_build_object('Content-Type', 'application/json', 'webhook-signature', concat('v1,', signature), 'webhook-id', message_id::text, 'webhook-timestamp', timestamp);
  perform net.http_post(url := webhook_url, body := payload, headers := headers_json);

  return true;

end;
$$ language plpgsql security definer set search_path = public, extensions, net;
