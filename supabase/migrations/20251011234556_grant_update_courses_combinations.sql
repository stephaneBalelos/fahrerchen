

grant update (price) on table public.course_costs_combinations to authenticated;
create policy "owner_manager_can_update_course_costs_combinations" on public.course_costs_combinations for update to authenticated using (public.authorize('course_costs_combinations.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_costs_combinations.update'), ('manager', 'course_costs_combinations.update');

grant update (price, required) on table public.course_activities_combinations to authenticated;
create policy "owner_manager_can_update_course_activities_combinations" on public.course_activities_combinations for update to authenticated using (public.authorize('course_activities_combinations.update', organization_id));
insert into public.role_permissions (role, permission) values ('owner', 'course_activities_combinations.update'), ('manager', 'course_activities_combinations.update');