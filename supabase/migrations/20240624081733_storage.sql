-- Storage Policies
insert into storage.buckets
  (id, name, public, allowed_mime_types)
values
  ('users_avatars', 'users_avatars', true, '{image/*}');
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
  (id, name, public, allowed_mime_types)
values
  ('student_documents', 'student_documents', false, '{image/*, application/pdf, application/msword}');
create policy "Everyone can see students Documents" on storage.objects for select to authenticated using (public.authorize('students.read', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can insert students" on storage.objects for insert to authenticated with check (public.authorize('students.create', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can update students" on storage.objects for update to authenticated using (public.authorize('students.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('students.update', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can delete students" on storage.objects for delete to authenticated using (public.authorize('students.delete', ((storage.foldername(name))[1])::uuid));



-- course Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types)
values
  ('course_documents', 'course_documents', false, '{image/*, application/pdf, application/msword}');
create policy "Everyone can see courses Documents" on storage.objects for select to authenticated using (public.authorize('courses.read', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can insert courses" on storage.objects for insert to authenticated with check (public.authorize('courses.create', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can update courses" on storage.objects for update to authenticated using (public.authorize('courses.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('courses.update', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can delete courses" on storage.objects for delete to authenticated using (public.authorize('courses.delete', ((storage.foldername(name))[1])::uuid));

-- Course Required Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types)
values
  ('course_required_documents', 'course_required_documents', false, '{image/*, application/pdf, application/msword}');
create policy "Everyone can see course required Documents" on storage.objects for select to authenticated using (public.authorize('course_subscriptions.read', (((storage.foldername(name))[1])::uuid)::uuid));
create policy "Owner & Manager can insert course required Documents" on storage.objects for insert to authenticated with check (public.authorize('course_subscriptions.create', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can update course required Documents" on storage.objects for update to authenticated using (public.authorize('course_subscriptions.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('course_subscriptions.update', ((storage.foldername(name))[1])::uuid));
create policy "Owner & Manager can delete course required Documents" on storage.objects for delete to authenticated using (public.authorize('course_subscriptions.delete', ((storage.foldername(name))[1])::uuid));
