"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Search, X } from "lucide-react";
import { categories } from "@/lib/unispot";
import { useCatalogView } from "@/hooks/useCatalogView";
import { useCatalog } from "./CatalogProvider";
import CalendarCards from "./CalendarCards";
import CatalogErrorNotice from "./CatalogErrorNotice";
import SiteShell from "./SiteShell";
import FilterSidebar, { FilterChoices, FilterGroup } from "./FilterSidebar";
import CatalogViewToggle from "./CatalogViewToggle";
import MotionResults from "./MotionResults";

export default function CalendarDirectory() {
  const catalog = useCatalog();
  const { view: layout, setView: setLayout } = useCatalogView("calendars");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("All calendars");
  const [sort, setSort] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const search = useDeferredValue(query);
  const index = useMemo(() => catalog.calendars.map(calendar => ({ calendar, text: `${calendar.name} ${calendar.description}`.toLowerCase() })), [catalog.calendars]);
  const calendarCategories = useMemo(() => {
    const result = new Map<string, Set<string>>();
    for (const opportunity of catalog.opportunities) {
      if (!opportunity.calendarId) continue;
      if (!result.has(opportunity.calendarId)) result.set(opportunity.calendarId, new Set());
      result.get(opportunity.calendarId)!.add(opportunity.category);
    }
    return result;
  }, [catalog.opportunities]);
  const calendars = useMemo(() => {
    const followed = new Set(catalog.followed);
    const term = search.trim().toLowerCase();
    return index.filter(({ calendar, text }) =>
      (view !== "Following" || followed.has(calendar.id)) &&
      (view !== "My calendars" || calendar.canManage) && text.includes(term) &&
      (!selectedCategories.length || selectedCategories.some(category => calendarCategories.get(calendar.id)?.has(category)))
    ).map(entry => entry.calendar).sort((a, b) => sort === "title" ? a.name.localeCompare(b.name) : sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : 0);
  }, [index, calendarCategories, catalog.followed, search, view, sort, selectedCategories]);

  const hasFilters = !!query || view !== "All calendars" || selectedCategories.length > 0;
  const reset = () => { setQuery(""); setView("All calendars"); setSort("featured"); setSelectedCategories([]); };
  const toggleCategory = (value: string) => setSelectedCategories(previous => previous.includes(value) ? previous.filter(item => item !== value) : [...previous, value]);
  const resultTransition = JSON.stringify([layout, view, sort, selectedCategories]);

  return <SiteShell wide className="calendar-directory-shell catalog-sidebar-shell">
    <section className="intro-section"><h1 className="page-heading">Calendars</h1><p className="intro-description">Find a community to follow. Explore opportunities from organizers, campuses, and student groups.</p></section>
    <CatalogErrorNotice />
    <div className="catalog-search-layout">
      <FilterSidebar label="Search and filter calendars" activeCount={Number(!!query) + Number(view !== "All calendars") + selectedCategories.length} onReset={reset}>
        <label className="catalog-filter-sort"><span>Sort by</span><select aria-label="Sort calendars" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="title">A–Z</option><option value="newest">Recently added</option></select></label>
        <FilterGroup title="Search calendars" defaultOpen>
          <div className="catalog-sidebar-search"><Search size={16} /><input type="search" aria-label="Search calendars" placeholder="Names, topics, communities…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" className="icon-button" aria-label="Clear calendar search" onClick={() => setQuery("")}><X size={14} /></button>}</div>
        </FilterGroup>
        <FilterGroup title="Collection" defaultOpen selected={Number(view !== "All calendars")}>
          <div className="catalog-filter-choices" role="radiogroup" aria-label="Calendar collection">{["All calendars", "Following", "My calendars"].map(item => <label className="catalog-filter-choice" key={item}><input type="radio" name="calendar-collection" value={item} checked={view === item} onChange={() => setView(item)} /><span>{item}</span></label>)}</div>
        </FilterGroup>
        <FilterGroup title="Category" defaultOpen selected={selectedCategories.length}>
          <FilterChoices label="Calendar categories" options={categories.map(category => ({ value: category.id, label: category.name }))} selected={selectedCategories} onToggle={toggleCategory} />
        </FilterGroup>
      </FilterSidebar>
      <section className="section-block directory-results catalog-search-results" aria-label="Calendars" aria-busy={catalog.loading || query !== search}>
        <div className="section-heading"><h2 aria-live="polite">{calendars.length} {calendars.length === 1 ? "calendar" : "calendars"}</h2><CatalogViewToggle view={layout} onChange={setLayout} /></div>
        {calendars.length ? <MotionResults transitionKey={resultTransition} view={layout}><CalendarCards calendars={calendars} view={layout} /></MotionResults> : <div className="empty-state"><CalendarDays size={48} strokeWidth={1} /><h3>{query || selectedCategories.length ? "No calendars found" : view === "Following" ? "Follow your first calendar" : "Create your first calendar"}</h3><p>{query || selectedCategories.length ? "Try another name or reset your filters." : view === "Following" ? "Follow a calendar to keep your communities together here." : "Bring your community’s opportunities together in one place."}</p>{hasFilters ? <button className="secondary-button" onClick={reset}>Browse all calendars</button> : <Link className="primary-button calendar-create-button" href="/calendars/new">Create calendar</Link>}</div>}
      </section>
    </div>
  </SiteShell>;
}
