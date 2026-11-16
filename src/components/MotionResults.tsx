"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { CatalogView } from "@/hooks/useCatalogView";

export default function MotionResults({ transitionKey, appendKey = 0, view, children }: { transitionKey: string; appendKey?: number; view: CatalogView; children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  const previous = useRef({ transitionKey, appendKey });
  const previousCards = useRef(new Set<HTMLElement>());
  const animations = useRef<Animation[]>([]);
  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    const cards = Array.from(node.querySelectorAll<HTMLElement>(".opportunity-card,.calendar-card,.calendar-list-card"));
    const appended = cards.filter(card => !previousCards.current.has(card));
    previousCards.current = new Set(cards);
    const changed = previous.current.transitionKey !== transitionKey;
    const added = previous.current.appendKey !== appendKey;
    previous.current = { transitionKey, appendKey };
    if (!changed && !added) return;
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    if (typeof node.animate !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const style = getComputedStyle(node);
    const time = style.getPropertyValue("--motion-view").trim();
    const milliseconds = parseFloat(time) * (time.endsWith("ms") ? 1 : 1000);
    // Animate small, visible cards, never an entire tall catalog. Appending results
    // leaves existing cards (and their keyboard focus) in place.
    const candidates = changed ? cards : appended;
    const targets = candidates.filter(target => {
      const box = target.getBoundingClientRect();
      return box.bottom > 52 && box.top < window.innerHeight && box.width > 0;
    }).slice(0, 6);
    const options = {
      duration: Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 300,
      easing: style.getPropertyValue("--motion-ease-soft").trim() || "ease-out",
    };
    animations.current = targets.map((target, index) => target.animate([
      { opacity: .25, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { ...options, delay: index * 30, fill: "backwards" }));
  }, [transitionKey, appendKey, children]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (query.matches) animations.current.forEach(animation => animation.cancel()); };
    query.addEventListener("change", reduce);
    return () => { query.removeEventListener("change", reduce); animations.current.forEach(animation => animation.cancel()); };
  }, []);
  return <div ref={element} className="catalog-view-content" data-view={view} onFocusCapture={() => animations.current.forEach(animation => animation.cancel())}>{children}</div>;
}
