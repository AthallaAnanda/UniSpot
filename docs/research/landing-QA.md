# Native UniSpot landing: refresh and first-render verification

**Historical:** this report describes the earlier native landing implementation.
The root was subsequently restored to the original template layout. Current
startup/loading verification is in [landing-startup-QA.md](landing-startup-QA.md).

> Historical report for the superseded native landing implementation.
> The user requested restoration of the Ugency template, with photo/video
> substitutions only. Current behavior is documented in
> [ugency-restoration-QA.md](ugency-restoration-QA.md).

Verified locally on November 15, 2026, against a production build served on
`http://localhost:3101`, with additional responsive checks on the development
server at port 3000.

## Root cause and implementation

The previous `/` rewrite served captured template HTML, an externally hosted
Framer application, and a rebranding script that repeatedly replaced the DOM.
The application could reintroduce its own branding and copy after UniSpot had
already been shown. Changing only the initial logo URL or hiding the old logo
could not prevent the other template content from returning.

`/` now renders `LandingPage.tsx` through the App Router. UniSpot copy, navigation,
transparent vector branding, and all 11 sections are server-rendered. Small local
client components implement video playback and the audience switch; the menu
uses native `details` and works without JavaScript. Media, fonts, and scripts
are served locally. There is no page-wide visibility gate, ready-class timeout,
branding polling, imported template HTML, or external template application.

The old `/landing-static` URL returns a 308 redirect to `/`. The old
`/api/unispot-rebrand` endpoint returns an empty 410 response. Historical source
captures are retained but unreferenced by application modules.

## Automated checks

- `npm run build`: passed, including TypeScript and prerendering `/`.
- `UNISPOT_QA_URL=http://localhost:3101 npm run qa:landing`: 3/3 passed.
  - UniSpot headline, branding, and section content exist in the initial HTML.
  - Template branding, copy, remote runtime URLs, and old readiness/rebrand code
    are absent from that response.
  - Initial media and script URLs are same-origin and respond successfully.
  - Both retired route behaviors match the implementation above.

## Recorded production scenarios

Each test used a clean browser context. Sampling started before navigation,
using `requestAnimationFrame`, with checks for legacy branding/copy/runtime URLs
in the document. Video recording also started before navigation. Desktop cold
load additionally used a CDP screencast to produce the filmstrip.

| Scenario | DOM frame samples | Legacy-content samples | Observed logo source | CLS |
| --- | ---: | ---: | --- | ---: |
| Desktop, cold load | 317 | 0 | `/brand/unispot.svg` only | 0.00329 |
| Desktop, reload with cache disabled | 327 | 0 | `/brand/unispot.svg` only | 0.00329 |
| Mobile, cold load | 183 | 0 | `/brand/unispot.svg` only | 0.00948 |
| Mobile, warm refresh | 205 | 0 | `/brand/unispot.svg` only | 0.00009 |

Desktop conditions: 1440 × 900 viewport, 150 ms network latency, 200,000 bytes/s
download, 100,000 bytes/s upload, and 4× CPU slowdown. First contentful paint in
that cold-load run was approximately 1044 ms. Cold load and reload were sampled
through eight seconds. There were no title visibility-gating samples after the
heading existed, no external requests, and no application JavaScript errors.

The cold-load filmstrip was visually reviewed. It shows only UniSpot branding
from the first painted page onward. Local font substitution and progressive
poster/video loading remain ordinary browser loading behavior; these are not
template content being rendered or restored.

### Local artifacts

- [Desktop slow cold-load + refresh video](../../.playwright-mcp/landing-qa/desktop-slow-cold-and-refresh.webm)
- [Cold-load filmstrip](../../.playwright-mcp/landing-qa/cold-load-filmstrip.png)
- [Mobile cold-load + refresh video](../../.playwright-mcp/landing-qa/mobile-cold-and-refresh.webm)
- [Production desktop screenshot](../../.playwright-mcp/landing-qa/production-desktop.png)
- [Production mobile screenshot](../../.playwright-mcp/landing-qa/production-mobile.png)
- [Production with JavaScript disabled](../../.playwright-mcp/landing-qa/production-no-javascript.png)
- [Full page after scrolling to load section images](../../.playwright-mcp/landing-qa/desktop-full.png)

## Interactions and responsive checks

- Checked widths 320, 390, 768, and 1440 px: 11 sections, no horizontal overflow,
  no broken loaded images, and no legacy content.
- Scrolled through all sections to trigger and verify lazy images; no HTTP
  failures occurred.
- Students is the server-rendered initial selection. Switching to Organizers
  exposes `/hubs/new`, `/create`, and `/hubs` actions.
- Home, ArrowLeft, and ArrowRight operate the audience tabs and focus correctly.
- Menu opens, Escape closes it, and navigation to Hubs and back returns to the
  native landing page.
- Pause/Play controls stop and resume all hero videos.
- Reduced-motion preference pauses hero videos.
- JavaScript-disabled production context still shows the headline, UniSpot
  logo, and all 11 sections. Its native menu opens successfully.
