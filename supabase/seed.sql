-- seed first user
-- DECLARE
-- user_id uuid := extensions.uuid_generate_v4();
-- insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at)
--   values ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', 'sd@balelos.com', '$2a$10$97oBNVu46wk26d3cQCXSD.GqhoAaREtwnrZPRIaTDVI9idRJQN7i.', '{"provider":"email","providers":["email"]}', '{}', timezone('utc'::text, now()), timezone('utc'::text, now()));

-- insert into auth.identities (id, user_id, identity_data, provider, provider_id, created_at)
--   values (user_id, user_id, '{"sub": '+ user_id + '}', 'email', user_id, timezone('utc'::text, now()));

-- insert into public.organisations (id, name, inserted_at, owner_id)
-- values ('f7b3b3b4-3b7b-4b3b-8b3b-3b7b3b7b3b3b', 'Supabase', now(), user_id, );

-- insert into public.students (id, firstname, lastname, email, birth_date, organisation_id)
-- values 
--     (extensions.uuid_generate_v4(), 'John', 'Doe', 'jd@student.com', '1990-01-01', 'f7b3b3b4-3b7b-4b3b-8b3b-3b7b3b7b3b3b'),
--     (extensions.uuid_generate_v4(), 'Jane', 'Doe', 'jane@student.com', '1990-01-01', 'f7b3b3b4-3b7b-4b3b-8b3b-3b7b3b7b3b3b'),
--     (extensions.uuid_generate_v4(), 'Student', 'Balelos', 'sb@student.com', '1990-01-01', 'f7b3b3b4-3b7b-4b3b-8b3b-3b7b3b7b3b3b')
-- ;