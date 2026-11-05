"use client";
import Link from "next/link";
import { useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import type { Opportunity, Organization } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import SiteShell from "./SiteShell";
import EventContent from "./EventContent";

export default function StandaloneEvent({ opportunity, organization }: { opportunity: Opportunity; organization?: Organization }) {
  const catalog = useCatalog();
  const current = catalog.opportunities.find(item => item.id === opportunity.id) ?? opportunity;
  const host = catalog.organizations.find(item => item.id === current.organizationId) ?? organization;
  const save = useCallback(() => catalog.toggleSave(current), [catalog.toggleSave, current]);
  return <SiteShell wide className="standalone-shell"><Link className="event-full-back" href="/explore"><ArrowLeft size={14} />Explore opportunities</Link><EventContent opportunity={current} organization={host} saved={catalog.saved.includes(current.id)} onSave={save} onNotify={catalog.notify} mode="page" /></SiteShell>;
}
