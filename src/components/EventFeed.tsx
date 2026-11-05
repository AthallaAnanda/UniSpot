import type { Opportunity, Organization } from "@/types/unispot";
import { memo, useMemo } from "react";
import OpportunityCard from "./OpportunityCard";

const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" });

function dateGroup(opportunity: Opportunity) {
  const value = opportunity.date ?? opportunity.deadline;
  if (!value) return { key: "anytime", title: "Explore anytime", subtitle: "Learning & ongoing opportunities" };
  const date = new Date(`${value}T12:00:00Z`);
  return { key: value, title: dayFormatter.format(date), subtitle: weekdayFormatter.format(date) };
}

export default memo(function EventFeed({ opportunities, organizations, saved, onSave, onOpen }: { opportunities: Opportunity[]; organizations: Record<string, Organization>; saved: string[]; onSave: (opportunity: Opportunity) => void; onOpen: (opportunity: Opportunity) => void }) {
  const groups = useMemo(() => {
    const result = new Map<string, { title: string; subtitle: string; opportunities: Opportunity[] }>();
    for (const opportunity of opportunities) {
      const key = opportunity.date ?? opportunity.deadline ?? "anytime";
      if (!result.has(key)) result.set(key, { ...dateGroup(opportunity), opportunities: [] });
      result.get(key)!.opportunities.push(opportunity);
    }
    return [...result.entries()];
  }, [opportunities]);
  const savedIds = useMemo(() => new Set(saved), [saved]);
  return <div className="event-timeline">{groups.map(([key, group]) => <section className="timeline-group" key={key} aria-label={`${group.title} ${group.subtitle}`}><h3 className="timeline-date">{group.title}<span>{group.subtitle}</span></h3><div className="opportunity-grid">{group.opportunities.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} organization={organizations[opportunity.organizationId]} saved={savedIds.has(opportunity.id)} onSave={onSave} onOpen={onOpen} />)}</div></section>)}</div>;
});
