"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Opportunity, Organization } from "@/types/unispot";
import EventContent from "./EventContent";
import LumaIcon from "./LumaIcon";
import "./OpportunityDetails.css";

interface OpportunityDetailsProps {
  opportunity: Opportunity | null;
  organization?: Organization;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onNotify: (message: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function OpportunityDetails({ opportunity, organization, saved, onClose, onSave, onNotify, onPrevious, onNext }: OpportunityDetailsProps) {
  const [copied, setCopied] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const scrollBody = useRef<HTMLDivElement | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRequest = useRef(0);
  const retained = useRef<{ opportunity: Opportunity; organization?: Organization; saved: boolean } | null>(null);
  useLayoutEffect(() => {
    if (opportunity) retained.current = { opportunity, organization, saved };
  }, [opportunity, organization, saved]);
  const displayed = opportunity ? { opportunity, organization, saved } : retained.current;

  useEffect(() => {
    if (opportunity) {
      setCopied(false);
      scrollBody.current?.scrollTo({ top: 0 });
    }
    return () => {
      copyRequest.current += 1;
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    };
  }, [opportunity?.id]);

  async function copyLink() {
    if (!opportunity) return;
    const request = ++copyRequest.current;
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (request !== copyRequest.current) return;
      setCopied(true);
      onNotify("Link copied. Good things are better shared.");
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      if (request === copyRequest.current) {
        onNotify("Could not copy this link. You can copy it from your address bar.");
      }
    }
  }

  return (
    <RadixDialog.Root open={!!opportunity} onOpenChange={open => { if (!open) onClose(); }}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="detail-overlay event-panel-overlay">
          <RadixDialog.Content
            className="detail-panel event-panel"
            aria-labelledby="event-content-title"
            aria-describedby="event-content-description"
            aria-hidden={opportunity ? undefined : true}
            inert={!opportunity}
            onOpenAutoFocus={() => {
              returnFocus.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
            }}
            onCloseAutoFocus={event => {
              event.preventDefault();
              if (opportunity) return;
              retained.current = null;
              if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
              else document.querySelector<HTMLElement>(".header-navigation [aria-current=page]")?.focus({ preventScroll: true });
            }}
          >
            {displayed && <>
              <div className="event-panel-toolbar">
                <RadixDialog.Close type="button" className="event-panel-button event-panel-icon-button event-panel-close" aria-label="Close opportunity">
                  <LumaIcon name="Close" size={20} />
                </RadixDialog.Close>
                <button type="button" className="event-panel-button" onClick={copyLink}>
                  <LumaIcon name="Copy" size={14} />
                  <span aria-live="polite">{copied ? "Copied" : "Copy Link"}</span>
                </button>
                <a className="event-panel-button" href={`/opportunities/${displayed.opportunity.id}`} target="_blank" rel="noopener noreferrer">
                  Event Page<LumaIcon name="External" size={14} />
                </a>
                <div className="event-panel-toolbar-spacer" />
                <div className="event-panel-navigation">
                  <button type="button" className="event-panel-button event-panel-icon-button" aria-label="Previous opportunity" disabled={!onPrevious} onClick={onPrevious}>
                    <ChevronUp size={16} aria-hidden="true" />
                  </button>
                  <button type="button" className="event-panel-button event-panel-icon-button" aria-label="Next opportunity" disabled={!onNext} onClick={onNext}>
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="event-panel-scroll" ref={scrollBody}>
                <EventContent opportunity={displayed.opportunity} organization={displayed.organization} saved={displayed.saved} onSave={onSave} onNotify={onNotify} mode="panel" />
              </div>
            </>}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
