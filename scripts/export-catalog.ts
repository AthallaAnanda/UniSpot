import { DatabaseSync } from "node:sqlite";
import { existsSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { seedCatalog, calendarOrganization } from "../src/lib/catalog-seed";
import type { PartnerCalendar } from "../src/types/unispot";

const sqlite = process.env.UNISPOT_DB_PATH ?? "data/unispot.sqlite";
const db = existsSync(sqlite) ? new DatabaseSync(sqlite, { readOnly: true }) : undefined;
const legacyHubs = (db?.prepare("select data from calendars").all() ?? []).map(row => JSON.parse(row.data as string) as PartnerCalendar);
const organizations = [...seedCatalog.organizations, ...legacyHubs.map(calendarOrganization)].map(data => ({ id: data.id, data }));
const hubs = [...seedCatalog.calendars, ...legacyHubs].map(data => {
  const { canManage: _, ...clean } = data;
  return { id: data.id, slug: data.slug, organization_id: data.organizationId, created_at: data.createdAt, data: clean };
});
const opportunities = [
  ...seedCatalog.opportunities.map(data => ({ id: data.id, hub_id: data.calendarId ?? null, organization_id: data.organizationId, status: "published", updated_at: data.publishedAt ?? "2026-11-05T00:00:00Z", data })),
  ...(db?.prepare("select * from opportunities").all() ?? []).map(row => ({ id: row.id, hub_id: row.calendar_id, organization_id: JSON.parse(row.data as string).organizationId, status: row.status, updated_at: row.updated_at, data: JSON.parse(row.data as string) })),
];
db?.close();
const catalog = { organizations, hubs, opportunities };
const output = process.argv[2] ?? "/tmp/opencode/unispot-catalog-export.json";
const payload = JSON.stringify(catalog, null, 2);
writeFileSync(output, payload);
console.log(JSON.stringify({ output, sha256: createHash("sha256").update(payload).digest("hex"), counts: Object.fromEntries(Object.entries(catalog).map(([key, rows]) => [key, rows.length])), hubs: hubs.map(h => ({ id: h.id, slug: h.slug, name: h.data.name })) }, null, 2));
