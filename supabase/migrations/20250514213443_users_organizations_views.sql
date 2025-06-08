-- User's Organizations View
-- This view provides a list of organizations that a user is a member of, along with their roles.

create or replace view public.users_organizations_view as
    select
        u.id as user_id,
        u.email as user_email,
        u.firstname as user_firstname,
        u.lastname as user_lastname,
        u.fullname as user_fullname,
        o.id as organization_id,
        o.name as organization_name,
        o.handle as organization_handle,
        o.description as organization_description,
        o.avatar_path as organization_avatar_path,
        o.preferred_language as organization_preferred_language,
        om.role as organization_role,
        om.inserted_at as organization_membership_inserted_at
    from
        public.users u
    join
        public.organization_members om on u.id = om.user_id
    join
        public.organizations o on om.organization_id = o.id;


-- Get All schedules for the given organization joining the course, course_activity and course activityschedules
-- This view provides a list of schedules for each organization, including their details.
create or replace view public.organizations_schedules_view as
    select
        s.id as schedule_id,
        s.organization_id as schedule_organization_id,
        s.start_at as schedule_start_at,
        s.end_at as schedule_end_at,
        s.attendees as schedule_attendees,
        s.status as schedule_status,
        s.assigned_to as schedule_assigned_to,
        u.firstname as assigned_to_firstname,
        u.lastname as assigned_to_lastname,
        u.email as assigned_to_email,
        u.fullname as assigned_to_fullname,
        a.id as activity_id,
        a.name as activity_name,
        a.description as activity_description,
        a.activity_type as activity_type,
        c.id as course_id,
        c.name as course_name,
        c.description as course_description
    from
        public.course_activity_schedules s
    join
        public.course_activities a on s.activity_id = a.id
    left join
        public.users u on s.assigned_to = u.id
    join
        public.courses c on a.course_id = c.id;

        

