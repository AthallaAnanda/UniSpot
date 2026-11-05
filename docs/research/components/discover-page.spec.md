# DiscoverPage Assembly Specification
## Overview
- Target src/components/DiscoverPage.tsx, routes src/app/page.tsx and src/app/discover/page.tsx.
- Reference desktop1440/tablet768/mobile390 screenshots. Static document layout with parent-owned Follow modal state.
## DOM Structure
- `.jsx-4084343657.jsx-3614264787.page-wrapper` contains skiplink, Header, main#main-content and modal portal.
- Main class `jsx-4084343657 jsx-3614264787 page-content sticky-topnav`; contains Intro, `.jsx-907177194.zm-container.content` with Categories,FeaturedCalendars,LocalEvents; then Footer.
## Computed Styles
- Wrapper page-bg#f8f8f8,padding-bottom64,min-height100dvh. Mainpaddingtop53. Contentmax820,padding16,centered. At<=650 contentpaddingtop0.
- Existing original source selectors implement document layout. Same local fonts and global CSS for all children.
## States & Behaviors
- Parent state opens SignInDialog onFollow. No auth/backend requests.
- Routes / and /discover return identical clone. External destinations use canonical URLs.
## Per-State Content / Text Content
- Content imported from src/data/discover.json, typed DiscoverData. Verbatim source snapshot, not live backend.
- Skip to Content.
## Assets
- Children reference downloaded local assets; nine shared extracted SVGs.
## Responsive
- Children own observed breakpoints; native document scroll; no global smoothscroll library or scroll-driven content switching.
