-- COURSE SUBSCRIPTION BILLS
create table public.course_subscription_bills (
  id            uuid default uuid_generate_v4(),
  course_subscription_id    uuid not null,
  -- The bill number is generated based on prefix "organization handle" + "year" + "month" and auto-incrementing number
  -- Example: organization-123-2024-01-1
  bill_number text not null unique check (bill_number ~ '^[a-z0-9\-]+-[0-9]{4}-[0-9]{2}-[0-9]+$'),
  -- Total is the total amount of the bill, excluding vat and discounts
  total        numeric default 0 not null check (total >= 0),
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null,
  paid_at       timestamp with time zone default null,
  ready_to_pay  boolean default false not null, -- if the bill is ready to be paid, the bill is should be locked
  stripe_payment_intent_id  text, -- Stripe Payment Intent ID
  canceled_at   timestamp with time zone default null,
  organization_id    uuid references public.organizations on delete cascade not null,
  vat_rate numeric(5, 2) default 0.0 not null check (vat_rate >= 0.0 and vat_rate <= 100.0),
  vat_amount numeric(10, 2) default 0.0 not null check (vat_amount >= 0.0),
  total_with_vat numeric(10, 2) generated always as (total + (total * (vat_rate / 100))) stored,
  check ((paid_at is not null and canceled_at is null) or (paid_at is null and canceled_at is not null) or (paid_at is null and canceled_at is null)),
  primary key (organization_id, id),
  foreign key (organization_id, course_subscription_id) references public.course_subscriptions(organization_id, id) on delete cascade
);
comment on table public.course_subscription_bills is 'COURSE SUBSCRIPTION BILLS.';
alter table public.course_subscription_bills enable row level security;
revoke update on table public.course_subscription_bills from authenticated, anon;
grant update (paid_at, ready_to_pay, stripe_payment_intent_id, canceled_at) on table public.course_subscription_bills to authenticated;

-- COURSE SUBSCRIPTION BILL ITEMS
create table public.course_subscription_bill_items (
  id            uuid default uuid_generate_v4(),
  bill_id      uuid,
  course_cost_id    uuid,
  course_activity_attendance_id    uuid,
  activity_type  public.activity_types,
  course_subscription_id    uuid,
  title        text not null,
  description   text not null,
  price       numeric default 0 not null, -- price can be negative if the attendance was refunded or a payment adjustment is made
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  organization_id    uuid references public.organizations on delete cascade not null,
  check (
    (course_cost_id is not null and course_activity_attendance_id is null) or
    (course_cost_id is null and course_activity_attendance_id is not null) or
    (course_cost_id is null and course_activity_attendance_id is null)
  ), -- either cost_id or attendance_id can be set, but not both
  primary key (organization_id, id),
  foreign key (organization_id, bill_id) references public.course_subscription_bills(organization_id, id) on delete cascade,
  foreign key (organization_id, course_subscription_id) references public.course_subscriptions(organization_id, id) on delete cascade,
  foreign key (organization_id, course_cost_id) references public.course_costs(organization_id, id) on delete set null,
  foreign key (organization_id, course_activity_attendance_id) references public.course_activity_schedules_attendances(organization_id, id) on delete set null
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
$$ language plpgsql security definer set search_path = '';



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
    raise exception 'course_subscription_is_not_active';
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
$$ language plpgsql security invoker set search_path = '';

-- generate bill number for the created bill
create or replace function public.generate_bill_number()
returns trigger as $$
declare
  org_handle text;
  year text;
  month text;
  bill_number text;
  bill_count integer;
begin
  -- Get the organization handle
  select handle into org_handle from public.organizations where id = new.organization_id;
  -- Get the current year and month
  year := to_char(new.created_at, 'YYYY');
  month := to_char(new.created_at, 'MM');
  -- Get the count of bills for the organization in the current year and month
  select count(*) into bill_count from public.course_subscription_bills
  where organization_id = new.organization_id and
        to_char(created_at, 'YYYY') = year and
        to_char(created_at, 'MM') = month;
  -- Generate the bill number
  bill_number := format('%s-%s-%s-%s', org_handle, year, month, bill_count + 1);
  -- Set the bill number
  new.bill_number := bill_number;
  return new;
end;
$$ language plpgsql security invoker set search_path = '';
-- trigger the function every time a bill is inserted
create trigger generate_bill_number_trigger
before insert on public.course_subscription_bills
for each row
execute procedure public.generate_bill_number();

-- When a subscription is inserted, create a bill item for every costs
create or replace function public.insert_bill_items_for_new_subscription()
returns trigger as $$
declare
  cost_id uuid;
  cost_name text;
  cost_description text;
  cost_price numeric;
  c_cost_price numeric;
begin
  -- Check if the subscription is active
  if not public.is_subscription_active(new.id) then
    raise exception 'course_subscription_is_not_active';
  end if;

  -- Loop through all the course costs combinations for the course
  for cost_id, cost_name, cost_description, cost_price, c_cost_price in
    select c.id, c.name, c.description, c.price, ccc.price
    from public.course_costs c
    join public.course_costs_combinations ccc on ccc.cost_id = c.id
    where ccc.course_id = new.course_id
      and ccc.organization_id = new.organization_id
  loop
    -- If there is a specific price for the cost in the combination, use it
    if c_cost_price is not null then
      cost_price := c_cost_price;
    end if;

    -- Insert a bill item for each cost
    insert into public.course_subscription_bill_items (course_subscription_id, course_cost_id, title, description, price, organization_id)
    values (new.id, cost_id, cost_name, cost_description, cost_price, new.organization_id);
  end loop;

  return new;
end;
$$ language plpgsql security invoker set search_path = '';
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
$$ language plpgsql security invoker set search_path = '';
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
    raise exception 'course_subscription_is_not_active';
  end if;

  -- Insert the bill item
  insert into public.course_subscription_bill_items (course_subscription_id, course_activity_attendance_id, activity_type, title, description, price, organization_id)
  values (new.course_subscription_id, new.id, new.activity_type, new.activity_name, new.activity_description, new.activity_price, new.organization_id);

  return new;
end;
$$ language plpgsql security invoker set search_path = '';
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
  select id, bill_id, price into bill_item_id, bill_item_bill_id, bill_item_price from public.course_subscription_bill_items where course_activity_attendance_id = old.id;

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
      -- refund the price of the attendance
      old.activity_type,
      -1 * bill_item_price,
      old.organization_id
    );
  else
    -- if the bill item is not attached to a bill, delete it
    delete from public.course_subscription_bill_items where id = bill_item_id;
  end if;

  return old;
end;
$$ language plpgsql security invoker set search_path = '';
-- trigger the function every time a course activity attendance is deleted
create trigger on_course_activity_attendance_deleted
  before delete on public.course_activity_schedules_attendances
  for each row execute procedure public.handle_delete_course_activity_attendance();

-- Before Archiving a course_subscription, check if:
-- 1. There is no active bill for the subscription
-- 2. There are no active schedules for the subscription
-- 3. There are no active bill items for the subscription
create or replace function public.validate_course_subscription_before_archiving(
  cs_id uuid
)
returns boolean as $$
declare
  active_bill_count integer;
  active_schedule_count integer;
  active_bill_item_count integer;
begin
  -- Check if there are any active bills for the subscription
  select count(*) into active_bill_count from public.course_subscription_bills
  where course_subscription_id = cs_id and public.is_bill_active(id);

  if active_bill_count > 0 then
    raise exception 'subscription_has_active_bills';
  end if;

  -- Check if there are any active bill items for the subscription
  select count(*) into active_bill_item_count from public.course_subscription_bill_items
  where course_subscription_id = cs_id and bill_id is null;

  if active_bill_item_count > 0 then
    raise exception 'subscription_has_active_bill_items';
  end if;

  -- Check if there are any active schedules for the subscription
  select count(*) into active_schedule_count from public.course_activity_schedules
  where cs_id = any(attendees) and public.is_schedule_active(id);

  if active_schedule_count > 0 then
    -- Remove the subscription from the attendees of the active schedules
    perform remove_subscription_from_active_schedules(cs_id);
  end if;

  return true;
end;
$$ language plpgsql security invoker set search_path = '';

-- Before Archiving a course_subscription, validate the subscription
create or replace function public.validate_course_subscription_before_archiving_trigger()
returns trigger as $$
begin
  if not public.validate_course_subscription_before_archiving(new.id) then
    raise exception 'course_subscription_validation_failed';
  end if;

  return new;
end;
$$ language plpgsql security invoker set search_path = '';
-- trigger the function before archiving a course subscription
create trigger validate_course_subscription_before_archiving
before update on public.course_subscriptions
for each row
when (new.archived_at is not null and old.archived_at is null)
execute procedure public.validate_course_subscription_before_archiving_trigger();

-- Trigger to insert the VAT rate and amount into course_subscription_bills before inserting a new bill
create or replace function public.set_vat_rate_and_amount()
returns trigger as $$
declare
    org_billing_settings_vat_rate numeric(5, 2);
    org_billing_settings_vat_exempt boolean;
begin
    -- Get the VAT rate and exemption status from the organization's billing settings
    select vat_rate, vat_exempt into org_billing_settings_vat_rate, org_billing_settings_vat_exempt
    from public.organization_billing_settings
    where id = new.organization_id;

    -- If the organization does not have billing settings, set default values
    if org_billing_settings_vat_rate is null then
        org_billing_settings_vat_rate := 19.0; -- Default VAT rate
    end if;
    if org_billing_settings_vat_exempt is null then
        org_billing_settings_vat_exempt := false; -- Default to not exempt
    end if;

    -- If the organization is VAT exempt, set the VAT rate to 0
    if org_billing_settings_vat_exempt then
        new.vat_rate := 0.0;
        new.vat_amount := 0.0;
    else
        new.vat_rate := org_billing_settings_vat_rate;
        -- Calculate the VAT amount based on the total and the VAT rate
        new.vat_amount := round(new.total * (org_billing_settings_vat_rate / 100), 2);
    end if;

    return new;
end;
$$ language plpgsql security invoker set search_path = '';
-- Create the trigger to set VAT rate and amount before inserting a new bill
create trigger before_insert_course_subscription_bills
before insert on public.course_subscription_bills
for each row
execute procedure public.set_vat_rate_and_amount();