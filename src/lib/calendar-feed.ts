import type { Opportunity } from "@/types/unispot";

const escape = (text: string) => text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

// RFC 5545 folds long content lines at 75 UTF-8 octets, including the continuation space.
function fold(line: string) {
  const encoder = new TextEncoder();
  let current = "", size = 0;
  const lines: string[] = [];
  for (const character of line) {
    const length = encoder.encode(character).length;
    if (size + length > 75) { lines.push(current); current = " "; size = 1; }
    current += character; size += length;
  }
  return [...lines, current].join("\r\n");
}

export function calendarFeed(opportunities: Opportunity[], name = "UniSpot Opportunities") {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UniSpot//Opportunities//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${escape(name)}`];
  for (const opportunity of opportunities) {
    const date = opportunity.date ?? opportunity.deadline;
    if (!date) continue;
    const end = new Date(`${opportunity.date ? opportunity.endDate ?? date : date}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    lines.push("BEGIN:VEVENT", `UID:${opportunity.id}@unispot`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${date.replaceAll("-", "")}`, `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replaceAll("-", "")}`, `SUMMARY:${escape(!opportunity.date && opportunity.deadline ? `Application deadline: ${opportunity.title}` : opportunity.title)}`, `DESCRIPTION:${escape(`${opportunity.description}\n${opportunity.source}`)}`, `LOCATION:${escape(opportunity.location)}`, `URL:${escape(opportunity.source)}`, "END:VEVENT");
  }
  return [...lines, "END:VCALENDAR"].map(fold).join("\r\n") + "\r\n";
}
