import type { Opportunity, Organization } from "@/types/unispot";
import OpportunityCard from "./OpportunityCard";

function dateGroup(opportunity: Opportunity) {
  const value = opportunity.date ?? opportunity.deadline;
  if (!value) return { key: "anytime", title: "Explore anytime", subtitle: "Learning & ongoing opportunities" };
  const date = new Date(`${value}T12:00:00Z`);
  return { key: value, title: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }), subtitle: date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }) };
}

export default function EventFeed({ opportunities, organizations, saved, onSave, onOpen }: { opportunities: Opportunity[]; organizations: Record<string, Organization>; saved: string[]; onSave: (opportunity: Opportunity) => void; onOpen: (opportunity: Opportunity) => void }) {
  const groups = new Map<string, { title: string; subtitle: string; opportunities: Opportunity[] }>();
  for (const opportunity of opportunities) {
    const group = dateGroup(opportunity);
    if (!groups.has(group.key)) groups.set(group.key, { ...group, opportunities: [] });
    groups.get(group.key)!.opportunities.push(opportunity);
  }
  return <div className="event-timeline">{[...groups.entries()].map(([key, group]) => <section className="timeline-group" key={key} aria-label={`${group.title} ${group.subtitle}`}><h3 className="timeline-date">{group.title}<span>{group.subtitle}</span></h3><div className="opportunity-grid">{group.opportunities.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} organization={organizations[opportunity.organizationId]} saved={saved.includes(opportunity.id)} onSave={() => onSave(opportunity)} onOpen={() => onOpen(opportunity)} />)}</div></section>)}</div>;
}
