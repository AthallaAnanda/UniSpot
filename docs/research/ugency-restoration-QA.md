# Ugency template restoration — asset-only changes

Verified locally on November 15, 2026.

The restoration baseline below predates the loading fix. See
[landing-startup-QA.md](landing-startup-QA.md) for the current inline startup,
runtime scheduling, and refresh measurements.

## Scope and implementation

The root page again uses the captured Ugency document at
`src/lib/unispot-landing-source.json`, served by `/landing-static` through the
root rewrite. Its Framer stylesheet, responsive wrappers, original menu,
scroll entrances, carousel presentation and pricing/audience-switch layout
are retained. The alternative native `LandingPage.tsx` is not used by `/`.

The previous UniSpot content/link adapter is restored at
`/api/unispot-rebrand`. It keeps the existing student-facing copy and product
destinations, including CMS content mounted after initial load. It does not
introduce a new page stylesheet or replace the template section layouts.

`src/lib/landing-template-media.ts` substitutes image/video/poster URLs, both in
the initial HTML and when the original runtime mounts responsive variants or
CMS slides. The media synchronization observer only updates media attributes;
it does not change classes, inline geometry, wrappers, colors or typography.
Featured-slide images are matched to their source identity, so a Google AI
Essentials slide uses the Google image rather than the first slide's LPDP image.

## Automated checks

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run qa:landing`: 4/4 passed:
  1. `/` serves the preserved template with the UniSpot document title and all
     11 original named sections, rather than the native `.lp` layout.
  2. The 18 captured style blocks match byte-for-byte (compared by SHA-256).
     All 3,981 inline-style attributes, 1,887 named-wrapper attributes, and
     4,215 class attributes also match the captured document. The existing
     UniSpot reveal/logo rule is a separate, additional style block.
  3. Replacement media URLs are local and return HTTP 200.
  4. The document endpoint and content adapter are active; the generated
     adapter parses as valid JavaScript and references the replacement media.

## Browser verification

- Chromium at 1440, 768, 390 and 320 px: all 11 original sections are present,
  no horizontal overflow, and no broken visible images.
- Four visible hero videos use the new student footage and matching local
  posters. All reached `readyState = 4` without a media decoding error.
- The original Framer menu opens, navigates to `/hubs`, and browser Back returns
  to the template. Clicking the UniSpot home link from `/hubs` also returns to
  the template without an application console error.
- The original Students/Organizers control still changes the content and
  product actions in its existing template layout.
- Dynamically mounted featured content retains UniSpot labels and links; a
  Google AI Essentials slide was verified with `google-ai.webp` and its
  `/opportunities/google-ai-essentials` link.
- Scroll entrances remain active. Mission screenshots were captured after
  entering the viewport and allowing the original animation to settle.
- No application console errors were observed. The captured Framer runtime
  does emit recoverable React hydration warnings; it remains active to retain
  the template's original interactions.

## Reviewed screenshots

- [Desktop hero](../../.playwright-mcp/ugency-restored-1440.png)
- [Mobile hero](../../.playwright-mcp/ugency-restored-390.png)
- [Desktop mission](../../.playwright-mcp/ugency-restored-mission-1440.png)
- [Mobile mission](../../.playwright-mcp/ugency-restored-mission-390.png)

See [landing-assets.md](landing-assets.md) for replacement filenames, media
credits and image-generation briefs. Those briefs refer to the existing
template's media slots; generated images must fit those slots.
