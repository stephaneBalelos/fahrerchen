-- Update permissions to allow authenticated users to update course costs and activities combinations

alter type public.app_permission add value 'course_costs_combinations.update';
alter type public.app_permission add value 'course_activities_combinations.update';