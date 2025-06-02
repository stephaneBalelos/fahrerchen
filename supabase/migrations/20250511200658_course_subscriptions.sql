-- COURSES SUBSCRIPTIONS
create table public.course_subscriptions (
  id            uuid default uuid_generate_v4() primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  course_id    uuid references public.courses on delete cascade not null,
  student_id    uuid references public.students on delete cascade not null,
  archived_at   timestamp with time zone default null,
  organization_id    uuid references public.organizations on delete cascade not null,
  costs        numeric default 0 not null check (costs >= 0), -- The sum of all the bills
  unique (course_id, student_id) -- unique constraint to prevent multiple subscriptions for the same course and student
);
comment on table public.course_subscriptions is 'COURSES AVAILABLE.';
alter table public.course_subscriptions enable row level security;
revoke update on table public.course_subscriptions from authenticated, anon;
grant update (archived_at, costs) on table public.course_subscriptions to authenticated;
-- unique constraint to prevent multiple active subscriptions for the same course and student
create unique index unique_active_subscription on public.course_subscriptions(course_id, student_id) where archived_at is null;


-- check subscription is coherent with organization
-- the referenced course and student must belong to the same organization
create or replace function public.check_subscription_organization(
    org_id uuid,
    student_id uuid,
    course_id uuid
)
returns boolean as $$
declare
    course_organization_id uuid;
    student_organization_id uuid;
begin
    select organization_id into course_organization_id from public.courses where id = course_id;
    select organization_id into student_organization_id from public.students where id = student_id;

    if course_organization_id is null or student_organization_id is null then
        return false;
    end if;

    return course_organization_id = org_id and student_organization_id = org_id;
end;
$$ language plpgsql security definer;


-- Check if the subscription belongs to the student user
create or replace function public.course_subscription_belongs_to_student_user(
    course_subscription_id uuid
)
returns boolean as $$
declare
    student_user_id uuid;
begin
    select user_id into student_user_id from public.students
    where id = (select student_id from public.course_subscriptions where id = course_subscription_id);
    return student_user_id = auth.uid();
    
    if student_user_id is null then
        return false;
    end if;

    return student_user_id = auth.uid();
end;
$$ language plpgsql security definer;

create policy "student_can_see_their_own_course_subscriptions" on public.course_subscriptions for select to authenticated using (public.course_subscription_belongs_to_student_user(id));

-- check if a subscription is active / not archived
create or replace function public.is_subscription_active(
  subscription_id uuid
)
returns boolean as $$
declare
  archived_date timestamp with time zone;
begin
  select archived_at into archived_date from public.course_subscriptions where id = subscription_id;

  if archived_date is not null then
    return false;
  end if;

  return true;
end;
$$ language plpgsql security definer set search_path = public;

-- Course Subscriptions Policies
create policy "owner_manager_teacher_can_see_course_subscriptions" on public.course_subscriptions for select to authenticated using (public.authorize('course_subscriptions.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.read'), ('manager', 'course_subscriptions.read'), ('teacher', 'course_subscriptions.read');

create policy "owner_manager_can_create_course_subscriptions" on public.course_subscriptions for insert to authenticated with check (public.authorize('course_subscriptions.create', organization_id) and public.check_subscription_organization(organization_id, student_id, course_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.create'), ('manager', 'course_subscriptions.create');

create policy "owner_manager_can_update_course_subscriptions" on public.course_subscriptions for update to authenticated using (public.authorize('course_subscriptions.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.update'), ('manager', 'course_subscriptions.update');

create policy "owner_can_delete_course_subscriptions" on public.course_subscriptions for delete to authenticated using (public.authorize('course_subscriptions.delete', organization_id) and (not public.is_subscription_active(id)));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscriptions.delete');

create policy "user_can_see_their_own_course_subscriptions" on public.course_subscriptions for select to authenticated using (auth.uid() = student_id);
