import { Bookmark, CalendarDays, MapPin } from "lucide-react";
import { memo, type CSSProperties } from "react";
import type { CatalogView } from "@/hooks/useCatalogView";
import { categoryFor, opportunityStatus } from "@/lib/unispot";
import { opportunityDateLabel } from "@/lib/opportunity-date";
import type { Opportunity, Organization } from "@/types/unispot";
import LumaIcon from "./LumaIcon";
import CatalogImage from "./CatalogImage";
import "./OpportunityCard.css";
import "./CatalogView.css";

export default memo(function OpportunityCard({ opportunity, organization, saved, onSave, onOpen, view = "list", priority = false }: { opportunity: Opportunity; organization: Organization; saved: boolean; onSave: (opportunity: Opportunity) => void; onOpen: (opportunity: Opportunity) => void; view?: CatalogView; priority?: boolean }) {
  const category = categoryFor(opportunity.category);
  const fee = opportunity.fee?.trim();
  const visibleFee = fee?.toLowerCase() === "see organizer" ? "" : fee;
  const dateLabel = opportunityDateLabel(opportunity);
  const imageStyle: CSSProperties | undefined = opportunity.imageScale ? { transform: `scale(${opportunity.imageScale})` } : undefined;
  const hasDate = Boolean(opportunity.date || opportunity.deadline);
  const status = hasDate ? opportunityStatus(opportunity) : "";
  const ended = status === "Event ended" || status === "Applications closed";
  const dateDescription = opportunity.date ? `Event dates: ${dateLabel}` : opportunity.deadline ? `Application deadline: ${dateLabel}` : "Ongoing · No fixed date";
  if (view === "grid") return <article className="opportunity-card opportunity-tile" data-opportunity={opportunity.id} style={{ "--tile-color": opportunity.color } as CSSProperties}>
    <div className="opportunity-tile-cover">
      <CatalogImage src={opportunity.image} alt="" width={384} height={288} sizes="(max-width:600px) 360px, 300px" style={imageStyle} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
      <button type="button" className={`opportunity-tile-save${saved ? " is-saved" : ""}`} aria-label={`${saved ? "Unsave" : "Save"} ${opportunity.title}`} aria-pressed={saved} onClick={event => { event.stopPropagation(); onSave(opportunity); }}><Bookmark size={16} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} aria-hidden="true" /></button>
    </div>
    <div className="opportunity-tile-copy">
      <span className="opportunity-tile-category">{category.name}</span>
      <h3 className="opportunity-tile-title"><button type="button" onClick={() => onOpen(opportunity)} aria-label={`View ${opportunity.title}`} title={opportunity.title}>{opportunity.title}</button></h3>
      <div className="opportunity-tile-meta">
        <p className="opportunity-tile-date" title={dateDescription} aria-label={dateDescription}><CalendarDays size={14} aria-hidden="true" /><span>{dateLabel}</span></p>
        <p className="opportunity-tile-organizer"><CatalogImage src={organization.logo} alt="" width={16} height={16} loading="lazy" /><span>{opportunity.sourceName}</span></p>
        <p className="opportunity-tile-location"><MapPin size={14} aria-hidden="true" /><span>{opportunity.city === opportunity.format ? opportunity.format : `${opportunity.city} · ${opportunity.format}`}</span></p>
      </div>
      {(visibleFee || hasDate) && <div className="opportunity-tile-footer">{visibleFee && <span className="opportunity-tile-fee">{visibleFee}</span>}{hasDate && <span className={`opportunity-tile-status${ended ? " is-ended" : ""}`}>{status}</span>}</div>}
    </div>
  </article>;
  return <article className="opportunity-card luma-event-card" data-opportunity={opportunity.id}>
    <div className="luma-event-card-row">
      <div className="luma-event-card-text">
        <div className="luma-event-card-schedule" title={dateDescription} aria-label={dateDescription}>{dateLabel}</div>
        <h3 className="luma-event-card-title"><button type="button" onClick={() => onOpen(opportunity)} aria-label={`View ${opportunity.title}`} title={opportunity.title}>{opportunity.title}</button></h3>
        <div className="luma-event-card-meta">
          <div className="luma-event-card-organizer"><CatalogImage src={organization.logo} alt="" width={16} height={16} loading="lazy" /><span title={opportunity.sourceName}>{opportunity.sourceName}</span></div>
          <div className="luma-event-card-location"><LumaIcon name="MapPin" size={16} /><span title={opportunity.location}>{opportunity.location}</span></div>
        </div>
        <div className="luma-event-card-bottom"><div className="luma-event-card-badges"><span className="luma-event-card-pill">{category.name}</span>{hasDate && <span className={`luma-event-card-pill is-status${ended ? " is-ended" : ""}`}>{status}</span>}{visibleFee && <span className="luma-event-card-fee">{visibleFee}</span>}</div></div>
      </div>
      <div className="luma-event-card-cover" style={{ backgroundColor: opportunity.color }}>
        <CatalogImage className={opportunity.imageFit === "contain" ? "is-contained" : undefined} src={opportunity.image} alt="" width={128} height={128} sizes="(max-width:450px) 80px, 108px" style={imageStyle} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
        <button type="button" className={`luma-event-card-save${saved ? " is-saved" : ""}`} aria-label={`${saved ? "Unsave" : "Save"} ${opportunity.title}`} aria-pressed={saved} onClick={(event) => { event.stopPropagation(); onSave(opportunity); }}><Bookmark size={16} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} aria-hidden="true" /></button>
      </div>
    </div>
  </article>;
});
