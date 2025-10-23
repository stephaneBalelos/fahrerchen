create type public.schedule_request_statuses as enum ('pending', 'approved', 'rejected');

alter type public.app_permission add value 'course_activity_schedule_requests.read';
alter type public.app_permission add value 'course_activity_schedule_requests.create';
alter type public.app_permission add value 'course_activity_schedule_requests.update';
alter type public.app_permission add value 'course_activity_schedule_requests.delete';