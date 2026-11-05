import "server-only";
import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { seedCatalog, calendarOrganization } from "@/lib/catalog-seed";
import { categories } from "@/lib/unispot";
import type { CatalogData, CategoryId, ManagedOpportunity, Opportunity, PartnerCalendar } from "@/types/unispot";

let database: DatabaseSync | undefined;
function db() {
  if (database) return database;
  const filename = process.env.UNISPOT_DB_PATH ?? path.join(process.cwd(), "data", "unispot.sqlite");
  mkdirSync(path.dirname(filename), { recursive: true });
  database = new DatabaseSync(filename);
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS calendars (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, owner_hash TEXT NOT NULL, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS opportunities (id TEXT PRIMARY KEY, calendar_id TEXT NOT NULL REFERENCES calendars(id) ON DELETE CASCADE, status TEXT NOT NULL CHECK(status IN ('draft','published')), updated_at TEXT NOT NULL, data TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS opportunities_calendar ON opportunities(calendar_id);
    CREATE INDEX IF NOT EXISTS opportunities_status ON opportunities(status);`);
  return database;
}
export class CatalogError extends Error { constructor(message: string, public status = 400) { super(message); } }
type Row = { id: string; slug: string; owner_hash: string; data: string };
type OpportunityRow = { id: string; calendar_id: string; status: "draft" | "published"; updated_at: string; data: string };
const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export const ownerCookie = "unispot-calendar-owner";
export const newOwnerToken = () => randomBytes(32).toString("hex");
const object = (value: unknown): Record<string, unknown> => { if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatalogError("Please provide valid form data."); return value as Record<string, unknown>; };
function text(input: Record<string, unknown>, key: string, max: number, required = false) {
  const value = input[key];
  if (value !== undefined && typeof value !== "string") throw new CatalogError(`${key} must be text.`);
  const clean = (value as string | undefined)?.trim() ?? "";
  if (clean.length > max) throw new CatalogError(`${key} must be ${max} characters or fewer.`);
  if (required && !clean) throw new CatalogError(`Please complete ${key}.`);
  return clean;
}
function webUrl(value: string, label: string, required = false) {
  if (!value && !required) return "";
  try { const url = new URL(value); if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error(); return url.href; }
  catch { throw new CatalogError(`Please enter a valid http(s) URL for ${label}.`); }
}
function imageUrl(value: string) { return value.startsWith("/assets/") || value.startsWith("/brand/") ? value : webUrl(value, "image"); }
function dateValue(input: Record<string, unknown>, key: string) {
  const value = text(input, key, 10);
  if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T12:00:00Z`)) || new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) !== value)) throw new CatalogError(`Please enter a valid ${key}.`);
  return value || undefined;
}
function calendarFromRow(row: Row, token?: string): PartnerCalendar {
  return { ...JSON.parse(row.data), canManage: !!token && row.owner_hash === digest(token) };
}
export function getCatalog(token?: string): CatalogData {
  const calendars = (db().prepare("SELECT * FROM calendars ORDER BY rowid DESC").all() as Row[]).map(row => calendarFromRow(row, token));
  const opportunities = (db().prepare("SELECT * FROM opportunities WHERE status='published' ORDER BY updated_at DESC").all() as OpportunityRow[]).map(row => JSON.parse(row.data) as Opportunity);
  return { calendars: [...seedCatalog.calendars, ...calendars], organizations: [...seedCatalog.organizations, ...calendars.map(calendarOrganization)], opportunities: [...seedCatalog.opportunities, ...opportunities] };
}
export function getCalendar(slug: string, token?: string): PartnerCalendar | undefined {
  const seeded = seedCatalog.calendars.find(calendar => calendar.slug === slug);
  if (seeded) return { ...seeded, canManage: false };
  const row = db().prepare("SELECT * FROM calendars WHERE slug=?").get(slug) as Row | undefined;
  return row ? calendarFromRow(row, token) : undefined;
}
export function getOpportunity(id: string): Opportunity | undefined {
  const seeded = seedCatalog.opportunities.find(opportunity => opportunity.id === id);
  if (seeded) return seeded;
  const row = db().prepare("SELECT data FROM opportunities WHERE id=? AND status='published'").get(id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : undefined;
}
export function getOpportunityOrganization(opportunity: Opportunity) {
  const catalog = getCatalog();
  return catalog.organizations.find(organization => organization.id === opportunity.organizationId);
}
export function requireOwner(slug: string, token?: string) {
  const calendar = getCalendar(slug, token);
  if (!calendar) throw new CatalogError("Calendar not found.", 404);
  if (!calendar.canManage) throw new CatalogError("This calendar can only be managed by its owner.", 403);
  return calendar;
}
export function createCalendar(value: unknown, token: string) {
  const input = object(value);
  const name = text(input, "name", 100, true);
  const slug = text(input, "slug", 80, true).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || ["new", "manage", "api"].includes(slug)) throw new CatalogError("Use at least 3 lowercase letters, numbers, or hyphens for your calendar URL.");
  if (getCalendar(slug)) throw new CatalogError("This calendar URL is already taken. Try another one.", 409);
  const color = text(input, "color", 7) || "#bb267e";
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new CatalogError("Please choose a valid calendar color.");
  const id = `cal-${randomUUID()}`;
  const socialInput = input.socialLinks === undefined ? {} : object(input.socialLinks);
  const socialLinks = Object.fromEntries(["instagram", "tiktok", "linkedin"].map(platform => [platform, webUrl(text(socialInput, platform, 2000), platform)]).filter(([, url]) => url));
  const calendar: PartnerCalendar = { id, slug, name, description: text(input, "description", 1500, true), website: webUrl(text(input, "website", 2000), "website"), socialLinks, logo: imageUrl(text(input, "logo", 2000)) || "/brand/unispot-icon.svg", cover: imageUrl(text(input, "cover", 2000)) || undefined, color, organizationId: id, curated: false, createdAt: new Date().toISOString() };
  try { db().prepare("INSERT INTO calendars (id,slug,owner_hash,data) VALUES (?,?,?,?)").run(id, slug, digest(token), JSON.stringify(calendar)); }
  catch (error) { if (String(error).includes("UNIQUE")) throw new CatalogError("This calendar URL is already taken.", 409); throw error; }
  return { ...calendar, canManage: true };
}
export function managedOpportunities(slug: string, token?: string) {
  const calendar = requireOwner(slug, token);
  const opportunities = (db().prepare("SELECT * FROM opportunities WHERE calendar_id=? ORDER BY updated_at DESC").all(calendar.id) as OpportunityRow[]).map(row => ({ ...JSON.parse(row.data), status: row.status, updatedAt: row.updated_at }) as ManagedOpportunity);
  return { calendar, opportunities };
}
function opportunityInput(value: unknown, calendar: PartnerCalendar, status: "draft" | "published", existing?: Opportunity): Opportunity {
  const input = object(value);
  const published = status === "published";
  const category = text(input, "category", 30) || "events";
  if (!categories.some(item => item.id === category)) throw new CatalogError("Please choose a valid category.");
  const format = text(input, "format", 30) || "In person";
  if (!["In person", "Online", "Hybrid", "International"].includes(format)) throw new CatalogError("Please choose a valid format.");
  const date = dateValue(input, "date"), endDate = dateValue(input, "endDate"), deadline = dateValue(input, "deadline");
  if (endDate && (!date || endDate < date)) throw new CatalogError("The end date must be on or after the event date.");
  if (published && category === "events" && !date) throw new CatalogError("Please add an event date before publishing.");
  if (published && category === "scholarships" && !deadline) throw new CatalogError("Please add an application deadline before publishing.");
  const benefits = input.benefits;
  if (benefits !== undefined && (!Array.isArray(benefits) || benefits.length > 20 || benefits.some(item => typeof item !== "string" || item.length > 300))) throw new CatalogError("Add up to 20 benefits, with no more than 300 characters each.");
  return { id: existing?.id ?? `opp-${randomUUID()}`, title: text(input, "title", 180, true), category: category as CategoryId, calendarId: calendar.id, organizationId: calendar.organizationId, description: text(input, "description", 12000, published), city: text(input, "city", 100, published) || (format === "Online" ? "Online" : "Across Indonesia"), location: text(input, "location", 250, published), format: format as Opportunity["format"], schedule: text(input, "schedule", 180) || (date ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : deadline ? `Applications close ${deadline}` : "Explore the program"), date, endDate, deadline, fee: text(input, "fee", 180, published) || "See organizer", eligibility: text(input, "eligibility", 4000, published), benefits: (benefits as string[] | undefined)?.map(item => item.trim()).filter(Boolean) ?? [], source: webUrl(text(input, "source", 2000), "registration or information link", published), sourceName: calendar.name, actionLabel: text(input, "actionLabel", 80) || "View details & register", image: imageUrl(text(input, "image", 2000)) || calendar.logo, imageFit: text(input, "image", 2000) ? "cover" : "contain", color: calendar.color, publishedAt: published ? existing?.publishedAt ?? new Date().toISOString() : existing?.publishedAt };
}
export function saveOpportunity(slug: string, value: unknown, token?: string, id?: string) {
  const calendar = requireOwner(slug, token);
  const input = object(value);
  if (!["draft", "published"].includes(String(input.status))) throw new CatalogError("Choose draft or published status.");
  const status = input.status as "draft" | "published";
  let existing: Opportunity | undefined;
  if (id) {
    const row = db().prepare("SELECT * FROM opportunities WHERE id=? AND calendar_id=?").get(id, calendar.id) as OpportunityRow | undefined;
    if (!row) throw new CatalogError("Opportunity not found.", 404);
    existing = JSON.parse(row.data);
  }
  const opportunity = opportunityInput({ ...existing, ...input }, calendar, status, existing);
  const updatedAt = new Date().toISOString();
  db().prepare("INSERT INTO opportunities (id,calendar_id,status,updated_at,data) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at,data=excluded.data").run(opportunity.id, calendar.id, status, updatedAt, JSON.stringify(opportunity));
  return { ...opportunity, status, updatedAt };
}
