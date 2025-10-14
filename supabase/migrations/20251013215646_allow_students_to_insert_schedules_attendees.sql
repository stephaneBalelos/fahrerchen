insert into public.role_permissions (role, permission) values ('student', 'course_activity_schedules_attendees.create');
insert into public.role_permissions (role, permission) values ('student', 'course_activity_schedules_attendees.delete');

-- Allow students to insert themselves as attendees to schedules if the activity allows self-registration
create or replace function public.can_student_insert_schedule_attendee(schedule_id uuid, subscription_id uuid)
returns boolean as $$
declare org_id uuid;
        a_id uuid;
        a_allow_self_registration boolean;
begin
    select organization_id, activity_id into org_id, a_id from public.course_activity_schedules where id = schedule_id;
    select allow_self_registration into a_allow_self_registration from public.course_activities where id = a_id;

    if org_id is null then
        return false;
    end if;
    if not a_allow_self_registration then
        return false;
    end if;
    if not public.authorize('course_activity_schedules_attendees.create', org_id) then
        return false;
    end if;
    if not public.course_subscription_belongs_to_student_user(subscription_id) then
        return false;
    end if;

    return true;
end;
$$ language plpgsql security definer set search_path = '';

alter policy "owner_manager_teacher_can_create_course_activity_schedules_attendees" 
on public.course_activity_schedules_attendees
to authenticated with check 
((public.can_student_insert_schedule_attendee(schedule_id, subscription_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id)) or 
(public.authorize('course_activity_schedules_attendees.create', organization_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id)));

alter policy "owner_manager_teacher_can_delete_course_activity_schedules_attendees"
on public.course_activity_schedules_attendees
to authenticated using
((public.can_student_insert_schedule_attendee(schedule_id, subscription_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id)) or
(public.authorize('course_activity_schedules_attendees.delete', organization_id) and public.is_schedule_active(schedule_id) and public.is_subscription_active(subscription_id)));