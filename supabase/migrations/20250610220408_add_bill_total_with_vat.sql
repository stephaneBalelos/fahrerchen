-- Add a column bill_total_with_vat to the course_subscription_bills table
-- this column is generated based on the total and VAT rate
alter table public.course_subscription_bills
    add column if not exists total_with_vat numeric(10, 2) generated always as (total + (total * (vat_rate / 100))) stored;
-- -- Add a comment to the new column
comment on column public.course_subscription_bills.total_with_vat is 'The total amount of the bill including VAT, calculated as total + (total * (vat_rate / 100)).';

-- -- Update the course_subscription_bills_view to include the new column
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
        csb.vat_rate,
        csb.vat_amount,
        csb.total_with_vat, -- Include the new column in the view
        c.type as course_type
    from
        public.course_subscription_bills csb
    join
        public.course_subscriptions cs on csb.course_subscription_id = cs.id
    join
        public.students s on cs.student_id = s.id
    join
        public.courses c on cs.course_id = c.id;