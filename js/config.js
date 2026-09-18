/* ==========================================================================
   MacGillivray Law Arcade — leaderboard configuration
   --------------------------------------------------------------------------
   Leave this file exactly as it is and the arcade still works: scores save to
   each player's own browser (localStorage), which is enough to test, enough
   for a peer to beat their own best, and enough for a single cabinet.

   To turn on a SHARED board that everyone sees, pick one backend below and
   fill it in. Nothing here is secret — this file ships to the browser, so it
   must only ever hold public, publishable keys.
   ========================================================================== */

window.ARCADE_CONFIG = {

  /* Which backend to use: "local" | "supabase" | "hub"
     "local"    — this browser only. No setup. The default.
     "supabase" — shared board over the internet. Works on GitHub Pages.
     "hub"      — the Raspberry Pi on the party's own network. No internet.  */
  driver: "supabase",

  /* ---- supabase --------------------------------------------------------
     Project Settings -> API. Both of these values are PUBLIC by design;
     the anon key is safe in client code as long as row-level security is
     on (see supabase/schema.sql, which sets it up correctly).            */
  supabase: {
    url: "https://yvpnbdnwpyulndmxuasr.supabase.co",
    anonKey: "sb_publishable_5Mzsmz1pO_Uj4Nab4p6amg_eQ-F2IWE"  // publishable key — safe in client code with RLS on
  },

  /* ---- hub -------------------------------------------------------------
     The Pi running the local leaderboard at the party.                    */
  hub: {
    url: ""         // e.g. "http://10.0.0.1:8080"
  },

  /* How many rows the on-screen board shows. */
  boardSize: 10
};
