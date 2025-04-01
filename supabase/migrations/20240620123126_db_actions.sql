-- Webhooks
-- call the webhook to send the notification
create or replace function private.send_notification(
  actor_id uuid,
  type public.notification_type,
  target_roles app_role[],
  target_id uuid,
  resource_id uuid,
  n_payload jsonb,
  organization_id uuid
)
returns boolean as $$
declare
  secret_key text;
  webhook_url text;
  w_payload jsonb;
  signature text;
  headers_json jsonb;
  message text;
  timestamp text;
begin
  -- get Secret from vault
  SELECT decrypted_secret INTO secret_key FROM vault.decrypted_secrets WHERE name = 'notification_webhook_secret_key' LIMIT 1;
  SELECT decrypted_secret INTO webhook_url FROM vault.decrypted_secrets WHERE name = 'notification_webhook_url' LIMIT 1;

  -- get the Timestamp
  timestamp := cast(extract(epoch from current_timestamp) as integer)::text;

  -- build the webhook payload
  w_payload := jsonb_build_object(
    'actor_id', actor_id,
    'type', type,
    'target_roles', target_roles,
    'target_id', target_id,
    'resource_id', resource_id,
    'payload', n_payload,
    'organization_id', organization_id
  );
  -- create the message
  message = concat(resource_id::text, '.', timestamp, '.', w_payload::text);
  -- sign the payload with secret
  signature := encode(hmac(message, convert_from(decode(secret_key, 'base64'), 'UTF8'), 'sha256'), 'base64');
  -- send the payload to the webhook
  headers_json := jsonb_build_object('Content-Type', 'application/json', 'webhook-signature', concat('v1,', signature), 'webhook-id', resource_id::text, 'webhook-timestamp', timestamp);
  perform net.http_post(url := webhook_url, body := w_payload, headers := headers_json);
  return true;
end;
$$ language plpgsql security definer set search_path = public, extensions, net;




-- send transactional email
create or replace function private.send_transactional_email(
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
$$ language plpgsql security invoker set search_path = public, extensions, net;
