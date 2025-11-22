create type public.activity_types as enum ('THEORY', 'PRACTICE', 'EXAM', 'OTHER');
create type public.schedule_type as enum ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
create type public.schedule_status as enum ('PLANNED', 'COMPLETED', 'CANCELED');

-- enum for führerscheinklassen
create type public.course_type as enum ('AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'L', 'T');