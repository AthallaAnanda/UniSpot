"use client";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { PartnerCalendar } from "@/types/unispot";
import { useCatalog } from "./CatalogProvider";
import type { CatalogView } from "@/hooks/useCatalogView";
import "./CatalogView.css";

export default function CalendarCards({ calendars, view = "grid" }: { calendars: PartnerCalendar[]; view?: CatalogView }) {
  const { opportunities, followed, toggleFollow } = useCatalog();
  return <div className={view === "list" ? "calendar-list" : "organization-grid calendar-card-grid"}>{calendars.map(calendar => {
    const count = opportunities.filter(opportunity => opportunity.calendarId === calendar.id).length;
    const following = followed.includes(calendar.id);
    const followButton = <button type="button" className={`calendar-follow-small${following ? " following" : ""}`} aria-label={`${following ? "Unfollow" : "Follow"} ${calendar.name}`} aria-pressed={following} onClick={() => toggleFollow(calendar.id)}>{following && <Check size={12} />}{following ? "Following" : "Follow"}</button>;
    const countLabel = <span className="calendar-card-count">{count} {count === 1 ? "opportunity" : "opportunities"}<ArrowUpRight size={12} /></span>;
    if (view === "list") return <article className="calendar-list-card" key={calendar.id}><span className="calendar-list-logo"><img src={calendar.logo} alt="" loading="lazy" /></span><div className="calendar-list-copy"><h3><Link href={`/calendars/${calendar.slug}`}>{calendar.name}</Link></h3><p>{calendar.description}</p>{countLabel}</div>{followButton}</article>;
    return <article className="organization-card calendar-card" key={calendar.id}><div className="organization-card-top"><span className="organization-logo"><img src={calendar.logo} alt="" loading="lazy" /></span>{followButton}</div><h3><Link href={`/calendars/${calendar.slug}`}>{calendar.name}</Link></h3><p>{calendar.description}</p>{countLabel}</article>;
  })}</div>;
}
