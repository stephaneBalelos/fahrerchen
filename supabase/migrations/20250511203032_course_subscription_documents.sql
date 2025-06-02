-- COURSE SUBSCRIPTION DOCUMENTS
create table public.course_subscription_documents (
  id            uuid default uuid_generate_v4() primary key,
  course_subscription_id    uuid references public.course_subscriptions on delete cascade not null,
  required_document_id  uuid references public.course_required_documents on delete set null,
  path         text not null,
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null
);
comment on table public.course_subscription_documents is 'COURSE SUBSCRIPTION DOCUMENTS.';
alter table public.course_subscription_documents enable row level security;
revoke update on table public.course_subscription_documents from authenticated, anon;
grant update (path) on table public.course_subscription_documents to authenticated;

-- Course Subscription Documents Policies
create policy "owner_manager_can_see_course_subscription_documents" on public.course_subscription_documents for select to authenticated using (public.authorize('course_subscription_documents.read', organization_id));
create policy "owner_manager_can_see_course_subscription_documents_storage" on storage.objects for select to authenticated using (public.authorize('course_subscriptions.read', (((storage.foldername(name))[1])::uuid)::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_documents.read'), ('manager', 'course_subscription_documents.read');

create policy "owner_manager_can_create_course_subscription_documents" on public.course_subscription_documents for insert to authenticated with check (public.authorize('course_subscription_documents.create', organization_id));
create policy "owner_manager_can_create_course_subscription_documents_storage" on storage.objects for insert to authenticated with check (public.authorize('course_subscriptions.create', ((storage.foldername(name))[1])::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_documents.create'), ('manager', 'course_subscription_documents.create');

create policy "owner_manager_can_update_course_subscription_documents" on public.course_subscription_documents for update to authenticated using (public.authorize('course_subscription_documents.update', organization_id));
create policy "owner_manager_can_update_course_subscription_documents_storage" on storage.objects for update to authenticated using (public.authorize('course_subscriptions.update', (((storage.foldername(name))[1])::uuid)::uuid)) with check (public.authorize('course_subscriptions.update', (((storage.foldername(name))[1])::uuid)::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_documents.update'), ('manager', 'course_subscription_documents.update');

create policy "owner_manager_can_delete_course_subscription_documents_storage" on storage.objects for delete to authenticated using (public.authorize('course_subscriptions.delete', ((storage.foldername(name))[1])::uuid));

create policy "student_can_see_their_own_course_subscription_documents" on public.course_subscription_documents for select to authenticated using (public.course_subscription_belongs_to_student_user(course_subscription_id));
create policy "student_can_see_their_own_course_subscription_documents_storage" on storage.objects for select to authenticated using (public.course_subscription_belongs_to_student_user(((storage.foldername(name))[2])::uuid));

create policy "student_can_create_their_own_course_subscription_documents" on public.course_subscription_documents for insert to authenticated with check (public.course_subscription_belongs_to_student_user(course_subscription_id));
create policy "student_can_create_their_own_course_subscription_documents_storage" on storage.objects for insert to authenticated with check (public.course_subscription_belongs_to_student_user(((storage.foldername(name))[2])::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));

create policy "student_can_update_their_own_course_subscription_documents" on public.course_subscription_documents for update to authenticated using (public.course_subscription_belongs_to_student_user(course_subscription_id));
create policy "student_can_update_their_own_course_subscription_documents_storage" on storage.objects for update to authenticated using (public.course_subscription_belongs_to_student_user(((storage.foldername(name))[2])::uuid)) with check (public.course_subscription_belongs_to_student_user(((storage.foldername(name))[2])::uuid) and public.is_subscription_active(((storage.foldername(name))[2])::uuid));

create policy "student_can_delete_their_own_course_subscription_documents_storage" on storage.objects for delete to authenticated using (public.course_subscription_belongs_to_student_user(((storage.foldername(name))[2])::uuid));



-- create bucket for course subscription documents
    -- Course Subscription Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_subscription_documents', 'course_subscription_documents', false, '{image/*, application/pdf}', 5 * 1024 * 1024) on conflict (id) do nothing; -- 5MB

-- Handle course subscription documents changes
create or replace function public.handle_course_subscription_documents_storage_ops()
returns trigger as $$
begin

  -- Check if subscription is active
  if not public.is_subscription_active(((storage.foldername(new.name))[2])::uuid) then
    raise exception 'course_subscription_is_not_active';
  end if;

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
execute procedure public.handle_course_subscription_documents_storage_ops();

create trigger "handle_course_subscription_documents_update" after update on storage.objects
for each row
when (new.bucket_id = 'course_subscription_documents')
execute procedure public.handle_course_subscription_documents_storage_ops();

create trigger "handle_course_subscription_documents_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'course_subscription_documents')
execute procedure public.handle_course_subscription_documents_storage_ops();