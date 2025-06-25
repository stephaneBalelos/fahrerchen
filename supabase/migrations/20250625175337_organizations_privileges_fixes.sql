grant update (name, description, avatar_path, email, phone_number, website, address_street, address_zip, address_city, address_country, preferred_language, allow_self_registration) on table public.organizations to authenticated;

-- Revoke Update for billing settings
revoke update on table public.organization_billing_settings from authenticated, anon;
grant update (id, vat_rate, vat_exempt, bank_account_name, bank_account_number, bank_account_iban, bank_account_bic, tax_id, invoice_title, invoice_subtitle, invoice_message, invoice_footer) on table public.organization_billing_settings to authenticated;

