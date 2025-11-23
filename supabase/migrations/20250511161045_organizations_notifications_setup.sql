-- Manage notifications for organizations

create type public.notification_type as enum (
    'course_subscriptions.inserted',
    'course_activity_schedules.assigned_to.updated',
    'course_activity_schedules_attendees.inserted',
    'course_activity_schedules_attendees.removed',
    'course_activity_schedules.status.updated',
    'course_activity_schedules.start_at.updated',
    'course_activity_schedules.deleted',
    'course_activity_schedules_attendances.inserted',
    'course_subscription_bills.paid_at.updated',
    'course_subscription_bills.ready_to_pay.updated',
    'course_subscription_bills.canceled_at.updated',
    'students_registration_requests.inserted'
);

create type public.notification_job_status as enum (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);