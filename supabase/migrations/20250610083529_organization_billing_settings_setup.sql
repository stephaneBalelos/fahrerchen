alter type public.app_permission add value if not exists 'organization_billing_settings.read';
alter type public.app_permission add value if not exists 'organization_billing_settings.create';
alter type public.app_permission add value if not exists 'organization_billing_settings.update';
alter type public.app_permission add value if not exists 'organization_billing_settings.delete';