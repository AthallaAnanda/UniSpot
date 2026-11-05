# LocalEvents Specification
## Overview
- Target src/components/LocalEvents.tsx default export, props {regions: Record<string, City[]>}.
- Screenshots docs/design-references/luma.com/desktop-1440.png and mobile-390.png.
- Interaction model CLICK-driven tabs, native document scroll and native mobile tab-strip horizontal scrolling. Not scroll-driven.
## DOM Structure
- Root `can-divide medium with-divider`; section-title-wrapper medium > section-title-row flex-center spread gap-2 > h2.section-title.
- Tabs `jsx-3368012781 tabs flex-baseline`, button `jsx-3368012781 tab animated fs-sm fw-medium nowrap` with `selected` on active.
- Wrapper `jsx-3368012781 city-grid-wrapper` > `.jsx-3368012781.city-grid` > a.place-item > div.inner.flex-center.animated.city-inner > icon.flex-shrink-0 > image; sibling.min-width-0 > title.fw-medium.text-primary.nowrap.text-ellipses + desc.subscribed.flex-center.gap-1.fs-sm.text-tertiary-alpha.nowrap.
- Since city JSX hashes vary by city, add local CSS using .city-inner for original common rule instead of 87 generated classes. Set icon background from data.
## Computed Styles
- Existing extracted CSS applies to JSX3368012781 selectors.
- Desktop city grid repeat(auto-fill,minmax(180px,1fr)), gap16, width788 (four185px columns). Grid item height49.
- City inner padding8px 10px; margin -6px 0 -6px -10px; gap12; border-radius8; align:center; hover background#95959522; transition all .3s cubic-bezier(.4,0,.2,1).
- Icon40x40, border-radius50%, img width/height100% object-fit:contain.
- Title16/24 weight500 #151515 nowrap ellipsis; count14/21 .36alpha black.
- Tabs margin-top-4 bottom4 padding-bottom16; button padding4px 10px, 1px transparent border, radius8, font14/21 weight500, unselected .36alpha black.
## States & Behaviors
- Tab click immediately replaces cities; default 'Asia & Pacific' (captured local timezone GMT+7). React useState.
- Selected background rgba(21,21,21,.04), text rgba(21,21,21,.64).
- Tab hover text .36 -> .64, .3s cubic-bezier(.4,0,.2,1).
- City hover bg transparent -> #95959522 with same .3s transition.
- Links canonical https://luma.com + source href; do not replace card clicks with tab changes.
## Per-State Content / Text Content
- Heading: Explore Local Events.
- Tabs in order Asia & Pacific, Africa, Europe, North America, South America.
- All data captured in props from src/data/discover.json; render names/counts/images/colors/hrefs verbatim. No inferred counts.
- Counts per state: Asia21, Africa3, Europe26, NorthAmerica32, SouthAmerica5 =87.
- Asia order Auckland, Bangkok, Bengaluru, Brisbane, Dubai, Ho Chi Minh City, Hong Kong, Honolulu, Jakarta, Kuala Lumpur, Manila, Melbourne, Mumbai, New Delhi, Osaka, Seoul, Singapore, Sydney, Taipei, Tel Aviv-Yafo, Tokyo.
- Africa Cape Town,Lagos,Nairobi. South America Bogotá,Buenos Aires,Medellín,Rio de Janeiro,São Paulo.
## Assets
- 87 downloaded city landmark icons /assets/luma/cities/<slug>.png, exact image and background colors provided through props. alt `Icon for <name>`.
- No layered artwork beyond circular colored background and contained PNG foreground.
## Responsive Behavior
- 1440 four columns,768 three columns,390 two columns.
- <=450 grid repeat(auto-fill,minmax(135px,1fr)), column-gap12 row-gap16.
- <=650 tabs margin horizontal-16 padding-horizontal16 overflow-x:auto, no wrapping; city-grid-wrapper margin-horizontal-16 padding-left16 right6. Mobile grid width353.2 when content width343.2 due deliberate wrapper padding.
