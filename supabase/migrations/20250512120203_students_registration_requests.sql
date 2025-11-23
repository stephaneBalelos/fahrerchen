-- STUDENTS REGISTRATION REQUESTS
create table public.students_registration_requests (
  id            uuid default uuid_generate_v4(),
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  email         text not null,
  firstname      text not null,
  lastname      text not null,
  birth_date     date not null,
  phone_number    text not null,
  address_street    text not null,
  address_zip      text not null,
  address_city    text not null,
  address_country   text not null,
  has_a_license    boolean default false not null,
  requested_course_id uuid not null,
  status        integer default 0 not null check (status >= 0 and status <= 2), -- 0: pending, 1: accepted, 2: rejected
  organization_id    uuid references public.organizations on delete cascade not null,
  unique (email, organization_id),
  primary key (organization_id, id),
  foreign key (organization_id, requested_course_id) references public.courses(organization_id, id) on delete set null
);
comment on table public.students_registration_requests is 'STUDENTS REGISTRATION REQUESTS.';
alter table public.students_registration_requests enable row level security;
revoke update on table public.students_registration_requests from authenticated, anon;
grant update (status) on table public.students_registration_requests to authenticated;

-- Indexes for faster lookups
create index idx_students_registration_requests_organization_id on public.students_registration_requests(organization_id);
create index idx_students_registration_requests_course_id on public.students_registration_requests(requested_course_id);

-- Students Registration Requests Policies
create policy "owner_manager_can_see_students_registration_requests" on public.students_registration_requests for select to authenticated using (public.authorize('students_registration_requests.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.read'), ('manager', 'students_registration_requests.read');

create policy "owner_manager_can_update_students_registration_requests" on public.students_registration_requests for update to authenticated using (public.authorize('students_registration_requests.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.update'), ('manager', 'students_registration_requests.update');

create policy "owner_manager_can_delete_students_registration_requests" on public.students_registration_requests for delete to authenticated using (public.authorize('students_registration_requests.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'students_registration_requests.delete'), ('manager', 'students_registration_requests.delete');

-- Handle Registration Request confirmation
create or replace function public.handle_registration_request_confirmation()
returns trigger as $$
declare org_id uuid;
declare student_id uuid;
begin
  org_id := new.organization_id;

  -- prevent updating the status to PENDING
  if new.status = 0 then
    raise exception 'Status cannot be set to PENDING';
  end if;

  -- if the status is ACCEPTED, insert the student
  if new.status = 1 then
    insert into public.students (email, firstname, lastname, birth_date, phone_number, address_street, address_zip, address_city, address_country, has_a_license, organization_id)
    values (new.email, new.firstname, new.lastname, new.birth_date, new.phone_number, new.address_street, new.address_zip, new.address_city, new.address_country, new.has_a_license, org_id)
    returning id into student_id;

    -- add the student to the wished course
    insert into public.course_subscriptions (course_id, student_id, organization_id)
    values (new.requested_course_id, student_id, org_id);
  end if;

  return new;
end;
$$ language plpgsql security invoker set search_path = '';
-- trigger the function every time a registration request is updated
create trigger on_registration_request_updated
  after update of status on public.students_registration_requests
  for each row execute procedure public.handle_registration_request_confirmation();
