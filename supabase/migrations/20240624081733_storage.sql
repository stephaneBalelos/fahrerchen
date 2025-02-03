-- Storage Policies
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('users_avatars', 'users_avatars', true, '{image/*}', 5 * 1024 * 1024); -- 5MB
create policy "Allow Users to see their profile pictures" on storage.objects for select to authenticated using (
  bucket_id = 'users_avatars'
);
create policy "Allow Users to upload their profile pictures" on storage.objects for insert to authenticated with check (
  bucket_id = 'users_avatars' and auth.uid()::text = owner_id
);
create policy "Allow Users to update their profile pictures" on storage.objects for update to authenticated with check (
  bucket_id = 'users_avatars' and auth.uid()::text = owner_id
);
create policy "Allow Users to delete their profile pictures" on storage.objects for delete to authenticated using (
  bucket_id = 'users_avatars' and auth.uid()::text = owner_id
);





-- Student Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('student_documents', 'student_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024); -- 5MB
create policy "Everyone can see students Documents" on storage.objects for select to authenticated using (public.authorize('students.read', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can insert students" on storage.objects for insert to authenticated with check (public.authorize('students.create', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can update students" on storage.objects for update to authenticated using (public.authorize('students.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('students.update', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can delete students" on storage.objects for delete to authenticated using (public.authorize('students.delete', ((storage.foldername(name))[1])::uuid));

-- course Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_documents', 'course_documents', false, '{image/*, application/pdf, video/*}', 20 * 1024 * 1024); -- 20MB
create policy "Everyone can see courses Documents" on storage.objects for select to authenticated using (public.authorize('courses.read', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can insert courses" on storage.objects for insert to authenticated with check (public.authorize('courses.create', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can update courses" on storage.objects for update to authenticated using (public.authorize('courses.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('courses.update', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can delete courses" on storage.objects for delete to authenticated using (public.authorize('courses.delete', ((storage.foldername(name))[1])::uuid));

-- Course Subscription Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_subscription_documents', 'course_subscription_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024); -- 5MB
create policy "Everyone can see course required Documents" on storage.objects for select to authenticated using (public.authorize('course_subscriptions.read', (((storage.foldername(name))[1])::uuid)::uuid));
create policy "Owner & Manager can insert course required Documents" on storage.objects for insert to authenticated with check (public.authorize('course_subscriptions.create', ((storage.foldername(name))[1])::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));
create policy "Owner & Manager can update course required Documents" on storage.objects for update to authenticated using (public.authorize('course_subscriptions.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('course_subscriptions.update', ((storage.foldername(name))[1])::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));
create policy "Owner & Manager can delete course required Documents" on storage.objects for delete to authenticated using (public.authorize('course_subscriptions.delete', ((storage.foldername(name))[1])::uuid));


-- Organisations Profile Pictures
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('organizations_avatars', 'organizations_avatars', true, '{image/*}', 1 * 1024 * 1024); -- 1MB


-- Add, Update or clear avatar_path in public.organizations when a new avatar is uploaded or deleted
create or replace function public.handle_organization_avatar()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    update public.organizations set avatar_path = null where avatar_path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    update public.organizations set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.organizations set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
end;
$$ language plpgsql security invoker;

create trigger "handle_organization_avatar_create" after insert on storage.objects
for each row
when (new.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();

create trigger "handle_organization_avatar_update" after update on storage.objects
for each row
when (new.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();

create trigger "handle_organization_avatar_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'organizations_avatars')
execute procedure public.handle_organization_avatar();

-- Add, Update or clear avatar_path in public.users when a new avatar is uploaded or deleted
create or replace function public.handle_user_avatar()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    update public.users set avatar_path = null where avatar_path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    update public.users set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.users set avatar_path = array_to_string(new.path_tokens, '/') where id = ((storage.foldername(new.name))[1])::uuid;
    return new;
  end if;
end;
$$ language plpgsql security definer;

create trigger "handle_user_avatar_create" after insert on storage.objects
for each row
when (new.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();

create trigger "handle_user_avatar_update" after update on storage.objects
for each row
when (new.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();

create trigger "handle_user_avatar_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'users_avatars')
execute procedure public.handle_user_avatar();


-- Create Or Delete entry in public.course_documents when a new document is uploaded or deleted
create or replace function public.handle_course_documents()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    delete from public.course_documents where path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    insert into public.course_documents (course_id, organization_id, name, description, path)
    values (((storage.foldername(new.name))[2])::uuid, ((storage.foldername(new.name))[1])::uuid, null, null, array_to_string(new.path_tokens, '/'));
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.course_documents set path = array_to_string(new.path_tokens, '/') where path = array_to_string(old.path_tokens, '/');
    return new;
  end if;
end;
$$ language plpgsql security definer;

create trigger "handle_course_documents_create" after insert on storage.objects
for each row
when (new.bucket_id = 'course_documents')
execute procedure public.handle_course_documents();

create trigger "handle_course_documents_update" after update on storage.objects
for each row
when (new.bucket_id = 'course_documents')
execute procedure public.handle_course_documents();

create trigger "handle_course_documents_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'course_documents')
execute procedure public.handle_course_documents();


-- Create Or Delete entry in public.course_subscription_documents when a new document is uploaded or deleted
create or replace function public.handle_course_subscription_documents()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    delete from public.course_subscription_documents where path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    insert into public.course_subscription_documents (course_subscription_id, required_document_id, organization_id, path)
    values (((storage.foldername(new.name))[2])::uuid, ((storage.foldername(new.name))[3])::uuid, ((storage.foldername(new.name))[1])::uuid, array_to_string(new.path_tokens, '/'));
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.course_subscription_documents set path = array_to_string(new.path_tokens, '/') where path = array_to_string(old.path_tokens, '/');
    return new;
  end if;
end;
$$ language plpgsql security definer;

create trigger "handle_course_subscription_documents_create" after insert on storage.objects
for each row
when (new.bucket_id = 'course_subscription_documents')
execute procedure public.handle_course_subscription_documents();

create trigger "handle_course_subscription_documents_update" after update on storage.objects
for each row
when (new.bucket_id = 'course_subscription_documents')
execute procedure public.handle_course_subscription_documents();

create trigger "handle_course_subscription_documents_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'course_subscription_documents')
execute procedure public.handle_course_subscription_documents();




