create or replace function public.create_student(firstname text, lastname text, email text, birth_date date, organization_id uuid)
returns public.users as $$
declare
  user_id uuid;
begin
    user_id := extensions.uuid_generate_v4();
    
    insert into public.students (id, firstname, lastname, email, birth_date)
        values (user_id, firstname, lastname, email, birth_date);
        
    return (select * from public.users where id = user_id);
end;
$$ language plpgsql security definer set search_path = public;
