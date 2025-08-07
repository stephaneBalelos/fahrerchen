create extension if not exists pgmq;

select pgmq.create('organization_notifications');
-- Enable row-level security for the queue
alter table pgmq.q_organization_notifications enable row level security;
alter table pgmq.a_organization_notifications enable row level security;