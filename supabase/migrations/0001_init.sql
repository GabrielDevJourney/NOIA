create extension if not exists pgcrypto;

create table cards (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz default now()
);

create table connections (
  id uuid primary key default gen_random_uuid(),
  card_id_1 uuid references cards(id),
  card_id_2 uuid references cards(id),
  concept_name text,
  definition text,
  no_connection boolean default false,
  created_at timestamptz default now()
);

alter table cards enable row level security;
alter table connections enable row level security;

create policy "public read cards" on cards for select using (true);
create policy "public insert cards" on cards for insert with check (true);
create policy "public read connections" on connections for select using (true);
create policy "public insert connections" on connections for insert with check (true);
