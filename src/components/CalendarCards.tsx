"use client";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import type { CatalogView } from "@/hooks/useCatalogView";
import CatalogImage from "./CatalogImage";
import "./CatalogView.css";

const CalendarCard = memo(function CalendarCard({ calendar, view, count, following, onFollow }: { calendar: PartnerCalendar; view: CatalogView; count: number; following: boolean; onFollow: (id: string) => void }) {
  const followButton = <button type="button" className={`calendar-follow-small${following ? " following" : ""}`} aria-label={`${following ? "Unfollow" : "Follow"} ${calendar.name}`} aria-pressed={following} onClick={() => onFollow(calendar.id)}>{following && <Check size={12} />}{following ? "Following" : "Follow"}</button>;
  const countLabel = <span className="calendar-card-count">{count} {count === 1 ? "opportunity" : "opportunities"}<ArrowUpRight size={12} /></span>;
  if (view === "list") return <article className="calendar-list-card"><span className="calendar-list-logo"><CatalogImage src={calendar.logo} alt="" width={64} height={64} loading="lazy" /></span><div className="calendar-list-copy"><h3><Link href={`/calendars/${calendar.slug}`}>{calendar.name}</Link></h3><p>{calendar.description}</p>{countLabel}</div>{followButton}</article>;
  return <article className="organization-card calendar-card"><div className="organization-card-top"><span className="organization-logo"><CatalogImage src={calendar.logo} alt="" width={48} height={48} loading="lazy" /></span>{followButton}</div><h3><Link href={`/calendars/${calendar.slug}`}>{calendar.name}</Link></h3><p>{calendar.description}</p>{countLabel}</article>;
});

export default memo(function CalendarCards({ calendars, view = "grid" }: { calendars: PartnerCalendar[]; view?: CatalogView }) {
  const { opportunities, followed, toggleFollow } = useCatalog();
  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const opportunity of opportunities) if (opportunity.calendarId) result.set(opportunity.calendarId, (result.get(opportunity.calendarId) ?? 0) + 1);
    return result;
  }, [opportunities]);
  const followedIds = useMemo(() => new Set(followed), [followed]);
  return <div className={view === "list" ? "calendar-list" : "organization-grid calendar-card-grid"}>{calendars.map(calendar => <CalendarCard key={calendar.id} calendar={calendar} view={view} count={counts.get(calendar.id) ?? 0} following={followedIds.has(calendar.id)} onFollow={toggleFollow} />)}</div>;
});
