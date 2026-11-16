# Choose your path: alternating selection regression

Verified at `http://localhost:3000/` on November 16, 2026.

## Reproduced cause

Students/Organizers was still invoking the template's Monthly/Yearly gesture
handler. After the adapter changed the copy, the billing counter wrote prices
such as `$1,599` or `$1,999` back into the three cards. The old 100/400/900 ms
resynchronization eventually restored UniSpot text. The page-wide observer
did not recognize a dollar-only change as legacy marketing copy.

A four-click recording reproduced six legacy-price samples across 218 sampled
animation frames. The source values alternated between UniSpot's words and the
template's annual/monthly prices.

## Fix

- `src/lib/landing-paths.ts` owns audience selection and deterministic card
  content, including descriptions, feature lists, labels, and destinations.
- Pricing controls intercept activation in document capture, before the
  template's delegated pointer/click/keyboard billing handlers. Selecting an
  audience no longer starts a billing-price transition.
- The existing card DOM and styling are retained. The selected pill follows
  the active control with a local, reduced-motion-aware transition.
- A scoped observer repairs dollar-counter, copy, link, or ARIA regressions in
  the mutation microtask. Every mounted card set is synchronized, including
  responsive variants, rather than only the first three outgoing values.
- Switching uses no delayed resynchronization timers.
- Positional card data prevents repeated phrases from being mapped into the
  wrong card when toggling back and forth.

## Browser verification

Separate clean contexts, Chromium, local development server:

| Scenario | Input | CPU | Sampled animation frames | Invalid/legacy frames |
| --- | --- | --- | ---: | ---: |
| Desktop, 1440 × 900 | Mouse | 4× slowdown | 411 | 0 |
| Mobile, 390 × 900 | Real touch events | 4× slowdown | 559 | 0 |

Each scenario exercised 16 alternating selections, including rapid selections,
and Enter, Space, Home, End, ArrowLeft, and ArrowRight. Frame checks validated
the three value words, product destinations, legacy-price/marketing text, and
the role-specific fourth feature in the Follow/Share card. No new JavaScript
errors occurred during the interactions; preexisting template hydration
messages during initial loading were outside that interaction count.

Additional checks:

- An injected `$9,999` value, `./contact` destination, and incorrect feature
  text were restored before the following animation frame.
- Organizers retained `Create / Publish / Share` and the selected state through
  widths 390, 768, 1440, and 320 px. The pill position matched the selected
  control at each width, without horizontal overflow.
- Reduced motion made the pill transition duration `0s`.
- Organizer destinations: `/hubs/new`, `/create`, `/hubs`.
- Student destinations: `/explore`, `/saved`, `/hubs`.

## Artifacts

- [Desktop alternating selections](../../.playwright-mcp/path-switch-qa/desktop-alternating.webm)
- [Mobile touch alternating selections](../../.playwright-mcp/path-switch-qa/mobile-touch-alternating.webm)
- [Desktop Organizers](../../.playwright-mcp/path-switch-qa/desktop-organizers.png)
- [Desktop Students](../../.playwright-mcp/path-switch-qa/desktop-students.png)
- [Mobile Organizers](../../.playwright-mcp/path-switch-qa/mobile-organizers.png)
- [Mobile Students](../../.playwright-mcp/path-switch-qa/mobile-students.png)
