"use client";
import { useRef } from "react";
import { Dialog } from "radix-ui";
import { Search, X } from "lucide-react";
import type { Opportunity, Organization } from "@/types/unispot";
import "./SearchDialog.css";

export default function SearchDialog({ open, onClose, query, onQuery, opportunities, organizations, onOpen }: { open: boolean; onClose: () => void; query: string; onQuery: (query: string) => void; opportunities: Opportunity[]; organizations: Record<string, Organization>; onOpen: (opportunity: Opportunity) => void }) {
  const origin = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) onClose(); }}><Dialog.Portal><Dialog.Overlay className="search-overlay"><Dialog.Content className="search-modal" aria-describedby="search-dialog-description" onOpenAutoFocus={() => { origin.current = document.activeElement as HTMLElement; }} onCloseAutoFocus={e => { e.preventDefault(); origin.current?.focus(); }}>
    <Dialog.Title className="sr-only">Search opportunities</Dialog.Title><Dialog.Description id="search-dialog-description" className="sr-only">Search events, scholarships, and programs from the UniSpot catalog.</Dialog.Description>
    <Dialog.Close className="search-close icon-button" aria-label="Close search"><X size={18} /></Dialog.Close>
    <div className="search-modal-input"><Search size={24} strokeWidth={1.5} /><input aria-label="Search for opportunities" placeholder="Search for opportunities…" value={query} onChange={e => onQuery(e.target.value)} /></div>
    <div className="search-results">{query && <p className="search-result-count">{opportunities.length} {opportunities.length === 1 ? "opportunity" : "opportunities"}</p>}{opportunities.length ? opportunities.map(opportunity => <button type="button" className="search-result" key={opportunity.id} onClick={() => { onClose(); onOpen(opportunity); }}><img className="search-result-cover" src={opportunity.image} alt="" style={{ objectFit: opportunity.imageFit ?? "cover", backgroundColor: opportunity.color }} /><span className="search-result-text"><span className="search-result-date">{opportunity.schedule}</span><strong>{opportunity.title}</strong><span className="search-result-host"><img src={organizations[opportunity.organizationId]?.logo} alt="" />By {opportunity.sourceName}</span><span className="search-result-location">{opportunity.location}</span></span></button>) : <p className="search-empty">No opportunities found. Try a different search.</p>}</div>
  </Dialog.Content></Dialog.Overlay></Dialog.Portal></Dialog.Root>;
}
