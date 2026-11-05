# UniSpot

**Find your people. Find your possibilities.**

An English-language discovery platform for students across Indonesia: events, scholarships, learning, competitions, volunteering, career development, study abroad, and communities.

## Run

Use **Node.js 22.13 or newer**. Calendar publishing uses Node’s built-in SQLite database.

```bash
npm install
npm run dev
```

Open **http://localhost:3000** or **http://localhost:3000/discover**.

```bash
npm run build
npm run typecheck
npm start
```

## Product experience

- Original UniSpot vector logo, matching favicon, and magenta/coral/orange brand palette.
- Locally hosted Inter variable font and measured Luma-style typography:16px body,20px feed-card titles, normal letter spacing, and exact squircle geometry.
- Seventeen sourced opportunities in eight categories, with real organizer links and local imagery.
- **Discover** is a featured overview with category and location navigation.
- **Explore** is the searchable catalog: a left sidebar for keywords, category, location, calendar, format, date range, and sorting, with progressive results on the right. Checkbox groups support multiple selections.
- Saved opportunities and followed calendars persisted in browser local storage.
- Shareable filter and opportunity URLs.
- Right-side550px event panels with Copy Link, Event Page, previous/next navigation, eligibility, benefits, cost, schedule, and official sources.
- Dynamic standalone two-column opportunity pages at `/opportunities/[id]`, including newly published posts.
- Calendar directory with All calendars, Following, and My calendars collections.
- Tenara-inspired240px search/filter sidebars on Explore and Calendars, with600ms accordions,400ms chevrons, and a modal left-side filter panel on mobile.
- Default grid catalogs with3 desktop columns,2 tablet columns, and1 small-mobile column. Explore/Saved also offer the existing horizontal list/timeline; Calendars offers a compact logo-and-description list.
- Animated Grid/List toggle beside the result heading:340ms sliding selection indicator and240ms soft result fade. View preferences are remembered separately for Explore, Saved and Calendars; `?view=grid` or `?view=list` overrides the stored choice. Arrow keys, Home and End operate the focused toggle.
- Shared soft-motion system:420ms panel entrances,260ms exits,300ms client-page entrances, desktop-only2px card lifts, subtle press/save/follow feedback, and animated toasts. Initial page content stays visible immediately; typing and pagination do not replay result motion. Reduced-motion preferences are respected.
- Compact opportunity cards with2-line titles, date-only schedule labels, and a uniform Ongoing label for undated programs. Date/organizer/location rows are grouped tightly; full schedule details remain on the detail page.
- Public calendar profiles with cover, logo, month/date picker, Upcoming/Past/All feeds, and scoped Explore links.
- Compact Instagram, TikTok, LinkedIn and Website links on calendar profiles. Verified official social URLs are included where available; missing links appear as noninteractive muted icons. New calendars can supply optional social URLs during creation.
- Pink Create calendar actions and charcoal Follow/Following buttons, matching the registration action style.
- Calendar creation and owner-only opportunity editing: save draft, publish, update, and unpublish.
- Calendar downloads for individual dated opportunities and complete public calendar feeds.
- Location exploration and an About panel.

## Routes and publishing

| Route | Purpose |
| --- | --- |
| `/discover` | Featured overview |
| `/explore` | Search individual published opportunities |
| `/saved` | This browser’s saved opportunities |
| `/calendars` | Calendar directory and browser collections |
| `/calendars/new` | Create a community calendar |
| `/calendars/[slug]` | Public calendar profile and dated feed |
| `/calendars/[slug]/manage` | Owner-only drafts and publishing editor |
| `/opportunities/[id]` | Public opportunity detail; unpublished IDs return 404 |

A published post appears in its calendar and the individual Explore results. Drafts are excluded from the public catalog, detail pages, and ICS feed. Unpublishing removes the post from all three. The editor’s registration link directs students to the organizer’s website.

### Storage and ownership

- New calendars and posts are persisted in **`data/unispot.sqlite`**, with WAL journaling and foreign keys. Override its location with `UNISPOT_DB_PATH=/absolute/path/unispot.sqlite`.
- Deploy using the Node.js runtime with a writable, durable filesystem. Keep the database and its WAL files on persistent storage; this implementation is intended for a single app instance sharing that database.
- Creating a calendar sets a random, year-long **HttpOnly, SameSite=Lax** ownership cookie. The database stores its SHA-256 hash. Creation, editing, and publishing are authorized on the server. Production cookies use Secure.
- Management belongs to the browser that created the calendar. Clearing/losing the ownership cookie loses management access; account login, ownership recovery, team roles, and moderation are not implemented.
- Following and Saved are local browser collections. Following does not enroll the visitor in email notifications.
- The seven built-in calendars are **curated from official sources by UniSpot**. Their organization names do not imply that those organizations have claimed or operate a UniSpot account. They cannot be edited through the publishing API.

### API

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/catalog` | Public published catalog, browser-specific `canManage` flags |
| POST | `/api/calendars` | Creates calendar and ownership cookie |
| GET | `/api/calendars/[slug]/manage` | Owner only; includes drafts |
| POST | `/api/calendars/[slug]/opportunities` | Owner only; draft or published post |
| PATCH | `/api/calendars/[slug]/opportunities/[id]` | Owner only; fields and/or status |
| GET | `/api/calendars/[slug]/feed` | Public dated posts as a downloadable ICS file |

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

The preparation script retrieves DevFest metadata and imagery from the organizer pages, downloads source imagery, and derives the public logo/favicon from `mulmod-docs/UniSpot_Logo.svg`. Review dates and current source content when refreshing the catalog. Curated catalog assets are hosted locally; calendar owners may provide external image URLs for their own calendars and posts.

## Main files

```text
src/components/DiscoverPage.tsx       Featured overview and exploration entry points
src/components/ExplorePage.tsx        Search, filters, sorting, saved collection
src/components/CalendarDirectory.tsx  All, Following, and My calendars
src/components/PartnerCalendarPage.tsx Public calendar, date picker, and scoped feed
src/components/CalendarSocialLinks.tsx Verified/owner-provided social and website links
src/components/CreateCalendar.tsx     Calendar creation form
src/components/ManageCalendar.tsx     Owner-only drafts, editing, and publishing
src/components/CatalogProvider.tsx    Shared catalog and browser collections
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
src/lib/server/catalog-store.ts     SQLite persistence, validation, ownership
src/app/api/                       Catalog, publishing, and ICS endpoints
public/brand/                       UniSpot SVG assets
public/assets/unispot/              Downloaded organizer imagery and logos
```

Saved collections belong to the current browser/device. No account is needed. Clearing browser storage clears the collection. Filtered views and individual opportunities can be shared by URL.

The original design extraction is retained in `docs/research/luma.com/` and `docs/design-references/luma.com/` as historical design research. The later authenticated Home, public feed, Search, registration, panel, and full-page extraction is in `docs/research/luma-home/` with reference/comparison screenshots under `docs/design-references/luma-home/`. The current page uses UniSpot's own stylesheet and content. `npm run qa:reference` compares the historical content-identical reference captures only. See `docs/research/luma-home/QA.md` for current component-style verification.

Calendar research, behavior notes, and the publishing/responsive QA report are in `docs/research/luma-calendar/`. Desktop/mobile reference and UniSpot screenshots are in `docs/design-references/luma-calendar/`. The calendar pages reuse measured Luma geometry and components with UniSpot branding and content; these captures are visual references rather than a content-identical pixel-diff test.

Grid/list interaction, animation, preference, and responsive verification is recorded in `docs/research/luma-calendar/catalog-views-QA.md`.

The later shared-motion implementation, interaction checks and production before/after CPU-throttled benchmark are documented in `docs/research/MOTION-QA.md`. Raw local performance results are in `docs/research/motion-performance.json`.

## Stack

Next.js App Router · React · TypeScript · Tailwind CSS v4 · Radix UI · Lucide

`NEXT_PUBLIC_SITE_URL` can optionally specify the deployment origin for metadata.
