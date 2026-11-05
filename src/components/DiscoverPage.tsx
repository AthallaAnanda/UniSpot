"use client";
import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SiteShell from "./SiteShell";
import { useCatalog } from "./CatalogProvider";
import CatalogErrorNotice from "./CatalogErrorNotice";
import Categories from "./Categories";
import CalendarCards from "./CalendarCards";
import LocationExplorer from "./LocationExplorer";
import OpportunityCard from "./OpportunityCard";
import OpportunityDetails from "./OpportunityDetails";
import { useOpportunitySelection } from "@/hooks/useOpportunitySelection";

const featuredIds = ["devfest-cloud-jakarta-2026", "lpdp-naist-2026", "google-ai-essentials", "icmns-2026"];
export default function DiscoverPage() {
  const catalog = useCatalog();
  const router = useRouter();
  const selection = useOpportunitySelection(catalog.opportunities);
  const organizationMap = useMemo(() => Object.fromEntries(catalog.organizations.map(organization => [organization.id, organization])), [catalog.organizations]);
  const featuredCalendars = useMemo(() => catalog.calendars.slice(0, 6), [catalog.calendars]);
  const selectCategory = useCallback((id: string) => router.push(`/explore?category=${id}`), [router]);
  const selectLocation = useCallback((location: string) => router.push(`/explore?location=${encodeURIComponent(location)}`), [router]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "saved") { params.delete("view"); router.replace(`/saved?${params}`); }
    else if (["q", "category", "location", "search"].some(key => params.has(key))) { params.delete("search"); router.replace(`/explore?${params}`); }
  }, [router]);
  const featured = useMemo(() => featuredIds.flatMap(id => catalog.opportunities.find(opportunity => opportunity.id === id) ?? []), [catalog.opportunities]);
  return <SiteShell><section className="intro-section"><h1 className="page-heading">Discover Opportunities</h1><p className="intro-description">Find your next chapter. Explore featured events, scholarships, and the communities making things happen.</p></section><CatalogErrorNotice /><Categories opportunities={catalog.opportunities} selected="all" onSelect={selectCategory} />
    <section className="section-block" aria-labelledby="featured-opportunities-title"><div className="section-heading"><h2 id="featured-opportunities-title">Featured Opportunities</h2><Link className="section-link" href="/explore">Explore all<ArrowRight size={14} /></Link></div><div className="featured-opportunity-list">{featured.map((opportunity, index) => <OpportunityCard key={opportunity.id} opportunity={opportunity} organization={organizationMap[opportunity.organizationId]} saved={catalog.saved.includes(opportunity.id)} onSave={catalog.toggleSave} onOpen={selection.open} priority={index === 0} />)}</div></section>
    <section className="section-block" aria-labelledby="featured-calendars-title"><div className="section-heading"><div><h2 id="featured-calendars-title">Featured Calendars</h2><p>Follow a community. Find what’s coming next.</p></div><Link className="section-link" href="/calendars">View all<ArrowRight size={14} /></Link></div><CalendarCards calendars={featuredCalendars} /></section>
    <LocationExplorer opportunities={catalog.opportunities} selected="all" onSelect={selectLocation} />
    <OpportunityDetails opportunity={selection.selected} organization={selection.selected ? organizationMap[selection.selected.organizationId] : undefined} saved={!!selection.selected && catalog.saved.includes(selection.selected.id)} onClose={selection.close} onSave={() => { if (selection.selected) catalog.toggleSave(selection.selected); }} onNotify={catalog.notify} />
  </SiteShell>;
}
