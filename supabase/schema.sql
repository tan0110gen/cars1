
create extension if not exists pgcrypto;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  seller_id uuid references auth.users(id) on delete set null,
  make text not null,
  model text not null,
  year int not null,
  city text not null,
  price int not null,
  mileage int not null,
  description text default '',
  contact_email text default '',
  photos text[] default '{}'
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  listing_id uuid references listings(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  content text not null
);

alter table listings enable row level security;
alter table messages enable row level security;

create policy if not exists "Read listings" on listings for select using (true);
create policy if not exists "Insert own listings" on listings for insert with check (auth.uid() = seller_id);
create policy if not exists "Update own listings" on listings for update using (auth.uid() = seller_id);
create policy if not exists "Delete own listings" on listings for delete using (auth.uid() = seller_id);

create policy if not exists "Read messages" on messages for select using (true);
create policy if not exists "Insert messages" on messages for insert with check (auth.uid() = sender_id);
