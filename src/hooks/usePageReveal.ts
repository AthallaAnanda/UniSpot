"use client";

import { useLayoutEffect, useRef } from "react";

const revealTargets = ".intro-section > *, .section-heading, .category-tile, .opportunity-card, .calendar-card, .region-tabs, .location-item";

export function usePageReveal(enabled: boolean, routeKey: string) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = root.current;
    if (!enabled || !node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const animations = new Map<HTMLElement, Animation>();
    const targets = Array.from(node.querySelectorAll<HTMLElement>(revealTargets));
    const reveal = (elements: HTMLElement[]) => {
      elements.forEach((element, index) => {
        seen.add(element);
        const animation = element.animate([
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 360, delay: Math.min(index, 5) * 35, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
        animations.set(element, animation);
        const clear = () => { if (animations.get(element) === animation) animations.delete(element); };
        void animation.finished.then(clear, clear);
      });
    };
    const observer = new IntersectionObserver(entries => {
      if (preference.matches) return;
      const visible = entries.filter(entry => entry.isIntersecting && !seen.has(entry.target));
      reveal(visible.map(entry => entry.target as HTMLElement));
      visible.forEach(entry => observer.unobserve(entry.target));
    }, { threshold: 0.08 });
    const start = () => {
      if (preference.matches) {
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
        animations.clear();
        return;
      }
      // Start the first viewport before paint; offscreen content stays readable
      // without JS and only animates once when it enters the viewport.
      const visible: HTMLElement[] = [];
      targets.forEach(element => {
        if (seen.has(element)) return;
        const box = element.getBoundingClientRect();
        if (box.width && box.height && box.bottom > 52 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth) visible.push(element);
        else observer.observe(element);
      });
      reveal(visible);
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const [element, animation] of animations) if (element.contains(event.target)) animation.cancel();
    };
    start();
    preference.addEventListener("change", start);
    node.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", start);
      node.removeEventListener("focusin", focus);
      animations.forEach(animation => animation.cancel());
    };
  }, [enabled, routeKey]);

  return root;
}
