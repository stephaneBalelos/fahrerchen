-- Make Orgnization's infos not optional
-- This concerns the following columns:
-- - organizations.email
-- - organizations.phone_number
-- - organizations.address_street
-- - organizations.address_zip
-- - organizations.address_city
-- - organizations.address_country
alter table public.organizations
  alter column email set not null,
  alter column phone_number set not null,
  alter column address_street set not null,
  alter column address_zip set not null,
  alter column address_city set not null,
  alter column address_country set not null;

-- Add a default value to the columns
alter table public.organizations
  alter column email set default '',
  alter column phone_number set default '',
  alter column address_street set default '',
  alter column address_zip set default '',
  alter column address_city set default '',
  alter column address_country set default '';
