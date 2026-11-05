# Categories Specification
## Overview
- Target src/components/Categories.tsx (default export, props {categories: Category[]}).
- Screenshots docs/design-references/luma.com/desktop-1440.png and mobile-390.png.
- Interaction model: linked cards; native horizontal scroll on mobile. No click-driven content replacement.
## DOM Structure
- section/div class `can-divide medium with-divider`.
- Section heading wrapper `section-title-wrapper medium` -> `section-title-row flex-center spread gap-2` -> h2.section-title.
- `.jsx-2169399144.category-grid-wrapper` contains desktop `.jsx-2169399144.category-grid` and mobile `.jsx-2169399144.category-rows` with two `.category-row` flex rows.
- Category card: a class `jsx-702bb7b3285aa34f jsx-3763758620 content-card rounded-card hoverable actionable discover-category`, inline padding `8px 16px 8px 4px`.
- Child div class `jsx-96134204 flex-center gap-1`; img.jsx-96134204; div.jsx-96134204 with title `jsx-96134204 title fw-medium`, count `count text-tertiary-alpha reduced-line-height`.
## Computed Styles
- Foundation already loads extracted original stylesheet at /assets/luma/reference.css. Retain scoped JSX class strings for exact rules; no CSS approximations needed.
- Desktop container width788; columns repeat(auto-fill,minmax(240px,1fr)); gap16; category card252x65.6 (reference browser DPR1.25 renders border1 as.8).
- Card background rgba(255,255,255,.8), white border1, computed borderRadius24. Image48x48; gap4. Title16/24 weight500 color#151515; count14/18.2 color rgba(21,21,21,.36).
- Original typography stack inherited; local Inter available.
## States & Behaviors
- Hover border:white -> rgba(21,21,21,.16); transition border-color,box-shadow .3s cubic-bezier(.4,0,.2,1). Preserve original scoped card classes.
- Anchors use https://luma.com + source href to preserve working destinations outside the one-page clone.
## Per-State Content / Text Content
- Heading: Browse by Category
- Source order: Family 657 Events; Books 734 Events; Games 504 Events; Tech 4K Events; Food & Drink 600 Events; AI 4K Events; Running 585 Events; Arts & Culture 3K Events; Climate 741 Events; Fitness 2K Events; Wellness 999 Events; Crypto 573 Events.
- Desktop row-major order above. Mobile TOP even indices [0,2,4,6,8,10]; BOTTOM odd [1,3,5,7,9,11].
## Assets
- All 12 original icons downloaded; exact paths in categories props, sourced from src/data/discover.json, /assets/luma/categories/<slug>.png.
- Images decorative alt="". No SVG substitutes or generated artwork.
## Responsive Behavior
- At<=1000: minimum card width220.
- At<=820: gap12. At768 three columns.
- At<=650: desktop grid display:none; mobile2 rows each60 high gap8, width:max-content; horizontal scrolling wrapper padding16, margin -16. Cards intrinsic fit-content, gap8, image36x36, count12/15.6.
- Mobile screenshot390. Hide category rows above650 using existing CSS. Keep semantics of hidden content accurate without hydration mismatch.
