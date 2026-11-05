"use client";

import { memo, useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Globe2, Search } from "lucide-react";
import { timeZoneCity, timeZoneOffset } from "@/lib/opportunity-time";
import PublishingDialog from "./PublishingDialog";

const indonesia = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"];
const fallbackZones = ["UTC", ...indonesia, "Asia/Singapore", "Asia/Tokyo", "Asia/Seoul", "Asia/Kolkata", "Asia/Dubai", "Australia/Sydney", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles"];
const zoneAliases: Record<string, string> = { "Asia/Jakarta": "WIB Western Indonesia", "Asia/Makassar": "WITA Central Indonesia Bali", "Asia/Jayapura": "WIT Eastern Indonesia Papua" };
const rowHeight = 56;
type Props = { value: string; onChange: (value: string) => void; date?: string };

// Mounted by the dialog only when opened. A small, keyboard-accessible window
// keeps the full IANA search without rendering hundreds of offscreen buttons.
function TimeZoneOptions({ value, onChange, date }: Props) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim().toLowerCase());
  const [active, setActive] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetIndex, setOffsetIndex] = useState<{ day?: string; values: Map<string, string> } | null>(null);
  const options = useMemo(() => {
    const intl = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
    return [...new Set([value, ...indonesia, "UTC", ...(intl.supportedValuesOf?.("timeZone") ?? fallbackZones)])].map(zone => ({ zone, city: timeZoneCity(zone), alias: zoneAliases[zone] || "", search: `${zone} ${timeZoneCity(zone)} ${zoneAliases[zone] || ""}`.toLowerCase() }));
  }, [value]);
  const offsetSearch = /^(gmt|[+-]\d)/.test(search);
  const indexed = offsetIndex && offsetIndex.day === date ? offsetIndex.values : null;

  useEffect(() => {
    if (!offsetSearch || indexed) return;
    let canceled = false;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const values = new Map<string, string>();
    // Offset searches are uncommon. Build their index in short interruptible
    // slices so opening the dialog and typing never wait on all IANA formatters.
    const batch = () => {
      const start = performance.now();
      let count = 0;
      while (!canceled && index < options.length && count < 8 && performance.now() - start < 4) {
        const zone = options[index++].zone;
        values.set(zone, timeZoneOffset(zone, date).toLowerCase());
        count++;
      }
      if (canceled) return;
      if (index < options.length) timer = setTimeout(batch, 0);
      else setOffsetIndex({ day: date, values });
    };
    timer = setTimeout(batch, 0);
    return () => { canceled = true; clearTimeout(timer); };
  }, [offsetSearch, indexed, options, date]);

  const matches = useMemo(() => options.filter(option => offsetSearch ? indexed?.get(option.zone)?.includes(search) : option.search.includes(search)), [options, search, offsetSearch, indexed]);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
  const visible = matches.slice(start, start + 13);
  const busy = query.trim().toLowerCase() !== search || (offsetSearch && !indexed);

  function keyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") { event.preventDefault(); if (!busy && matches[active]) onChange(matches[active].zone); return; }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next = Math.max(0, Math.min(matches.length - 1, active + (event.key === "ArrowDown" ? 1 : -1)));
    setActive(next);
    const node = list.current;
    if (!node) return;
    if (next * rowHeight < node.scrollTop) node.scrollTop = next * rowHeight;
    else if ((next + 1) * rowHeight > node.scrollTop + node.clientHeight) node.scrollTop = (next + 1) * rowHeight - node.clientHeight;
    // Keep the active option mounted in the same render as keyboard selection,
    // rather than waiting for the browser's later scroll event.
    setScrollTop(node.scrollTop);
  }

  return <>
    <div className="timezone-search"><Search size={16} /><input role="combobox" aria-label="Search time zones" aria-autocomplete="list" aria-expanded="true" aria-controls={id} aria-activedescendant={matches[active] && active >= start && active < start + visible.length ? `${id}-${active}` : undefined} placeholder="Search a city, zone, or GMT offset" value={query} onKeyDown={keyboard} onChange={event => { setQuery(event.target.value); setActive(0); setScrollTop(0); if (list.current) list.current.scrollTop = 0; }} /></div>
    <div className="timezone-options" ref={list} id={id} role="listbox" aria-label="Available time zones" aria-busy={busy} style={{ height: Math.min(Math.max(matches.length, 1) * rowHeight, 336) }} onScroll={event => setScrollTop(event.currentTarget.scrollTop)}>
      <div className="timezone-options-window" style={{ height: matches.length * rowHeight }}>{visible.map(({ zone, city, alias }, offset) => {
        const index = start + offset;
        return <div role="option" id={`${id}-${index}`} className="timezone-option" key={zone} aria-selected={zone === value} aria-setsize={matches.length} aria-posinset={index + 1} data-active={index === active || undefined} style={{ top: index * rowHeight, height: rowHeight }} onMouseDown={event => event.preventDefault()} onClick={() => onChange(zone)}><span><strong>{city}</strong><small>{zone}{alias ? ` · ${alias.split(" ")[0]}` : ""}</small></span><span className="timezone-option-offset">{timeZoneOffset(zone, date)}</span><span className="timezone-option-check">{zone === value && <Check size={16} />}</span></div>;
      })}</div>
      {!matches.length && <p className="timezone-empty" role="status">{busy ? "Finding time zones…" : "No matching time zones. Try another city or offset."}</p>}
    </div>
  </>;
}

export default memo(function TimeZonePicker({ value, onChange, date }: Props) {
  const [open, setOpen] = useState(false);
  const select = useCallback((zone: string) => { onChange(zone); setOpen(false); }, [onChange]);
  return <>
    <button type="button" className="opportunity-timezone" aria-label="Choose time zone" aria-haspopup="dialog" onClick={() => setOpen(true)}><span className="opportunity-timezone-top"><Globe2 size={15} /><ChevronDown size={12} /></span><span className="opportunity-timezone-offset">{timeZoneOffset(value, date)}</span><small>{timeZoneCity(value)}</small></button>
    <PublishingDialog open={open} onOpenChange={setOpen} title="Time zone" description="Choose the time zone for this opportunity. Your entered date and time will stay the same."><TimeZoneOptions value={value} onChange={select} date={date} /></PublishingDialog>
  </>;
});
