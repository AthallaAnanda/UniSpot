"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { ArrowRight, Bookmark, CalendarDays, FileText, Pencil, Plus, X } from "lucide-react";
import { useProfile, type Profile } from "@/hooks/useProfile";
import { useDialogFocusReturn } from "@/hooks/useDialogFocusReturn";
import { useCatalog } from "./CatalogProvider";
import ProfileAvatar from "./ProfileAvatar";
import SiteShell from "./SiteShell";
import "./AccountPage.css";

export default function AccountPage() {
  const { calendars, opportunities, saved, followed, loading, notify } = useCatalog();
  const { profile, saveProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [error, setError] = useState("");
  const focusReturn = useDialogFocusReturn();
  const managed = useMemo(() => calendars.filter(calendar => calendar.canManage), [calendars]);
  const publishedCount = useMemo(() => {
    const calendarIds = new Set(managed.map(calendar => calendar.id));
    return opportunities.filter(opportunity => opportunity.calendarId && calendarIds.has(opportunity.calendarId)).length;
  }, [managed, opportunities]);
  const joined = profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  function openEditor() {
    setDraft(profile);
    setError("");
    setEditing(true);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      saveProfile(draft);
      setEditing(false);
      notify("Profile updated.");
    } catch { setError("Couldn’t save your profile. Please try again."); }
  }

  return <SiteShell className="profile-shell">
    <div className="profile-page">
      <section className="profile-summary" aria-labelledby="profile-name-heading">
        <div className="profile-identity">
          <button type="button" className="profile-avatar-edit" onClick={openEditor} aria-label="Edit profile"><ProfileAvatar name={profile.name} large /><span className="profile-avatar-edit-hint"><Pencil size={18} /></span></button>
          <div className="profile-identity-copy">
            <h1 id="profile-name-heading">{profile.name || "Your name"}</h1>
            <p className="profile-joined"><CalendarDays size={19} strokeWidth={1.6} /><span>{joined ? `Joined ${joined}` : "Joined UniSpot"}</span></p>
            <div className="profile-activity" aria-label="Your UniSpot activity"><Link href="/calendars"><strong>{followed.length}</strong> Following</Link></div>
            {profile.bio && <p className="profile-biography">{profile.bio}</p>}
          </div>
        </div>
      </section>

      <nav className="profile-collections" aria-label="Your collection">
        <Link href="/saved"><Bookmark size={17} /><span>Saved<span className="profile-collection-detail"> opportunities</span></span><strong>{saved.length}</strong></Link>
        <a href="#your-calendars" aria-label={`${publishedCount} published opportunities`}><FileText size={17} /><span>Published</span><strong>{publishedCount}</strong></a>
        <a href="#your-calendars"><CalendarDays size={17} /><span>Calendars</span><strong>{managed.length}</strong></a>
      </nav>

      <section className="profile-calendars" id="your-calendars" aria-labelledby="profile-calendars-heading">
        <div className="profile-section-heading"><div><h2 id="profile-calendars-heading">Your calendars</h2><p>Manage what you share with your community.</p></div><Link href="/calendars/new" className="profile-new-calendar"><Plus size={15} /><span>New calendar</span></Link></div>
        {loading ? <div className="profile-calendar-loading" role="status">Loading your calendars…</div> : managed.length ? <div className="profile-calendar-rows">{managed.map(calendar => <Link href={`/calendars/${encodeURIComponent(calendar.slug)}/manage`} key={calendar.id}><img src={calendar.logo} alt="" width={42} height={42} loading="lazy" decoding="async" /><span><strong>{calendar.name}</strong><small>Manage calendar and opportunities</small></span><ArrowRight size={16} /></Link>)}</div> : <div className="profile-calendar-empty"><div className="profile-empty-symbol"><CalendarDays size={25} strokeWidth={1.4} /></div><h3>A home for your community</h3><p>Bring your events and opportunities together<br className="profile-empty-break" /> in a calendar of your own.</p><Link href="/calendars/new">Create your first calendar<ArrowRight size={14} /></Link></div>}
      </section>

    </div>

    <Dialog.Root open={editing} onOpenChange={setEditing}><Dialog.Portal>
      <Dialog.Overlay className="profile-dialog-overlay" />
      <Dialog.Content className="profile-dialog" {...focusReturn}>
        <div className="profile-dialog-heading"><Dialog.Title>Edit profile</Dialog.Title><Dialog.Close className="profile-dialog-close" aria-label="Close edit profile"><X size={18} /></Dialog.Close></div>
        <Dialog.Description>Make yourself at home on UniSpot.</Dialog.Description>
        <form onSubmit={save}>
          <div className="profile-dialog-preview"><ProfileAvatar name={draft.name} /><span>Your name appears on your profile.</span></div>
          <div className="profile-form-field"><label htmlFor="profile-name">Display name</label><input id="profile-name" maxLength={100} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Your name or community name" /></div>
          <div className="profile-form-field"><label htmlFor="profile-role">Account type</label><select id="profile-role" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as Profile["role"] })}><option>Student</option><option>Community</option></select></div>
          <div className="profile-form-field"><label htmlFor="profile-campus">Campus or organization <span>Optional</span></label><input id="profile-campus" maxLength={100} value={draft.campus} onChange={e => setDraft({ ...draft, campus: e.target.value })} placeholder="Where you belong" /></div>
          <div className="profile-form-field"><label htmlFor="profile-bio">Bio <span>Optional</span></label><textarea id="profile-bio" rows={3} maxLength={200} value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} placeholder="A little about you" /></div>
          {error && <p className="profile-form-error" role="alert">{error}</p>}
          <p className="profile-form-note">Your profile is saved in this browser.</p>
          <div className="profile-form-actions"><Dialog.Close type="button">Cancel</Dialog.Close><button type="submit">Save changes</button></div>
        </form>
      </Dialog.Content>
    </Dialog.Portal></Dialog.Root>
  </SiteShell>;
}
