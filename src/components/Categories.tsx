import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/unispot";
import type { CategoryId, Opportunity } from "@/types/unispot";
import CategoryIcon from "./CategoryIcon";

export default function Categories({ opportunities, selected, onSelect }: { opportunities: Opportunity[]; selected: string; onSelect: (id: CategoryId) => void }) {
  return <section className="categories-section section-block" aria-labelledby="categories-title">
    <div className="section-heading"><h2 id="categories-title">Browse by Category</h2></div>
    <div className="unispot-category-grid">{categories.map(category => {
      const count = opportunities.filter(o => o.category === category.id).length;
      return <button type="button" key={category.id} className={`category-tile${selected === category.id ? " selected" : ""}`} aria-pressed={selected === category.id} onClick={() => onSelect(category.id)}>
        <span className="category-icon" style={{ color: category.color, background: category.background }}><CategoryIcon category={category.id} /></span>
        <span className="category-info"><span className="category-name">{category.name}</span><span className="category-count">{count} {count === 1 ? "opportunity" : "opportunities"}</span></span><ArrowUpRight className="category-arrow" size={14} />
      </button>;
    })}</div>
  </section>;
}
