export const defaultTimeZone = "Asia/Jakarta";

// Formatters are expensive to construct. Keep a bounded cache shared by the
// selected zone and the picker, rather than rebuilding hundreds during typing.
const offsetFormatters = new Map<string, Intl.DateTimeFormat>();
const offsets = new Map<string, string>();
const scheduleDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function timeZoneCity(timeZone: string) {
  return timeZone.split("/").pop()!.replaceAll("_", " ");
}

export function timeZoneOffset(timeZone: string, date?: string) {
  const day = date || new Date().toISOString().slice(0, 10);
  const key = `${timeZone}:${day}`;
  const cached = offsets.get(key);
  if (cached) return cached;
  let formatter = offsetFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" });
    if (offsetFormatters.size >= 64) offsetFormatters.delete(offsetFormatters.keys().next().value!);
    offsetFormatters.set(timeZone, formatter);
  }
  const offset = formatter.formatToParts(new Date(`${day}T12:00:00Z`)).find(part => part.type === "timeZoneName")?.value;
  const value = !offset || offset === "GMT" ? "GMT+00:00" : offset;
  if (offsets.size >= 2048) offsets.delete(offsets.keys().next().value!);
  offsets.set(key, value);
  return value;
}

export function formatOpportunitySchedule({ date, endDate, startTime, endTime, timeZone = defaultTimeZone }: {
  date?: string; endDate?: string; startTime?: string; endTime?: string; timeZone?: string;
}) {
  if (!date || !startTime) return "";
  const formatDate = (value: string) => scheduleDateFormatter.format(new Date(`${value}T12:00:00Z`));
  const start = `${formatDate(date)} · ${startTime}`;
  const end = endTime ? `–${endDate && endDate !== date ? `${formatDate(endDate)} · ` : ""}${endTime}` : "";
  const zone = timeZone === "Asia/Jakarta" ? "WIB" : timeZone === "Asia/Makassar" ? "WITA" : timeZone === "Asia/Jayapura" ? "WIT" : `${timeZoneCity(timeZone)} (${timeZoneOffset(timeZone, date)})`;
  return `${start}${end} ${zone}`;
}
