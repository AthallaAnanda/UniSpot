# Intro Specification
## Overview
- Target src/components/Intro.tsx; screenshots desktop1440/mobile390 in docs/design-references/luma.com.
- Static model, no stateful interaction.
## DOM Structure
- `.jsx-3922877081.page-header.zm-container.px-3` > `.jsx-3922877081.flex-center.mb-2.gap-2` > h1.jsx-3922877081.tab-title.flex-1.
- Following `.jsx-907177194.zm-container.px-3.text-secondary-alpha.pt-2.pb-4.mb-2.desc` contains description.
## Computed Styles
- Container max820 borderbox,gutters16, title header top44 after mainpadding53.
- H1 desktop28/33.6 weight600 #151515; description16/24 black.64 padding8px16px24px marginbottom8.
- Content below starts226.6 desktop,224.4 mobile in captured environment.
## States & Behaviors
- N/A; static text. No reveal animation observed after initial route mount.
## Per-State Content / Text Content
- Discover Events
- Explore popular events near you, browse by category, or check out some of the great community calendars.
## Assets
- No images; inherited local fonts.
## Responsive
- <=650 headerpaddingtop32/h1font24;<=450 top25/font22/26.4;description wraps naturally.
