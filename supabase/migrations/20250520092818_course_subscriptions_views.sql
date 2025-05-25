-- Organization's Course Subscriptions Views

create or replace view public.course_subscriptions_view as
    select
        cs.id
        cs.course_id as course_id,
        cs.student_id as student_id,
        cs.inserted_at as inserted_at,
        cs.archived_at as archived_at,
        cs.costs as costs,
        cs.organization_id as organization_id,
        s.firstname as student_firstname,
        s.lastname as student_lastname,
        s.email as student_email,
        s.full_name as student_full_name,
        s.avatar_path as student_avatar_path,
        c.name as course_name,
        c.description as course_description,
        c.id as course_id
    from
        public.course_subscriptions cs
    join
        public.students s on cs.student_id = s.id
    join
        public.courses c on cs.course_id = c.id;

