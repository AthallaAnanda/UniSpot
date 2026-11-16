"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { categories } from "@/lib/unispot";
import type { ManagedOpportunity, Opportunity, PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import SiteShell from "./SiteShell";
import "./CalendarPublishing.css";

type EditorFields = Pick<Opportunity, "title" | "category" | "description" | "format" | "city" | "location" | "schedule" | "fee" | "eligibility" | "source" | "actionLabel" | "image"> & {
  date: string;
  endDate: string;
  deadline: string;
  benefits: string;
};
type ManagerData = { calendar: PartnerCalendar; opportunities: ManagedOpportunity[] };
type PublishStatus = ManagedOpportunity["status"];

function emptyFields(): EditorFields {
  return { title: "", category: "events", description: "", format: "Online", city: "Online", location: "", date: "", endDate: "", deadline: "", schedule: "", fee: "See organizer", eligibility: "", benefits: "", source: "", actionLabel: "View details & register", image: "" };
}

function editFields(opportunity: ManagedOpportunity): EditorFields {
  return {
    title: opportunity.title, category: opportunity.category, description: opportunity.description,
    format: opportunity.format, city: opportunity.city, location: opportunity.location,
    date: opportunity.date ?? "", endDate: opportunity.endDate ?? "", deadline: opportunity.deadline ?? "",
    schedule: opportunity.schedule, fee: opportunity.fee, eligibility: opportunity.eligibility,
    benefits: opportunity.benefits.join("\n"), source: opportunity.source, actionLabel: opportunity.actionLabel,
    image: opportunity.imageFit === "contain" ? "" : opportunity.image,
  };
}

class PublishingError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new PublishingError(typeof data?.error === "string" ? data.error : "Couldn’t complete the request. Please try again.", response.status);
  if (!data) throw new Error("The server returned an incomplete response. Please reload to check the latest changes.");
  return data as T;
}

function displayDate(value: string) {
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function ManageCalendar({ initialCalendar }: { initialCalendar: PartnerCalendar }) {
  const router = useRouter();
  const { commitOpportunity, notify } = useCatalog();
  const [manager, setManager] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<PublishStatus>("draft");
  const [fields, setFields] = useState<EditorFields>(emptyFields);
  const loadingRequest = useRef<AbortController | null>(null);
  const mutationPending = useRef(false);
  const mounted = useRef(false);
  const editorForm = useRef<HTMLFormElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const openedFromLink = useRef(false);
  const apiBase = `/api/calendars/${encodeURIComponent(initialCalendar.slug)}`;
  const calendar = manager?.calendar ?? initialCalendar;
  const publicUrl = `/hubs/${encodeURIComponent(calendar.slug)}`;
  const createUrl = `/create?hub=${encodeURIComponent(initialCalendar.slug)}`;

  const loadManager = useCallback(async (background = false) => {
    loadingRequest.current?.abort();
    const controller = new AbortController();
    loadingRequest.current = controller;
    if (!background) setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(`${apiBase}/manage`, { cache: "no-store", signal: controller.signal });
      const data = await readResponse<ManagerData>(response);
      if (!data.calendar || !Array.isArray(data.opportunities)) throw new Error("Couldn’t load Hub management. Please try again.");
      if (controller.signal.aborted) return;
      setManager(data);
      setForbidden(false);
    } catch (problem) {
      if (controller.signal.aborted) return;
      if (problem instanceof PublishingError && problem.status === 403) {
        setForbidden(true);
        setManager(null);
        setEditorOpen(false);
      }
      setLoadError(problem instanceof Error ? problem.message : "Couldn’t load this Hub. Please try again.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    mounted.current = true;
    setManager(null);
    setForbidden(false);
    setEditorOpen(false);
    setActionError("");
    void loadManager();
    return () => { mounted.current = false; loadingRequest.current?.abort(); };
  }, [loadManager]);

  useEffect(() => {
    if (editorOpen) titleInput.current?.focus();
  }, [editorOpen, editingId]);

  useEffect(() => {
    if (manager && !openedFromLink.current) {
      openedFromLink.current = true;
      if (new URLSearchParams(window.location.search).get("new") === "1") router.replace(createUrl);
    }
  }, [manager, router, createUrl]);

  function update<K extends keyof EditorFields>(key: K, value: EditorFields[K]) {
    setFields(previous => ({ ...previous, [key]: value }));
  }

  function resetEditor() {
    setEditorOpen(false);
    setEditingId(null);
    setEditingStatus("draft");
    setFields(emptyFields());
    setActionError("");
  }

  function openEditor(opportunity?: ManagedOpportunity) {
    if (mutationPending.current) return;
    setFields(opportunity ? editFields(opportunity) : emptyFields());
    setEditingId(opportunity?.id ?? null);
    setEditingStatus(opportunity?.status ?? "draft");
    setActionError("");
    setEditorOpen(true);
    requestAnimationFrame(() => editorForm.current?.scrollIntoView({ behavior: "auto", block: "start" }));
  }

  async function persist(body: object, id: string | null, pendingKey: string): Promise<ManagedOpportunity | null> {
    if (mutationPending.current || !manager || forbidden) return null;
    mutationPending.current = true;
    setPending(pendingKey);
    setActionError("");
    try {
      const response = await fetch(`${apiBase}/opportunities${id ? `/${encodeURIComponent(id)}` : ""}`, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await readResponse<{ opportunity: ManagedOpportunity }>(response);
      if (!data.opportunity?.id) throw new Error("The server returned an incomplete response. Reload to check whether your changes were saved.");
      const opportunity = data.opportunity;
      if (mounted.current) {
        // Keep the persisted result even if the follow-up GET is temporarily unavailable.
        setManager(previous => previous ? { ...previous, opportunities: [opportunity, ...previous.opportunities.filter(item => item.id !== opportunity.id)] } : previous);
        commitOpportunity(opportunity);
      }
      return opportunity;
    } catch (problem) {
      if (mounted.current) {
        if (problem instanceof PublishingError && problem.status === 403) {
          setForbidden(true);
          setManager(null);
          setEditorOpen(false);
        }
        setActionError(problem instanceof Error ? problem.message : "Couldn’t save your changes. Please try again.");
      }
      return null;
    } finally {
      mutationPending.current = false;
      if (mounted.current) setPending("");
    }
  }

  async function save(status: PublishStatus) {
    if (mutationPending.current) return;
    if (!fields.title.trim()) {
      titleInput.current?.setCustomValidity("Please enter an opportunity title.");
      titleInput.current?.reportValidity();
      return;
    }
    titleInput.current?.setCustomValidity("");
    if (!titleInput.current?.reportValidity()) return;
    const opportunity = await persist({ ...fields, title: fields.title.trim(), benefits: fields.benefits.split(/\r?\n/).map(item => item.trim()).filter(Boolean), status }, editingId, `save:${status}`);
    if (!opportunity || !mounted.current) return;
    notify(status === "published" ? "Opportunity published." : "Draft saved.");
    if (status === "published") resetEditor();
    else {
      setEditingId(opportunity.id);
      setEditingStatus(opportunity.status);
      setFields(editFields(opportunity));
    }
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save("published");
  }

  async function changeStatus(opportunity: ManagedOpportunity) {
    const status = opportunity.status === "published" ? "draft" : "published";
    const saved = await persist({ status }, opportunity.id, opportunity.id);
    if (!saved || !mounted.current) return;
    if (editingId === saved.id) setEditingStatus(saved.status);
    notify(status === "published" ? "Opportunity published." : "Opportunity unpublished. It is now a private draft.");
  }

  return <SiteShell className="calendar-publishing-shell">
    <section className="calendar-publishing-page">
      <Link href={publicUrl} className="calendar-publishing-back"><ArrowLeft size={16} aria-hidden="true" />View Hub</Link>
      <header className="calendar-publishing-heading calendar-publishing-heading-row">
        <div><p className="calendar-publishing-eyebrow">Manage Hub</p><h1>{calendar.name}</h1></div>
        {manager && !forbidden && <button type="button" className="calendar-publishing-button calendar-publishing-primary" disabled={!!pending || loading} onClick={() => router.push(createUrl)}><Plus size={16} aria-hidden="true" />New opportunity</button>}
      </header>

      {loading && <div className="calendar-publishing-card calendar-publishing-state" role="status">Loading Hub management…</div>}
      {forbidden ? <div className="calendar-publishing-card calendar-publishing-state">
        <h2>Cannot manage this Hub</h2>
         <p className="calendar-publishing-error" role="alert">{actionError || loadError || "This Hub can only be managed by its owner."}</p>
        <Link href={publicUrl} className="calendar-publishing-button">View Hub<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div> : <>
        {loadError && <div className="calendar-publishing-error calendar-publishing-retry" role="alert"><span>{loadError}</span><button type="button" className="calendar-publishing-button" disabled={loading || !!pending} onClick={() => void loadManager()}>Retry</button></div>}
        {actionError && !editorOpen && <p className="calendar-publishing-error" role="alert">{actionError}</p>}

        {manager && <>
          <section className="calendar-publishing-card calendar-publishing-list" aria-labelledby="calendar-opportunities-heading" aria-busy={!!pending || loading}>
            <div className="calendar-publishing-section-heading"><h2 id="calendar-opportunities-heading">Opportunities</h2><span>{manager.opportunities.length}</span></div>
            {manager.opportunities.length ? <ul className="calendar-publishing-posts">{manager.opportunities.map(opportunity => <li key={opportunity.id} className="calendar-publishing-post">
              <div className="calendar-publishing-post-details"><h3>{opportunity.title}</h3><div className="calendar-publishing-post-meta"><span className={`calendar-publishing-badge calendar-publishing-badge-${opportunity.status}`}>{opportunity.status === "published" ? "Published" : "Draft"}</span><span>{opportunity.date ? `Event: ${displayDate(opportunity.date)}` : opportunity.deadline ? `Deadline: ${displayDate(opportunity.deadline)}` : `Updated ${displayDate(opportunity.updatedAt)}`}</span></div></div>
              <div className="calendar-publishing-post-actions">
                {opportunity.status === "published" && <Link className="calendar-publishing-text-link" href={`/opportunities/${encodeURIComponent(opportunity.id)}`}>View opportunity<ArrowUpRight size={14} aria-hidden="true" /></Link>}
                <button type="button" className="calendar-publishing-button" disabled={!!pending || loading} aria-label={`Edit ${opportunity.title}`} onClick={() => openEditor(opportunity)}>Edit</button>
                <button type="button" className="calendar-publishing-button" disabled={!!pending || loading} aria-label={`${opportunity.status === "published" ? "Unpublish" : "Publish"} ${opportunity.title}`} onClick={() => void changeStatus(opportunity)}>{pending === opportunity.id ? "Updating…" : opportunity.status === "published" ? "Unpublish" : "Publish"}</button>
              </div>
            </li>)}</ul> : <div className="calendar-publishing-empty"><h3>No opportunities yet</h3></div>}
          </section>

          {editorOpen && <form ref={editorForm} className="calendar-publishing-card calendar-publishing-editor" onSubmit={publish} aria-labelledby="calendar-editor-heading" aria-busy={!!pending}>
            <div className="calendar-publishing-section-heading"><h2 id="calendar-editor-heading">{editingId ? "Edit opportunity" : "New opportunity"}</h2>{editingId && <span className={`calendar-publishing-badge calendar-publishing-badge-${editingStatus}`}>{editingStatus === "published" ? "Published" : "Draft"}</span>}</div>
            <p className="calendar-publishing-hint" id="calendar-editor-hint">Only a title is required to save a draft. Fields marked * are required to publish.</p>
            {editingStatus === "published" && <p className="calendar-publishing-note">Saving this opportunity as a draft will unpublish it.</p>}
            <fieldset className="calendar-publishing-fields calendar-publishing-editor-grid" disabled={!!pending || loading} aria-describedby="calendar-editor-hint">
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-title">Title <span aria-hidden="true">*</span></label>
                <input ref={titleInput} id="opportunity-title" name="title" value={fields.title} required maxLength={180} onChange={event => { event.target.setCustomValidity(""); update("title", event.target.value); }} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-category">Category</label>
                <select id="opportunity-category" name="category" value={fields.category} onChange={event => update("category", event.target.value as Opportunity["category"])}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-format">Format</label>
                <select id="opportunity-format" name="format" value={fields.format} onChange={event => update("format", event.target.value as Opportunity["format"])}>{(["In person", "Online", "Hybrid", "International"] as const).map(format => <option key={format}>{format}</option>)}</select>
              </div>
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-description">Description <span aria-hidden="true">*</span></label>
                <textarea id="opportunity-description" name="description" rows={6} value={fields.description} required maxLength={12000} onChange={event => update("description", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-city">City <span aria-hidden="true">*</span></label>
                <input id="opportunity-city" name="city" value={fields.city} required maxLength={100} onChange={event => update("city", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-location">Location <span aria-hidden="true">*</span></label>
                <input id="opportunity-location" name="location" value={fields.location} required maxLength={250} aria-describedby="opportunity-location-hint" onChange={event => update("location", event.target.value)} />
                <p id="opportunity-location-hint" className="calendar-publishing-hint">The venue or online platform students will use.</p>
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-date">Event date {fields.category === "events" && <span aria-hidden="true">*</span>}</label>
                <input id="opportunity-date" name="date" type="date" value={fields.date} required={fields.category === "events"} onChange={event => update("date", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-end-date">End date <span className="calendar-publishing-optional">Optional</span></label>
                <input id="opportunity-end-date" name="endDate" type="date" min={fields.date || undefined} value={fields.endDate} onChange={event => update("endDate", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-deadline">Application deadline {fields.category === "scholarships" && <span aria-hidden="true">*</span>}</label>
                <input id="opportunity-deadline" name="deadline" type="date" value={fields.deadline} required={fields.category === "scholarships"} onChange={event => update("deadline", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-schedule">Schedule <span className="calendar-publishing-optional">Optional</span></label>
                <input id="opportunity-schedule" name="schedule" value={fields.schedule} maxLength={180} aria-describedby="opportunity-schedule-hint" onChange={event => update("schedule", event.target.value)} />
                <p id="opportunity-schedule-hint" className="calendar-publishing-hint">Add times and a time zone if relevant.</p>
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-fee">Fee <span aria-hidden="true">*</span></label>
                <input id="opportunity-fee" name="fee" value={fields.fee} required maxLength={180} onChange={event => update("fee", event.target.value)} />
              </div>
              <div className="calendar-publishing-field">
                <label htmlFor="opportunity-action">Registration button label</label>
                <input id="opportunity-action" name="actionLabel" value={fields.actionLabel} maxLength={80} onChange={event => update("actionLabel", event.target.value)} />
              </div>
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-eligibility">Eligibility <span aria-hidden="true">*</span></label>
                <textarea id="opportunity-eligibility" name="eligibility" rows={3} value={fields.eligibility} required maxLength={4000} onChange={event => update("eligibility", event.target.value)} />
              </div>
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-benefits">Benefits <span className="calendar-publishing-optional">Optional</span></label>
                <textarea id="opportunity-benefits" name="benefits" rows={4} value={fields.benefits} aria-describedby="opportunity-benefits-hint" onChange={event => update("benefits", event.target.value)} />
                <p id="opportunity-benefits-hint" className="calendar-publishing-hint">One benefit per line. Up to 20 benefits, 300 characters each.</p>
              </div>
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-source">Registration or information URL <span aria-hidden="true">*</span></label>
                <input id="opportunity-source" name="source" type="url" pattern="https?://.*" value={fields.source} required maxLength={2000} onChange={event => update("source", event.target.value)} />
              </div>
              <div className="calendar-publishing-field calendar-publishing-full">
                <label htmlFor="opportunity-image">Image URL <span className="calendar-publishing-optional">Optional</span></label>
                <input id="opportunity-image" name="image" type="url" pattern="https?://.*" value={fields.image} maxLength={2000} aria-describedby="opportunity-image-hint" onChange={event => update("image", event.target.value)} />
                <p id="opportunity-image-hint" className="calendar-publishing-hint">Leave blank to use your Hub’s logo.</p>
              </div>
            </fieldset>
            {actionError && <p className="calendar-publishing-error" role="alert">{actionError}</p>}
            <div className="calendar-publishing-actions">
              <button type="button" className="calendar-publishing-button" disabled={!!pending || loading} onClick={resetEditor}>Cancel</button>
              <button type="button" className="calendar-publishing-button" disabled={!!pending || loading} onClick={() => void save("draft")}>{pending === "save:draft" ? "Saving…" : "Save draft"}</button>
              <button type="submit" className="calendar-publishing-button calendar-publishing-primary" disabled={!!pending || loading}>{pending === "save:published" ? "Publishing…" : editingStatus === "published" ? "Update published opportunity" : "Publish opportunity"}</button>
            </div>
          </form>}
        </>}
      </>}
    </section>
  </SiteShell>;
}
