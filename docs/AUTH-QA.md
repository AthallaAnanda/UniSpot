# Authentication verification — 2026-11-16

## Completed

- `npm run typecheck` and `npm run build`: passed.
- `npm run qa:auth`: all five tests passed locally and against
  `https://unispot-ten.vercel.app`.
- Verified real Supabase password login using the private Arkavidia demo account,
  cookie persistence after reload, account-scoped saves/follows and logout.
- Verified anonymous publishing/collections/management rejection, cross-Hub
  management rejection, protected-page return destinations and safe callbacks.
- Login/signup/recovery/reset screens checked at 1440px and 390px; no horizontal
  overflow or page JavaScript errors in those checks.
- Isolated PostgreSQL RLS fixtures passed: owners see their drafts, other users
  and anonymous users cannot; cross-account profile/collection reads, Hub takeover
  and publishing are blocked. All fixtures rolled back.
- Full public payload comparison: 16 organizations, 8 Hubs and 31 opportunities
  match the pre-import export exactly.
- Every imported Hub has its own Community demo account. Credentials are in the
  ignored, mode-0600 `.local/hub-accounts.json`, not GitHub.
- Temporary import RPC removed; provisioning Edge Function retired and JWT
  verification re-enabled. No privileged provisioning code remains active.
- Vercel built the GitHub `main` commit successfully; runtime-error query returned
  no errors during initial production verification.

## Remaining configuration-dependent checks

- Google, Apple and X developer-app credentials are not yet configured. Provider
  buttons remain unavailable until Supabase reports each provider enabled.
- Email-confirmation and password-recovery delivery have not been tested using
  real mailboxes. Supabase Auth Site URL/redirect allowlist and production SMTP
  still need dashboard configuration; see `AUTH-SETUP.md`.
- Supabase's advisor reports [leaked-password protection is disabled](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
  No table/RLS security findings were reported. This Auth setting requires the
  project dashboard and depends on the project's available plan features.
- Supabase's security advisor reports
  [leaked-password protection disabled](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
  No database/RLS security findings were reported.
