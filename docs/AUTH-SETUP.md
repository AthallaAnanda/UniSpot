# UniSpot authentication and deployment

## Environments

- Supabase: **UniSpot - Production**, `yusnnltuqouysvrwwdup`, Singapore.
- Vercel project: **unispot**, team **athallaananda's projects**.
- Production: https://unispot-ten.vercel.app
- GitHub: https://github.com/AthallaAnanda/UniSpot, production branch `main`.
- Local: copy `.env.example` to `.env.local`, fill the project URL and publishable key, then `npm run dev`.

The application uses cookie-based Supabase SSR authentication. `src/proxy.ts`
refreshes cookies, and server pages/API handlers independently verify identities.
All data requests use the requesting user's session; the runtime does not need an
admin key. RLS also protects direct requests to the Supabase Data API.

## Remaining dashboard configuration

The available MCP tools can manage schemas and deployments but do not expose
Supabase Auth configuration writes. The local Supabase CLI is not authenticated.
The following settings must therefore be applied by a project administrator.

### Redirects and email

Open https://supabase.com/dashboard/project/yusnnltuqouysvrwwdup/auth/url-configuration

- Site URL: `https://unispot-ten.vercel.app`.
- Redirect URLs: production/local callback URLs declared in `supabase/config.toml`.
- Keep email confirmations enabled and use a minimum password length of 8.
- Configure custom SMTP for sending signup, recovery and invitation emails to real users.
  Supabase's default email service is restricted and is not a general production mail service.

Alternatively, after authenticating a current Supabase CLI locally, review and
push the declared configuration (CLI v3):

```sh
npx supabase config diff --remote=yusnnltuqouysvrwwdup
npx supabase config push --remote=yusnnltuqouysvrwwdup --yes
```

Signup and recovery use PKCE with `/auth/callback`. The links normally need to be
opened in the browser that initiated the flow. `/auth/confirm` additionally
supports token-hash email templates. For administrator invitations, set the
invitation template's link to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/reset-password
```

### Google, Apple, X / Twitter

Configure providers at:
https://supabase.com/dashboard/project/yusnnltuqouysvrwwdup/auth/providers

All three developer consoles use this **provider callback**:

```text
https://yusnnltuqouysvrwwdup.supabase.co/auth/v1/callback
```

This is distinct from the application's `/auth/callback` redirect.

| Provider | Required setup |
| --- | --- |
| Google | OAuth web client, consent screen, permitted test users if in testing, client ID/secret, Supabase callback above. |
| Apple | Apple Developer App ID with Sign in with Apple, Services ID, Team ID, signing key and client secret. Register the Supabase domain and callback. Renew the web client secret at least every six months. Apple OAuth may not supply a display name; it can be entered on the profile page. |
| X / Twitter | OAuth **2.0** Web App, client ID/secret, callback, website/privacy/terms URLs, and email permission. Supabase provider name is **`x`**, not legacy `twitter`. |

Enter secrets only in the provider dashboards/Supabase configuration. The UI reads
the public provider settings and enables each button only when that provider is
actually enabled. Creating developer apps and supplying credentials is still
required; no provider is represented as working before that setup.

References: [SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client),
[Google](https://supabase.com/docs/guides/auth/social-login/auth-google),
[Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple),
[X](https://supabase.com/docs/guides/auth/social-login/auth-twitter).

## Imported data and ownership

The JSON catalog plus the existing SQLite database were imported on 2026-11-16:
**16 organizations, 8 Hubs and 31 published opportunities**. IDs, slugs, content,
asset paths and relationships were preserved. All public JSON payloads were
compared against the client-side export and matched exactly. SQLite files remain
on the local machine as historical source material; the deployed app does not
read or write them.

Eight Hub-specific **demo** identities were created at the user's request. Each
uses `<hub-slug>@hubs.unispot.test`, has a separate strong random password, and
owns exactly its Hub. These addresses are reserved demo identities, not email
inboxes. They cannot receive recovery/verification emails.

The provisioning machine stores the credentials in **`.local/hub-accounts.json`**
with mode `0600`. That directory is ignored by Git. Do not copy credentials into
issues, public docs, screenshots, or the repository. For real Hub administrators,
use deliverable email addresses and the invitation script below.

One-time data import and demo provisioning endpoints were retired immediately
after successful execution. The remaining provisioning Edge Function returns
410 and performs no administrative operations; JWT verification is enabled.

Personal profiles, saves and follows were not imported from browser storage.
The account's `Student`/`Community` field is display information, never an
authorization role. Ownership comes from `hubs.owner_id`.

### Administrative scripts

```sh
npm run export:catalog
npm run verify:catalog
```

For a different database, apply the migrations first and then import the export
with `scripts/import-catalog.mjs`. It inserts missing records without overwriting
existing data. It requires a locally supplied `SUPABASE_SECRET_KEY`.

`scripts/invite-hub-owners.mjs` takes a private JSON file mapping Hub slugs to
deliverable emails and sends invitations, reusing existing accounts. It requires
`SUPABASE_SECRET_KEY`, and refuses to replace a different existing owner. Current
demo-owned Hubs must first have their ownership transition explicitly reviewed.
Administrative keys must never use a `NEXT_PUBLIC_` prefix or be committed.

## Verification

```sh
npm run typecheck
npm run build
npm run qa:auth
```

Playwright starts the production server on port 3005 automatically. Set
`UNISPOT_QA_URL` to run against a deployment. The authenticated test additionally
uses the private local demo-account file, or `UNISPOT_QA_ACCOUNTS`.

The isolated Postgres policy tests are `supabase/tests/bootstrap-local.sql` and
`supabase/tests/auth-rls.sql`; apply the schema migration between them. They verify
owner draft access, cross-user isolation, takeover/publishing rejection, personal
collection isolation, and anonymous restrictions. Fixtures are rolled back.

Signup confirmation delivery, password-recovery delivery and external OAuth
round-trips require the dashboard/provider configuration above and have not
been verified using real mailboxes or provider accounts.
