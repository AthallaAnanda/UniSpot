import type { CategoryId, Opportunity } from "@/types/unispot";
import { calendarFeed } from "./calendar-feed";

export const categories: { id: CategoryId; name: string; color: string; background: string }[] = [
  { id: "events", name: "Events & seminars", color: "#e75b53", background: "#fff0eb" },
  { id: "scholarships", name: "Scholarships", color: "#b642b4", background: "#f9eafa" },
  { id: "workshops", name: "Workshops", color: "#d49426", background: "#fff6df" },
  { id: "competitions", name: "Competitions", color: "#6188d7", background: "#ecf2ff" },
  { id: "volunteering", name: "Volunteering", color: "#67966b", background: "#edf5ec" },
  { id: "career", name: "Career & skills", color: "#bd6b42", background: "#fcf0e8" },
  { id: "exchange", name: "Study abroad", color: "#8a75ca", background: "#f1edfb" },
  { id: "communities", name: "Communities", color: "#4d9caa", background: "#eaf5f6" },
];

const categoryMap = new Map(categories.map(category => [category.id, category]));
const jakartaDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" });

export function categoryFor(id: CategoryId) { return categoryMap.get(id)!; }

export function opportunityStatus(opportunity: Opportunity) {
  const today = jakartaDate.format(new Date());
  if (opportunity.deadline) return opportunity.deadline < today ? "Applications closed" : "Applications open";
  if (opportunity.date) return (opportunity.endDate ?? opportunity.date) < today ? "Event ended" : "Upcoming event";
  if (["workshops", "career"].includes(opportunity.category)) return "Self-paced learning";
  if (opportunity.category === "competitions") return "Getting started";
  return "Explore the program";
}

export function isPast(opportunity: Opportunity) {
  return ["Applications closed", "Event ended"].includes(opportunityStatus(opportunity));
}

export function downloadCalendar(opportunity: Opportunity) {
  const date = opportunity.date ?? opportunity.deadline;
  if (!date) return;
  const content = calendarFeed([opportunity]);
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${opportunity.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
