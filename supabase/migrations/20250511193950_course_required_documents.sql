-- COURSE REQUIRED DOCUMENTS
create table public.course_required_documents (
  id            uuid default uuid_generate_v4(),
  name          text not null,
  description   text not null,
  inserted_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  primary key (organization_id, id)
);
comment on table public.course_required_documents is 'COURSE REQUIRED DOCUMENTS.';
alter table public.course_required_documents enable row level security;
revoke update on table public.course_required_documents from authenticated, anon;
grant update (name, description) on table public.course_required_documents to authenticated;

-- Course Required Documents Policies
create policy "owner_manager_teacher_student_can_see_course_required_documents" on public.course_required_documents for select to authenticated using (public.authorize('course_required_documents.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.read'), ('manager', 'course_required_documents.read'), ('teacher', 'course_required_documents.read'), ('student', 'course_required_documents.read');

create policy "owner_can_create_course_required_documents" on public.course_required_documents for insert to authenticated with check (public.authorize('course_required_documents.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.create');

create policy "owner_manager_can_update_course_required_documents" on public.course_required_documents for update to authenticated using (public.authorize('course_required_documents.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.update'), ('manager', 'course_required_documents.update');

create policy "owner_can_delete_course_required_documents" on public.course_required_documents for delete to authenticated using (public.authorize('course_required_documents.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents.delete');

-- Indexes for faster lookups
create index idx_course_required_documents_organization_id on public.course_required_documents(organization_id);

-- Course Required Documents Combinations
create table public.course_required_documents_combinations (
  id uuid default uuid_generate_v4(),
  course_id uuid,
  required_document_id uuid,
  organization_id uuid references public.organizations on delete cascade not null,
  unique (course_id, required_document_id),
  primary key (organization_id, id),
  foreign key (organization_id, course_id) references public.courses(organization_id, id) on delete cascade,
  foreign key (organization_id, required_document_id) references public.course_required_documents(organization_id, id) on delete cascade
);
comment on table public.course_required_documents_combinations is 'COURSE REQUIRED DOCUMENTS COMBINATIONS.';
alter table public.course_required_documents_combinations enable row level security;
revoke update on table public.course_required_documents_combinations from authenticated, anon;

-- Indexes for faster lookups
create index idx_course_required_documents_combinations_organization_id on public.course_required_documents_combinations(organization_id);

-- COURSE REQUIRED DOCUMENTS COMBINATIONS POLICIES
create policy "owner_manager_teacher_student_can_see_course_required_documents_combinations" on public.course_required_documents_combinations for select to authenticated using (public.authorize('course_required_documents_combinations.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents_combinations.read'), ('manager', 'course_required_documents_combinations.read'), ('teacher', 'course_required_documents_combinations.read'), ('student', 'course_required_documents_combinations.read');

create policy "owner_can_create_course_required_documents_combinations" on public.course_required_documents_combinations for insert to authenticated with check (public.authorize('course_required_documents_combinations.create', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents_combinations.create');

create policy "owner_can_delete_course_required_documents_combinations" on public.course_required_documents_combinations for delete to authenticated using (public.authorize('course_required_documents_combinations.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_required_documents_combinations.delete');


