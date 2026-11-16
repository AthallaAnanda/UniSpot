# Template landing: startup and refresh QA

## Active implementation

The current root URL is `http://localhost:3000/`. It rewrites to
`/landing-static`, not the alternative native `LandingPage.tsx` component.
The template restoration and newer media/theme changes are preserved.

The endpoint identifies this implementation with the response header
`X-UniSpot-Landing: template-inline`.

## Reproduction before the fix

A fresh standalone Chromium context reproduced both reports:

- Normal connection: the entire page stayed hidden until about 2672 ms, after
  `window.load` at 2409 ms. One sampled frame exposed old template text during
  a subsequent runtime render.
- Throttled connection (150 ms latency, 400,000 bytes/s download, 4× CPU
  slowdown): the page remained hidden through the 14-second recording.

The restored adapter waited for `window.load`, and the fallback could reveal
the document at seven seconds whether or not branding was ready. Branding after
runtime changes also used delayed timers. Module preloads, eager offscreen
images, and the separate deferred adapter request competed with the document.

## Changes

- The adapter is shared in `src/lib/landing-adapter.ts` and embedded in the
  document head. No separate adapter request or `window.load` dependency.
- Header and hero copy are prepared while the document is parsed. The hero
  does not wait for all 11 sections, videos, or the remote application.
- The template runtime starts after the initial full-document branding pass;
  its speculative module preloads no longer compete with initial rendering.
- Runtime/CMS changes are synchronized in the mutation microtask, rather than
  after the former 32 ms or 150 ms timers.
- The page-wide visibility gate and seven-second fallback are removed. Only
  the hero's original intro state is held until its text is prepared; its
  first appearance is shown at its final position instead of replaying a fade.
- The existing video frames can display posters before HD playback begins.
  Sources, full-frame fitting, poster identities, and newer media remain intact.
- Initial brand images use the local transparent UniSpot SVG. Offscreen images
  are lazy-loaded. The template purchase promotion is suppressed from first
  paint, matching its eventual removal by the existing adapter.

## Latest localhost recordings

Fresh Chromium contexts, cache disabled, 1440 × 900 desktop viewport. Measurements
are individual local runs, not a controlled multi-run performance benchmark.

| Scenario | Visible UniSpot heading | `window.load` | Sampled frames | Visible legacy-copy frames |
| --- | ---: | ---: | ---: | ---: |
| Desktop normal connection | 402 ms | 1533 ms | 228 | 0 |
| Desktop throttled connection | 2075 ms | 13043 ms | 170 | 0 |
| Mobile actual refresh, 390 × 900 | 196 ms | 1058 ms | 721 | 0 |

Each recording continued through fourteen seconds. Visible-text detection
checks heading/paragraph/navigation text, ancestor opacity/visibility, viewport
intersection, and ancestor overflow clipping. This excludes closed navigation
panels from false positives while including the right-side header CTA.

Screenshots at 1, 2, 4, 7, 10, and 14 seconds and WebM recordings are stored in:

- `.playwright-mcp/landing-startup-normal/`
- `.playwright-mcp/landing-startup-slow/`
- `.playwright-mcp/landing-startup-mobile-refresh/`

The screenshot review caught and corrected the header's rolling “Book a call”
label, which a paragraph-only check would have missed.

## Checks

- `npm run typecheck`: passed.
- `npm run qa:landing`: 5/5 passed. The captured styles, inline geometry,
  classes, and named wrappers still match; the additional critical startup
  stylesheet is tested separately from the captured template styles.
- `npm run build`: passed, including the TypeScript build check.
- Original menu opens and navigates to Hubs; browser Back returns correctly.
- Original Organizers/Students control changes values and destinations.
- Widths 320, 390, 768, and 1440: correct UniSpot heading and no horizontal
  overflow.

## Scope and remaining loading

The Framer application remains active to retain the restored template's
interactions. Its hydration mismatch errors (#418/#422) were still observed
in the standalone browser recordings; this change does not claim to eliminate
them. Menu, navigation, and audience switching were verified despite those
messages. HD videos and remote interaction modules still take time to download,
especially under throttling. The verified improvement is that the initial
UniSpot view is displayed earlier and was not replaced by visible legacy copy
in the sampled recordings; it is not a claim that all network activity finishes
at first paint.
