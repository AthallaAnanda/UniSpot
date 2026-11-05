"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { CalendarDays, CalendarPlus, Check, ChevronDown, ChevronLeft, ChevronRight, Plus, Search, Settings, X } from "lucide-react";
import { useOpportunitySelection } from "@/hooks/useOpportunitySelection";
import { isPast } from "@/lib/unispot";
import type { Opportunity, PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import EventFeed from "./EventFeed";
import OpportunityDetails from "./OpportunityDetails";
import SiteShell from "./SiteShell";
import CalendarSocialLinks from "./CalendarSocialLinks";
import "./PartnerCalendarPage.css";

type Period = "Upcoming" | "Past" | "All";
const periods: Period[] = ["Upcoming", "Past", "All"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateLabel(key: string) {
  return new Date(`${key}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function fallsOn(opportunity: Opportunity, key: string) {
  return opportunity.deadline === key || (!!opportunity.date && opportunity.date <= key && (opportunity.endDate ?? opportunity.date) >= key);
}

function MonthPicker({ month, today, selectedDate, opportunities, onMonthChange, onSelect }: {
  month: Date;
  today: string;
  selectedDate: string | null;
  opportunities: Opportunity[];
  onMonthChange: (month: Date) => void;
  onSelect: (key: string) => void;
}) {
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cellCount = Math.max(35, Math.ceil((firstWeekday + daysInMonth) / 7) * 7);
  const heading = month.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  return <div className="partner-month-picker" role="group" aria-label="Filter opportunities by date">
    <div className="partner-month-heading">
      <h3 aria-live="polite">{heading}</h3>
      <div className="partner-month-navigation">
        <button type="button" aria-label="Previous month" onClick={() => onMonthChange(new Date(Date.UTC(year, monthIndex - 1, 1)))}><ChevronLeft size={16} aria-hidden="true" /></button>
        <button type="button" aria-label="Next month" onClick={() => onMonthChange(new Date(Date.UTC(year, monthIndex + 1, 1)))}><ChevronRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
    <div className="partner-month-weekdays" aria-hidden="true">{weekdays.map(day => <span key={day}>{day.slice(0, 1)}</span>)}</div>
    <div className="partner-month-days">
      {Array.from({ length: cellCount }, (_, index) => {
        const date = new Date(Date.UTC(year, monthIndex, index - firstWeekday + 1));
        const key = dateKey(date);
        const count = opportunities.filter(opportunity => fallsOn(opportunity, key)).length;
        const outside = date.getUTCMonth() !== monthIndex;
        return <button
          key={key}
          type="button"
          className={`partner-month-day${outside ? " is-outside" : ""}${key === today ? " is-today" : ""}${key === selectedDate ? " is-selected" : ""}`}
          aria-label={`${dateLabel(key)}${count ? `, ${count} ${count === 1 ? "opportunity" : "opportunities"}` : ", no opportunities"}`}
          aria-pressed={key === selectedDate}
          aria-current={key === today ? "date" : undefined}
          onClick={() => {
            if (outside) onMonthChange(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)));
            onSelect(key);
          }}
        ><span>{date.getUTCDate()}</span>{count > 0 && <span className="partner-month-dot" aria-hidden="true" />}</button>;
      })}
    </div>
    <p className="partner-month-hint"><span className="partner-month-dot" aria-hidden="true" />Opportunity dates & deadlines · UTC</p>
  </div>;
}

export default function PartnerCalendarPage({ initialCalendar }: { initialCalendar: PartnerCalendar }) {
  const catalog = useCatalog();
  const calendar = catalog.calendars.find(item => item.id === initialCalendar.id) ?? initialCalendar;
  const [period, setPeriod] = useState<Period>("Upcoming");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [today] = useState(() => dateKey(new Date()));
  const [month, setMonth] = useState(() => new Date(`${today.slice(0, 7)}-01T00:00:00Z`));
  const following = catalog.followed.includes(calendar.id);
  const canManage = calendar.canManage && !calendar.curated;
  const calendarPath = `/calendars/${encodeURIComponent(calendar.slug)}`;
  const opportunities = useMemo(() => catalog.opportunities.filter(opportunity =>
    opportunity.calendarId === calendar.id && (!("status" in opportunity) || opportunity.status === "published")
  ), [catalog.opportunities, calendar.id]);
  const filtered = useMemo(() => opportunities.filter(opportunity =>
    (period === "All" || (period === "Past" ? isPast(opportunity) : !isPast(opportunity))) &&
    (!selectedDate || fallsOn(opportunity, selectedDate))
  ).sort((a, b) => {
    const aDate = a.date ?? a.deadline;
    const bDate = b.date ?? b.deadline;
    if (!aDate) return bDate ? 1 : a.title.localeCompare(b.title);
    if (!bDate) return -1;
    const order = aDate.localeCompare(bDate) || a.title.localeCompare(b.title);
    return period === "Past" ? -order : order;
  }), [opportunities, period, selectedDate]);
  const organizationMap = useMemo(() => Object.fromEntries(catalog.organizations.map(organization => [organization.id, organization])), [catalog.organizations]);
  const selection = useOpportunitySelection(opportunities);
  const selectedIndex = selection.selected ? filtered.findIndex(opportunity => opportunity.id === selection.selected!.id) : -1;

  function viewAll() {
    setSelectedDate(null);
    setPeriod("All");
  }

  return <SiteShell wide className="calendar-shell">
    <section className="partner-calendar-profile" aria-labelledby="partner-calendar-name" style={{ "--partner-calendar-color": calendar.color } as CSSProperties}>
      <div className={`partner-calendar-cover${calendar.cover ? " has-image" : ""}`} aria-hidden="true">
        {calendar.cover ? <img src={calendar.cover} alt="" /> : <CalendarDays className="partner-calendar-cover-icon" strokeWidth={1} />}
      </div>
      <div className="partner-calendar-profile-body">
        <div className="partner-calendar-profile-top">
          <div className="partner-calendar-avatar">{calendar.logo ? <img src={calendar.logo} alt={`${calendar.name} logo`} width={96} height={96} /> : <CalendarDays size={32} aria-hidden="true" />}</div>
          <button type="button" className={`partner-calendar-follow${following ? " is-following" : ""}`} aria-pressed={following} onClick={() => catalog.toggleFollow(calendar.id)}>
            {following ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}{following ? "Following" : "Follow"}
          </button>
        </div>
        <h1 id="partner-calendar-name">{calendar.name}</h1>
        <p className="partner-calendar-description">{calendar.description}</p>
        <CalendarSocialLinks calendar={calendar} />
        {canManage && <div className="partner-calendar-management">
          <Link className="partner-calendar-action" href={`${calendarPath}/manage`}><Settings size={15} aria-hidden="true" />Manage calendar</Link>
          <Link className="partner-calendar-action" href={`${calendarPath}/manage?new=1`}><Plus size={15} aria-hidden="true" />Add opportunity</Link>
        </div>}
      </div>
    </section>

    <div className="partner-calendar-body">
      <section className="partner-calendar-feed" aria-labelledby="partner-opportunities-heading">
        <div className="partner-calendar-feed-heading">
          <h2 id="partner-opportunities-heading">Opportunities <span className="partner-calendar-count" aria-live="polite">{filtered.length}</span></h2>
          <div className="partner-calendar-periods" role="group" aria-label="Opportunity time period">{periods.map(value => <button key={value} type="button" aria-pressed={period === value} onClick={() => setPeriod(value)}>{value}</button>)}</div>
        </div>
        <div className="partner-calendar-feed-tools">
          <Link href={`/explore?calendar=${encodeURIComponent(calendar.slug)}`} className="partner-calendar-search"><Search size={14} aria-hidden="true" />Search in this calendar</Link>
          {selectedDate && <div className="partner-calendar-date-filter"><span>{new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</span><button type="button" onClick={() => setSelectedDate(null)}><X size={12} aria-hidden="true" />Clear date</button></div>}
        </div>
        {catalog.error && <div className="partner-calendar-error" role="status"><span>{catalog.error}</span><button type="button" onClick={() => void catalog.refresh()} disabled={catalog.loading}>{catalog.loading ? "Retrying…" : "Try again"}</button></div>}
        <div aria-busy={catalog.loading}>
          {filtered.length > 0 ? <EventFeed opportunities={filtered} organizations={organizationMap} saved={catalog.saved} onSave={catalog.toggleSave} onOpen={selection.open} /> : <div className="partner-calendar-empty" role="status">
            <CalendarDays size={36} strokeWidth={1.25} aria-hidden="true" />
            <h3>{catalog.loading ? "Loading opportunities…" : selectedDate ? "No opportunities on this date" : period === "Past" ? "No past opportunities" : period === "Upcoming" ? "No upcoming opportunities" : "No opportunities yet"}</h3>
            <p>{selectedDate ? "Choose another date or view everything in this calendar." : period === "Upcoming" && opportunities.length ? "Take a look at past opportunities from this calendar." : "New opportunities will appear here when they’re published."}</p>
            <div className="partner-calendar-empty-actions">
              {selectedDate && <button className="partner-calendar-action" type="button" onClick={() => setSelectedDate(null)}>Clear date</button>}
              {(selectedDate || period !== "All") ? <button className="partner-calendar-action" type="button" onClick={viewAll}>View all opportunities</button> : <Link className="partner-calendar-action" href="/explore">Explore opportunities</Link>}
            </div>
          </div>}
        </div>
      </section>

      <aside className="partner-calendar-aside" aria-label="Calendar tools">
        <div className="partner-calendar-aside-actions">
          <button type="button" className="partner-calendar-choose-date partner-calendar-action" aria-expanded={datePickerOpen} aria-controls="partner-calendar-date-picker" onClick={() => setDatePickerOpen(open => !open)}><CalendarDays size={15} aria-hidden="true" />Choose date<ChevronDown size={14} aria-hidden="true" /></button>
          <a className="partner-calendar-action partner-calendar-subscribe" href={`/api/calendars/${encodeURIComponent(calendar.slug)}/feed`} download={`${calendar.slug}.ics`}><CalendarPlus size={15} aria-hidden="true" />Add to calendar</a>
        </div>
        <div id="partner-calendar-date-picker" className={`partner-calendar-picker-disclosure${datePickerOpen ? " is-open" : ""}`}>
          <MonthPicker month={month} today={today} selectedDate={selectedDate} opportunities={opportunities} onMonthChange={setMonth} onSelect={setSelectedDate} />
        </div>
      </aside>
    </div>

    <OpportunityDetails
      opportunity={selection.selected}
      organization={selection.selected ? organizationMap[selection.selected.organizationId] : undefined}
      saved={!!selection.selected && catalog.saved.includes(selection.selected.id)}
      onSave={() => { if (selection.selected) catalog.toggleSave(selection.selected); }}
      onClose={selection.close}
      onNotify={catalog.notify}
      onPrevious={selectedIndex > 0 ? () => selection.open(filtered[selectedIndex - 1]) : undefined}
      onNext={selectedIndex >= 0 && selectedIndex < filtered.length - 1 ? () => selection.open(filtered[selectedIndex + 1]) : undefined}
    />
  </SiteShell>;
}
