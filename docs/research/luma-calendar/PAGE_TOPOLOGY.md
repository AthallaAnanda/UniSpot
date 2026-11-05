# Calendar page topology

## Reference

1. Fixed, blurred site navigation above native document scrolling.
2. Centered wide cover, followed by overlapping calendar logo and Follow action.
3. Profile title, timezone, description, and external/social links.
4. Feed section: main date-grouped cards on the left; submission/ICS controls, month picker, period selector, and map on the right at desktop sizes.
5. Event activation opens an individual event experience. Month, period, display-mode, and search controls are click-driven; no scroll-driven tab switching was observed.

## UniSpot composition

- `SiteShell` provides the fixed header, standard or wide main, footer, and About dialog.
- `PartnerCalendarPage` renders the cover, overlapping avatar/Follow row, title/description/site, and curated or owner-management context.
- Below the profile, a two-column grid contains the opportunity feed and month picker. Upcoming/Past/All controls are colocated with the feed. Scoped search navigates to Explore.
- At820px and below, calendar tools move above the feed and Choose date toggles the month picker. The profile heading changes from36px to24px at650px.
- `EventFeed` groups cards by real date/deadline. Undated programs occupy an Explore anytime group. Cards share `OpportunityDetails`; standalone pages share `EventContent`.
- `CatalogProvider` shares public catalog data, browser collections, and toast feedback across routes.
- `CreateCalendar` and `ManageCalendar` use separate standard-width forms. Management loads private drafts through an owner-authorized endpoint.

The calendar uses actual catalog assets or an owner-provided cover; an unconfigured cover uses the calendar color. Map coordinates are not present in the UniSpot catalog, so the rendered sidebar consists of the functional date picker and ICS export.
