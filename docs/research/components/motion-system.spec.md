# Soft, deliberate motion

Approved scope includes component interactions and client-side page entrances. Preserve synchronous state/input feedback and existing sidebar geometry, typography and colors.

## Timing
- Feedback120–180ms; hover240–280ms; view indicator340ms and content240ms.
- Drawer/detail enter420ms, exit260ms; backdrop240ms. Panels use opacity/transform, small overshoot-free easing cubic-bezier(.22,1,.36,1).
- Client page entrance300ms, opacity.85→1 and vertical translate6px→0. Initial load stays visible without an entrance animation. Header stays stationary. Search parameters alone never trigger page motion.
- Accordion600ms ease-in-out and chevron400ms remain unchanged.
- Toast enter280ms/exit240ms with an8px vertical offset. Keep its3500ms readable duration.

## Lifecycle and performance
- CSS-first, existing Radix Dialog presence for panel exits. Retain detail data during exit; clear it after unmount, not immediately on close. Do not use permanent forceMount.
- Animations are interruptible. A rapid reopen must cancel exit cleanup. Filter drawer keeps its current Escape/backdrop/focus handling.
- Card hover lift2px only under hover:hover and pointer:fine. Do not animate card height, image blur, long shadows or every card on search keystrokes.
- Follow/save state updates immediately; only their visual feedback animates.
- View fade starts at partial opacity so results never disappear while being interacted with. No stagger delays on initial content or typing.
- Discrete filter/sort changes may trigger a short group entrance; typing and pagination must not remount/reanimate existing cards or reset focus/scroll.
- A tall catalog must not be flattened into one large animated GPU surface. For long results, limit the fade to at most six cards intersecting the viewport, with no stagger/delay. Short results can animate as one group. Geometry is read once per discrete action, never on scroll or per frame.
- No new animation dependency, global transition:all, permanent will-change, polling, scroll listeners or per-frame React updates.
- Honor prefers-reduced-motion for CSS and retained-content cleanup. Keyboard focus indicators remain immediate.

## Verification
- Production before/after benchmark via scripts/benchmark-motion.mjs, identical warmup and4x CPU throttling. Capture frame gaps, long tasks, input-to-frame proxy and unexpected layout shift; distinguish these local samples from field INP/FPS guarantees.
- Verify both exit directions, rapid reopen, URL updates, retained closing content, focus restoration, reduced motion, mobile overflow, and immediate search updates.
