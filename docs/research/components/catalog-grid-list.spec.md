# Catalog grid/list views

Approved design: default visual grid for Explore and Calendars, with a compact animated Grid/List toggle at the right of the result heading. Preserve the left filter sidebar, data, sort order, saved/followed state, pagination and detail panel.

- Explore grid: three columns desktop, two tablet, one below600px. Gaps16px. Use actual poster images in4:3 frames with contain fitting and soft calendar-color backgrounds. Title18/24 weight500, max2 lines in grid and list; category, date/deadline, organizer, location/format, fee and status. Cards use natural content height,8px copy gaps, and no reserved title/schedule heights or auto-pushed footer. Save control in the cover’s top-right corner. Existing horizontal cards/timeline form List view.
- Calendars grid: retain existing community cards; List:64px logo at left, name/description/published opportunity count in the middle, Follow at right. Stack the trailing action as necessary on narrow screens.
- Header toggle:80×36px neutral rounded container, two equal buttons, white inset active indicator with a subtle shadow. Indicator translates between positions over220ms cubic-bezier(.2,.8,.2,1). Icons transition color over180ms. Accessible Grid view / List view labels, aria-pressed, keyboard arrows/Home/End.
- Result layout switches with a160ms opacity fade. Do not animate the sidebar or reset filters when switching views. Honor reduced-motion preferences.
- Default is grid. Remember the choice separately for Explore, Saved and Calendars in browser storage. A valid `view=grid|list` URL takes precedence when opening a page. Preserve unrelated URL parameters.
- List with Soonest first keeps date-grouped timeline. Other list sorts remain flat. Grid always respects the same sorted result array, without timeline grouping.
- Reuse existing sourced content and local assets. No additional imagery or dependencies required.

## Compact content refinement

- Card schedule labels come from structured date/endDate/deadline fields, not free-form schedule text. Display dates only: `Nov 5–7, 2026`, `Dec 1, 2026`. Every undated opportunity uses `Ongoing`, with a tooltip explaining no fixed date. Event times and original enrollment/schedule instructions remain in the detail panel/page.
- Date, organizer and location form one metadata group:16px icon column,6px icon/text gap,20px line-height and2px row gaps. Dates stay on one line with ellipsis for unusually long ranges; the full date label is available on hover.
- Grid copy padding12px14px; no fixed title or metadata heights. Titles remain limited to2 lines. Footer places fee/status side by side when space permits, with4px wrapped-row gaps. Undated cards omit the extra status badge so `Ongoing` appears just once.
- Placeholder fee text `See organizer` is hidden in both card layouts; real fee/funding text remains visible.
- Refined List uses18px/24px titles (17px/22px mobile),13px dates,14px metadata,6px text-block gaps, and108px thumbnails (80px mobile). Organizer/location are inline on desktop and stacked with2px gaps on mobile. Category/status sit inside the left content column, with a neutral status badge. Save overlays the thumbnail, avoiding a separate footer row beneath the image.
