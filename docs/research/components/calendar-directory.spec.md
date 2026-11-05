# Calendar directory and catalog layout

UniSpot adaptation using the measured Luma foundation, existing local assets and original brand.

- Target: `CalendarDirectory.tsx`, `catalog-pages.css`, Discover/Explore shared presentation.
- Interaction: click-driven All / Following / My calendars; name/description search; Follow toggles browser collection; links open profile or create form. No automatic switching on scroll.
- Directory shell max820px including32px gutters; heading28/33.6 weight600, body16/24. Cards reuse white squircle24px, 1px border, logo48px, title18/23.4 weight500, secondary14/21. Hover border uses existing foundation token and 0.3s easing.
- Directory uses three columns desktop, two tablet, one mobile. Featured overview cards keep Luma's mobile horizontal arrangement, with accessible separate Follow controls.
- Every count derives from published opportunities. My calendars depends on server ownership, not followed state. Empty search/collection has a contextual heading and functional clear/create/explore actions.
- Discover: overview only, category navigation, four featured cards, featured calendars and location links. No inline search/filter toolbar.
- Explore: search plus category/location/calendar and optional format/date filters, count/sort, timeline cards, pagination. Labels14/21, input16/24, controls40px and 8px corners. Three select columns desktop; two then one as needed on mobile.
- Responsive390px: heading24/28.8,16px gutters; controls wrap, no document horizontal overflow. At320px header uses symbol brand, compact links and saved icon.
- All page text English; source content from actual catalog. No invented partner affiliations or follow counts.
