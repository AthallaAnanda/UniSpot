// Only run for an intentional save/follow, never while restoring a collection.
export function playConfirmation(button: HTMLElement) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;
  // Wait for the committed state: Follow may replace a plus icon with a check.
  requestAnimationFrame(() => {
    const icon = button.querySelector("svg");
    if (preference.matches || !button.isConnected || button.getAttribute("aria-pressed") !== "true" || !icon || typeof icon.animate !== "function") return;
    icon.getAnimations().forEach(animation => animation.cancel());
    const animation = icon.animate([
      { transform: "scale(.72) rotate(-12deg)", offset: 0 },
      { transform: "scale(1.2) rotate(6deg)", offset: .45 },
      { transform: "scale(.96) rotate(0)", offset: .75 },
      { transform: "scale(1) rotate(0)", offset: 1 },
    ], { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" });
    const reduce = () => { if (preference.matches) animation.cancel(); };
    const cleanup = () => preference.removeEventListener("change", reduce);
    preference.addEventListener("change", reduce);
    void animation.finished.then(cleanup, cleanup);
  });
}
