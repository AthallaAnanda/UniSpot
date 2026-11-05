# Calendar reference and UniSpot adaptation

Reference: https://luma.com/readingrhythms-global

## Refreshed inspection

- Public Chromium inspection on November 4–5, 2026; desktop1440px and mobile390px.
- Native document scrolling. No Lenis/Locomotive scroll container or document scroll-snap was detected.
- Upcoming/Past is click-driven. Selecting Past updates the reference URL to `?period=past` and replaces the event feed.
- Month navigation and individual days are explicit click controls. Scrolling does not switch calendar periods.
- Luma exposes Follow and Submit Event; UniSpot’s Follow maintains a browser collection and publishing controls appear only for the calendar owner.
- Luma’s event cards retain the existing horizontal layout: text on the left, square cover on the right, date-group timeline. Cover/profile layout uses the same desktop/mobile title scale as the measured extraction.

## Measured values

| Element | Desktop | Mobile |
| --- | --- | --- |
| Calendar h1 | 36px / 43.2px, weight600 | 24px / 28.8px, weight600 |
| Heading letter spacing | normal | normal |
| Feed section heading | 24px / 28.8px, weight600 | Existing responsive foundation |
| Body | 16px / 24px | 16px / 24px |
| Card geometry | 24px, `corner-shape:superellipse(2)` | Same geometry, smaller cover |
| Card transition | border-color and box-shadow, 0.3s cubic-bezier(.4,0,.2,1) | Same |
| Hovered reference card background | rgba(255,255,255,.8) | Same token family |

## Artifacts

- `reference-desktop.json`, `responsive.json`: original computed-style extraction.
- `refreshed-past-state.json`: refreshed computed styles and Past content state.
- `../../design-references/luma-calendar/reference-feed-1440.png`: loaded reference feed and calendar widget in the viewport.
- `../../design-references/luma-calendar/reference-profile-390.png`, `reference-feed-390.png`: mobile viewport references.
- Full-page captures are also retained. Viewport captures are more reliable for the reference’s lazy-rendered event content.

## UniSpot interaction model

Discover is an overview. Category/location links lead into Explore; it has no search field or filter toolbar. Explore handles individual opportunity search and calendar-scoped filtering. Calendar profiles provide a community feed, date picker, period selection, Follow, and an ICS download. Mobile exposes the month picker through Choose date.

Dates are date-only records, consistently rendered in UTC; times are shown only when provided in the organizer’s schedule. Each ICS event is all-day and has an exclusive end date. Undated programs remain visible in Upcoming/All but are omitted from ICS.

Public opportunity metadata contains no draft status or ownership secret. Ownership flags come from the server; drafts require the owner cookie. Curated calendars clearly identify UniSpot as curator.
