import { ArrowUpRight, Building2, Globe2, MapPin } from "lucide-react";
import { useState } from "react";
import type { Opportunity } from "@/types/unispot";

export default function LocationExplorer({ opportunities, selected, onSelect }: { opportunities: Opportunity[]; selected: string; onSelect: (city: string) => void }) {
  const [region, setRegion] = useState("Indonesia");
  const cities = region === "Indonesia" ? ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Bogor", "Depok"] : region === "Online" ? ["Online"] : ["International"];
  const colors = ["#d072a7", "#b490d0", "#cda35c", "#d5876c", "#7aa59b", "#7d9bc7"];
  return <section id="locations" className="section-block locations-section" aria-labelledby="locations-title">
    <div className="section-heading"><h2 id="locations-title">Explore by Location</h2></div>
    <div className="region-tabs" aria-label="Explore regions">{["Indonesia", "Online", "International"].map(r => <button type="button" key={r} aria-pressed={r === region} className={r === region ? "selected" : ""} onClick={() => setRegion(r)}>{r}</button>)}</div>
    <div className="location-grid">{cities.map((city, index) => {
      const count = opportunities.filter(o => o.city === city).length;
      return <button type="button" className={`location-item${city === selected ? " selected" : ""}`} key={city} onClick={() => onSelect(city)}>
        <span className="city-symbol" style={{ background: colors[index % colors.length] }}>{["Online", "International"].includes(city) ? <Globe2 size={21} strokeWidth={1.4} /> : <Building2 size={21} strokeWidth={1.4} />}</span><span><strong>{city === "Online" ? "Anywhere, online" : city === "International" ? "Beyond Indonesia" : city}</strong><small>{count} {count === 1 ? "opportunity" : "opportunities"}</small></span><ArrowUpRight className="location-arrow" size={15} />
      </button>;
    })}</div>
  </section>;
}
