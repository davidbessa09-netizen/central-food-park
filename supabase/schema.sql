-- Central Food Park — Supabase schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

-- ── Tables ───────────────────────────────────────────────────────────────────

create table public.reservations (
  id bigint generated always as identity primary key,
  responsavel text not null,
  whatsapp text not null,
  data date not null,
  horario text,
  aniversariante text,
  nascimento text,
  pacote int not null,
  adultos int not null default 0,
  criancas int not null default 0,
  tema text,
  obs text,
  espaco text,
  espaco_nome text,
  pagamento text,
  status text not null default 'Pré-reserva',
  valor numeric not null default 0,
  pix_confirmado boolean not null default false,
  created_at timestamptz not null default now()
);

create index reservations_data_idx on public.reservations (data);

-- Prevents double-booking the same date + area at the database level
-- (covers both the free named spaces "s1".."s11" and the paid-package
-- implicit slots "pkg-<id>").
create unique index reservations_unique_active_slot
  on public.reservations (data, espaco)
  where status <> 'Cancelada';

create table public.blocked_dates (
  data date primary key
);

-- ── Row Level Security ──────────────────────────────────────────────────────

alter table public.reservations enable row level security;
alter table public.blocked_dates enable row level security;

-- reservations: anyone can create a reservation (the public booking form),
-- but only an authenticated admin can read, update or delete.
create policy "public can insert reservations"
  on public.reservations for insert
  to anon
  with check (true);

create policy "admin can select reservations"
  on public.reservations for select
  to authenticated
  using (true);

create policy "admin can update reservations"
  on public.reservations for update
  to authenticated
  using (true) with check (true);

create policy "admin can delete reservations"
  on public.reservations for delete
  to authenticated
  using (true);

-- blocked_dates: readable by anyone (needed by the public booking form),
-- only the admin can block/unblock a date.
create policy "anyone can read blocked dates"
  on public.blocked_dates for select
  to anon, authenticated
  using (true);

create policy "admin can insert blocked dates"
  on public.blocked_dates for insert
  to authenticated
  with check (true);

create policy "admin can delete blocked dates"
  on public.blocked_dates for delete
  to authenticated
  using (true);

-- ── Public availability view ────────────────────────────────────────────────
-- Exposes only the columns needed to compute "taken/free" per date+area,
-- without ever exposing customer name/WhatsApp/etc to anonymous visitors.
-- Created by the table owner, so it bypasses the base table's restrictive
-- RLS transparently — anon can query the view even though anon has no
-- select policy on `reservations` itself, because the view only ever
-- returns these 4 safe columns.
create view public.reservation_availability as
  select data, pacote, espaco, status
  from public.reservations;

grant select on public.reservation_availability to anon, authenticated;
