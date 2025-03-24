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


    -- Course Activity Attendances
insert into public.role_permissions (role, permission) values ('owner', 'course_activity_attendances.read');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_attendances.read');
insert into public.role_permissions (role, permission) values ('teacher', 'course_activity_attendances.read');
insert into public.role_permissions (role, permission) values ('student', 'course_activity_attendances.read');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_attendances.create');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_attendances.create');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_attendances.update');
insert into public.role_permissions (role, permission) values ('manager', 'course_activity_attendances.update');

insert into public.role_permissions (role, permission) values ('owner', 'course_activity_attendances.delete');


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


--     -- Einfügen der Führerscheinklassen
-- INSERT INTO public.course_types (type, description) VALUES
-- ('AM', 'Leichte zweirädrige Kraftfahrzeuge mit einer Höchstgeschwindigkeit von nicht mehr als 45 km/h, einer Nenndauerleistung von nicht mehr als 4 kW und einem Verbrennungsmotor mit einem Hubraum von nicht mehr als 50 cm³ oder einer anderen Antriebsform. Dreirädrige Kleinkrafträder und vierrädrige Leichtkraftfahrzeuge mit den gleichen Einschränkungen.'),
-- ('A1', 'Krafträder mit einem Hubraum von nicht mehr als 125 cm³ und einer Motorleistung von nicht mehr als 11 kW, bei denen das Leistung-Leergewichts-Verhältnis 0,1 kW/kg nicht übersteigt. Dreirädrige Kraftfahrzeuge bis 15 kW.'),
-- ('A2', 'Krafträder bis 35 kW Leistung, bei denen das Leistung-Leergewichts-Verhältnis 0,2 kW/kg nicht übersteigt und die nicht von einem Kraftrad mit einer Leistung von über 70 kW Motorleistung abgeleitet sind.'),
-- ('A', 'Alle Krafträder und dreirädrige Kraftfahrzeuge.'),
-- ('B', 'Kraftfahrzeuge mit einer zulässigen Gesamtmasse (zGM) von nicht mehr als 3.500 kg und mit nicht mehr als 8 Sitzplätzen außer dem Führersitz (auch mit Anhänger mit einer zGM von nicht mehr als 750 kg oder einem schweren Anhänger, sofern die zGM der Kombination 3.500 kg nicht übersteigt).'),
-- ('BE', 'Kombinationen aus einem Zugfahrzeug der Klasse B und einem Anhänger, sofern die zGM des Anhängers 3.500 kg nicht übersteigt.'),
-- ('C1', 'Kraftfahrzeuge mit einer zGM von mehr als 3.500 kg, aber nicht mehr als 7.500 kg und mit nicht mehr als 8 Sitzplätzen außer dem Führersitz (auch mit Anhänger mit einer zGM von nicht mehr als 750 kg).'),
-- ('C1E', 'Kombinationen aus einem Zugfahrzeug der Klasse C1 und einem Anhänger über 750 kg oder der Klasse B und einem Anhänger über 3.500 kg, soweit die zGM der Kombination jeweils 12.000 kg nicht übersteigt.'),
-- ('C', 'Kraftfahrzeuge mit einer zGM über 3.500 kg und mit nicht mehr als 8 Sitzplätzen außer dem Führersitz (auch mit Anhänger mit einer zGM von nicht mehr als 750 kg).'),
-- ('CE', 'Kombinationen aus einem Zugfahrzeug der Klasse C und einem Anhänger mit einer zGM von mehr als 750 kg.'),
-- ('D1', 'Kraftfahrzeuge bis 8 m Länge, die zur Beförderung von nicht mehr als 16 Personen außer dem Fahrzeugführer ausgelegt und gebaut sind (auch mit Anhänger mit einer zGM von nicht mehr als 750 kg).'),
-- ('D1E', 'Kombinationen aus einem Zugfahrzeug der Klasse D1 und einem Anhänger über 750 kg zGM.'),
-- ('D', 'Kraftfahrzeuge, die zur Beförderung von mehr als 8 Personen außer dem Fahrzeugführer ausgelegt und gebaut sind (auch mit Anhänger mit einer zGM von nicht mehr als 750 kg).'),
-- ('DE', 'Kombinationen aus einem Zugfahrzeug der Klasse D und einem Anhänger mit einer zGM von mehr als 750 kg.'),
-- ('L', 'Zugmaschinen bis 40 km/h (mit Anhängern bis 25 km/h), die nach ihrer bauartbedingten Höchstgeschwindigkeit für die Verwendung zu land- oder forstwirtschaftlichen Zwecken bestimmt sind und für solche Zwecke eingesetzt werden.'),
-- ('T', 'Zugmaschinen mit einer bauartbedingten Höchstgeschwindigkeit bis 60 km/h sowie selbstfahrende Arbeitsmaschinen und Futtermischwagen mit einer bauartbedingten Höchstgeschwindigkeit bis 40 km/h, die jeweils nach ihrer Bauart für die Verwendung zu land- oder forstwirtschaftlichen Zwecken bestimmt sind und für solche Zwecke eingesetzt werden (jeweils auch mit Anhängern).');

    -- Delete all existing data
DELETE FROM public.course_activity_types;
    -- Einfügen der Kurs Aktivitätstypen
INSERT INTO public.course_activity_types (type) VALUES
('THEORY'),
('PRACTICE'),
('EXAM'),
('OTHER');

-- Storage Buckets

    -- Users Avatars
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('users_avatars', 'users_avatars', true, '{image/*}', 5 * 1024 * 1024); -- 5MB

    -- Student Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('student_documents', 'student_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024); -- 5MB

    -- course Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_documents', 'course_documents', false, '{image/*, application/pdf, video/*}', 20 * 1024 * 1024); -- 20MB

    -- Course Subscription Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_subscription_documents', 'course_subscription_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024); -- 5MB

    -- Organisations Profile Pictures
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('organizations_avatars', 'organizations_avatars', true, '{image/*}', 1 * 1024 * 1024); -- 1MB












