alter table public.course_subscription_bills
    add column if not exists vat_rate numeric(5, 2) default 0.0 not null,
    add column if not exists vat_amount numeric(10, 2) default 0.0 not null,
    add constraint check_vat_rate check (vat_rate >= 0.0 and vat_rate <= 100.0),
    add constraint check_vat_amount check (vat_amount >= 0.0);
-- Add a comment to the new columns
comment on column public.course_subscription_bills.vat_rate is 'The VAT rate applied to the bill, expressed as a percentage.';
comment on column public.course_subscription_bills.vat_amount is 'The calculated VAT amount for the bill based on the total and VAT rate.';

-- Ensure the new columns are included in the existing view
create or replace view public.course_subscription_bills_view as
    select
        csb.id,
        csb.bill_number,
        csb.organization_id,
        csb.total,
        csb.paid_at,
        csb.canceled_at,
        csb.ready_to_pay,
        csb.created_at,
        csb.course_subscription_id,
        cs.course_id as course_id,
        cs.student_id as student_id,
        s.firstname as student_firstname,
        s.lastname as student_lastname,
        s.email as student_email,
        c.name as course_name,
        c.description as course_description,
        csb.vat_rate,
        csb.vat_amount
    from
        public.course_subscription_bills csb
    join
        public.course_subscriptions cs on csb.course_subscription_id = cs.id
    join
        public.students s on cs.student_id = s.id
    join
        public.courses c on cs.course_id = c.id;

-- Trigger to insert the VAT rate and amount into course_subscription_bills before inserting a new bill
create or replace function public.set_vat_rate_and_amount()
returns trigger as $$
declare
    org_billing_settings_vat_rate numeric(5, 2);
    org_billing_settings_vat_exempt boolean;
begin
    -- Get the VAT rate and exemption status from the organization's billing settings
    select vat_rate, vat_exempt into org_billing_settings_vat_rate, org_billing_settings_vat_exempt
    from public.organization_billing_settings
    where id = new.organization_id;

    -- If the organization does not have billing settings, set default values
    if org_billing_settings_vat_rate is null then
        org_billing_settings_vat_rate := 19.0; -- Default VAT rate
    end if;
    if org_billing_settings_vat_exempt is null then
        org_billing_settings_vat_exempt := false; -- Default to not exempt
    end if;

    -- If the organization is VAT exempt, set the VAT rate to 0
    if org_billing_settings_vat_exempt then
        new.vat_rate := 0.0;
        new.vat_amount := 0.0;
    else
        new.vat_rate := org_billing_settings_vat_rate;
        -- Calculate the VAT amount based on the total and the VAT rate
        new.vat_amount := round(new.total * (org_billing_settings_vat_rate / 100), 2);
    end if;

    return new;
end;
$$ language plpgsql security invoker set search_path = '';
-- Create the trigger to set VAT rate and amount before inserting a new bill
create trigger before_insert_course_subscription_bills
before insert on public.course_subscription_bills
for each row
execute procedure public.set_vat_rate_and_amount();
