-- ===========================================================================
-- MacGillivray Law Arcade — shared leaderboard
-- Paste this whole file into Supabase -> SQL Editor -> Run.
--
-- What it sets up: anonymous visitors may READ the board and ADD a score,
-- and may not edit or delete anything that is already on it. That is why the
-- anon key is safe to publish in the page — it can only do what the policies
-- below allow.
-- ===========================================================================

create table if not exists public.scores (
  id          bigint generated always as identity primary key,
  game        text        not null,
  name        text        not null,
  score       integer     not null,
  level       integer,
  created_at  timestamptz not null default now(),

  -- the page sanitises these too, but the database is the boundary that counts
  constraint scores_game_ok  check (game ~ '^[a-z0-9-]{1,32}$'),
  constraint scores_name_ok  check (char_length(name) between 1 and 12),
  constraint scores_score_ok check (score >= 0 and score <= 9999999),
  constraint scores_level_ok check (level is null or (level >= 1 and level <= 999))
);

-- the board is always read as "top N for one game"
create index if not exists scores_game_score_idx
  on public.scores (game, score desc, created_at asc);

alter table public.scores enable row level security;

-- read the board
drop policy if exists "read scores" on public.scores;
create policy "read scores"
  on public.scores for select
  to anon, authenticated
  using (true);

-- add your own score. No update or delete policy exists, so nobody can
-- rewrite or wipe the board with the public key.
drop policy if exists "add score" on public.scores;
create policy "add score"
  on public.scores for insert
  to anon, authenticated
  with check (true);


-- ---------------------------------------------------------------------------
-- Optional: a tidy view of the top 20 per game, if you want to read it from
-- SQL or point a big-screen display at it.
-- ---------------------------------------------------------------------------
create or replace view public.top_scores as
select game, name, score, level, created_at
from (
  select *, row_number() over (partition by game order by score desc, created_at asc) as rn
  from public.scores
) ranked
where rn <= 20;


-- ---------------------------------------------------------------------------
-- Housekeeping you may want AFTER the party.
--
--   -- clear one game's board:
--   delete from public.scores where game = 'record-chase';
--
--   -- remove a name someone thought was funny at 11pm:
--   delete from public.scores where name ilike '%whatever%';
--
-- Run these from the SQL editor, which uses your own credentials — not the
-- anon key the page carries.
-- ---------------------------------------------------------------------------
