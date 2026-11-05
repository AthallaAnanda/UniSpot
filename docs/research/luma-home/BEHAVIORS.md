# Observed behavior and implementation contract

- Authenticated Home: click-driven Upcoming/Past segmented control; native page scrolling; no Lenis or Locomotive wrapper.
- Discover: category navigation, featured calendar links, mobile two-row category strip, three-row calendar strip with native horizontal snap. Use existing Discover extraction for raw exact rules.
- Feed: dates grouped by native timeline; hover changes border white → rgba(21,21,21,.16),0.3s cubic-bezier(.4,0,.2,1). Not click-switched panels except actual detail opening.
- Home nav: active text#151515, inactive black36%, hover#151515;14px text,16px icons; full-page backdrop gradient180px and blur16px. Header link layout aligns with820px main content on wide screens. Mobile secondary nav moves below header if needed; must remain reachable.
- Event card click: URL receives event ID, right-side modal opens. Escape/outside dismiss. Cover itself is part of the same action. Bookmark is UniSpot-specific and must stop card action.
- Panel: right550wide, inset8, corner-shape superellipse2/radius16,48px toolbar;padding8px12px; body scroll; neutral background#f8f8f8. Width<=450 fullscreen, no inset or radius.
- Detail title32/38.4 (long26px), mobile28/33.6 (long24px). Text16/24, labels14/21. Image280 square with glow overlay, not wide hero crop.
- Event Page toolbar opens standalone page. Copy Link copies UniSpot URL, not Luma. Prev/next uses currently filtered opportunities and disables at boundaries.
- Registration reference: clicking Join Waitlist opens Your Info form. Inspected form, never submitted. UniSpot uses the same registration-card structure with actual official external actions instead of gathering personal information.
- Search reference: full-viewport overlay, centered max740 content,24px input, native-scroll results using identical event cards. UniSpot implements keyword search with existing catalog and opens chosen event in side panel.
- Reduced motion: honor platform preference; otherwise .3s source easing. No scale-on-hover on cover, no decorative sparkle headings or marketing CTA section in refined UniSpot.

Raw files: home-desktop.json, home-responsive-behaviors.json, feed-computed.json,feed-states.json,detail-desktop.json,detail-responsive.json,event-page-desktop.json,search.json,registration.json. Screenshots: docs/design-references/luma-home/.
