-- 神魔之塔 2026 上半年卡池強度票選：Supabase 資料表
-- 使用方式：到 Supabase 專案 > SQL Editor > 貼上本檔內容並執行。

create extension if not exists pgcrypto;

create table if not exists public.tos_2026_votes (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  nickname text default '匿名召喚師',
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

-- 允許前端匿名讀取統計資料
create policy "public read tos votes"
  on public.tos_2026_votes
  for select
  using (true);

-- 允許前端匿名新增資料
create policy "public insert tos votes"
  on public.tos_2026_votes
  for insert
  with check (true);

-- 允許同一 client_id 更新自己的上一票。
-- 注意：這是輕量防重複，不能防 VPN / 無痕模式 / 惡意灌票。
create policy "public update tos votes"
  on public.tos_2026_votes
  for update
  using (true)
  with check (true);

create index if not exists tos_2026_votes_created_at_idx on public.tos_2026_votes (created_at desc);
