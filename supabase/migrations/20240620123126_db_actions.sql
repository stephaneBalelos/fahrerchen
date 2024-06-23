create or replace function public.create_student(firstname text, lastname text, email text, birth_date date, organisation_id uuid)
returns public.students as $$
declare
  user_id uuid;
begin
    user_id := extensions.uuid_generate_v4();
    
    insert into public.students (firstname, lastname, email, birth_date, organisation_id)
        values (firstname, lastname, email, birth_date, organisation_id);
        
    return (select id from public.students where id = user_id);
end;
$$ language plpgsql security invoker set search_path = public;
