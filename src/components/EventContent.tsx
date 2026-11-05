"use client";

import { Bookmark, Globe, Ticket } from "lucide-react";
import Link from "next/link";
import { categoryFor, downloadCalendar, opportunityStatus } from "@/lib/unispot";
import type { Opportunity, Organization } from "@/types/unispot";
import LumaIcon from "./LumaIcon";
import "./EventContent.css";

export interface EventContentProps {
  opportunity: Opportunity;
  organization?: Organization;
  saved: boolean;
  onSave: () => void;
  onNotify: (message: string) => void;
  mode?: "panel" | "page";
}

export default function EventContent({ opportunity, organization, saved, onSave, onNotify, mode = "panel" }: EventContentProps) {
  const category = categoryFor(opportunity.category);
  const status = opportunityStatus(opportunity);
  const calendarDate = opportunity.date ?? opportunity.deadline;
  // Date-only values are formatted in UTC so their day stays the same in every timezone.
  const date = calendarDate ? new Date(`${calendarDate}T12:00:00Z`) : undefined;
  const hasDate = date !== undefined && !Number.isNaN(date.getTime());
  const deadlineOnly = !opportunity.date && Boolean(opportunity.deadline);
  const dateLabel = hasDate
    ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })
    : opportunity.schedule;
  const Heading = mode === "page" ? "h1" : "h2";
  const SectionHeading = mode === "page" ? "h2" : "h3";
  const hostName = organization?.name ?? opportunity.sourceName;
  const hostUrl = organization?.calendarSlug ? `/calendars/${organization.calendarSlug}` : organization?.url ?? opportunity.source;

  return (
    <div className={`event-content-layout mode-${mode}`}>
      <div className="event-visual">
        <div className={`event-cover${opportunity.imageFit === "contain" ? " event-cover-contained" : ""}`} style={{ backgroundColor: opportunity.color }}>
          <img className="event-cover-glow" src={opportunity.image} alt="" aria-hidden="true" />
          <img className="event-cover-image" src={opportunity.image} alt={opportunity.title} />
        </div>
      </div>

      <div className="event-main">
        <Heading id="event-content-title" className={`event-title${opportunity.title.length > 60 ? " event-title-long" : ""}`}>
          {opportunity.title}
        </Heading>
        {mode === "panel" && (
          <Link className="event-host-row" href={hostUrl} target={hostUrl.startsWith("/") ? undefined : "_blank"} rel={hostUrl.startsWith("/") ? undefined : "noopener noreferrer"}>
            {organization?.logo && <img src={organization.logo} alt="" width={18} height={18} />}
            <span>Hosted by {hostName}</span><LumaIcon name="External" size={12} />
          </Link>
        )}

        <div className="event-facts">
          <div className="event-fact">
            <div className={`event-fact-icon${hasDate ? " event-date-icon" : ""}`} aria-hidden="true">
              {hasDate ? <>
                <span className="event-date-month">{date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}</span>
                <span className="event-date-day">{date.getUTCDate()}</span>
              </> : <LumaIcon name="Calendar" size={20} />}
            </div>
            <div className="event-fact-copy">
              <div className="event-fact-primary">{deadlineOnly && "Application deadline · "}{dateLabel}</div>
              {hasDate && <div className="event-fact-secondary">{opportunity.schedule}</div>}
            </div>
          </div>
          <div className="event-fact">
            <div className="event-fact-icon" aria-hidden="true"><LumaIcon name="MapPin" size={20} /></div>
            <div className="event-fact-copy">
              <div className="event-fact-primary">{opportunity.location}</div>
              <div className="event-fact-secondary">
                {[opportunity.city !== opportunity.location ? opportunity.city : "", opportunity.format].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>
        </div>

        <section className="event-registration" aria-label="Registration">
          <div className="event-registration-strip">Registration</div>
          <div className="event-registration-status">
            <span className="event-registration-icon"><Ticket size={18} aria-hidden="true" /></span>
            <div className="event-fact-copy">
              <div className="event-fact-primary">{status}</div>
              <div className="event-fact-secondary">{opportunity.fee}</div>
            </div>
          </div>
          <div className="event-registration-body">
            <p>You’ll continue on the organizer’s website.</p>
            <a className="event-registration-action" href={opportunity.source} target="_blank" rel="noopener noreferrer">
              {opportunity.actionLabel}
            </a>
          </div>
        </section>

        <section className="event-section">
          <SectionHeading className="event-section-label">{opportunity.category === "events" ? "About Event" : "About Opportunity"}</SectionHeading>
          <p id="event-content-description" className="event-prose">{opportunity.description}</p>
        </section>
        <section className="event-section">
          <SectionHeading className="event-section-label">Who can join</SectionHeading>
          <p className="event-prose">{opportunity.eligibility}</p>
        </section>
        {opportunity.benefits.length > 0 && (
          <section className="event-section">
            <SectionHeading className="event-section-label">What to expect</SectionHeading>
            <ul className="event-benefits">
              {opportunity.benefits.map((benefit, index) => <li key={`${index}-${benefit}`}>{benefit}</li>)}
            </ul>
          </section>
        )}
        <section className="event-section">
          <SectionHeading className="event-section-label">Location</SectionHeading>
          <p className="event-location-name">{opportunity.location}</p>
          <p className="event-location-note">{[opportunity.city !== opportunity.location ? opportunity.city : "", opportunity.format].filter(Boolean).join(" · ")}</p>
        </section>
        <section className="event-section event-official-source">
          <SectionHeading className="event-section-label">{opportunity.publishedAt ? "Organizer’s source" : "Official source"}</SectionHeading>
          <a className="event-source-link" href={opportunity.source} target="_blank" rel="noopener noreferrer">
            <Globe size={16} aria-hidden="true" />
            <span>{opportunity.sourceName}</span>
            <LumaIcon name="External" size={14} />
          </a>
          <p className="event-reviewed">{opportunity.publishedAt ? <>Published <time dateTime={opportunity.publishedAt}>{new Date(opportunity.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></> : <>Reviewed <time dateTime="2026-11-04">Nov 4, 2026</time></>}</p>
        </section>
      </div>

      <aside className="event-sidebar" aria-label="Organizer and event tools">
        {mode === "page" && (
          <div className="event-sidebar-host">
            <SectionHeading className="event-section-label">Hosted By</SectionHeading>
            <Link className="event-sidebar-host-link" href={hostUrl} target={hostUrl.startsWith("/") ? undefined : "_blank"} rel={hostUrl.startsWith("/") ? undefined : "noopener noreferrer"}>
              {organization?.logo && <img src={organization.logo} alt="" width={24} height={24} />}
              <span>{hostName}</span>
            </Link>
          </div>
        )}
        <span className="event-category-tag"># {category.name}</span>
        <div className="event-tools">
          <button className="event-tool-button" type="button" aria-pressed={saved} onClick={onSave}>
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
            {saved ? "Saved" : "Save for later"}
          </button>
          {hasDate && (
            <button className="event-tool-button" type="button" onClick={() => { downloadCalendar(opportunity); onNotify("Calendar file downloaded."); }}>
              <LumaIcon name="Calendar" size={15} />
              Add to calendar
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
