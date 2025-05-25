-- Custom types
create type public.app_permission as enum (
  'users.read',
  'users.update',
  'users.delete',
  'organizations.read',
  'organizations.create',
  'organizations.update',
  'organizations.delete',
  'organizations_stripe_accounts.read',
  'organizations_stripe_accounts.create',
  'organizations_stripe_accounts.update',
  'organization_members.read',
  'organization_members.create',
  'organization_members.update',
  'organization_members.delete',
  'organization_invitations.read',
  'organization_invitations.create',
  'organization_invitations.update',
  'organization_invitations.delete',
  'students.read',
  'students.create',
  'students.update',
  'students.delete',
  'students_registration_requests.read',
  'students_registration_requests.create',
  'students_registration_requests.update',
  'students_registration_requests.delete',
  'courses.read',
  'courses.create',
  'courses.update',
  'courses.delete',
  'course_subscriptions.read',
  'course_subscriptions.create',
  'course_subscriptions.update',
  'course_subscriptions.delete',
  'course_activities.read',
  'course_activities.create',
  'course_activities.update',
  'course_activities.delete',
  'course_activity_schedules_attendances.read',
  'course_activity_schedules_attendances.create',
  'course_activity_schedules_attendances.update',
  'course_activity_schedules_attendances.delete',
  'course_costs.read',
  'course_costs.create',
  'course_costs.update',
  'course_costs.delete',
  'course_activity_schedules.read',
  'course_activity_schedules.create',
  'course_activity_schedules.update',
  'course_activity_schedules.delete',
  'course_subscription_bills.read',
  'course_subscription_bills.create',
  'course_subscription_bills.update',
  'course_subscription_bills.delete'
);
create type public.app_role as enum ('owner','manager', 'teacher', 'student' );
create type public.user_status as enum ('ONLINE', 'OFFLINE');
create type public.activity_types as enum ('THEORY', 'PRACTICE', 'EXAM', 'OTHER');
create type public.schedule_type as enum ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
create type public.schedule_status as enum ('PLANNED', 'COMPLETED', 'CANCELED');

-- enum for führerscheinklassen
create type public.course_type as enum ('AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'L', 'T');

-- Notifications Types
create type public.notification_type as enum (
  'students_registration_requests.created',
  'course_subscriptions.created',
  'course_activity_schedules.updated',
  'course_activity_schedules.assigned',
  'course_subscription_bills.ready_to_pay',
  'course_subscription_bills.updated',
  'course_subscription_bills.paid',
  'course_subscription_bills.canceled'
);