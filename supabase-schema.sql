create extension if not exists pgcrypto;

create table if not exists public.tos_2026_votes (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  nickname text default '召喚師',
  tenure text,
  spending text,
  pulled jsonb default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  awards jsonb default '{}'::jsonb,
  best_leader text,
  best_member text,
  comment text,
  created_at timestamptz default now()
);

alter table public.tos_2026_votes enable row level security;

create policy "public read tos votes"
  on public.tos_2026_votes
  for select
  using (true);

create policy "public insert tos votes"
  on public.tos_2026_votes
  for insert
  with check (true);

create policy "public update tos votes"
  on public.tos_2026_votes
  for update
  using (true)
  with check (true);

create index if not exists tos_2026_votes_created_at_idx on public.tos_2026_votes (created_at desc);
