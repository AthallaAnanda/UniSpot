# Header Specification
## Overview
- Target src/components/Header.tsx. Screenshot desktop-1440.png/mobile-390.png under docs/design-references/luma.com.
- Model: fixed header; scroll-driven divider; links navigate. Local clock updates with time.
## DOM Structure
- header `jsx-1502588700 nav-wrapper animated sticky` (+show-divider).
- gradient div `jsx-1502588700 background animated mounted`.
- nav `jsx-1502588700 flex-center spread gap-2` > logo anchor > div `jsx-1502588700 logo flex-center animated wordmark` > LogoIcon.
- Sibling `jsx-1502588700 center-and-right` > emptydiv + right-wrapper min-width-0 containing time, Discover Events, Sign In.
## Computed Styles
- nav padding12px16px, height52, width100%; headerfixed z10 blur16px borderbottom1 transparent.
- Gradient height180 width100% fixed, linear-gradient(rgba(51,65,198,.2)0%,rgba(61,143,245,.1)50%,rgba(126,215,224,0)100%).
- LogoSVG height16 widthauto. Logo padding6px4px margin0-4px. Links14/21 weight500 black.36; rightgap16.
- Exact existing original scoped CSS retained.
## States & Behaviors
- Scroll>24: divider transparent->black.08, transition.3s cubic-bezier(.4,0,.2,1).
- Logo/link hover black.36->#151515.
- SignIn original navigates /signin?next=%2Fdiscover; clone link canonical luma.com URL.
- Clock time local format h:mm AM/PM GMT±offset. Render after mount to avoid hydration mismatch.
## Per-State Content / Text
- Discover Events; Sign In; dynamic clock. Logo aria-label Luma Home.
## Assets
- Extracted LogoIcon from icons.tsx; no raster/logo approximation.
## Responsive
- <=650 clockhidden/rightgap14. Full-width navigation at all sizes. Existing extracted CSS.
