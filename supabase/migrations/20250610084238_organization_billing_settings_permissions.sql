-- Add permissions for the organization_billing_settings table
create policy "members_can_read_organization_billing_settings" on public.organization_billing_settings 
    for select to authenticated using (public.authorize('organization_billing_settings.read', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.read'),
           ('manager', 'organization_billing_settings.read'),
           ('teacher', 'organization_billing_settings.read'),
           ('student', 'organization_billing_settings.read');

create policy "owner_can_create_organization_billing_settings" on public.organization_billing_settings
    for insert to authenticated with check (public.authorize('organization_billing_settings.create', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.create');

create policy "owner_can_update_organization_billing_settings" on public.organization_billing_settings
    for update to authenticated using (public.authorize('organization_billing_settings.update', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.update');

create policy "owner_can_delete_organization_billing_settings" on public.organization_billing_settings
    for delete to authenticated using (public.authorize('organization_billing_settings.delete', id));
insert into public.role_permissions (role, permission)
    values ('owner', 'organization_billing_settings.delete');