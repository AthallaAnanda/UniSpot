"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AlignLeft, ArrowLeft, CalendarDays, ChevronDown, Globe2, ImagePlus, Link2, MapPin, Pencil, Plus, Sparkles, Ticket, UsersRound } from "lucide-react";
import { categories } from "@/lib/unispot";
import { defaultTimeZone, formatOpportunitySchedule } from "@/lib/opportunity-time";
import type { ManagedOpportunity, PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import PublishingDialog from "./PublishingDialog";
import PublishingImagePicker from "./PublishingImagePicker";
import TimeZonePicker from "./TimeZonePicker";
import SiteShell from "./SiteShell";
import "./PublishingForms.css";

type LocationFields = { format: string; city: string; location: string };
type EditorDialog = "location" | "description" | null;

export default function CreateOpportunity() {
  const router = useRouter();
  const { calendars, loading, error: catalogError, refresh, commitOpportunity, notify } = useCatalog();
  const managed = useMemo(() => calendars.filter(calendar => calendar.canManage), [calendars]);
  const [calendarSlug, setCalendarSlug] = useState("");
  const [fields, setFields] = useState({ title: "", category: "events", date: "", endDate: "", startTime: "", endTime: "", timeZone: defaultTimeZone, deadline: "", format: "In person", city: "", location: "", description: "", fee: "Free", eligibility: "", source: "", image: "", benefits: "" });
  const [dialog, setDialog] = useState<EditorDialog>(null);
  const [locationDraft, setLocationDraft] = useState<LocationFields>({ format: "In person", city: "", location: "" });
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [pending, setPending] = useState<"draft" | "published" | null>(null);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const selected = managed.find(calendar => calendar.slug === calendarSlug) ?? managed[0];
  const hasLocation = !!fields.city.trim() && !!fields.location.trim();
  const isEvent = fields.category === "events";

  useEffect(() => { const params = new URLSearchParams(window.location.search); setCalendarSlug(params.get("hub") || params.get("calendar") || ""); }, []);

  const update = useCallback((key: keyof typeof fields, value: string) => { setFields(previous => ({ ...previous, [key]: value })); }, []);
  const changeTimeZone = useCallback((zone: string) => update("timeZone", zone), [update]);

  function openLocation() {
    setLocationDraft({ format: fields.format, city: fields.city, location: fields.location });
    setDialog("location");
  }

  function openDescription() {
    setDescriptionDraft(fields.description);
    setDialog("description");
  }

  async function save(status: "draft" | "published") {
    if (submitting.current) return;
    if (!selected) { setError("Choose a Hub to save your opportunity."); return; }
    if (!fields.title.trim()) { titleInput.current?.focus(); setError("Give your opportunity a name first."); return; }
    if (status === "published" && !hasLocation) { setError("Add a city and location before publishing."); openLocation(); return; }
    if (status === "published" && !fields.description.trim()) { setError("Add a description before publishing."); openDescription(); return; }
    if (fields.endDate && (!fields.date || fields.endDate < fields.date)) { setError("The end date must be on or after the start date."); return; }
    if (fields.startTime && !fields.date) { setError("Add a start date before setting a time."); return; }
    if (fields.endTime && !fields.startTime) { setError("Add a start time before setting an end time."); return; }
    if (fields.startTime && fields.endTime && fields.date && (!fields.endDate || fields.endDate === fields.date) && fields.endTime <= fields.startTime) { setError("The end time must be after the start time."); return; }

    submitting.current = true;
    setPending(status);
    setError("");
    let opportunity: ManagedOpportunity;
    try {
      const response = await fetch(`/api/calendars/${encodeURIComponent(selected.slug)}/opportunities`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, benefits: fields.benefits.split(/\r?\n/).map(item => item.trim()).filter(Boolean), schedule: formatOpportunitySchedule(fields), status }),
      });
      const data = await response.json().catch(() => null) as { opportunity?: ManagedOpportunity; error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Couldn’t save your opportunity. Please try again.");
      if (!data?.opportunity?.id) throw new Error("The server returned an incomplete response. Check your Hub before trying again.");
      opportunity = data.opportunity;
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn’t save your opportunity.");
      submitting.current = false;
      setPending(null);
      return;
    }
    // Apply the server-confirmed result immediately; refresh continues in the background.
    commitOpportunity(opportunity);
    notify(status === "draft" ? "Draft saved." : "Opportunity published.");
    router.push(status === "published" ? `/opportunities/${encodeURIComponent(opportunity.id)}` : `/hubs/${encodeURIComponent(selected.slug)}/manage`);
  }

  function publish(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void save("published"); }

  return <SiteShell className="publishing-shell opportunity-builder-shell">
    <section className="publishing-page">
      <Link href="/account" className="publishing-back"><ArrowLeft size={15} />Your account</Link>
      <h1 className="sr-only">Create opportunity</h1>
      <form onSubmit={publish} aria-busy={!!pending}>
        <fieldset className="publishing-fieldset opportunity-builder-layout" disabled={!!pending}>
          <aside className="opportunity-builder-aside">
            <div className="opportunity-builder-art">
              {fields.image ? <img src={fields.image} alt="Opportunity cover preview" decoding="async" /> : <div className="opportunity-default-art" aria-hidden="true"><div className="opportunity-art-orbit" /><div className="opportunity-art-orbit second" /><span className="opportunity-art-star">✳</span><div className="opportunity-art-copy"><strong>See you<br />there<span>.</span></strong></div></div>}
              <PublishingImagePicker label="Change cover" value={fields.image} onChange={value => update("image", value)} className="opportunity-cover-button"><ImagePlus size={19} /></PublishingImagePicker>
            </div>
            <div className="opportunity-cover-caption"><ImagePlus size={15} /><span>Cover</span></div>
          </aside>

          <div className="opportunity-builder-main">
            <div className="opportunity-builder-topline"><label className="opportunity-calendar-picker"><UsersRound size={15} /><span className="sr-only">Choose Hub</span><select value={selected?.slug || ""} onChange={event => setCalendarSlug(event.target.value)} disabled={!managed.length}><option value="" disabled>{loading ? "Loading…" : "Choose a Hub"}</option>{managed.map((calendar: PartnerCalendar) => <option value={calendar.slug} key={calendar.id}>{calendar.name}</option>)}</select><ChevronDown size={13} /></label><span className="opportunity-visibility" title="Drafts are private. Only published opportunities are public."><Globe2 size={14} />Public</span></div>
            {!loading && !managed.length && <div className="opportunity-calendar-notice">{catalogError ? <><span>Couldn’t load your Hubs.</span><button type="button" onClick={() => void refresh()}>Try again</button></> : <><span>Create a Hub to start sharing.</span><Link href="/hubs/new"><Plus size={13} />Create a Hub</Link></>}</div>}
            <label className="sr-only" htmlFor="create-title">Opportunity name</label><input ref={titleInput} id="create-title" className="opportunity-builder-title" placeholder="Opportunity name" maxLength={180} value={fields.title} onChange={event => update("title", event.target.value)} required />

            <div className="publishing-option-group opportunity-category"><div className="publishing-option-row"><Sparkles size={17} /><label htmlFor="create-category">Category</label><select id="create-category" value={fields.category} onChange={event => update("category", event.target.value)}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div></div>

            <div className="opportunity-date-layout">
              <div className="opportunity-date-group">
                <div className="opportunity-date-row"><span className="opportunity-date-dot" aria-hidden="true" /><label htmlFor="create-date">Start{isEvent && <span className="sr-only"> (required)</span>}</label><input id="create-date" type="date" required={isEvent} value={fields.date} onChange={event => update("date", event.target.value)} /><input type="time" aria-label="Start time" value={fields.startTime} onChange={event => update("startTime", event.target.value)} /></div>
                <div className="opportunity-date-row"><span className="opportunity-date-dot end" aria-hidden="true" /><label htmlFor="create-end">End</label><input id="create-end" type="date" min={fields.date || undefined} value={fields.endDate} onChange={event => update("endDate", event.target.value)} /><input type="time" aria-label="End time" value={fields.endTime} onChange={event => update("endTime", event.target.value)} /></div>
              </div>
              <TimeZonePicker value={fields.timeZone} onChange={changeTimeZone} date={fields.date || undefined} />
            </div>
            {!isEvent && <div className="publishing-option-group"><div className="publishing-option-row"><CalendarDays size={17} /><label htmlFor="create-deadline">Deadline</label><input id="create-deadline" type="date" required={fields.category === "scholarships"} value={fields.deadline} onChange={event => update("deadline", event.target.value)} /></div></div>}

            <button type="button" className="opportunity-detail-trigger" onClick={openLocation}><MapPin size={18} /><span><strong>{hasLocation ? fields.location : "Add location"}</strong>{hasLocation && <small>{fields.city} · {fields.format}</small>}</span><Pencil size={14} /></button>
            <button type="button" className="opportunity-detail-trigger" onClick={openDescription}><AlignLeft size={18} /><span><strong>{fields.description.trim() ? "Description" : "Add description"}</strong>{fields.description.trim() && <small>{fields.description}</small>}</span><Pencil size={14} /></button>

            <h2 className="opportunity-options-heading">Details</h2>
            <div className="publishing-option-group"><div className="publishing-option-row"><Ticket size={17} /><label htmlFor="create-fee">Fee</label><input id="create-fee" required maxLength={180} value={fields.fee} onChange={event => update("fee", event.target.value)} placeholder="Free" /></div><div className="publishing-option-row"><UsersRound size={17} /><label htmlFor="create-eligibility">Eligibility</label><input id="create-eligibility" placeholder="Who can apply?" required maxLength={4000} value={fields.eligibility} onChange={event => update("eligibility", event.target.value)} /></div><div className="publishing-option-row"><Link2 size={17} /><label htmlFor="create-source">Registration</label><input id="create-source" type="url" pattern="https?://.*" placeholder="https://" required maxLength={2000} value={fields.source} onChange={event => update("source", event.target.value)} /></div></div>

            <details className="opportunity-more-details"><summary>Benefits<ChevronDown size={14} /></summary><div className="publishing-field"><label htmlFor="create-benefits" className="sr-only">Benefits</label><textarea id="create-benefits" rows={3} value={fields.benefits} onChange={event => update("benefits", event.target.value)} placeholder="One benefit per line" /></div></details>

            {error && <p className="publishing-error" role="alert">{error}</p>}
            <div className="opportunity-builder-actions"><button className="publishing-secondary" type="button" disabled={!selected} onClick={() => void save("draft")}>{pending === "draft" ? "Saving…" : "Save draft"}</button><button className="publishing-primary" type="submit" disabled={!selected}>{pending === "published" ? "Publishing…" : "Publish"}</button></div>
          </div>
        </fieldset>
      </form>
    </section>

    <PublishingDialog open={dialog === "location"} onOpenChange={open => { if (!open) setDialog(null); }} title="Location" description="Help students know where to show up.">
      <form onSubmit={event => { event.preventDefault(); setFields(previous => ({ ...previous, ...locationDraft })); setDialog(null); setError(""); }}>
        <div className="publishing-field"><label htmlFor="create-format">Format</label><select id="create-format" value={locationDraft.format} onChange={event => { const format = event.target.value; setLocationDraft(previous => ({ ...previous, format, city: format === "Online" && !previous.city ? "Online" : previous.city })); }}>{["In person", "Online", "Hybrid", "International"].map(format => <option key={format}>{format}</option>)}</select></div>
        <div className="publishing-field"><label htmlFor="create-city">City</label><input id="create-city" placeholder="e.g. Bandung or Online" required maxLength={100} value={locationDraft.city} onChange={event => setLocationDraft(previous => ({ ...previous, city: event.target.value }))} /></div>
        <div className="publishing-field"><label htmlFor="create-location">{locationDraft.format === "Online" ? "Online platform" : "Venue or platform"}</label><input id="create-location" placeholder={locationDraft.format === "Online" ? "e.g. Zoom or Google Meet" : "Where will it take place?"} required maxLength={250} value={locationDraft.location} onChange={event => setLocationDraft(previous => ({ ...previous, location: event.target.value }))} /></div>
        <div className="publishing-dialog-actions"><button type="button" className="publishing-text-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="publishing-primary">Done</button></div>
      </form>
    </PublishingDialog>
    <PublishingDialog open={dialog === "description"} onOpenChange={open => { if (!open) setDialog(null); }} title="Description" description="What’s it about, and why should students join?">
      <form onSubmit={event => { event.preventDefault(); update("description", descriptionDraft.trim()); setDialog(null); setError(""); }}>
        <label htmlFor="create-description" className="sr-only">About this opportunity</label><textarea className="publishing-description-editor" id="create-description" placeholder="Share the details of your opportunity…" required maxLength={12000} rows={9} value={descriptionDraft} onChange={event => setDescriptionDraft(event.target.value)} />
        <div className="publishing-dialog-actions"><button type="button" className="publishing-text-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="publishing-primary">Done</button></div>
      </form>
    </PublishingDialog>
  </SiteShell>;
}
