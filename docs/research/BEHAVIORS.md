# Observed behaviors

## Header
- Fixed at all scroll positions. At scrollY 24px divider absent; at rounded 24.8px present (threshold approximately 24px).
- Divider rgba(21,21,21,0) -> rgba(21,21,21,.08), 1 CSS px; rendered .8px on reference browser DPR.
- Transition .3s cubic-bezier(.4,0,.2,1); blur(16px); gradient remains mounted with opacity 1.
- Clock displays local time and UTC offset. Hidden at <=650px.
- Logo hover color rgba(21,21,21,.36) -> rgb(21,21,21).

## Cards
- Category/calendar hover border white -> rgba(21,21,21,.16), .3s cubic-bezier(.4,0,.2,1), border-color and box-shadow.
- Follow hover background rgba(21,21,21,.04) -> rgba(21,21,21,.64); foreground rgba(21,21,21,.64) -> white.
- Follow click opens 'Welcome to Luma' dialog, does not follow or navigate while logged out.
- Modal dismisses using Escape/outside click. Form has Email and Use Phone Number modes. Authentication backend excluded.
- Card/category/city links navigate to independent Luma pages outside clone scope.

## Regions
- Click-driven, not scroll-driven. Each button replaces city set immediately.
- Selected tab background rgba(21,21,21,.04), color rgba(21,21,21,.64); unselected text rgba(21,21,21,.36), hover .64.
- Contents captured verbatim for all 5 regions in luma.com/content.json.
- City hover background #95959522, transition .3s cubic-bezier(.4,0,.2,1).

## Responsive
- 1440: max container 820 including 32px gutters. Category and calendar grid minmax(240px,1fr), gap16; city minmax180 gap16 (4 columns).
- <=1000: card grid minimum220.
- <=820: card gaps12; footer adds bottom16.
- 768: 3 category/calendar columns; city3 columns.
- <=650: category desktop grid hidden, two 60px horizontal rows gap8; category image48 ->36, count14 ->12. Calendar becomes 3x84px rows flowing columns300; follow buttons absent. Region tabs horizontally overflow. Header clock hidden. H1 24px and header top32px.
- <=450: H1 22px, top25px; section heading18px. City minmax135 (2 columns), column gap12. Footer wordmark replaces sparkle; social icons top right, text links below.
- Mobile screenshots use a desktop browser resized to390; native scrollbar occupies approximately15px, matching the reference environment.

## Footer
- Link hover text .36 -> .64 opacity black with .3s easing.
- Canonical social/help/mail destinations retained.

## Evidence
desktop-extraction.json / mobile-extraction.json contain full recursive computed styles; modal-extraction.json contains modal styles. Screenshots at 1440,768,390 under docs/design-references/luma.com/.
