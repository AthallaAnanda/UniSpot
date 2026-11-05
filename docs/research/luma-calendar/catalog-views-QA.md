# Grid/list catalog verification

Verified November5,2026 against the running application at `http://localhost:3000` with Chromium. Functional checks used isolated browser contexts so QA preferences, saves and follows do not modify the main browser collection.

## Implementation

- Explore, Saved and Calendars default to Grid. View preferences use separate browser storage keys and a valid `view=grid|list` query overrides the saved choice.
- Explore grid renders the same sorted opportunity array as List. List uses the existing timeline only for Soonest first; other sorts remain flat.
- Grid cards show real images in4:3 contain frames, category, title, schedule, organizer, city/format, fee and status. Save opens no detail dialog; activating the card opens the shared detail panel.
- Calendars retains its grid and adds a logo64px/name/description/count/Follow list. Mobile rows use48px logos and move Follow below the copy.
- Toggle is an80×36px segmented control, with aria-pressed states and Grid view/List view accessible labels.

## Functional results

| Check | Result |
| --- | --- |
| Fresh browser defaults to Grid | Passed |
| Grid and List retain the same first12 opportunity IDs and ordering | Passed |
| List/Soonest first displays timeline | Passed |
| Explore preference restored on revisiting the path without a query | Passed |
| Scholarship filter survives view change, returning2 opportunities | Passed |
| URL preserves both category and view | Passed |
| Grid Save and detail panel work | Passed |
| Saved state survives Grid →List | Passed |
| Expanded pagination retains17 posts after switching views | Passed |
| Calendar grid/list each show7 records | Passed |
| Follow state survives calendar layout switch | Passed |
| Calendar category filter still returns LPDP | Passed |
| Calendar preference restored | Passed |
| Explore and Calendar preferences are independent | Passed |
| Explicit grid URL overrides a stored list preference | Passed |
| ArrowLeft and End switch/focus the appropriate toggle button | Passed |
| Reduced-motion transition duration | 0.00001s |

## Animation results

Observed the running CSS transition through `getAnimations()` after selecting List:

- Indicator: transform,220ms,`cubic-bezier(.2,.8,.2,1)`.
- Results: `catalog-view-enter`,160ms opacity animation.
- Icons use180ms color transitions. Active indicator moves between the same two buttons rather than remounting.
- The content wrapper is keyed by view, so changing filters does not replay the layout-switch animation.

## Responsive/visual results

20 combinations tested: Explore and Calendars ×Grid/List ×320,390,768,1024,and1440px. No document horizontal overflow; toggle stayed inside the viewport; no JavaScript page errors.

| Width | Explore grid | Calendar grid |
| --- | --- | --- |
| 320/390 | 1 column | 1 column |
| 768/1024 | 2 columns | 2 columns |
| 1440 | 3 columns | 3 columns |

Visually reviewed desktop Explore grid, desktop Calendar list, mobile Explore grid and mobile Calendar list. Screenshots for both layouts and both catalogs at390/1440px are in `docs/design-references/luma-calendar/catalog-{grid,list}-{explore,calendars}-{390,1440}.png`.

## Checks

- `npm run build`: passed.
- `npm run typecheck`: passed.
- No additional dependencies or content assets required.

## Compact dates and metadata refinement

- Card schedule labels now derive exclusively from date/endDate/deadline. ICMNS shows `Nov 5–7, 2026`; LPDP shows `Dec 1, 2026`. Times and enrollment instructions are not included in the card date row.
- All6 undated seeded opportunities show `Ongoing` in both Grid and List. Their extra status badge is omitted, avoiding a second inconsistent scheduling label.
- Grid metadata uses aligned16px icon columns,20px lines, and2px row gaps. Date labels occupy one line. Fee and status share a compact wrapping footer instead of separate stacked rows.
- Measured ICMNS desktop height reduced from462px to402px at1440px. Titles remain at most2 lines without reserved empty height.
- Checked all17 opportunities in Grid/List at320,390,768,and1440px: no card date contained times/WIB/Applications close; every undated card used Ongoing; all title clamps were2; no horizontal overflow or JavaScript page errors.
- Verified the shared detail panel still contains the complete ICMNS schedule including `08:00–16:00 WIB`.
- Eight formatter assertions passed: undated, same-day, same-month range, scholarship deadline, cross-month, cross-year, invalid date, and reversed range.
- `npm run typecheck` and final `npm run build` passed after refinement.

Screenshots: `catalog-compact-dates-390.png` and `catalog-compact-dates-1440.png` in `docs/design-references/luma-calendar/`.

## List refinement and placeholder fee removal

Confirmed the user intended to tidy List cards. List metadata is now inline on desktop, stacked tightly on mobile, with category/status inside the main text column and Save over the thumbnail. Titles remain2 lines. `See organizer` is hidden in both Grid and List; actual fee/funding information is retained.

Verified Grid/List at320,390,and1440px: no placeholder fee text, no horizontal overflow, real Scholarship funding labels preserved, and all titles within2 lines. The relocated thumbnail Save button toggled successfully without opening the detail panel; card activation still opened its detail panel. Final production build passed, including TypeScript.

Screenshots: `catalog-list-refined-390.png` and `catalog-list-refined-1440.png` in `docs/design-references/luma-calendar/`.

## Calendar socials, label and action colors

- Replaced the text website row with Instagram/TikTok/LinkedIn/Website icons and removed the visible curated badge. Internal seed classification and ownership behavior are preserved.
- Seed social URLs were extracted from official Google Developers, LPDP, ITB and Indorelawan pages. Missing platforms render noninteractive muted icons instead of invented URLs.
- Verified12 combinations: calendar directory, LPDP profile and calendar creation at320,390,768,and1440px. No horizontal overflow, no JavaScript page errors, and no curated badge text.
- Computed Create calendar button color:rgb(245,22,131), matching#f51683, on directory and form. Header action uses the same pink. Follow and Following computed backgrounds:rgb(53,53,53), matching#353535, in card/list and profile contexts.
- Followed a calendar from List and confirmed Following persisted on its profile with the same charcoal color.
- Created an isolated QA calendar through the form with all three social URLs. The server persisted the fields and the public profile exposed all four actual links. A javascript: social URL was rejected with400.
- Removed the exact temporary QA record from SQLite; the invalid submission created no record. The isolated browser context was closed without changing the main browser’s collections.
- Production build and TypeScript checks passed after all changes.

Specification and source URLs: `docs/research/components/calendar-social-links.spec.md`. Screenshots: `docs/design-references/luma-calendar/calendar-social-{directory,profile,create}-{390,1440}.png`.
