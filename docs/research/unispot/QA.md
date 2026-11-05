# UniSpot verification

Reviewed November 4, 2026.

## Visual review

Playwright screenshots at 1440×1000, 768×1000, and 390×844 are saved in `docs/design-references/unispot/`.

- Desktop: three opportunity columns; four category columns; three organization columns.
- Tablet: two opportunity columns; all eight categories available.
- Mobile: single-column opportunity cards, horizontally scrollable two-row categories and organization cards, compact navigation, stacked search/location control.
- No document horizontal overflow at any inspected width.
- No broken locally served images.
- Original UniSpot logo and matching symbol favicon present.
- English interface copy throughout.
- No placeholder/development labels or Luma branding in rendered page text.
- Additional 320px narrow-screen check: no document horizontal overflow.
- All 42 image elements in the fully expanded catalog and page loaded without errors.
- Mobile opportunity panel verified after its entrance transition: opaque background, viewport-safe width, internally scrollable content.

## Interaction results

| Check | Result |
|---|---|
| Search `scholarship` | 2 matching opportunities |
| Unmatched search | Helpful empty state and working reset |
| Reset filters | Initial 6 results restored |
| More possibilities | 6 → 12 → 17 results |
| Bandung location filter | 3 matching opportunities |
| Save opportunity | Saved collection contains selected record |
| Reload saved collection | Same record restored after hydration |
| Competition category | Kaggle Titanic record displayed with loaded artwork |
| Detail panel | Title, source, cost, schedule, eligibility, benefits available |
| Official event action | Correct GDG event URL |
| Calendar action | `devfest-cloud-jakarta-2026.ics` downloaded |
| Share | URL copied with correct `opportunity` parameter |
| Open shared URL / reload | Correct detail panel restored |
| Escape dismissal | Panel closes and card title regains focus |
| About UniSpot | Product and saved-collection explanation opens |
| Empty saved collection | Working discovery return action |
| Sort soonest | ICMNS, November 5, appears first |
| Online location exploration | 3 matching opportunities |
| Local routes, logo, favicon | HTTP 200 |
| Final browser console | No errors or warnings |

Final commands: `npm run build` and `npm run typecheck` passed. Additional release evidence: `release-qa.json`.

The initial server-rendered page appears before browser-local preferences load. Persistence checks wait for the saved-view heading after hydration; the actual saved collection contains the expected one record.

Source provenance is retained in `sources.json` and `asset-manifest.json`. Browser verification details are in `interaction-qa.json`. Historical pixel differences against Luma apply to the former reference clone, not to the current branded design.
