# UniSpot

**Find your people. Find your possibilities.**

An English-language discovery platform for students across Indonesia: events, scholarships, learning, competitions, volunteering, career development, study abroad, and communities.

## Run

Use **Node.js 22.x**. Authentication and durable application storage use Supabase.

```bash
npm install
cp .env.example .env.local
# Fill the Supabase URL and publishable key in .env.local.
npm run dev
```

Open **http://localhost:3000** for the UniSpot landing page, or **http://localhost:3000/discover** for the featured opportunity overview.

```bash
npm run build
npm run typecheck
npm start
```

## Product experience

- Original UniSpot vector logo, matching favicon, and magenta/coral/orange brand palette.
- The landing page preserves the Ugency template's original Framer layout, typography, colors, responsive wrappers, and interactions, with UniSpot branding/content and locally hosted replacement photos/videos.
- Locally hosted Inter variable font and measured Luma-style typography:16px body,20px feed-card titles, normal letter spacing, and exact squircle geometry.
- Seventeen sourced opportunities in eight categories, with real organizer links and local imagery.
- **Discover** is a featured overview with category and location navigation.
- **Explore** is the searchable catalog: a left sidebar for keywords, category, location, Hub, format, date range, and sorting, with progressive results on the right. Checkbox groups support multiple selections.
- Email/password login and signup, confirmation/resend, password recovery, and provider-ready Google, Apple and X / Twitter sign-in.
- Profiles, saved opportunities and followed Hubs are persisted per account in Supabase.
- Shareable filter and opportunity URLs.
- Right-side550px event panels with Copy Link, Event Page, previous/next navigation, eligibility, benefits, cost, schedule, and official sources.
- Dynamic standalone two-column opportunity pages at `/opportunities/[id]`, including newly published posts.
- Hub directory with All Hubs, Following, and My Hubs collections.
- Tenara-inspired240px search/filter sidebars on Explore and Hubs, with600ms accordions,400ms chevrons, and a modal left-side filter panel on mobile.
- Default grid catalogs with3 desktop columns,2 tablet columns, and1 small-mobile column. Explore/Saved also offer the existing horizontal list/timeline; Hubs offers a compact logo-and-description list.
- Animated Grid/List toggle beside the result heading:340ms sliding selection indicator and240ms soft result fade. View preferences are remembered separately for Explore, Saved and Hubs; `?view=grid` or `?view=list` overrides the stored choice. Arrow keys, Home and End operate the focused toggle.
- Shared soft-motion system:420ms panel entrances,260ms exits,300ms client-page entrances, desktop-only2px card lifts, subtle press/save/follow feedback, and animated toasts. Initial page content stays visible immediately; typing and pagination do not replay result motion. Reduced-motion preferences are respected.
- Compact opportunity cards with2-line titles, date-only schedule labels, and a uniform Ongoing label for undated programs. Date/organizer/location rows are grouped tightly; full schedule details remain on the detail page.
- Public Hub pages with cover, logo, month/date picker, Upcoming/Past/All feeds, and scoped Explore links.
- Compact Instagram, TikTok, LinkedIn and Website links on Hub pages. Verified official social URLs are included where available; missing links appear as noninteractive muted icons. New Hubs can supply optional social URLs during creation.
- Pink Create a Hub actions and charcoal Follow/Following buttons, matching the registration action style.
- Hub creation and owner-only opportunity editing: save draft, publish, update, and unpublish.
- Calendar downloads for individual dated opportunities and complete public Hub feeds.
- Location exploration and an About panel.

## Routes and publishing

| Route | Purpose |
| --- | --- |
| `/` | UniSpot landing page and student/organizer paths |
| `/discover` | Featured overview |
| `/explore` | Search individual published opportunities |
| `/login`, `/signup` | Email and social authentication |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/account` | Account profile (login required) |
| `/saved` | Account's saved opportunities (login required) |
| `/hubs` | Public Hub directory and account collections |
| `/hubs/new` | Create a community or organizer Hub |
| `/hubs/[slug]` | Public Hub profile and opportunity feed |
| `/hubs/[slug]/manage` | Owner-only drafts and publishing editor |
| `/opportunities/[id]` | Public opportunity detail; unpublished IDs return 404 |

A published post appears in its Hub and the individual Explore results. Drafts are excluded from the public catalog, detail pages, and ICS feed. Unpublishing removes the post from all three. The editor’s registration link directs students to the organizer’s website. Legacy `/calendars/...` page URLs redirect to their `/hubs/...` equivalents; the underlying API and database retain their original calendar identifiers for compatibility.

### Storage and ownership

- Organizations, Hubs, opportunities, profiles and account collections are persisted in Supabase Postgres with RLS.
- Hub creation requires a verified session and assigns the authenticated account as owner. Management works across devices; API handlers and database policies enforce ownership.
- Drafts are visible only to their Hub owner. Public catalog/detail/ICS queries explicitly select published posts.
- The historical SQLite data and JSON catalog were imported: **8 Hubs, 16 organizations and 31 opportunities**. Runtime SQLite access has been removed for Vercel deployment.
- Following and Saved require login and are synced per account. Following does not enroll a user in email notifications.
- The seven original Hubs are **curated from official sources by UniSpot**. Their names do not imply official account verification. Demo owner accounts have been provisioned for all eight imported Hubs; private credentials are stored locally outside Git.
- See **[authentication and deployment setup](docs/AUTH-SETUP.md)** for provider configuration, required email/redirect settings, demo accounts, migrations and verification.

### API

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/catalog` | Public published catalog, verified account-specific `canManage` flags |
| POST | `/api/calendars` | Login required; creates an account-owned Hub (legacy API path) |
| GET | `/api/calendars/[slug]/manage` | Owner only; includes drafts (legacy API path) |
| POST | `/api/calendars/[slug]/opportunities` | Owner only; draft or published post (legacy API path) |
| PATCH | `/api/calendars/[slug]/opportunities/[id]` | Owner only; fields and/or status (legacy API path) |
| GET | `/api/calendars/[slug]/feed` | Public dated posts as a downloadable ICS file |
| GET / PATCH | `/api/me` | Verified account profile and personal collections |
| PUT | `/api/me/collections` | Login required; save/unsave or follow/unfollow |

Mutations validate required publishing fields, categories, formats, real calendar dates, date ranges, URL protocols, and input lengths. Events require a date and scholarships require a deadline before publishing. Cross-origin writes are rejected. Validation errors return JSON `{ "error": "…" }`.

## Content and sources

The original catalog was reviewed on **November 4, 2026**. Additional opportunities across every category were checked against official AMINEF/Fulbright, DAAD, Google Skills, AWS, Microsoft Learn, AIESEC, United Nations Volunteers, ISEP, Python, and Kaggle sources on **November 5, 2026**. Per-opportunity review dates are recorded in `docs/research/unispot/sources.json` and shown on detail pages.

The catalog distinguishes dated events, scholarship calls, self-paced learning, and program directories. Some listings are ongoing catalogs rather than individual dated calls; check the organizer’s page for current availability, deadlines, costs, and eligibility. Registration and enrollment take place on the organizer's website. Unknown event pricing is left to the organizer.

- `src/data/unispot-seed.json`: curated program information and organization definitions.
- `docs/research/unispot/gdg-events.json`: Indonesian DevFest event dates and links extracted from Google's official map.
- `src/data/unispot.json`: prepared application catalog with local asset paths.
- `docs/research/unispot/sources.json`: source URLs and reviewed dates.
- `docs/research/unispot/asset-manifest.json`: content asset provenance.

To regenerate content and download assets:

```bash
npm run assets
```

The preparation script retrieves DevFest metadata and imagery from the organizer pages, downloads source imagery, and derives the public logo/favicon from `mulmod-docs/UniSpot_Logo.svg`. Review dates and current source content when refreshing the catalog. Curated catalog assets are hosted locally; Hub owners may provide external image URLs for their own Hubs and opportunities.

Landing footage, frame posters, source credits, and editorial image slots are configured in `src/data/landing-media.json` and stored in `public/assets/unispot/landing/`. Run `npm run assets:landing` to prepare missing media with FFmpeg. The [landing asset handoff](docs/research/landing-assets.md) includes the image-generation prompts, exact replacement filenames, and source links.

## Main files

```text
src/app/landing-static/route.ts       Preserved Ugency template document, served at /
src/app/api/unispot-rebrand/route.ts  Compatibility endpoint for the content adapter
src/lib/landing-adapter.ts           Inline startup, copy, links, and audience switch
src/lib/landing-paths.ts             Audience controls and stable, role-specific card content
src/lib/landing-template-media.ts    Asset-only substitutions, including dynamic slides
src/data/landing-media.json          Replacement media paths and source credits
src/components/DiscoverPage.tsx       Featured overview and exploration entry points
src/components/ExplorePage.tsx        Search, filters, sorting, saved collection
src/components/CalendarDirectory.tsx  All, Following, and My Hubs
src/components/PartnerCalendarPage.tsx Public Hub, date picker, and scoped feed
src/components/CalendarSocialLinks.tsx Verified/owner-provided social and website links
src/components/CreateCalendar.tsx     Hub creation form (legacy component name)
src/components/ManageCalendar.tsx     Owner-only drafts, editing, and publishing
src/components/CatalogProvider.tsx    Shared Supabase catalog and account collections
src/components/AuthProvider.tsx       Session and personal-data synchronization
src/components/AuthForm.tsx           Login/signup/reset and OAuth UI
src/lib/supabase/                     Browser/server cookie-based Supabase clients
src/proxy.ts                         Session refresh and protected-page redirects
src/components/FilterSidebar.tsx      Animated filter groups and mobile drawer
src/components/CatalogViewToggle.tsx  Animated Grid/List segmented control
src/components/CatalogView.css        Responsive grid cards, list rows, view transitions
src/hooks/useCatalogView.ts           Per-catalog view preference and URL state
src/app/motion.css                    Shared motion tokens, drawers, cards, toast feedback
src/components/MotionResults.tsx      Bounded visible-result fades without remounts
src/components/NavigationMotionProvider.tsx Client-pathname entrance state
src/components/OpportunityCard.tsx    Horizontal Luma-style event cards and bookmarks
src/components/OpportunityDetails.tsx Right-side detail panel and toolbar
src/components/EventContent.tsx       Shared registration card, event facts, and detail sections
src/components/StandaloneEvent.tsx    Standalone two-column event page
src/components/EventFeed.tsx          Grouped event timeline
src/components/LocationExplorer.tsx  Location-based exploration
src/components/Header.tsx           UniSpot navigation
src/components/Categories.tsx       Category browsing
src/components/Footer.tsx           Footer and exploration links
src/app/globals.css                 UniSpot design tokens and responsive styles
src/lib/unispot.ts                  Categories, date statuses, calendar generation
src/lib/opportunity-date.ts         Shared date-only and Ongoing catalog labels
src/lib/calendar-feed.ts            Shared RFC 5545 calendar serialization
src/lib/server/catalog-store.ts     Supabase persistence, validation, ownership
src/app/api/                       Catalog, publishing, and ICS endpoints
public/brand/                       UniSpot SVG assets
public/assets/unispot/              Downloaded organizer imagery and logos
```

The public `/hubs` routes and UI are the product-facing names. Existing component, data, and API identifiers still use `calendar` internally for backwards compatibility; `/calendars/...` page URLs redirect to `/hubs/...`.

`/` is rewritten to `/landing-static`, which serves `src/lib/unispot-landing-source.json` with the preserved template CSS and wrappers. `src/lib/landing-adapter.ts` is embedded in the head: it prepares the header and hero as the HTML arrives, then starts the Framer runtime after the initial content is branded. It does not wait for `window.load` or a seven-second timer. Later runtime mounts are synchronized in the mutation microtask before paint. `/api/unispot-rebrand` exposes the same adapter for compatibility; the landing page does not fetch it separately. `src/lib/landing-template-media.ts` replaces media references in the initial document and responsive/CMS elements. The alternative `LandingPage.tsx` implementation is not used by the root route.

With the app running, `npm run qa:landing` verifies that the captured template's styles, inline geometry, classes and named wrappers remain unchanged, that the replacement media and content adapter load, and that the old delayed startup is absent. Set `UNISPOT_QA_URL` to check a different local port or deployment URL. See [startup/loading QA](docs/research/landing-startup-QA.md) for the current loading behavior and [template restoration QA](docs/research/ugency-restoration-QA.md) for the original restoration baseline.

The Students/Organizers controls are owned by the local audience controller, so selecting a path does not start the template's Monthly/Yearly billing animation. Repeated-click, touch, keyboard, and frame-level verification is recorded in [path switch QA](docs/research/path-switch-QA.md).

Saved collections belong to the signed-in account. Browsing, filters and public opportunity/Hub URLs remain available to guests.

The original design extraction is retained in `docs/research/luma.com/` and `docs/design-references/luma.com/` as historical design research. The later authenticated Home, public feed, Search, registration, panel, and full-page extraction is in `docs/research/luma-home/` with reference/comparison screenshots under `docs/design-references/luma-home/`. The current page uses UniSpot's own stylesheet and content. `npm run qa:reference` compares the historical content-identical reference captures only. See `docs/research/luma-home/QA.md` for current component-style verification.

Calendar research, behavior notes, and the publishing/responsive QA report are in `docs/research/luma-calendar/`. Desktop/mobile reference and UniSpot screenshots are in `docs/design-references/luma-calendar/`. The calendar pages reuse measured Luma geometry and components with UniSpot branding and content; these captures are visual references rather than a content-identical pixel-diff test.

Grid/list interaction, animation, preference, and responsive verification is recorded in `docs/research/luma-calendar/catalog-views-QA.md`.

The later shared-motion implementation, interaction checks and production before/after CPU-throttled benchmark are documented in `docs/research/MOTION-QA.md`. Raw local performance results are in `docs/research/motion-performance.json`.

## Stack

Next.js App Router · React · TypeScript · Tailwind CSS v4 · Radix UI · Lucide

`NEXT_PUBLIC_SITE_URL` can optionally specify the deployment origin for metadata.
