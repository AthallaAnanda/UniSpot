import "server-only";
import { randomUUID } from "node:crypto";
import { calendarOrganization } from "@/lib/catalog-seed";
import { createClient } from "@/lib/supabase/server";
import { currentUser } from "./auth";
import { categories } from "@/lib/unispot";
import { defaultTimeZone, formatOpportunitySchedule } from "@/lib/opportunity-time";
import type { CatalogData, CategoryId, ManagedOpportunity, Opportunity, PartnerCalendar } from "@/types/unispot";

export class CatalogError extends Error { constructor(message: string, public status = 400) { super(message); } }
type Row = { id: string; slug: string; owner_id: string | null; data: PartnerCalendar };
function databaseError(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code === "23505") throw new CatalogError("This Hub URL is already taken. Try another one.", 409);
  if (error.code === "42501") throw new CatalogError("You don’t have permission to make this change.", 403);
  console.error("Supabase catalog request failed", error.code, error.message);
  throw new CatalogError("Couldn’t load or save the catalog. Please try again.", 503);
}
export async function requireApiUser() {
  const user = await currentUser();
  if (!user) throw new CatalogError("Please sign in to continue.", 401);
  return user;
}
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
function calendarFromRow(row: Row, userId?: string): PartnerCalendar {
  return { ...row.data, id: row.id, slug: row.slug, canManage: !!userId && row.owner_id === userId };
}
export async function getCatalog(userId?: string): Promise<CatalogData> {
  const supabase = await createClient();
  const [hubs, posts, organizations] = await Promise.all([
    supabase.from("hubs").select("id,slug,owner_id,data").order("created_at", { ascending: false }),
    supabase.from("opportunities").select("data").eq("status", "published").order("updated_at", { ascending: false }),
    supabase.from("organizations").select("data"),
  ]);
  [hubs, posts, organizations].forEach(result => databaseError(result.error));
  return { calendars: (hubs.data as Row[]).map(row => calendarFromRow(row, userId)), organizations: organizations.data!.map(row => row.data), opportunities: posts.data!.map(row => row.data) };
}
export async function getCalendar(slug: string, userId?: string): Promise<PartnerCalendar | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("hubs").select("id,slug,owner_id,data").eq("slug", slug).maybeSingle();
  databaseError(error);
  return data ? calendarFromRow(data as Row, userId) : undefined;
}
export async function getOpportunity(id: string): Promise<Opportunity | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("opportunities").select("data").eq("id", id).eq("status", "published").maybeSingle();
  databaseError(error);
  return data?.data;
}
export async function getOpportunityOrganization(opportunity: Opportunity) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("data").eq("id", opportunity.organizationId).maybeSingle();
  databaseError(error);
  return data?.data;
}
export async function requireOwner(slug: string) {
  const user = await requireApiUser();
  const calendar = await getCalendar(slug, user.id);
  if (!calendar) throw new CatalogError("Hub not found.", 404);
  if (!calendar.canManage) throw new CatalogError("This Hub can only be managed by its owner.", 403);
  return calendar;
}
export async function createCalendar(value: unknown) {
  await requireApiUser();
  const input = object(value);
  const name = text(input, "name", 100, true);
  const slug = text(input, "slug", 80, true).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || ["new", "manage", "api"].includes(slug)) throw new CatalogError("Use at least 3 lowercase letters, numbers, or hyphens for your Hub URL.");
  if (await getCalendar(slug)) throw new CatalogError("This Hub URL is already taken. Try another one.", 409);
  const color = text(input, "color", 7) || "#bb267e";
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new CatalogError("Please choose a valid Hub color.");
  const id = `cal-${randomUUID()}`;
  const socialInput = input.socialLinks === undefined ? {} : object(input.socialLinks);
  const socialLinks = Object.fromEntries(["instagram", "tiktok", "linkedin"].map(platform => [platform, webUrl(text(socialInput, platform, 2000), platform)]).filter(([, url]) => url));
  const calendar: PartnerCalendar = { id, slug, name, description: text(input, "description", 1500, true), website: webUrl(text(input, "website", 2000), "website"), socialLinks, logo: imageUrl(text(input, "logo", 2000)) || "/brand/unispot-icon.svg", cover: imageUrl(text(input, "cover", 2000)) || undefined, color, organizationId: id, curated: false, createdAt: new Date().toISOString() };
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_unispot_hub", { p_id: id, p_slug: slug, p_organization: calendarOrganization(calendar), p_data: calendar });
  databaseError(error);
  return { ...calendar, canManage: true };
}
export async function managedOpportunities(slug: string) {
  const calendar = await requireOwner(slug);
  const supabase = await createClient();
  const { data, error } = await supabase.from("opportunities").select("data,status,updated_at").eq("hub_id", calendar.id).order("updated_at", { ascending: false });
  databaseError(error);
  const opportunities = data!.map(row => ({ ...row.data, status: row.status, updatedAt: row.updated_at }) as ManagedOpportunity);
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
  const startTime = text(input, "startTime", 5) || undefined;
  const endTime = text(input, "endTime", 5) || undefined;
  const timeZone = text(input, "timeZone", 100) || defaultTimeZone;
  try { new Intl.DateTimeFormat("en-US", { timeZone }); }
  catch { throw new CatalogError("Please choose a valid time zone."); }
  if ([startTime, endTime].some(time => time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new CatalogError("Please enter a valid time in HH:MM format.");
  if (startTime && !date) throw new CatalogError("Add a start date before setting a time.");
  if (endTime && !startTime) throw new CatalogError("Add a start time before setting an end time.");
  if (startTime && endTime && (!endDate || endDate === date) && endTime <= startTime) throw new CatalogError("The end time must be after the start time.");
  if (endDate && (!date || endDate < date)) throw new CatalogError("The end date must be on or after the event date.");
  if (published && category === "events" && !date) throw new CatalogError("Please add an event date before publishing.");
  if (published && category === "scholarships" && !deadline) throw new CatalogError("Please add an application deadline before publishing.");
  const benefits = input.benefits;
  if (benefits !== undefined && (!Array.isArray(benefits) || benefits.length > 20 || benefits.some(item => typeof item !== "string" || item.length > 300))) throw new CatalogError("Add up to 20 benefits, with no more than 300 characters each.");
  return { id: existing?.id ?? `opp-${randomUUID()}`, title: text(input, "title", 180, true), category: category as CategoryId, calendarId: calendar.id, organizationId: calendar.organizationId, description: text(input, "description", 12000, published), city: text(input, "city", 100, published) || (format === "Online" ? "Online" : "Across Indonesia"), location: text(input, "location", 250, published), format: format as Opportunity["format"], schedule: text(input, "schedule", 180) || formatOpportunitySchedule({ date, endDate, startTime, endTime, timeZone }) || (date ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : deadline ? `Applications close ${deadline}` : "Explore the program"), date, endDate, startTime, endTime, timeZone, deadline, fee: text(input, "fee", 180, published) || "See organizer", eligibility: text(input, "eligibility", 4000, published), benefits: (benefits as string[] | undefined)?.map(item => item.trim()).filter(Boolean) ?? [], source: webUrl(text(input, "source", 2000), "registration or information link", published), sourceName: calendar.name, actionLabel: text(input, "actionLabel", 80) || "View details & register", image: imageUrl(text(input, "image", 2000)) || calendar.logo, imageFit: text(input, "image", 2000) ? "cover" : "contain", color: calendar.color, publishedAt: published ? existing?.publishedAt ?? new Date().toISOString() : existing?.publishedAt };
}
export async function saveOpportunity(slug: string, value: unknown, id?: string) {
  const calendar = await requireOwner(slug);
  const supabase = await createClient();
  const input = object(value);
  if (!["draft", "published"].includes(String(input.status))) throw new CatalogError("Choose draft or published status.");
  const status = input.status as "draft" | "published";
  let existing: Opportunity | undefined;
  if (id) {
    const { data, error } = await supabase.from("opportunities").select("data").eq("id", id).eq("hub_id", calendar.id).maybeSingle();
    databaseError(error);
    if (!data) throw new CatalogError("Opportunity not found.", 404);
    existing = data.data;
  }
  const opportunity = opportunityInput({ ...existing, ...input }, calendar, status, existing);
  const updatedAt = new Date().toISOString();
  const { error } = await supabase.from("opportunities").upsert({ id: opportunity.id, hub_id: calendar.id, organization_id: calendar.organizationId, status, updated_at: updatedAt, data: opportunity });
  databaseError(error);
  return { ...opportunity, status, updatedAt };
}
