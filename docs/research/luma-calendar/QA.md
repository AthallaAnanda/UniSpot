# Calendar and catalog QA

Verified against the local application using Chromium and the running Node/SQLite API, November 4–5, 2026.

## End-to-end workflow

1. Created a calendar through the public form, including automatic slug generation.
2. Redirected to management with `?new=1`; the new-opportunity editor opened automatically.
3. Saved a draft with only a title. The manager listed exactly one draft; the public catalog excluded it and its detail URL returned404.
4. Completed required fields and published. The same post ID appeared in the public catalog and calendar, in scoped Explore search, and on its standalone detail URL (200).
5. Opened the result in the shared detail panel. Its URL included the opportunity ID and its organizer link pointed to the local calendar.
6. Saved the post and found it on Saved. Followed the calendar and confirmed Following survived reload.
7. Edited the published title through the UI; the public catalog reflected the new value.
8. Unpublished through the UI. The catalog and ICS feed excluded it, and its standalone detail URL returned404 again.
9. Removed the exact QA calendar and its associated post from SQLite, and removed only their IDs from browser collections. No QA records remain in the public app.

## API checks

| Check | Result |
| --- | --- |
| Invalid date (`2026-02-30`) | 400 |
| Missing event date on publish | 400 |
| `javascript:` registration URL | 400 |
| Unknown category | 400 |
| Attempt to publish to curated GDG calendar | 403 |
| Mutation with another Origin | 403 |
| Duplicate calendar slug | 409 |
| Other browser context reading management | 403 |
| Other browser context editing a post | 403 |
| Published standalone page in another context | 200 |
| Calendar ICS download | 200; correct event ID and date |
| ICS content-line folding | All lines <=75 UTF-8 octets |

The browser automation initially used two incorrect selectors (an inert header link behind an open dialog, and the new-post publish label while editing a published post). Those automation timeouts were resolved using the live accessibility snapshot; the corresponding app actions then passed.

## Responsive and visual review

Before the sidebar refinement,24 page/viewport combinations were checked: Discover, Explore, Calendars directory, public GDG calendar, calendar creation, and denied calendar management at320,390,768,and1440px. None had document horizontal overflow. Navigation stayed within the viewport. The overview contained zero search inputs; Explore contained one.

- Initial Discover/Explore/directory: h128px desktop,24px mobile; desktop main820px including gutters. Explore/directory now use the wider sidebar layout described below.
- Calendar profile: h136px desktop,24px mobile; desktop outer container1020px.
- Create/manage: h128px, forms remain readable and single-column on mobile.
- Public curated calendar exposes no editing controls; directly visiting its management URL shows the denied state.
- Screenshot review covered source feed/profile and UniSpot profile, overview, Explore, directory, and creation. Fixed a header specificity issue that had displayed both logo variants on mobile. Calendar h1 letter-spacing now matches the reference’s normal value.
- Initial 12 standard catalog page loads reported zero JavaScript page errors. Expected403 network responses occur when checking denied management.
- On mobile, opened Choose date, navigated to December, selected December12, and received exactly the two matching GDG posts. Clear date and Past/View all controls restored the expected feed.
- Explore A–Z produced correctly sorted visible titles; the scholarship filter returned two results. More opportunities expanded12 results to17, and resetting an empty search restored12.
- Calendar plus from/to date filters survived a page reload with their URL values intact. Recently published and A–Z results use a flat list so date grouping cannot alter the selected sort order.

Source and application content differ by design. The visual review compares component geometry, typography, spacing, responsive layout, and behavior; it is not a pixel-identical content comparison. UniSpot keeps its own brand and sourced opportunities.

## Build and implementation boundaries

Final verification: **`npm run build` passed** and **`npm run typecheck` passed** after all code changes. Node22 emits its expected experimental SQLite notice during builds. `npm install --package-lock-only` synchronized the Node engine requirement and reported zero dependency vulnerabilities.

Runtime storage is SQLite and management uses an HttpOnly browser ownership cookie. Account login/recovery, collaborative roles, and moderation are outside this implementation; deployment/storage requirements are in the README.

## Tenara sidebar refinement — November5,2026

Reference inspected directly at `http://localhost:3001/galeri`. UniSpot remains available at `http://localhost:3000`.

- Explore and Calendars now have a240px left sidebar,40px result gap, and1140px outer container at1440px. Search, sort, and filters are colocated in the sidebar.
- Explore multi-select Scholarships + Workshops returned three posts; both selections and the result count survived reload. Sorting remained correct and reset restored17 results.
- Calendar category Scholarships returned LPDP; searching Google returned GDG and Grow with Google. My calendars showed its correct empty state; A–Z sorted all seven names.
- Rechecked both routes at320,390,768,and1440px after the animation change: no horizontal overflow or JavaScript page errors.
- Mobile320/390/768: fixed left modal panel,320px/max90vw, dark backdrop. Close button and Escape both dismiss it and restore focus to the trigger. Backdrop dismissal passed. Selecting filters, closing, and reopening retains their values.
- Matched **actual running transition timings** using `getAnimations({subtree:true})`: grid-template-rows600ms ease-in-out and chevron transform400ms ease, rotating0 →-90deg. Opening and closing both had intermediate heights; the closed grid finished at0px and was inert.
- Clearing the last checkbox keeps its group open. Reduced-motion mode reduces the transition duration to0.00001s through the shared global override.
- Tenara’s mobile panel itself has no translation/fade animation; UniSpot likewise opens the panel immediately while its internal groups use the measured transitions.
- Final `npm run build` and `npm run typecheck` both passed after the sidebar changes.

Reference extraction: `docs/research/components/tenara-sidebar-motion-reference.json`. Specification: `docs/research/components/catalog-filter-sidebar.spec.md`. Screenshots: `docs/design-references/luma-calendar/sidebar-{explore,calendars}-{1440,390,390-open}.png`.
