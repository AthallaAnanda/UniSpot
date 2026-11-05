"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Bookmark, Search, X } from "lucide-react";
import { categories } from "@/lib/unispot";
import { opportunitySearchIndex } from "@/lib/catalog-search";
import { useOpportunitySelection } from "@/hooks/useOpportunitySelection";
import { useCatalogView } from "@/hooks/useCatalogView";
import SiteShell from "./SiteShell";
import { useCatalog } from "./CatalogProvider";
import CatalogErrorNotice from "./CatalogErrorNotice";
import EventFeed from "./EventFeed";
import OpportunityDetails from "./OpportunityDetails";
import OpportunityCard from "./OpportunityCard";
import FilterSidebar, { FilterChoices, FilterGroup } from "./FilterSidebar";
import CatalogViewToggle from "./CatalogViewToggle";
import MotionResults from "./MotionResults";

const initial = { q: "", category: "all", location: "all", calendar: "all", format: "all", sort: "soonest", from: "", to: "" };
type Filters = typeof initial;
type ChoiceFilter = "category" | "location" | "calendar" | "format";
const selectedValues = (value: string) => value === "all" ? [] : value.split("|").filter(Boolean);

export default function ExplorePage({ savedOnly = false }: { savedOnly?: boolean }) {
  const catalog = useCatalog();
  const { view, setView } = useCatalogView(savedOnly ? "saved" : "explore");
  const [filters, setFilters] = useState<Filters>(initial);
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(12);
  const selection = useOpportunitySelection(catalog.opportunities);
  const query = useDeferredValue(filters.q);
  const searchIndex = useMemo(() => opportunitySearchIndex(catalog.opportunities, catalog.calendars), [catalog.opportunities, catalog.calendars]);
  const savedFilter = savedOnly ? catalog.saved : null;
  const savedFilterIds = useMemo(() => new Set(savedFilter ?? []), [savedFilter]);

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const next = { ...initial };
      for (const key of Object.keys(initial) as (keyof Filters)[]) next[key] = params.get(key) ?? initial[key];
      setFilters(next);
      setLimit(12);
    };
    restore();
    setReady(true);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== initial[key as keyof Filters]) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [filters, ready]);

  const update = (key: keyof Filters, value: string) => { setFilters(previous => ({ ...previous, [key]: value })); setLimit(12); };
  const toggle = (key: ChoiceFilter, value: string) => {
    setFilters(previous => {
      const selected = selectedValues(previous[key]);
      const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
      return { ...previous, [key]: next.join("|") || "all" };
    });
    setLimit(12);
  };
  const reset = () => { setFilters(initial); setLimit(12); };

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const categoryIds = new Set(selectedValues(filters.category));
    const locations = new Set(selectedValues(filters.location));
    const calendars = new Set(selectedValues(filters.calendar));
    const formats = new Set(selectedValues(filters.format));
    return searchIndex.filter(({ opportunity, calendarSlug, text }) => {
      const date = opportunity.date ?? opportunity.deadline;
      return (!savedOnly || savedFilterIds.has(opportunity.id)) && terms.every(term => text.includes(term)) &&
        (!categoryIds.size || categoryIds.has(opportunity.category)) && (!locations.size || locations.has(opportunity.city)) &&
        (!calendars.size || calendars.has(calendarSlug)) && (!formats.size || formats.has(opportunity.format)) &&
        (!filters.from || (!!date && (opportunity.endDate ?? date) >= filters.from)) && (!filters.to || (!!date && date <= filters.to));
    }).map(entry => entry.opportunity).sort((a, b) => filters.sort === "title" ? a.title.localeCompare(b.title) : filters.sort === "newest" ?
      (b.publishedAt ?? "2026-11-04").localeCompare(a.publishedAt ?? "2026-11-04") :
      (a.date ?? a.deadline ?? "9999").localeCompare(b.date ?? b.deadline ?? "9999"));
  }, [searchIndex, savedFilterIds, savedOnly, query, filters.category, filters.location, filters.calendar, filters.format, filters.from, filters.to, filters.sort]);

  const organizationMap = useMemo(() => Object.fromEntries(catalog.organizations.map(organization => [organization.id, organization])), [catalog.organizations]);
  const selectedIndex = selection.selected ? filtered.findIndex(opportunity => opportunity.id === selection.selected!.id) : -1;
  const locations = useMemo(() => [...new Set(catalog.opportunities.map(opportunity => opportunity.city))].sort(), [catalog.opportunities]);
  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const hasFilters = Object.entries(filters).some(([key, value]) => key !== "sort" && value !== initial[key as keyof Filters]);
  const activeCount = (["category", "location", "calendar", "format"] as ChoiceFilter[]).reduce((count, key) => count + selectedValues(filters[key]).length, 0) + Number(!!filters.q) + Number(!!filters.from || !!filters.to);
  const resultTransition = JSON.stringify([view, filters.category, filters.location, filters.calendar, filters.format, filters.sort, filters.from, filters.to]);
  // Opening/closing a detail panel should not reconcile every card beneath it.
  const resultCards = useMemo(() => view === "list" && filters.sort === "soonest" ?
    <EventFeed opportunities={visible} organizations={organizationMap} saved={catalog.saved} onSave={catalog.toggleSave} onOpen={selection.open} /> :
    <div className={view === "grid" ? "opportunity-catalog-grid" : "opportunity-grid"}>{visible.map(opportunity => <OpportunityCard key={opportunity.id} view={view} opportunity={opportunity} organization={organizationMap[opportunity.organizationId]} saved={catalog.saved.includes(opportunity.id)} onSave={catalog.toggleSave} onOpen={selection.open} />)}</div>,
  [view, filters.sort, visible, organizationMap, catalog.saved, catalog.toggleSave, selection.open]);

  return <SiteShell wide className="catalog-sidebar-shell">
    <section className="intro-section">
      <h1 className="page-heading">{savedOnly ? "Saved Opportunities" : "Explore Opportunities"}</h1>
      <p className="intro-description">{savedOnly ? "Your collection of possibilities, all in one place." : "Search every event, scholarship, and program. Find an opportunity, wherever its community calls home."}</p>
    </section>
    <CatalogErrorNotice />
    <div className="catalog-search-layout">
      <FilterSidebar label="Search and filter opportunities" activeCount={activeCount} onReset={reset}>
        <label className="catalog-filter-sort"><span>Sort by</span><select aria-label="Sort opportunities" value={filters.sort} onChange={event => update("sort", event.target.value)}><option value="soonest">Soonest first</option><option value="newest">Recently published</option><option value="title">A–Z</option></select></label>
        <FilterGroup title="Search opportunities" defaultOpen>
          <div className="catalog-sidebar-search"><Search size={16} /><input type="search" aria-label="Search opportunities" placeholder="Titles, topics, organizers…" value={filters.q} onChange={event => update("q", event.target.value)} />{filters.q && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => update("q", "")}><X size={14} /></button>}</div>
        </FilterGroup>
        <FilterGroup title="Category" defaultOpen selected={selectedValues(filters.category).length}>
          <FilterChoices label="Filter by category" options={categories.map(category => ({ value: category.id, label: category.name }))} selected={selectedValues(filters.category)} onToggle={value => toggle("category", value)} />
        </FilterGroup>
        <FilterGroup title="Location" defaultOpen={filters.location !== "all"} selected={selectedValues(filters.location).length}>
          <FilterChoices label="Filter by location" options={locations.map(location => ({ value: location, label: location }))} selected={selectedValues(filters.location)} onToggle={value => toggle("location", value)} />
        </FilterGroup>
        <FilterGroup title="Calendar" defaultOpen={filters.calendar !== "all"} selected={selectedValues(filters.calendar).length}>
          <FilterChoices label="Filter by calendar" options={catalog.calendars.map(calendar => ({ value: calendar.slug, label: calendar.name }))} selected={selectedValues(filters.calendar)} onToggle={value => toggle("calendar", value)} />
        </FilterGroup>
        <FilterGroup title="Format" defaultOpen={filters.format !== "all"} selected={selectedValues(filters.format).length}>
          <FilterChoices label="Filter by format" options={["In person", "Online", "Hybrid", "International"].map(format => ({ value: format, label: format }))} selected={selectedValues(filters.format)} onToggle={value => toggle("format", value)} />
        </FilterGroup>
        <FilterGroup title="Date range" defaultOpen={!!filters.from || !!filters.to} selected={Number(!!filters.from || !!filters.to)}>
          <div className="catalog-sidebar-dates"><label><span>From</span><input type="date" aria-label="From date" value={filters.from} max={filters.to || undefined} onChange={event => update("from", event.target.value)} /></label><label><span>To</span><input type="date" aria-label="To date" value={filters.to} min={filters.from || undefined} onChange={event => update("to", event.target.value)} /></label></div>
        </FilterGroup>
      </FilterSidebar>
      <section className="section-block explore-results catalog-search-results" aria-labelledby="explore-results-title" aria-busy={catalog.loading || filters.q !== query}>
        <div className="section-heading"><h2 id="explore-results-title"><span aria-live="polite">{filtered.length}</span> {filtered.length === 1 ? "opportunity" : "opportunities"}</h2><CatalogViewToggle view={view} onChange={setView} /></div>
        {filtered.length ? <>
          <MotionResults transitionKey={resultTransition} view={view}>{resultCards}</MotionResults>
          {filtered.length > limit && <div className="load-more"><button type="button" className="secondary-button" onClick={() => setLimit(value => value + 12)}>More opportunities<ArrowDown size={15} /></button></div>}
        </> : <div className="empty-state">
          {savedOnly ? <Bookmark size={48} strokeWidth={1} /> : <Search size={48} strokeWidth={1} />}
          <h3>{savedOnly && !hasFilters ? "No Saved Opportunities" : "No Opportunities Found"}</h3>
          <p>{savedOnly && !hasFilters ? "Save an opportunity to find it here later." : "Try another keyword or clear a filter."}</p>
          {hasFilters ? <button type="button" className="secondary-button" onClick={reset}>Reset filters</button> : <Link className="secondary-button" href="/explore">Explore opportunities</Link>}
        </div>}
      </section>
    </div>
    <OpportunityDetails opportunity={selection.selected} organization={selection.selected ? organizationMap[selection.selected.organizationId] : undefined} saved={!!selection.selected && catalog.saved.includes(selection.selected.id)} onClose={selection.close} onSave={() => { if (selection.selected) catalog.toggleSave(selection.selected); }} onNotify={catalog.notify} onPrevious={selectedIndex > 0 ? () => selection.open(filtered[selectedIndex - 1]) : undefined} onNext={selectedIndex >= 0 && selectedIndex < filtered.length - 1 ? () => selection.open(filtered[selectedIndex + 1]) : undefined} />
  </SiteShell>;
}
