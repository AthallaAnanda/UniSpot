# Luma Component Refinement QA

## Source evidence

Authenticated Home and Discover were inspected through the user's existing Chromium CDP session. Home had an empty event collection, so populated event cards came from Luma's public Jakarta timeline. Detail panel, full event page, Search, and registration form were inspected separately. No registration was submitted and no account state was changed.

## Implementation inventory

- Five new component modules: LumaIcon, EventContent, EventFeed, SearchDialog, StandaloneEvent.
- Nine updated modules: Header, Intro, Categories, OpportunityCard, OpportunityDetails, Organizations, LocationExplorer, Footer, DiscoverPage.
- Fourteen component/assembly specifications beginning `luma-` under docs/research/components/.
- Seven exact extracted SVG files archived in public/assets/luma-components/. The previously downloaded exact Inter variable font and21 official-source content assets remain in use.
- Seventeen generated standalone event routes at `/opportunities/[id]`.

## Exact computed-style comparison

`style-comparison-qa.json` records matching source and UniSpot values:

| Component property | Source and UniSpot |
|---|---|
| Body |16px /24px|
| Main heading |28px /33.6px, weight600|
| Main content max width |820px|
| Feed card title |20px /24px, weight500|
| Feed card background |rgba(255,255,255,.8)|
| Feed card radius/shape |24px /superellipse(2)|
| Feed card padding |12px12px12px16px|
| Feed card thumbnail |120px square|
| Feed card transition |border-color,box-shadow .3s cubic-bezier(.4,0,.2,1)|

Mobile cards use18/21.6 titles and90px images; full event pages use48/55.2 titles on desktop,36/41.4 on tablet,28/33.6 on mobile. Right panel550px with8px insets on desktop; fullscreen on narrow phones. Independent body scrolling and48px toolbar.

## Functional verification

- Keyword scholarship search returns2 records; unmatched search shows reset state.
- Progressive loading6→12→17.
- Bandungfilter returns3.
- Saved collection persists across reload.
- Next/previous changes the correct filtered opportunity and returns to original.
- Copy Link includes correct `opportunity` URL parameter.
- Event Page link targets the new local standalone route.
- Calendar file downloaded for actual ICMNS date.
- Escape returns focus to originating event title.
- Search overlay returns8AI results; selecting one opens event panel.
- Desktop, tablet,390px and320px layouts have no document horizontal overflow or broken local images.
- Fullpage and panel body fonts16px, mobile panel usesfullviewport andnohorizontaloverflow.
- Search-result → panel → Escape correctly restores focus to the header search button; event-card → panel → Escape restores the originating title button.
- Sample event pages return200; invalid opportunity IDs return404. No development-placeholder copy appears in rendered content.

Final production build and TypeScript verification passed. Home/Discover/component measurements are compared directly in style-comparison-qa.json; all sampled style values match after correcting the source's hydrated desktop card left padding to16px.

Raw results: interaction-qa.json,responsive-qa.json,style-comparison-qa.json. Screenshots: docs/design-references/luma-home/refined-*.png plus sourcecaptures.

## Scope of fidelity

This is a UniSpot adaptation of extracted Luma components, not a content-identical clone. Brand, real catalog, available actions, and text lengths differ intentionally. Core measured typography, spacing, card geometry, panel sizing, and full-page grid are aligned. Pixel-difference percentages are not meaningful across different content and are not claimed.

Private Home account data, Luma authentication, Luma event registration, and attendee counts are not part of UniSpot. Registration uses a structurally matching card with official external links. All visible controls retain real local or official-source behavior.
