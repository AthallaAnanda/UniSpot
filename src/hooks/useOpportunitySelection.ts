"use client";
import { useCallback, useEffect, useState } from "react";
import type { Opportunity } from "@/types/unispot";

export function useOpportunitySelection(opportunities: Opportunity[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const restore = () => setSelectedId(new URLSearchParams(window.location.search).get("opportunity"));
    restore(); setRestored(true);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    if (!restored) return;
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("opportunity", selectedId); else url.searchParams.delete("opportunity");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [selectedId, restored]);
  const open = useCallback((opportunity: Opportunity) => setSelectedId(opportunity.id), []);
  const close = useCallback(() => setSelectedId(null), []);
  return { selected: opportunities.find(opportunity => opportunity.id === selectedId) ?? null, open, close };
}
