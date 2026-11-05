"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CalendarSocialLinks, PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import SiteShell from "./SiteShell";
import "./CalendarPublishing.css";

function calendarSlug(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "");
}

export default function CreateCalendar() {
  const router = useRouter();
  const { refresh, notify } = useCatalog();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState<CalendarSocialLinks>({});
  const [logo, setLogo] = useState("");
  const [cover, setCover] = useState("");
  const [color, setColor] = useState("#bb267e");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    let created: PartnerCalendar | undefined;
    try {
      const response = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug, description: description.trim(), website: website.trim(), socialLinks, logo: logo.trim() || "/brand/unispot-icon.svg", cover: cover.trim(), color }),
      });
      const data = await response.json().catch(() => null) as { calendar?: PartnerCalendar; error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Couldn’t create your calendar. Please try again.");
      if (!data?.calendar) throw new Error("The server returned an incomplete response. Reload calendars to check whether your calendar was created.");
      created = data.calendar;
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn’t create your calendar. Please try again.");
      submitting.current = false;
      setPending(false);
      return;
    }
    // The calendar is already persisted: a refresh failure must not invite a duplicate POST.
    try { await refresh(); } catch { /* The destination can load the persisted calendar directly. */ }
    notify("Calendar created.");
    router.push(`/calendars/${encodeURIComponent(created.slug)}/manage?new=1`);
  }

  return <SiteShell className="calendar-publishing-shell">
    <section className="calendar-publishing-page">
      <Link href="/calendars" className="calendar-publishing-back"><ArrowLeft size={16} aria-hidden="true" />Back to calendars</Link>
      <header className="calendar-publishing-heading">
        <h1>Create a calendar</h1>
        <p>Bring your community’s opportunities together. Create a home for your organization, student group, or partner community.</p>
      </header>
      <form className="calendar-publishing-card calendar-publishing-create" onSubmit={create} aria-busy={pending}>
        <fieldset className="calendar-publishing-fields" disabled={pending}>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-name">Calendar name <span aria-hidden="true">*</span></label>
            <input id="calendar-name" name="name" value={name} maxLength={100} required onChange={event => { setName(event.target.value); if (!slugEdited) setSlug(calendarSlug(event.target.value)); }} />
          </div>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-slug">Calendar URL <span aria-hidden="true">*</span></label>
            <input id="calendar-slug" name="slug" value={slug} required minLength={3} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Use at least 3 lowercase letters, numbers, or hyphens, without a leading or trailing hyphen." autoCapitalize="none" spellCheck={false} aria-describedby="calendar-slug-hint" onChange={event => { setSlugEdited(true); setSlug(event.target.value); }} />
            <p id="calendar-slug-hint" className="calendar-publishing-hint">Your public address: <span className="calendar-publishing-url">/calendars/{slug || "…"}</span></p>
          </div>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-description">Description <span aria-hidden="true">*</span></label>
            <textarea id="calendar-description" name="description" rows={5} value={description} required maxLength={1500} aria-describedby="calendar-description-hint" onChange={event => setDescription(event.target.value)} />
            <p id="calendar-description-hint" className="calendar-publishing-hint">Tell students who you are and what you share. Up to 1,500 characters.</p>
          </div>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-website">Website <span className="calendar-publishing-optional">Optional</span></label>
            <input id="calendar-website" name="website" type="url" pattern="https?://.*" maxLength={2000} value={website} onChange={event => setWebsite(event.target.value)} />
          </div>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-logo">Logo URL <span className="calendar-publishing-optional">Optional</span></label>
            <input id="calendar-logo" name="logo" type="url" pattern="https?://.*" maxLength={2000} value={logo} aria-describedby="calendar-logo-hint" onChange={event => setLogo(event.target.value)} />
            <p id="calendar-logo-hint" className="calendar-publishing-hint">Use an http(s) image URL, or leave blank to use the UniSpot icon.</p>
          </div>
          <details className="calendar-publishing-social-fields">
            <summary>Social links <span>Optional</span></summary>
            <div>{([['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn']] as const).map(([platform, label]) => <div className="calendar-publishing-field" key={platform}>
              <label htmlFor={`calendar-${platform}`}>{label} URL</label>
              <input id={`calendar-${platform}`} name={platform} type="url" pattern="https?://.*" maxLength={2000} value={socialLinks[platform] ?? ""} onChange={event => setSocialLinks(previous => ({ ...previous, [platform]: event.target.value }))} />
            </div>)}</div>
          </details>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-cover">Cover image URL <span className="calendar-publishing-optional">Optional</span></label>
            <input id="calendar-cover" name="cover" type="url" pattern="https?://.*" maxLength={2000} value={cover} onChange={event => setCover(event.target.value)} />
          </div>
          <div className="calendar-publishing-field">
            <label htmlFor="calendar-color">Calendar color</label>
            <div className="calendar-publishing-color"><input id="calendar-color" name="color" type="color" value={color} onChange={event => setColor(event.target.value)} /><span>{color}</span></div>
          </div>
        </fieldset>
        {error && <p className="calendar-publishing-error" role="alert">{error}</p>}
        <p className="calendar-publishing-note">You can manage this calendar from the browser you create it in.</p>
        <div className="calendar-publishing-actions">
          <button type="submit" className="calendar-publishing-button calendar-publishing-primary calendar-create-button" disabled={pending}>{pending ? "Creating…" : "Create calendar"}{!pending && <ArrowRight size={16} aria-hidden="true" />}</button>
        </div>
      </form>
    </section>
  </SiteShell>;
}
