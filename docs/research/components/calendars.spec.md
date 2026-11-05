# FeaturedCalendars Specification
## Overview
- Target src/components/FeaturedCalendars.tsx default export.
- Props {calendars: Calendar[]; onFollow: (calendar: Calendar) => void}.
- Screenshots docs/design-references/luma.com/desktop-1440.png, mobile-390.png, follow-modal-desktop.png.
- Interaction model: linked cards, Follow click opens parent-owned modal; mobile horizontal scroll-snap. No timed/scroll-driven content changes.
## DOM Structure
- Root `can-divide medium with-divider`; standard `section-title-wrapper medium` -> `section-title-row flex-center spread gap-2` -> h2.section-title.
- Desktop wrapper `jsx-3508014293 calendar-grid-wrapper desktop-calendars` > `jsx-3508014293 calendar-grid`.
- Desktop a class `jsx-702bb7b3285aa34f jsx-3763758620 content-card rounded-card hoverable actionable flex-column desktop-calendar`, padding14px.
- Top `jsx-339980398 flex-start spread` with image48 and button class `btn lux-button flex-center small light solid variant-color-light round no-icon`; button child div.label Follow.
- info class `jsx-339980398 info`; title `jsx-339980398 title fw-medium text-primary reduced-line-height`; desc `jsx-189d9c6ebcf99dd2 calendar-desc text-tertiary-alpha fs-sm` > span.jsx-189d9c6ebcf99dd2. End spacer `jsx-339980398 flex-1`.
- Mobile separate wrapper class `jsx-3508014293 calendar-grid-wrapper mobile-calendars` with same grid and plain anchors. Inner `jsx-cc9249456458bd8a calendar-row flex-center gap-25 relative`; first `.jsx-cc9249456458bd8a.hover-bg.animated`; image48; `.jsx-cc9249456458bd8a.min-width-0` with title `.jsx-cc9249456458bd8a.title.fw-medium.reduced-line-height.text-ellipses.text-primary` and same description. No Follow button on mobile.
## Computed Styles
- Exact original CSS loaded globally /assets/luma/reference.css; preserve JSX selectors. Shared desktop/mobile visibility utilities already in globals.
- Desktop 3 columns252px, gap16, cards159px (content-driven), padding14, border1 white, background white .8, computed radius24.
- Avatar48x48 border .5px solid var(--divider-color), borderRadius var(--border-radius)=8px.
- Desktop title margin12px 0 4px font18/23.4 weight500, clamp2. Desc14/21 .36 alpha black, clamp2; preserve newlines as normal whitespace.
- Mobile row width300px, height84px, padding8px 8px 8px 16px, gap12. Title16/20.8 weight500, desc14/21 clamp2 margin-top2px. Hover background absolute inset0 0 0 4px, radius8.
## States & Behaviors
- Desktop card hover border:white -> rgba(21,21,21,.16), .3s cubic-bezier(.4,0,.2,1).
- Follow hover bg rgba(21,21,21,.04) -> rgba(21,21,21,.64), text.64 -> white; when hovering nested button outer card border stayswhite using extracted :has rule.
- Follow prevents anchor default/bubbling, invokes onFollow(calendar). No auth requests.
- Card href https://luma.com + source href.
## Per-State Content / Text Content
- Heading Featured Calendars.
- Reading Rhythms Global: Not a book club. A reading party.\nRead with friends to live music & curated playlists!
- Build Club: The most collaborative AI community in the world (50+ Cities, 30K+ community)
- South Park Commons: South Park Commons helps you get from -1 to 0. To learn more or apply, visit southparkcommons.com.
- Design Buddies: Events for all creatives across SF/LA, online, and the world! Hosted by Design Buddies, the world's largest design community (https://designbuddies.community). Founded by Grace Ling
- SpaceXSI Community: SpaceXSI community events in 250+ cities
- Creative Coffee Club: Unique experiences for creatives and builders in... 📍 NYC · Philly · Seattle · Toronto · Chicago · LA · Austin · Boston · SF · Nashville · Houston · Phoenix · Miami
- Google DeepMind: Connect with the Google DeepMind Developer Experience Team
## Assets
- Seven downloaded avatars via props from src/data/discover.json: /assets/luma/calendars/<slug>.png. alt/title `Avatar for <name>`; use original actual images.
## Responsive Behavior
- Desktop card minimum240, <=1000 minimum220; <=820 gap12.
- <=650 desktop wrapper hidden, mobile wrapper flex, margin-16 padding8px 0 overflow-x:auto scrollbar hidden scroll-snap-type:x mandatory scroll-behavior:smooth.
- Mobile grid rows repeat(3,84px), columns repeat(auto-fill,300px), auto-flow:column,gap0. Ensure width:max-content / sufficient implicit columns. Each row scroll-snap-align:start. Source order fills down then across.
