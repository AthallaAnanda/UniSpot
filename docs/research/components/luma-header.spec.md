# Luma-style UniSpot Header
## Overview
- Target src/components/Header.tsx and Header.css only. Existing props preserved: savedCount,savedView,onNavigate. Optional onSearch?:()=>void.
- Reference docs/design-references/luma-home/home-desktop.png,home-390.png. Interaction: link/click, scroll divider, search button.
## DOM Structure
- Fixed full-width header, UniSpot logo left; center navigation aligned with main820px container; right Search icon and location.
- Existing Discover and Saved functional nav remain. Add optional Search button if prop supplied. No fake account/create actions.
## Computed Styles
- Nav height52px,padding12px16px;headerborderbottom1transparent;z10/50;blur16px.
- Container max820 including16pxgutters. Desktop nav center-left starts at calc((100vw - 820px)/2 +16px).
- Navfont14/21 weight500,inactive rgba(21,21,21,.36),active#151515;icons16px;gap24px. No pill background around active link.
- Logo UniSpot original SVG local /brand/unispot.svg at96x28 (brand adaptation; original Luma mark16px).
- Clock/location14px/21,.36alpha. Buttons light bg black.04,radius8,padding4px8px. Savedcount12px.
## States & Behaviors
- Hover navblack.36→#151515,transition.3s cubic-bezier(.4,0,.2,1).
- Scroll>24px divider black0→black.08;headerbackground transparent/blur16px. Use current passive scroll handler.
- Exact SVGs LumaIcon Compass,Calendar; use lucide Bookmark/Search for additional UniSpot functions.
## Text Content / Per-State Content
- Discover, Saved, Search opportunities, Across Indonesia. No fake login.
## Assets
- Local UniSpot logo; imported LumaIcon exact extracted icons. Existing font from root.
## Responsive
-1440 all items aligned to central container;768 center nav flexible;390 logoleft,Discover/Saved/search onright,locationhidden.52pxbaseheight;no overflow320.
