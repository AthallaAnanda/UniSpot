"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Dialog } from "radix-ui";
import "./FilterSidebar.css";

export default function FilterSidebar({ label, activeCount = 0, onReset, children }: {
  label: string;
  activeCount?: number;
  onReset: () => void;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 860px)");
    const update = () => { setMobile(query.matches); if (!query.matches) setOpen(false); };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const content = <>{children}<button type="button" className="catalog-reset-filters" onClick={onReset}>Reset filters</button></>;
  return <aside className="catalog-filter-sidebar" aria-label={label}>
    <Dialog.Root open={mobile && open} onOpenChange={setOpen}>
      <Dialog.Trigger type="button" className="catalog-mobile-filter-toggle" aria-controls={id}><SlidersHorizontal size={16} /><span>Search & filters{activeCount > 0 && <small>{activeCount}</small>}</span><ChevronDown size={16} /></Dialog.Trigger>
      {!mobile && <div id={id} className="catalog-filter-content">{content}</div>}
      {mobile && <Dialog.Portal>
        <Dialog.Overlay className="catalog-mobile-filter-overlay" />
        <Dialog.Content id={id} className="catalog-mobile-filter-drawer">
          <div className="catalog-mobile-filter-heading"><Dialog.Title>Search & filters</Dialog.Title><Dialog.Close className="icon-button" aria-label="Close filters"><X size={20} /></Dialog.Close></div>
          <Dialog.Description className="sr-only">{label}. Choose filters and close this panel to view the results.</Dialog.Description>
          <div className="catalog-filter-content is-open">{content}</div>
        </Dialog.Content>
      </Dialog.Portal>}
    </Dialog.Root>
  </aside>;
}

export function FilterGroup({ title, children, defaultOpen = false, selected = 0 }: { title: string; children: ReactNode; defaultOpen?: boolean; selected?: number }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);
  return <div className={`catalog-filter-group${open ? " is-open" : ""}`}>
    <button id={`${id}-trigger`} type="button" className="catalog-filter-trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}><span>{title}{selected > 0 && <small>{selected}</small>}</span><ChevronRight size={14} /></button>
    <div id={id} className="catalog-filter-collapse" role="region" aria-labelledby={`${id}-trigger`} aria-hidden={!open} inert={!open}>
      <div className="catalog-filter-collapse-inner"><div className="catalog-filter-group-body">{children}</div></div>
    </div>
  </div>;
}

export function FilterChoices({ label, options, selected, onToggle }: { label: string; options: { value: string; label: string }[]; selected: string[]; onToggle: (value: string) => void }) {
  return <div className="catalog-filter-choices" role="group" aria-label={label}>{options.map(option => <label key={option.value} className="catalog-filter-choice"><input type="checkbox" checked={selected.includes(option.value)} onChange={() => onToggle(option.value)} /><span>{option.label}</span></label>)}</div>;
}
