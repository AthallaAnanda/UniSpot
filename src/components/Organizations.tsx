import { ArrowUpRight } from "lucide-react";
import type { Organization } from "@/types/unispot";

export default function Organizations({ organizations }: { organizations: Organization[] }) {
  return <section id="communities" className="section-block organizations-section" aria-labelledby="organizations-title">
    <div className="section-heading"><h2 id="organizations-title">Featured Communities</h2></div>
    <div className="organization-grid">{organizations.slice(0, 6).map(organization => <a className="organization-card" key={organization.id} href={organization.url} target="_blank" rel="noopener noreferrer">
      <div className="organization-card-top"><span className="organization-logo"><img src={organization.logo} alt={`${organization.name} logo`} loading="lazy" /></span><span className="organization-visit">Explore<ArrowUpRight size={13} /></span></div>
      <h3>{organization.name}</h3><p>{organization.description}</p><span className="organization-topic">{organization.topic}</span>
    </a>)}</div>
  </section>;
}
