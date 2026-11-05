import type { Opportunity, PartnerCalendar } from "@/types/unispot";
import { categoryFor } from "./unispot";

/** Build searchable text when catalog data changes, not for every keypress. */
export function opportunitySearchIndex(opportunities: Opportunity[], calendars: PartnerCalendar[]) {
  const calendarMap = new Map(calendars.map(calendar => [calendar.id, calendar]));
  return opportunities.map(opportunity => {
    const calendar = opportunity.calendarId ? calendarMap.get(opportunity.calendarId) : undefined;
    return {
      opportunity,
      calendarSlug: calendar?.slug ?? "",
      text: `${opportunity.title} ${opportunity.description} ${opportunity.city} ${opportunity.sourceName} ${opportunity.category} ${categoryFor(opportunity.category).name} ${calendar?.name ?? ""}`.toLowerCase(),
    };
  });
}
