create table users (
    id integer primary key,
    name text not null,
    age integer not null,
    isActive boolean not null default true
);
