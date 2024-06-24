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