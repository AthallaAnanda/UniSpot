"use client";

import { useCallback, useEffect, useState } from "react";

export type CatalogView = "grid" | "list";
const isView = (value: string | null): value is CatalogView => value === "grid" || value === "list";

export function useCatalogView(collection: "explore" | "saved" | "calendars") {
  const key = `unispot-${collection}-view`;
  const [view, setViewState] = useState<CatalogView>("grid");
  useEffect(() => {
    const restore = () => {
      const query = new URLSearchParams(window.location.search).get("view");
      let stored: string | null = null;
      try { stored = localStorage.getItem(key); } catch { /* Keep the view usable without storage. */ }
      setViewState(isView(query) ? query : isView(stored) ? stored : "grid");
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [key]);

  const setView = useCallback((next: CatalogView) => {
    setViewState(next);
    try { localStorage.setItem(key, next); } catch { /* The current visit still keeps its selection. */ }
    const url = new URL(window.location.href);
    url.searchParams.set("view", next);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [key]);
  return { view, setView };
}
