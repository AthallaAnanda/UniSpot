# UniSpot brand and content adaptation

## Scope

English-language UniSpot discovery experience, adapted from the Luma design research. The live page is fully branded for UniSpot. Original reference artifacts are kept as historical research.

## Identity

Logo source: `mulmod-docs/UniSpot_Logo.svg`. Public variants: `/brand/unispot.svg` and `/brand/unispot-icon.svg`.

Original logo gradient stops: #CF21B6, #F51683, #FF4855, #FF891A, #F7B416. Wordmark: #151515. Controls use a darker related magenta #BB267E / #B93085 for readable white labels. Background #F8F8F8, white translucent cards, warm low-opacity gradient atmosphere, source Inter variable font.

## Information architecture

1. UniSpot navigation: Discover, Saved.
2. Intro, keyword search, location selector, suggested searches.
3. Eight categories with counts derived from catalog records.
4. Searchable opportunity catalog, 6 initial results, incremental reveal, category tabs and sorting.
5. Six organization profiles with official external destinations.
6. Indonesian city exploration plus Online and International tabs.
7. Exploration callout, branded footer, About information.
8. Opportunity detail dialog with official source and action, save, share, and calendar download.

## Content model

17 records: eight Indonesian DevFest events, ICMNS 2026, two LPDP scholarship calls, Google AI Essentials, Google Career Certificates, Indorelawan's opportunity directory, Erasmus+ study-exchange guidance, Kaggle Titanic competition, and GDG on Campus community discovery.

The catalog does not treat a directory as a dated event. Indorelawan and GDG on Campus link to their discovery portals. Erasmus+ directs users to institutional application guidance. Google learning is explicitly subscription-based, not labeled free. DevFest pricing and eligibility are not invented. Dates are sourced from the official Google DevFest listing, ITB Agenda, and the individual LPDP calls.

Record details and original source links are captured in `sources.json`. Asset provenance is in `asset-manifest.json`. Translations and editorial summaries are in English; proper names retain their official spelling.

## Behavior

- Search terms match title, description, category, organizer, and city. Multi-term queries require each term.
- Category and location filters combine with search. Counts reflect actual matching records.
- Sorting supports recommended order, soonest dated opportunity, and title A–Z.
- Bookmarks persist in localStorage; storage failures retain the collection for the current visit and use accurate confirmation text.
- `q`, `category`, `location`, `view`, and `opportunity` query parameters encode the visible state.
- Source links are external and open in a new tab. No affiliation or partner relationship is claimed.
- Date status is derived using Asia/Jakarta's current date. Date-only deadlines remain date-only.
- Calendar export uses all-day dates; unspecified event times are not invented.
- Modal focus trapping and dismissal use Radix. Share uses the native share API or clipboard with failure handling.
- No inactive login, registration, newsletter, or publication actions are exposed.
