# MacGillivray Law Arcade

Vertical arcade games for MacGillivray Injury & Insurance Law. Plain HTML, CSS
and canvas — no build step, no framework, no dependencies. Drop the folder on
any static host and it runs.

Currently shipping **Counsel Chase**, a maze game. The Advocate eats case files
while Denial, Delay, Lowball and Fine Print give chase; the firm's own mark is
the power pellet.

```
index.html          Counsel Chase (game + engine, self-contained)
favicon.svg         the firm mark
js/config.js        which leaderboard backend to use  <-- the only file you edit
js/leaderboard.js   leaderboard: local / supabase / hub
supabase/schema.sql paste-in SQL for the shared board
.nojekyll           tells GitHub Pages not to run Jekyll over the files
```

---

## 1. Put it online (GitHub Pages)

```bash
git init
git add .
git commit -m "MacGillivray Law Arcade"
git branch -M main
git remote add origin git@github.com:YOUR-ORG/mgl-arcade.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
A minute later it's live at `https://YOUR-ORG.github.io/mgl-arcade/` and you can
send that link to anyone.

**Two things to know before you push:**

- On a free GitHub plan, Pages only works from a **public repo**. The games are
  harmless, but the repo will contain the firm's logo and palette in the open.
  If that matters, either use a paid plan (Pages from private repos) or host on
  **Cloudflare Pages**, which is free, serves private repos, and — usefully —
  can also host the leaderboard backend in the same place.
- Nothing here is secret *except* what you choose to put in `js/config.js`.
  Read section 2 before pasting any key into it.

---

## 2. The leaderboard

GitHub Pages is static hosting. It serves files and runs no code, so it cannot
store scores by itself. The arcade handles this with three interchangeable
backends, selected by one line in `js/config.js`.

### `local` — the default, zero setup

Scores go to the player's own browser (`localStorage`). Good enough to test,
good enough for a peer to chase their own best, good enough for one cabinet.
Nobody sees anybody else's scores.

### `supabase` — a shared board, works on GitHub Pages

This is the one you want for a party.

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, **Run**.
3. **Project Settings → API**, copy the **Project URL** and the **anon / public**
   key.
4. Put both in `js/config.js` and set `driver: "supabase"`.

```js
driver: "supabase",
supabase: {
  url: "https://abcdefghijkl.supabase.co",
  anonKey: "eyJhbGciOi...."
}
```

**Yes, that key is meant to be public.** It ships to every visitor's browser
and there is no way to hide it in a static site. It is safe because the SQL in
step 2 turns on row-level security with exactly two policies: anyone may *read*
the board and *add* a score, and there is no update or delete policy at all —
so nobody holding that key can rewrite or wipe what's already there. Never put
the `service_role` key in this file; that one really is a master key.

Anyone can still *add* junk rows. For a firm Christmas party that's an
acceptable trade; the cleanup queries at the bottom of `schema.sql` handle the
one person who thinks of something clever at 11pm.

### `hub` — the Pi on the party's own network

For the physical cabinets, where you don't want to depend on the venue's wifi.
Point `hub.url` at the Raspberry Pi running the local leaderboard server and
the cabinets work with no internet at all.

### It never loses a score

Every score is written locally **first**, so the player always sees it land.
If the remote write fails, the score is queued and retried on the next page
load, the next submit, and whenever the browser comes back online.

---

## 3. Running it locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. It must be served over HTTP — opening
`index.html` straight off the disk breaks the `js/` imports.

---

## 4. Controls

| | |
|---|---|
| Move | Arrow keys, or `W` `A` `S` `D` |
| Start / restart | `Enter` or `Space` |
| Pause | `P` |
| Mute | `M` |
| Phone | Swipe the screen, or use the on-screen pad |

The layout is portrait-first: it fills a phone screen, and it fills a monitor
rotated 90° in a cabinet. On a cabinet, an Ultimarc I-PAC presents the joystick
to the Pi as arrow keys, so the games need no changes at all.

---

## 5. Brand

Logo, wordmark and palette are the firm's own, taken from macgillivraylaw.com:

| | |
|---|---|
| Brand teal | `#068288` |
| Dark teal | `#004953` |
| Ink | `#13292b` |
| Pale | `#E8F2F4` |
| Red | `#E53C3C` |
| Orange | `#FE611E` |

The firm's typeface, **Gilroy**, is licensed and can't be redistributed here.
The pages set `Gilroy` first in the stack and fall back to **Outfit**, the
closest free geometric sans — so if you add a licensed Gilroy `@font-face`
block, every page picks it up with no other change.

---

## 6. Not legal advice

It's a game about a maze. Nothing in it describes how any real claim works.
