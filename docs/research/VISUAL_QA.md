# Visual and interaction QA

Reference: https://luma.com/discover. Captured 4 November 2026 using the same Playwright browser for both pages.

## Coverage

- Six document sections: header, intro, categories, featured calendars, local events, footer.
- One additional interactive Follow dialog.
- Nine custom component modules and nine corresponding specifications, including assembly and shared icons.
- 120 downloaded assets:106 images,9 unique SVGs,1 variable font,4 metadata files. Reference CSS stored separately.
- Screenshots at1440x1000,768x1000,390x844. Native scrollbar reduces captured full-page image width by approximately15px in this browser.

## Layout comparison

The measured x/y/width/height of h1, all h2s, category wrapper, visible calendar wrapper, city grid, and footer match the original at all three widths. Full data: `luma.com/layout-qa.json`.

| Viewport | Document wrapper height, both pages |
|---|---|
|1440|1958px|
|768|2042.4px|
|390|1806.2px|

## Pixel comparison

Pillow compares full-page RGB screenshots, excluding the top54px containing the changing clock. A pixel is counted as different if its largest channel difference exceeds16/255. This is a thresholded difference metric, not a claim of exact binary identity.

|Viewport|Pixels above threshold|Mean absolute channel difference,0–255|
|---|---|---|
|1440|0.00726%|0.01085|
|768|0.01403%|0.01930|
|390|0.02180%|0.03529|

Evidence: `reference-<width>-qa.png`, `clone-<width>-qa.png`, `diff-<width>.png`; raw statistics `luma.com/visual-diff.json`.

Remaining small differences are concentrated in raster imagery/antialiasing. A transient missing calendar image in the initial reference capture was replaced by a fully loaded reference for final comparison.

## Interaction checks

- Region clicks return21,3,26,32,5 cities for the five captured states.
- Category hover border matches rgba(21,21,21,.16).
- Scrolled header divider matches rgba(21,21,21,.08).
- Follow opens dialog without navigating.
- Input receives initial focus; email/phone toggle works.
- Demo form explicitly states that no sign-in request was sent.
- Escape and outside click close dialog; focus returns to Follow.
- Mobile category scrollLeft240 and calendar scrollLeft300 confirmed.
- Calendar snap computed x mandatory.
- No document horizontal overflow at390px.
- No broken local images.
- Both `/` and `/discover` return200.
- No browser console errors or warnings in final check.

## Scope notes

- Data is a snapshot; live counts, ranking, location-based ordering, and current time can change on the source.
- Original secondary destinations are canonical external links, not rebuilt subpages.
- Authentication/provider buttons are demonstration controls. No authentication service, account data, or backend was introduced.
- Modal appearance, focus, and dismissal are reproduced with Radix; entrance uses a short CSS overlay fade rather than the source's JS-driven motion implementation.
- The page was not a git repository; parallel builders worked in non-overlapping files without commits or git metadata.
