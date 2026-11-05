"use client";

import { LayoutGrid, List } from "lucide-react";
import type { CatalogView } from "@/hooks/useCatalogView";
import "./CatalogView.css";

export default function CatalogViewToggle({ view, onChange }: { view: CatalogView; onChange: (view: CatalogView) => void }) {
  return <div className="catalog-view-toggle" data-view={view} role="group" aria-label="Catalog view" onKeyDown={event => {
    const next = event.key === "ArrowLeft" || event.key === "Home" ? "grid" : event.key === "ArrowRight" || event.key === "End" ? "list" : null;
    if (!next) return;
    event.preventDefault();
    onChange(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-view="${next}"]`)?.focus();
  }}>
    <span className="catalog-view-indicator" aria-hidden="true" />
    <button type="button" data-view="grid" aria-label="Grid view" title="Grid view" aria-pressed={view === "grid"} onClick={() => onChange("grid")}><LayoutGrid size={17} strokeWidth={1.7} /></button>
    <button type="button" data-view="list" aria-label="List view" title="List view" aria-pressed={view === "list"} onClick={() => onChange("list")}><List size={18} strokeWidth={1.7} /></button>
  </div>;
}
