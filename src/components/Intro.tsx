import { MapPin, Search, X } from "lucide-react";

export default function Intro({ query, onQuery, location, onLocation, locations, savedView }: { query: string; onQuery: (value: string) => void; location: string; onLocation: (value: string) => void; locations: string[]; savedView: boolean }) {
  return <section className="intro-section" aria-labelledby="page-title">
    <div className="intro-heading-row"><h1 id="page-title">{savedView ? "Saved Opportunities" : "Discover Opportunities"}</h1></div>
    <p className="intro-description">{savedView ? "Keep track of the events, scholarships, and programs you want to explore." : "Explore events near you, discover opportunities for your next chapter, or find a community that shares your interests."}</p>
    <div className="discovery-search" role="search">
      <div className="search-input-wrap"><Search size={18} strokeWidth={1.5} /><input aria-label="Search opportunities" type="search" placeholder="Search opportunities…" value={query} onChange={e => onQuery(e.target.value)} />{query && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => onQuery("")}><X size={15} /></button>}</div>
      <label className="location-select"><MapPin size={16} /><select aria-label="Filter by location" value={location} onChange={e => onLocation(e.target.value)}><option value="all">All locations</option>{locations.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
    </div>
  </section>;
}
