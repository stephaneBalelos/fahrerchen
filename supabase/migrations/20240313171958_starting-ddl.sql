create table user_profiles (
  user_id uuid primary key references auth.users (id) not null,
  firstname text not null,
  lastname text not null,
  birthdate date not null,
  email text not null,
);