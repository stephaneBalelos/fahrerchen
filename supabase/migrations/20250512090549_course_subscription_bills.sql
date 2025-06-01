-- COURSE SUBSCRIPTION BILLS
create table public.course_subscription_bills (
  id            uuid default uuid_generate_v4() primary key,
  course_subscription_id    uuid references public.course_subscriptions on delete cascade not null,
  total        numeric default 0 not null check (total >= 0),
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  paid_at       timestamp with time zone default null,
  ready_to_pay  boolean default false not null, -- if the bill is ready to be paid, the bill is should be locked
  stripe_payment_intent_id  text, -- Stripe Payment Intent ID
  canceled_at   timestamp with time zone default null,
  organization_id    uuid references public.organizations on delete cascade not null,
  check ((paid_at is not null and canceled_at is null) or (paid_at is null and canceled_at is not null) or (paid_at is null and canceled_at is null))
);
comment on table public.course_subscription_bills is 'COURSE SUBSCRIPTION BILLS.';
alter table public.course_subscription_bills enable row level security;
revoke update on table public.course_subscription_bills from authenticated, anon;
grant update (paid_at, ready_to_pay, stripe_payment_intent_id, canceled_at) on table public.course_subscription_bills to authenticated;

-- COURSE SUBSCRIPTION BILL ITEMS
create table public.course_subscription_bill_items (
  id            uuid default uuid_generate_v4() primary key,
  bill_id      uuid references public.course_subscription_bills on delete cascade,
  course_cost_id    uuid references public.course_costs on delete set null,
  course_activity_attendance_id    uuid references public.course_activity_schedules_attendances on delete set null,
  activity_type  integer references public.course_activity_types, -- 0: THEORY, 1: PRACTICAL, 2: EXAM, 3: OTHER, null: Base Cost
  course_subscription_id    uuid references public.course_subscriptions on delete cascade not null,
  title        text not null,
  description   text not null,
  price       numeric default 0 not null, -- price can be negative if the atten
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  check (
    (course_cost_id is not null and course_activity_attendance_id is null) or
    (course_cost_id is null and course_activity_attendance_id is not null) or
    (course_cost_id is null and course_activity_attendance_id is null)
  )
);
comment on table public.course_subscription_bill_items is 'COURSE SUBSCRIPTION BILL ITEMS.';
alter table public.course_subscription_bill_items enable row level security;
revoke update on table public.course_subscription_bill_items from authenticated, anon;
grant update (bill_id, course_activity_attendance_id) on table public.course_subscription_bill_items to authenticated;
-- unique constraint to prevent duplicated attendances for the same subscription
create unique index unique_attendance_per_subscription on public.course_subscription_bill_items(course_activity_attendance_id, course_subscription_id) where course_activity_attendance_id is not null;
-- unique constraint to prevent duplicated costs for the same subscription
create unique index unique_cost_per_subscription on public.course_subscription_bill_items(course_cost_id, course_subscription_id) where course_cost_id is not null;

-- Check if the bill is active
create or replace function public.is_bill_active(
  bill_id uuid
)
returns boolean as $$
declare
  bill_paid_at timestamp with time zone;
  bill_canceled_at timestamp with time zone;
  bill_ready_to_pay boolean;
begin
  select paid_at, canceled_at, ready_to_pay into bill_paid_at, bill_canceled_at, bill_ready_to_pay
  from public.course_subscription_bills where id = bill_id;

  if bill_paid_at is not null then
    return false; -- Bill is paid, not active
  end if;
  if bill_canceled_at is not null then
    return false; -- Bill is canceled, not active
  end if;
  return true; -- Bill is active
end;
$$ language plpgsql security definer set search_path = public;



-- COURSE SUBSCRIPTION BILL POLICIES
create policy "owner_manager_teacher_can_see_course_subscription_bills" on public.course_subscription_bills for select to authenticated using (public.authorize('course_subscription_bills.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.read'), ('manager', 'course_subscription_bills.read'), ('teacher', 'course_subscription_bills.read');

create policy "owner_manager_can_create_course_subscription_bills" on public.course_subscription_bills for insert to authenticated with check (public.authorize('course_subscription_bills.create', organization_id) and public.is_subscription_active(course_subscription_id) and public.is_bill_active(id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.create'), ('manager', 'course_subscription_bills.create');

create policy "owner_manager_can_update_course_subscription_bills" on public.course_subscription_bills for update to authenticated using (public.authorize('course_subscription_bills.update', organization_id) and public.is_bill_active(id) );
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.update'), ('manager', 'course_subscription_bills.update');

create policy "owner_can_delete_course_subscription_bills" on public.course_subscription_bills for delete to authenticated using (public.authorize('course_subscription_bills.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bills.delete');

create policy "student_can_see_their_own_course_subscription_bills" on public.course_subscription_bills for select to authenticated using (public.course_subscription_belongs_to_student_user(course_subscription_id));

-- COURSE SUBSCRIPTION BILL ITEM POLICIES
create policy "owner_manager_teacher_can_see_course_subscription_bill_items" on public.course_subscription_bill_items for select to authenticated using (public.authorize('course_subscription_bill_items.read', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bill_items.read'), ('manager', 'course_subscription_bill_items.read'), ('teacher', 'course_subscription_bill_items.read');

create policy "owner_manager_can_create_course_subscription_bill_items" on public.course_subscription_bill_items for insert to authenticated with check (public.authorize('course_subscription_bill_items.create', organization_id) and public.is_subscription_active(course_subscription_id) and public.is_bill_active(bill_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bill_items.create'), ('manager', 'course_subscription_bill_items.create');

create policy "owner_manager_can_update_course_subscription_bill_items" on public.course_subscription_bill_items for update to authenticated using (public.authorize('course_subscription_bill_items.update', organization_id) and public.is_bill_active(bill_id) and public.is_subscription_active(course_subscription_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bill_items.update'), ('manager', 'course_subscription_bill_items.update');

create policy "owner_can_delete_course_subscription_bill_items" on public.course_subscription_bill_items for delete to authenticated using (public.authorize('course_subscription_bill_items.delete', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_subscription_bill_items.delete');

create policy "student_can_see_their_own_course_subscription_bill_items" on public.course_subscription_bill_items for select to authenticated using (public.course_subscription_belongs_to_student_user(course_subscription_id));

-- Generate Bill for Subscription
create or replace function public.generate_bill_for_subscription(
  subscription_id uuid
)
returns uuid as $$
declare
  org_id uuid;
  is_subscription_active boolean;
  bill_items uuid[];
  bill_total numeric;
  b_id uuid;
begin
  select organization_id into org_id from public.course_subscriptions where id = subscription_id;

  select public.is_subscription_active(subscription_id) into is_subscription_active;

  if not is_subscription_active then
    raise exception 'subscription_is_not_active';
  end if;

  select array_agg(id) into bill_items from public.course_subscription_bill_items where course_subscription_id = subscription_id and bill_id is null;

  if array_length(bill_items, 1) > 0 then
    select sum(price) into bill_total from public.course_subscription_bill_items where id = any(bill_items);

    insert into public.course_subscription_bills (course_subscription_id, organization_id, total)
    values (subscription_id, org_id, bill_total)
    returning id into b_id;

    update public.course_subscription_bill_items set bill_id = b_id
    where id = any(bill_items);

    return b_id;
  end if;

  return null;
end;
$$ language plpgsql security invoker set search_path = public;


-- When a subscription is inserted, create a bill item for every costs
create or replace function public.insert_bill_items_for_new_subscription()
returns trigger as $$
declare
  cost_id uuid;
  cost_name text;
  cost_description text;
  cost_price numeric;
begin
  -- Check if the subscription is active
  if not public.is_subscription_active(new.id) then
    raise exception 'Subscription is not active';
  end if;

  -- Loop through all the costs and create a bill item for each one
  for cost_id, cost_name, cost_description, cost_price in
    select id, name, description, price from public.course_costs where course_id = new.course_id and organization_id = new.organization_id
  loop
    insert into public.course_subscription_bill_items (course_subscription_id, course_cost_id, title, description, price, organization_id)
    values (new.id, cost_id, cost_name, cost_description, cost_price, new.organization_id);
  end loop;

  return new;
end;
$$ language plpgsql security invoker set search_path = public;
-- trigger the function every time a subscription is inserted
create trigger on_subscription_inserted
after insert on public.course_subscriptions
for each row
execute procedure public.insert_bill_items_for_new_subscription();

-- trigger to aggreate subscription cost base on all bill items
create or replace function public.aggregate_subscription_cost()
returns trigger as $$
declare
  total_cost numeric;
begin
  select sum(price) into total_cost from public.course_subscription_bill_items where course_subscription_id = new.course_subscription_id;

  update public.course_subscriptions set costs = total_cost where id = new.course_subscription_id;

  return new;
end;
$$ language plpgsql security invoker set search_path = public;
-- trigger the function every time a bill item is inserted or updated
create trigger on_bill_item_inserted
after insert on public.course_subscription_bill_items
for each row
execute procedure public.aggregate_subscription_cost();

-- trigger to generate bill item when an attendance is inserted
create or replace function public.handle_insert_course_activity_attendance()
returns trigger as $$
begin
  --Check if the subscription is active
  if not public.is_subscription_active(new.course_subscription_id) then
    raise exception 'Subscription is not active';
  end if;

  -- Insert the bill item
  insert into public.course_subscription_bill_items (course_subscription_id, course_activity_attendance_id, activity_type, title, description, price, organization_id)
  values (new.course_subscription_id, new.id, new.activity_type, new.activity_name, new.activity_description, new.activity_price, new.organization_id);

  return new;
end;
$$ language plpgsql security invoker set search_path = public;
-- trigger the function every time a course activity attendance is inserted
create trigger on_course_activity_attendance_inserted
after insert on public.course_activity_schedules_attendances
for each row
execute procedure public.handle_insert_course_activity_attendance();

-- trigger to delete bill item when an attendance is deleted
-- handle delete course activity attendance
create or replace function public.handle_delete_course_activity_attendance()
returns trigger as $$
declare
  bill_item_id uuid;
  bill_item_bill_id uuid;
  bill_item_price numeric;
begin
  -- check if the attendance has a bill item
  select id, bill_id, price into bill_item_id, bill_item_bill_id, bill_item_price from public.course_subscription_bill_items where course_activity_attendance_id = new.id;

  -- if the bill item is already attached to a bill, create a refund item
  if bill_item_bill_id is not null then
    insert into public.course_subscription_bill_items(
      course_subscription_id,
      title,
      description,
      activity_type,
      price,
      organization_id
    )
    values (
      old.course_subscription_id,
      old.activity_name,
      old.activity_description,
      old.activity_type,
      -- refund the price of the attendance
      -1 * bill_item_price,
      new.organization_id
    );
  else
    -- if the bill item is not attached to a bill, delete it
    delete from public.course_subscription_bill_items where id = bill_item_id;
  end if;

  return old;
end;
$$ language plpgsql security invoker set search_path = public;
-- trigger the function every time a course activity attendance is deleted
create trigger on_course_activity_attendance_deleted
  before delete on public.course_activity_schedules_attendances
  for each row execute procedure public.handle_delete_course_activity_attendance();

  