alter table users add column isActive integer not null default 1 check (isActive in (0, 1));
