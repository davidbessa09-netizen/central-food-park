-- Repair script: safely re-creates all RLS policies for reservations and
-- blocked_dates, regardless of what already exists. Safe to run more than
-- once. Run this in the Supabase SQL Editor if reservations aren't being
-- created from the public booking form (RLS policy violation error).

-- ── reservations ─────────────────────────────────────────────────────────

drop policy if exists "public can insert reservations" on public.reservations;
create policy "public can insert reservations"
  on public.reservations for insert
  to anon
  with check (true);

drop policy if exists "admin can select reservations" on public.reservations;
create policy "admin can select reservations"
  on public.reservations for select
  to authenticated
  using (true);

drop policy if exists "admin can update reservations" on public.reservations;
create policy "admin can update reservations"
  on public.reservations for update
  to authenticated
  using (true) with check (true);

drop policy if exists "admin can delete reservations" on public.reservations;
create policy "admin can delete reservations"
  on public.reservations for delete
  to authenticated
  using (true);

-- ── blocked_dates ────────────────────────────────────────────────────────

drop policy if exists "anyone can read blocked dates" on public.blocked_dates;
create policy "anyone can read blocked dates"
  on public.blocked_dates for select
  to anon, authenticated
  using (true);

drop policy if exists "admin can insert blocked dates" on public.blocked_dates;
create policy "admin can insert blocked dates"
  on public.blocked_dates for insert
  to authenticated
  with check (true);

drop policy if exists "admin can delete blocked dates" on public.blocked_dates;
create policy "admin can delete blocked dates"
  on public.blocked_dates for delete
  to authenticated
  using (true);

-- ── public availability view (safe to re-run: CREATE OR REPLACE) ────────

create or replace view public.reservation_availability as
  select data, pacote, espaco, status
  from public.reservations;

grant select on public.reservation_availability to anon, authenticated;
