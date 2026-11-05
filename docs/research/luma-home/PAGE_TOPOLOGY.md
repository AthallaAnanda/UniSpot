# Luma component refinement — source topology

## Sources inspected

- Authenticated Chromium at CDP9222: `https://luma.com/home`, `https://luma.com/discover`. Existing session used in place, no cookie/account data exported.
- Public `https://luma.com/jakarta`: actual event timeline and event-card composition.
- `https://luma.com/jakarta?e=…`: actual right-side event panel and its toolbar.
- `https://luma.com/ru9noaq1`: standalone event page and registration form (opened only, never submitted).
- Jakarta Search: full-screen, centered results search overlay with24px input and feed results.

## Home

Fixed52px nav +1px divider; content padding-top53; max820 border-box including16px gutters. Header padding-top44 with28/33.6 weight600 title,14px segmented control. Existing account has no upcoming events, so populated cards are extracted from the public event timeline. Empty state heading24/28.8 weight500. Home mobile header/title22px, same16px content gutters.

## Feed

Public city page has a decorative city hero; that marketing hero is not transferred. Core event list is a native-scroll timeline with date labels, dotted vertical rail, and horizontal white event cards. Card text first, cover on right; body16/24, title20/24 weight500,120px square cover; below450px90px cover and18/21.6 title. White border transitions to black16% on hover. Computed24px radius uses corner-shape:superellipse(2), not a circular24px radius.

## Detail panel

Click card updates URL and opens550px panel on right with8px viewport inset,48px toolbar, independent scrolling body. Toolbar has collapse, Copy Link, Event Page, prev/next. Cover280px square centered with diffuse image glow; title32/38.4 weight600. Mobile fullscreen with28px title. Registration is a separate card preceding About Event, with subdued header, status and funding row, explanatory text and full-width action.

## Standalone detail

Desktop event-page max960, left330, gap32, right566. Title48/55.2 weight600; at768 left280/rightremaining and title36; mobile stacked cover then title28. Section labels14 with divider; main text16/24. This is implemented as `/opportunities/[id]`, shared EventContent with panel.

## Adaptations retained

UniSpot original logo, magenta/coral brand gradient, English sourced student content, saved collection and filters. No real Luma registration or account actions performed. No attendee counts/affiliations fabricated. Images are the existing downloaded official source assets. New vector assets are exact extracted SVGs.
