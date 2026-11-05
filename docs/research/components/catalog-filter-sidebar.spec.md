# Catalog filter sidebar

Reference inspected live at `http://localhost:3001/galeri`, following the user’s Tenara screenshot. Apply the structure to UniSpot Explore and Calendars directory while retaining English labels and UniSpot/Luma typography.

- Reference aside width240px, layout column-gap40px, no enclosing card or colored background.
- Sort row is borderless with14px text and12px label/control gap.
- Accordion headers use14px, weight500,22.4px line-height,20px vertical padding,16px gap, chevron at the far edge.
- Checkbox rows use14px text,10px gap,10px bottom spacing; native checkbox17px, top margin3px.
- Thin neutral rules separate groups. Reset sits at the bottom.
- Interaction is click-driven: expand/collapse groups, select checkboxes, sort, search, reset. Multiple selections OR within a group, AND across groups. Existing single-value Explore URLs remain supported; multiple values are pipe-separated so city names containing commas remain intact.
- UniSpot: use existing Inter/system font,14px/21px sidebar copy, magenta checkbox accent, existing neutral border and background. Desktop max1140px including32px gutters, sidebar240px, gap40px, results flexibly fill the remaining width.
- Explore: sidebar contains sorting, search, category, location, calendar, format, date range, reset. Right column contains count, results, pagination, and opportunity panel. Saved uses the same layout.
- Calendars: sidebar contains sorting, search, collection selection (All/Following/My calendars), category checkboxes based on actual published calendar opportunities, reset. Right column contains calendar count/cards/empty state. Create calendar stays in page heading.
- <=860px: Search & filters opens a fixed left panel,320px wide/max90vw,padding28px24px with a50%-black backdrop, matching Tenara’s mobile drawer. It opens immediately: the reference has no panel translation/fade animation. Use modal focus handling, Close/Escape/backdrop dismissal, and body scroll lock.
- Desktop controls must be left of the results, with no duplicate search or sort toolbar above the results.

## Exact animation extraction

Inspected Tenara’s Teknik group in both states and through `getAnimations({subtree:true})`:

- Accordion uses CSS grid rows0fr →1fr on open and1fr →0fr on close, **600ms ease-in-out**.
- Inner wrapper has min-height0 and overflow hidden; contents keep natural height. No opacity or translate animation.
- Chevron is right-facing when closed, rotates-90deg when open, **400ms ease**.
- Trigger remains stationary while subsequent groups move with the changing grid height.
- Group bottom margin8px; options padding-bottom16px.
- Reset hover transitions color and text-decoration-color over200ms.
- Closed content remains mounted for the closing animation, but is inert and aria-hidden so it cannot receive keyboard focus.
- Honor reduced-motion preferences through the existing global override.
