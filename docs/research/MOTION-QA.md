# Soft motion implementation and verification

## Implementation

Shared timing/easing tokens live in `src/app/motion.css`. No new package was added.

| Interaction | Motion |
| --- | --- |
| Sidebar accordion | Existing600ms ease-in-out,400ms chevron |
| Filter drawer |420ms slide in,260ms slide out;240ms backdrop |
| Opportunity detail |420ms soft32px entrance,260ms exit; retained content through close |
| About dialog |300ms small translate/scale entrance,260ms exit |
| Grid/List indicator |340ms transform |
| Discrete results change |240ms opacity.82→1; no stagger |
| Client pathname navigation |300ms opacity.85→1 and6px vertical entrance |
| Card hover |2px lift/260ms, fine-pointer hover devices only |
| Control press |Scale.98 over120ms; state updates immediately |
| Save/Follow icon |180ms confirmation scale |
| Toast |280ms entrance,240ms exit;3500ms readable duration |

Initial documents stay visible without a page entrance. The navbar is outside the animated main. Query parameters do not trigger page motion. Main animation does not gate navigation or wait for an outgoing page.

Long catalogs fade at most six visible cards, not one tall GPU surface. Short results fade as a group. Geometry is read only on discrete view/filter changes, not during scrolling or on every frame. Typing and pagination do not replay results motion. Existing result cards are memoized so selection changes do not reconcile every card below the panel. Toast-only changes do not change catalog context identity.

## Functional verification

- Detail entrance computed420ms; exit state retained its title/content and was inert until Radix removed it. Focus returned to the card trigger.
- Drawer entrance/exit matched the configured durations; Escape and Close restored trigger focus. Selected checkbox state survived reopening.
- Rapid accordion reversal and repeated Grid/List changes reached their final selected state.
- A new opportunity opened during a previous detail’s exit was not cleared by stale cleanup.
- Save state survived Grid/List and panel previous/next navigation. Clicking Save did not open the panel.
- Toast retained its readable message during exit. A new message interrupted exit correctly; automatic dismissal removed the toast after its normal duration.
- Discrete category filtering invoked240ms Web Animations; six visible targets were used for a tall grid. Typing invoked none, and More opportunities expanded to17 without replaying existing card animations.
- Reduced motion removed the page entrance and card lift, reduced CSS durations, and skipped JavaScript result animations. Drawer/dialog dismissal still completed.
- Production navigation across Discover/Explore/Calendars at320,390,768,and1440px had no document horizontal overflow, no JavaScript page errors, no navbar animation, and no active page animations after settling.
- About dialog exit completed and unmounted normally.

## Production-only timing correction

Verification caught the CSS minifier normalizing the240ms custom property to`.24s`. The Web Animations duration parser now accepts both seconds and milliseconds. A running production assertion confirmed240ms after the fix. Intermediate timing samples made before this correction are not the final benchmark.

## Performance comparison

`scripts/benchmark-motion.mjs` runs the same warmup and interaction sequence against the temporary production server on port3002. It uses a fresh isolated browser context, a4×CPU throttle, frame sampling, PerformanceObserver and CDP metrics. Browser collections are not changed in the main context. No application QA records were created.

| Local metric | Before | Final |
| --- | ---: | ---: |
| p95 frame gap |16.8ms|33.3ms|
| Frame gaps >50ms |12|15|
| p95 click →next animation-frame callback |221.3ms|148.1ms|
| Main-thread TaskDuration |4681.7ms|5109.7ms|
| LayoutDuration |144.8ms|169.3ms|
| RecalcStyleDuration |763.6ms|1070.3ms|
| Unexpected layout shift |0|0|

The final sample adds about9.1% total main-thread work and more style work, while the input-to-frame proxy improves. Frame gaps are higher and long tasks remain under the artificial CPU slowdown. These are single local samples with environmental noise, not field INP or a universal60fps guarantee. The implementation limits the added work with compositor-friendly motion, visible-target caps, immediate input handling, no animation dependency, and no permanent animation loop. Full values: `docs/research/motion-performance.json`.

## Build

Final `npm run build` and `npm run typecheck` passed after all code changes. Baseline and final production processes are used only for QA; the normal app remains on port3000.
