import type { Opportunity } from "@/types/unispot";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function parseDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : undefined;
}

/** Compact catalog label; detailed times and enrollment instructions stay on the detail page. */
export function opportunityDateLabel(opportunity: Pick<Opportunity, "date" | "endDate" | "deadline">) {
  const start = parseDate(opportunity.date ?? opportunity.deadline);
  if (!start) return "Ongoing";
  const end = opportunity.date ? parseDate(opportunity.endDate) : undefined;
  if (end && end > start) return dateFormat.formatRange(start, end).replace(/\s*–\s*/g, "–");
  return dateFormat.format(start);
}
