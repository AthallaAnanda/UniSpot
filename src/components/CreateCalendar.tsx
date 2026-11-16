"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowLeft, Check, ChevronDown, Globe2, ImagePlus, UsersRound } from "lucide-react";
import type { CalendarSocialLinks, PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import SiteShell from "./SiteShell";
import PublishingImagePicker from "./PublishingImagePicker";
import "./PublishingForms.css";

const colors = [
  { name: "Gray", value: "#8b8b8b" }, { name: "Pink", value: "#bb267e" },
  { name: "Purple", value: "#9760ce" }, { name: "Blue", value: "#3974d8" },
  { name: "Green", value: "#459775" }, { name: "Yellow", value: "#d4a52a" },
  { name: "Orange", value: "#e38b4e" }, { name: "Red", value: "#d25c67" },
];

function calendarSlug(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "");
}

export default function CreateCalendar() {
  const router = useRouter();
  const { commitCalendar, notify } = useCatalog();
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
      if (!response.ok) throw new Error(data?.error || "Couldn’t create your Hub. Please try again.");
      if (!data?.calendar) throw new Error("The server returned an incomplete response. Reload Hubs to check whether your Hub was created.");
      created = data.calendar;
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn’t create your Hub. Please try again.");
      submitting.current = false;
      setPending(false);
      return;
    }
    commitCalendar(created);
    notify("Hub created.");
    router.push(`/hubs/${encodeURIComponent(created.slug)}/manage`);
  }

  return <SiteShell className="publishing-shell calendar-builder-shell">
    <section className="publishing-page">
      <Link href="/hubs" className="publishing-back"><ArrowLeft size={15} />Hubs</Link>
      <header className="publishing-heading"><h1>Create a Hub</h1><p>A home for the opportunities your community or organization shares.</p></header>
      <form onSubmit={create} aria-busy={pending}>
        <fieldset className="publishing-fieldset" disabled={pending}>
          <div className="calendar-builder-preview" style={{ "--calendar-tint": color } as CSSProperties}>
             <div className="calendar-builder-cover">{cover && <img src={cover} alt="Hub cover preview" decoding="async" />}<div className="calendar-builder-cover-art" aria-hidden="true" hidden={!!cover}><span /><span /><span /></div><PublishingImagePicker label="Change cover" value={cover} onChange={setCover} /></div>
            <div className="calendar-builder-identity">
               <PublishingImagePicker label="Change Hub logo" className="calendar-builder-logo" value={logo} onChange={setLogo}>{logo ? <img src={logo} alt="Hub logo" /> : <UsersRound size={30} strokeWidth={1.5} />}<span><ImagePlus size={12} /></span></PublishingImagePicker>
               <label htmlFor="calendar-name" className="sr-only">Hub name</label>
               <input id="calendar-name" className="calendar-builder-name" name="name" placeholder="Hub name" value={name} maxLength={100} required onChange={event => { setName(event.target.value); if (!slugEdited) setSlug(calendarSlug(event.target.value)); }} />
              <label htmlFor="calendar-description" className="sr-only">Description</label>
               <textarea id="calendar-description" name="description" placeholder="Describe your community, organization, or program for students…" rows={2} value={description} required maxLength={1500} onChange={event => setDescription(event.target.value)} />
            </div>
          </div>

          <section className="publishing-card" aria-labelledby="calendar-customization-heading"><h2 id="calendar-customization-heading">Customization</h2>
            <div className="calendar-customization-grid">
              <div className="publishing-field"><span className="publishing-label" id="calendar-tint-label">Tint color</span><div className="calendar-color-options" role="group" aria-labelledby="calendar-tint-label">{colors.map(swatch => <button type="button" key={swatch.value} className="calendar-color-swatch" style={{ "--swatch": swatch.value } as CSSProperties} aria-label={swatch.name} aria-pressed={color === swatch.value} onClick={() => setColor(swatch.value)}>{color === swatch.value && <Check size={13} strokeWidth={2.5} />}</button>)}<label className="calendar-custom-color" title="Custom color"><span className="sr-only">Custom color</span><input type="color" value={color} onChange={event => setColor(event.target.value)} /></label></div><span className="publishing-hint">A little color to make it yours.</span></div>
               <div className="publishing-field"><label htmlFor="calendar-slug">Public URL</label><div className="publishing-url-input"><span>/hubs/</span><input id="calendar-slug" name="slug" placeholder="your-community" value={slug} required minLength={3} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Use at least 3 lowercase letters, numbers, or hyphens, without a leading or trailing hyphen." autoCapitalize="none" spellCheck={false} onChange={event => { setSlugEdited(true); setSlug(event.target.value); }} /></div><span className="publishing-hint">Your community’s address on UniSpot.</span></div>
            </div>
          </section>

          <details className="publishing-card publishing-disclosure"><summary><span><Globe2 size={16} />Links & socials<small>Optional</small></span><ChevronDown size={16} /></summary><div className="publishing-disclosure-content"><div className="publishing-field"><label htmlFor="calendar-website">Website</label><input id="calendar-website" name="website" type="url" pattern="https?://.*" placeholder="https://your-community.com" maxLength={2000} value={website} onChange={event => setWebsite(event.target.value)} /></div>{([['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn']] as const).map(([platform, label]) => <div className="publishing-field" key={platform}><label htmlFor={`calendar-${platform}`}>{label}</label><input id={`calendar-${platform}`} name={platform} type="url" pattern="https?://.*" placeholder={`https://${platform}.com/…`} maxLength={2000} value={socialLinks[platform] ?? ""} onChange={event => setSocialLinks(previous => ({ ...previous, [platform]: event.target.value }))} /></div>)}</div></details>
        </fieldset>
        {error && <p className="publishing-error" role="alert">{error}</p>}
         <div className="calendar-builder-submit"><button type="submit" className="publishing-primary" disabled={pending}><Check size={16} />{pending ? "Creating…" : "Create a Hub"}</button><p className="publishing-hint">Managed from your UniSpot account, on any device.</p></div>
      </form>
    </section>
  </SiteShell>;
}
