-- COURSE DOCUMENTS
create table public.course_documents (
  id            uuid default uuid_generate_v4() primary key,
  name          text,
  description   text,
  path         text not null,
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  last_modified_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (path)
);
comment on table public.course_documents is 'COURSE DOCUMENTS MADE AVAILABLE FOR STUDENTS.';
alter table public.course_documents enable row level security;
revoke update on table public.course_documents from authenticated, anon;
grant update (name, description) on table public.course_documents to authenticated;

-- Indexes for faster lookups
create index idx_course_documents_organization_id on public.course_documents(organization_id);
create index idx_course_documents_path on public.course_documents(path);

-- Course Documents Policies
create policy "owner_manager_teacher_student_can_see_course_documents" on public.course_documents for select to authenticated using (public.authorize('course_documents.read', organization_id));
create policy "owner_manager_teacher_student_can_see_course_documents_storage" on storage.objects for select to authenticated using (public.authorize('course_documents.read', ((storage.foldername(name))[1])::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents.read'), ('manager', 'course_documents.read'), ('teacher', 'course_documents.read'), ('student', 'course_documents.read');

create policy "owner_manager_teacher_can_create_course_documents" on public.course_documents for insert to authenticated with check (public.authorize('course_documents.create', organization_id));
create policy "owner_manager_teacher_can_create_course_documents_storage" on storage.objects for insert to authenticated with check (public.authorize('course_documents.create', ((storage.foldername(name))[1])::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents.create'), ('manager', 'course_documents.create'), ('teacher', 'course_documents.create');

create policy "owner_manager_teacher_can_update_course_documents" on public.course_documents for update to authenticated using (public.authorize('course_documents.update', organization_id));
create policy "owner_manager_teacher_can_update_course_documents_storage" on storage.objects for update to authenticated using (public.authorize('course_documents.update', ((storage.foldername(name))[1])::uuid)) with check (public.authorize('course_documents.update', ((storage.foldername(name))[1])::uuid));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents.update'), ('manager', 'course_documents.update'), ('teacher', 'course_documents.update');

create policy "owner_manager_can_delete_course_documents_storage" on storage.objects for delete to authenticated using (public.authorize('courses.delete', ((storage.foldername(name))[1])::uuid));


-- Create bucket for course documents
    -- course Documents
insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  ('course_documents', 'course_documents', false, '{image/*, application/pdf, video/*}', 20 * 1024 * 1024) on conflict (id) do nothing; -- 20MB


-- Handle course documents changes
create or replace function public.handle_course_documents_storage_ops()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    delete from public.course_documents where path = array_to_string(old.path_tokens, '/');
    return old;
  end if;
  
  if (TG_OP = 'INSERT') then
    insert into public.course_documents (organization_id, name, description, path)
    values (((storage.foldername(new.name))[1])::uuid, null, null, array_to_string(new.path_tokens, '/'));
    return new;
  end if;
  
  if (TG_OP = 'UPDATE') then
    update public.course_documents set path = array_to_string(new.path_tokens, '/') where path = array_to_string(old.path_tokens, '/');
    return new;
  end if;
end;
$$ language plpgsql security definer set search_path = '';

create trigger "handle_course_documents_changes" after insert on storage.objects
for each row
when (new.bucket_id = 'course_documents')
execute procedure public.handle_course_documents_storage_ops();

create trigger "handle_course_documents_update" after update on storage.objects
for each row
when (new.bucket_id = 'course_documents')
execute procedure public.handle_course_documents_storage_ops();

create trigger "handle_course_documents_delete" after delete on storage.objects
for each row
when (old.bucket_id = 'course_documents')
execute procedure public.handle_course_documents_storage_ops();

-- Course Documents Combinations
create table public.course_documents_combinations (
  id            uuid default uuid_generate_v4() primary key,
  course_id    uuid references public.courses on delete cascade not null,
  document_id   uuid references public.course_documents on delete cascade not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (course_id, document_id)
);
comment on table public.course_documents_combinations is 'COURSE DOCUMENTS COMBINATIONS.';
alter table public.course_documents_combinations enable row level security;
revoke update on table public.course_documents_combinations from authenticated, anon;

-- Indexes for faster lookups
create index idx_course_documents_combinations_organization_id on public.course_documents_combinations(organization_id);

-- COURSE DOCUMENTS COMBINATIONS POLICIES
create policy "owner_manager_teacher_student_can_see_course_documents_combinations" on public.course_documents_combinations for select to authenticated using (public.authorize('course_documents_combinations.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents_combinations.read'), ('manager', 'course_documents_combinations.read'), ('teacher', 'course_documents_combinations.read'), ('student', 'course_documents_combinations.read');

create policy "owner_can_create_course_documents_combinations" on public.course_documents_combinations for insert to authenticated with check (public.authorize('course_documents_combinations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents_combinations.create');

create policy "owner_can_delete_course_documents_combinations" on public.course_documents_combinations for delete to authenticated using (public.authorize('course_documents_combinations.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_documents_combinations.delete');