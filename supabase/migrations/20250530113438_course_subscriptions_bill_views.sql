-- Course Subscriptions Bill Views
-- Joining the bill and subscription student & course details
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
        s.email as student_email
    from
        public.course_subscription_bills csb
    join
        public.course_subscriptions cs on csb.course_subscription_id = cs.id
    join
        public.students s on cs.student_id = s.id;

