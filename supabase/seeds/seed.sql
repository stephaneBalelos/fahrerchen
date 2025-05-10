-- Role Permissions
   -- Organizations
insert into public.role_permissions (role, permission) values ('owner', 'organizations.read');
insert into public.role_permissions (role, permission) values ('manager', 'organizations.read');
insert into public.role_permissions (role, permission) values ('teacher', 'organizations.read');
insert into public.role_permissions (role, permission) values ('student', 'organizations.read');

insert into public.role_permissions (role, permission) values ('owner', 'organizations.update');
insert into public.role_permissions (role, permission) values ('manager', 'organizations.update');

    -- Organizations Stripe Accounts
insert into public.role_permissions (role, permission) values ('owner', 'organizations_stripe_accounts.read');
insert into public.role_permissions (role, permission) values ('manager', 'organizations_stripe_accounts.read');
insert into public.role_permissions (role, permission) values ('teacher', 'organizations_stripe_accounts.read');
insert into public.role_permissions (role, permission) values ('student', 'organizations_stripe_accounts.read');

insert into public.role_permissions (role, permission) values ('owner', 'organizations_stripe_accounts.update');
insert into public.role_permissions (role, permission) values ('manager', 'organizations_stripe_accounts.update');

    -- Organization Members
insert into public.role_permissions (role, permission) values ('owner', 'organization_members.read');
insert into public.role_permissions (role, permission) values ('manager', 'organization_members.read');
insert into public.role_permissions (role, permission) values ('teacher', 'organization_members.read');
insert into public.role_permissions (role, permission) values ('student', 'organization_members.read');

insert into public.role_permissions (role, permission) values ('owner', 'organization_members.update');

insert into public.role_permissions (role, permission) values ('owner', 'organization_members.delete');

    -- Organization Invitations
insert into public.role_permissions (role, permission) values ('owner', 'organization_invitations.read');
insert into public.role_permissions (role, permission) values ('manager', 'organization_invitations.read');

insert into public.role_permissions (role, permission) values ('owner', 'organization_invitations.create');
insert into public.role_permissions (role, permission) values ('manager', 'organization_invitations.create');

insert into public.role_permissions (role, permission) values ('owner', 'organization_invitations.delete');
insert into public.role_permissions (role, permission) values ('manager', 'organization_invitations.delete');

    -- Students
insert into public.role_permissions (role, permission) values ('owner', 'students.read');
insert into public.role_permissions (role, permission) values ('manager', 'students.read');
insert into public.role_permissions (role, permission) values ('teacher', 'students.read');

insert into public.role_permissions (role, permission) values ('owner', 'students.create');
insert into public.role_permissions (role, permission) values ('manager', 'students.create');

insert into public.role_permissions (role, permission) values ('owner', 'students.update');
insert into public.role_permissions (role, permission) values ('manager', 'students.update');

insert into public.role_permissions (role, permission) values ('owner', 'students.delete');
insert into public.role_permissions (role, permission) values ('manager', 'students.delete');

    -- Students Registration Requests
insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.read');
insert into public.role_permissions (role, permission) values ('manager', 'students_registration_requests.read');
insert into public.role_permissions (role, permission) values ('teacher', 'students_registration_requests.read');

insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.update');
insert into public.role_permissions (role, permission) values ('manager', 'students_registration_requests.update');

insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.delete');
insert into public.role_permissions (role, permission) values ('manager', 'students_registration_requests.delete');

    -- Courses
insert into public.role_permissions (role, permission) values ('owner', 'courses.read');
insert into public.role_permissions (role, permission) values ('manager', 'courses.read');
insert into public.role_permissions (role, permission) values ('teacher', 'courses.read');
insert into public.role_permissions (role, permission) values ('student', 'courses.read');

insert into public.role_permissions (role, permission) values ('owner', 'courses.create');
insert into public.role_permissions (role, permission) values ('manager', 'courses.create');

insert into public.role_permissions (role, permission) values ('owner', 'courses.update');
insert into public.role_permissions (role, permission) values ('manager', 'courses.update');

insert into public.role_permissions (role, permission) values ('owner', 'courses.delete');

    -- Course Subscriptions
insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscriptions.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_subscriptions.read');
insert into public.role_permissions (role, permission) values ('student', 'course_subscriptions.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscriptions.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscriptions.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.delete');

    -- Course Activities
insert into public.role_permissions (role, permission) values ('owner', 'course_activities.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_activities.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activities.read');
insert into public.role_permissions (role, permission) values ('student', 'course_activities.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_activities.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_activities.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_activities.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_activities.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_activities.delete');

    -- Course Costs
insert into public.role_permissions (role, permission) values ('owner', 'course_costs.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_costs.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_costs.read');
insert into public.role_permissions (role, permission) values ('student', 'course_costs.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_costs.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_costs.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_costs.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_costs.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_costs.delete');

    -- Course Activity Attendances
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules_attendances.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules_attendances.read');
insert into public.role_permissions (role, permission) values ('student', 'course_activity_schedules_attendances.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules_attendances.create');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules_attendances.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules_attendances.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules_attendances.delete');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules_attendances.delete');

    -- Course Activity Schedules
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules.read');
insert into public.role_permissions (role, permission) values ('student', 'course_activity_schedules.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules.create');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules.update');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_schedules.delete');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_schedules.delete');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_schedules.delete');



-- Course Subscription Bills
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscription_bills.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_subscription_bills.read');
insert into public.role_permissions (role, permission) values ('student', 'course_subscription_bills.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscription_bills.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_subscription_bills.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.delete');

-- Delete all existing data
DELETE FROM public.course_activity_types;

-- Einfügen der Kurs Aktivitätstypen
INSERT INTO public.course_activity_types (type) VALUES
('THEORY'),
('PRACTICE'),
('EXAM'),
('OTHER');


-- Delete all existing data
DELETE FROM storage.buckets;
-- Storage Buckets
    -- Users Avatars
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('users_avatars', 'users_avatars', true, '{image/*}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB

    -- Student Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('student_documents', 'student_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB

    -- course Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_documents', 'course_documents', false, '{image/*, application/pdf, video/*}', 20 * 1024 * 1024) on conflict (id) do nothing; -- 20MB

    -- Course Subscription Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_subscription_documents', 'course_subscription_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB

    -- Organisations Profile Pictures
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('organizations_avatars', 'organizations_avatars', true, '{image/*}', 1 * 1024 * 1024) on conflict (id) do nothing; -- 1MB












