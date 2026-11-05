"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { CatalogView } from "@/hooks/useCatalogView";

export default function MotionResults({ transitionKey, view, children }: { transitionKey: string; view: CatalogView; children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  const previous = useRef(transitionKey);
  const animations = useRef<Animation[]>([]);
  useLayoutEffect(() => {
    if (previous.current === transitionKey) return;
    previous.current = transitionKey;
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    const node = element.current;
    if (!node || typeof node.animate !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const style = getComputedStyle(node);
    const time = style.getPropertyValue("--motion-view").trim();
    const milliseconds = parseFloat(time) * (time.endsWith("ms") ? 1 : 1000);
    // Bound the painted area: a tall catalog must not become one huge GPU layer.
    // Read geometry once on a discrete action, then animate at most six visible cards.
    const candidates = node.getBoundingClientRect().height > window.innerHeight
      ? Array.from(node.querySelectorAll<HTMLElement>(".opportunity-card,.calendar-card,.calendar-list-card"))
      : [node];
    const targets = candidates.filter(target => {
      const box = target.getBoundingClientRect();
      return box.bottom > 0 && box.top < window.innerHeight;
    }).slice(0, 6);
    const options = {
      duration: Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 240,
      easing: style.getPropertyValue("--motion-ease-soft").trim() || "ease-out",
    };
    animations.current = targets.map(target => target.animate([{ opacity: .82 }, { opacity: 1 }], options));
  }, [transitionKey]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (query.matches) animations.current.forEach(animation => animation.cancel()); };
    query.addEventListener("change", reduce);
    return () => { query.removeEventListener("change", reduce); animations.current.forEach(animation => animation.cancel()); };
  }, []);
  return <div ref={element} className="catalog-view-content" data-view={view}>{children}</div>;
}
