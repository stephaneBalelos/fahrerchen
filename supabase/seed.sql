INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,invited_at,confirmation_token,confirmation_sent_at,recovery_token,recovery_sent_at,email_change_token_new,email_change,email_change_sent_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,phone_change,phone_change_token,phone_change_sent_at,email_change_token_current,email_change_confirm_status,banned_until,reauthentication_token,reauthentication_sent_at,is_sso_user,deleted_at,is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', 'b00285e8-2d93-5220-91e9-b28b82ca7b49', 'authenticated', 'authenticated', 'owner1@organisation1.com', '$2b$04$2MgzzdHzpQQFr5MXl3caquPt.JOCCl3RkA5p0rLY8vdq2pAW6xwJO', '2024-07-17T16:40:21.450Z', '2020-01-21T12:58:15.000Z', 'dedef55f-950a-52ac-bd01-644464709575', '2020-12-12T12:05:50.000Z', '371d0086-71c1-59da-b944-1dc5a8d31d0e', '2020-07-03T06:21:19.000Z', 'ec6b8abf-00a9-51c0-950f-0f35d09eb7a1', 'old_email@me.com:new_email@icloud.co.uk', '2020-11-23T22:59:46.000Z', '2020-08-16T20:07:51.000Z', '{"provider":"email","providers":["email"]}', '{"orgid":null,"role":null}', 't', '2024-07-17T16:40:21.450Z', '2020-03-03T02:16:57.000Z', DEFAULT, '2020-12-08T11:50:38.000Z', DEFAULT, DEFAULT, '2020-07-23T06:52:10.000Z', DEFAULT, DEFAULT, '2020-09-09T20:45:19.000Z', DEFAULT, '2020-04-20T15:23:08.000Z', DEFAULT, '2020-08-16T08:03:39.000Z', DEFAULT), ('00000000-0000-0000-0000-000000000000', '6d47a002-b1ba-5390-aaf1-ac4e0d6aefc0', 'authenticated', 'authenticated', 'owner2@organisation2.com', '$2b$04$6C15/NV2.uv3PmUfiMUzk.dM6y4otFmKUqRIv9.bIv5/SxqqcvQ8m', '2024-07-17T16:40:21.451Z', '2020-06-06T17:31:39.000Z', '1b08ff0f-6d42-5a9f-b0d1-a5f9498d2b32', '2020-09-13T20:17:11.000Z', 'a834b9ba-25a8-5c17-ae1a-a5e89da67616', '2020-05-13T04:44:39.000Z', '33dc4e79-66e5-5a3f-8ecb-ffa782461c97', 'user456@outlook.com:user456@hotmail.com', '2020-11-15T22:57:47.000Z', '2020-04-08T15:30:17.000Z', '{"provider":"email","providers":["email"]}', '{"orgid":null,"role":null}', 't', '2024-07-17T16:40:21.451Z', '2020-12-28T11:17:59.000Z', DEFAULT, '2020-10-06T10:01:38.000Z', DEFAULT, DEFAULT, '2020-07-23T18:47:30.000Z', DEFAULT, DEFAULT, '2020-06-02T17:55:35.000Z', DEFAULT, '2020-03-27T02:29:07.000Z', DEFAULT, '2020-11-19T11:00:25.000Z', DEFAULT), ('00000000-0000-0000-0000-000000000000', '9b0c3035-58ad-536d-9b8b-2c0fdf5168b4', 'authenticated', 'authenticated', 'manager1@organisation1.com', '$2b$04$Yl56vSZ.m5H8fTX8sYCoaOkoIqlnrSS2J6azgJsV46Ovi7rfOUgLa', '2024-07-17T16:40:21.452Z', '2020-12-04T12:08:09.000Z', '4b04b462-2bd6-5ac4-b4cf-32f3a36b1669', '2020-04-16T03:57:40.000Z', '69699c04-4e36-52d3-b1cd-3c39dbee14db', '2020-01-21T12:23:04.000Z', 'a77a7a41-3e3d-5b70-82e5-b6a48ab3555c', 'old_email@example.com:new_email@example.com', '2020-02-10T01:14:40.000Z', '2020-07-11T18:35:18.000Z', '{"provider":"email","providers":["email"]}', '{"orgid":null,"role":null}', 'f', '2024-07-17T16:40:21.452Z', '2020-01-05T00:24:53.000Z', DEFAULT, '2020-03-23T14:43:51.000Z', DEFAULT, DEFAULT, '2020-04-16T04:00:00.000Z', DEFAULT, DEFAULT, '2020-11-27T10:56:21.000Z', DEFAULT, '2020-12-12T23:45:20.000Z', DEFAULT, '2020-04-20T03:59:22.000Z', DEFAULT), ('00000000-0000-0000-0000-000000000000', 'e60a60a5-9c16-58cd-8294-d11a48042cac', 'authenticated', 'authenticated', 'manager2@organisation2.com', '$2b$04$.wu25Vhwkx4X.gho1UDpouZUilLkAuO7C7RNKp8Bc3gYOR0U3C7fq', '2024-07-17T16:40:21.453Z', '2020-06-22T17:44:09.000Z', '2d8bd175-eb1b-5969-be2e-53cd5fc7956a', '2020-11-27T22:36:53.000Z', 'fc02aa34-6124-556c-ac6f-eaae9e01f832', '2020-06-10T05:41:17.000Z', '49cd0929-0351-5924-833a-c2919ab588d2', 'user123@oldmail.com:user123@newmail.com', '2020-12-24T11:38:19.000Z', '2020-05-01T16:26:44.000Z', '{"provider":"email","providers":["email"]}', '{"orgid":null,"role":null}', 'f', '2024-07-17T16:40:21.453Z', '2020-03-19T02:38:04.000Z', DEFAULT, '2020-07-15T18:19:24.000Z', DEFAULT, DEFAULT, '2020-05-21T16:07:15.000Z', DEFAULT, DEFAULT, '2020-07-15T06:33:24.000Z', DEFAULT, '2020-03-27T14:07:27.000Z', DEFAULT, '2020-06-10T05:33:56.000Z', DEFAULT);
INSERT INTO auth.identities (provider_id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at,id) VALUES ('b00285e8-2d93-5220-91e9-b28b82ca7b49', 'b00285e8-2d93-5220-91e9-b28b82ca7b49', '{"sub":"b00285e8-2d93-5220-91e9-b28b82ca7b49"}', 'email', '2020-02-22T13:15:49.000Z', '2024-07-17T16:40:21.450Z', '2020-05-09T04:27:27.000Z', 'b143eba5-dccf-5102-bf0c-df1fed8e4684'), ('6d47a002-b1ba-5390-aaf1-ac4e0d6aefc0', '6d47a002-b1ba-5390-aaf1-ac4e0d6aefc0', '{"sub":"6d47a002-b1ba-5390-aaf1-ac4e0d6aefc0"}', 'email', '2020-07-07T06:18:56.000Z', '2024-07-17T16:40:21.451Z', '2020-05-05T04:50:06.000Z', 'faa53e33-d79d-5e55-8492-9d63f5d3d727'), ('9b0c3035-58ad-536d-9b8b-2c0fdf5168b4', '9b0c3035-58ad-536d-9b8b-2c0fdf5168b4', '{"sub":"9b0c3035-58ad-536d-9b8b-2c0fdf5168b4"}', 'email', '2020-07-19T19:09:07.000Z', '2024-07-17T16:40:21.452Z', '2020-11-11T22:48:09.000Z', '74f042cb-e322-509c-9d63-10e4f595b967'), ('e60a60a5-9c16-58cd-8294-d11a48042cac', 'e60a60a5-9c16-58cd-8294-d11a48042cac', '{"sub":"e60a60a5-9c16-58cd-8294-d11a48042cac"}', 'email', '2020-03-03T14:22:26.000Z', '2024-07-17T16:40:21.453Z', '2020-09-17T20:27:37.000Z', 'b9b4b9f5-2df1-59fe-9530-3958f5529a0d');
INSERT INTO public.organizations (id,inserted_at,name,owner_id) VALUES ('59eb0414-3227-5a0f-8ddb-001d48e3fe6b', DEFAULT, 'organization 0', 'b00285e8-2d93-5220-91e9-b28b82ca7b49'), ('3ea035ba-8d50-52a6-bc49-4459b96e57c9', DEFAULT, 'organization 1', '6d47a002-b1ba-5390-aaf1-ac4e0d6aefc0');
INSERT INTO public.organization_members (id,inserted_at,organization_id,user_id,role) VALUES ('3ee0f405-7041-58bf-a37e-16d304e60006', DEFAULT, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b', '9b0c3035-58ad-536d-9b8b-2c0fdf5168b4', 'manager');
INSERT INTO public.organization_members (id,inserted_at,organization_id,user_id,role) VALUES ('28ba77e4-2340-50e2-9f93-cf00a14d09bd', DEFAULT, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b', 'e60a60a5-9c16-58cd-8294-d11a48042cac', 'manager');
INSERT INTO public.students (id,email,firstname,lastname,birth_date,user_id,organization_id) VALUES ('5ce0b7bd-3312-5b3e-ab6b-ffcf05b50752', 'Filiberto_Walker71127@bleakcricket.org', 'Daphnee', 'Gleason', '1991-02-02T01:50:46.000Z', NULL, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b'), ('bdf066e1-87ef-597f-87a8-4e9e4def323a', 'Pete.Kassulke82520@fox-min.com', 'Pearline', 'Huel', '1997-08-16T07:35:00.000Z', NULL, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b');
INSERT INTO public.courses (id,inserted_at,name,description,type,organization_id) VALUES ('19eaee5e-b69f-52a5-a891-a822703a3a92', DEFAULT, 'Course 0', 'Discens sibus possitatque fatem quos.', 8, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b'), ('98262c29-76b9-5e43-9a8b-196af04f1f6f', DEFAULT, 'Course 1', 'Advero quisquamquam inquam ii possit est dolorem synephebos.', 2, '59eb0414-3227-5a0f-8ddb-001d48e3fe6b');
INSERT INTO public.courses (id,inserted_at,name,description,type,organization_id) VALUES ('512ff8ed-f120-50e5-92d7-9800f500ebfc', DEFAULT, 'Course 0', 'Discens sibus possitatque fatem quos.', 2, '3ea035ba-8d50-52a6-bc49-4459b96e57c9'), ('90275d39-1005-5f93-878e-c6777ccea068', DEFAULT, 'Course 1', 'Advero quisquamquam inquam ii possit est dolorem synephebos.', 3, '3ea035ba-8d50-52a6-bc49-4459b96e57c9');
