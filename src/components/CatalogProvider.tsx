"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calendarOrganization } from "@/lib/catalog-seed";
import { useRouter } from "next/navigation";
import { loginUrl } from "@/lib/auth";
import { useAuth } from "./AuthProvider";
import type { CatalogData, ManagedOpportunity, Opportunity, PartnerCalendar } from "@/types/unispot";
import MotionToast from "./MotionToast";

interface CatalogContextValue extends CatalogData {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  commitCalendar: (calendar: PartnerCalendar) => void;
  commitOpportunity: (opportunity: ManagedOpportunity) => void;
  saved: string[];
  followed: string[];
  toggleSave: (opportunity: Opportunity) => void;
  toggleFollow: (id: string) => void;
  notify: (message: string) => void;
}
const CatalogContext = createContext<CatalogContextValue | null>(null);
const catalogUpdateKey = "unispot-catalog-updated";
const focusFreshnessMs = 30_000;
function reuseRecords<T extends { id: string }>(previous: T[], next: T[]): T[] {
  const byId = new Map(previous.map(record => [record.id, record]));
  const records = next.map(record => {
    const existing = byId.get(record.id);
    return existing && JSON.stringify(existing) === JSON.stringify(record) ? existing : record;
  });
  return records.length === previous.length && records.every((record, index) => record === previous[index]) ? previous : records;
}
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, saved, followed, setCollection } = auth;
  const router = useRouter();
  const [catalog, setCatalog] = useState<CatalogData>({ organizations: [], calendars: [], opportunities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pendingCollections = useRef(new Set<string>());
  const [toast, setToast] = useState("");
  const requestId = useRef(0);
  const inFlight = useRef<{ controller: AbortController; promise: Promise<void> } | null>(null);
  const lastSuccess = useRef(0);
  const lastPayload = useRef<string | null>(null);
  const invalidateRequest = useCallback(() => {
    requestId.current++;
    inFlight.current?.controller.abort();
    inFlight.current = null;
  }, []);
  const refresh = useCallback((): Promise<void> => {
    if (inFlight.current) return inFlight.current.promise;
    const id = ++requestId.current;
    const controller = new AbortController();
    const promise = (async () => {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Couldn’t refresh the opportunity catalog.");
        const payload = await response.text();
        if (id !== requestId.current) return;
        if (payload !== lastPayload.current) {
          const data: CatalogData = JSON.parse(payload);
          setCatalog(previous => {
            const opportunities = reuseRecords(previous.opportunities, data.opportunities);
            const calendars = reuseRecords(previous.calendars, data.calendars);
            const organizations = reuseRecords(previous.organizations, data.organizations);
            return opportunities === previous.opportunities && calendars === previous.calendars && organizations === previous.organizations ? previous : { opportunities, calendars, organizations };
          });
          lastPayload.current = payload;
        }
        lastSuccess.current = Date.now();
        setError("");
      } catch (problem) {
        if (id === requestId.current && !controller.signal.aborted) setError(problem instanceof Error ? problem.message : "Couldn’t load opportunities.");
      } finally {
        if (id === requestId.current) setLoading(false);
        if (inFlight.current?.controller === controller) inFlight.current = null;
      }
    })();
    inFlight.current = { controller, promise };
    return promise;
  }, []);

  const announceMutation = useCallback(() => {
    invalidateRequest();
    lastPayload.current = null;
    setLoading(false);
    // Synchronize other tabs immediately, without making successful saves wait.
    try { localStorage.setItem(catalogUpdateKey, `${Date.now()}:${Math.random()}`); } catch { /* Current-tab state is already updated. */ }
    void refresh();
  }, [invalidateRequest, refresh]);
  const commitCalendar = useCallback((calendar: PartnerCalendar) => {
    setCatalog(previous => ({
      ...previous,
      calendars: [calendar, ...previous.calendars.filter(item => item.id !== calendar.id)],
      organizations: [calendarOrganization(calendar), ...previous.organizations.filter(item => item.id !== calendar.organizationId)],
    }));
    announceMutation();
  }, [announceMutation]);
  const commitOpportunity = useCallback((opportunity: ManagedOpportunity) => {
    setCatalog(previous => ({ ...previous, opportunities: opportunity.status === "published" ? [opportunity, ...previous.opportunities.filter(item => item.id !== opportunity.id)] : previous.opportunities.filter(item => item.id !== opportunity.id) }));
    announceMutation();
  }, [announceMutation]);
  useEffect(() => {
    void refresh();
    const storage = (event: StorageEvent) => { if (event.key === catalogUpdateKey || event.key === null) void refresh(); };
    const focus = () => { if (Date.now() - lastSuccess.current >= focusFreshnessMs) void refresh(); };
    window.addEventListener("storage", storage);
    window.addEventListener("focus", focus);
    return () => { invalidateRequest(); window.removeEventListener("storage", storage); window.removeEventListener("focus", focus); };
  }, [refresh, invalidateRequest]);
  useEffect(() => {
    invalidateRequest();
    lastPayload.current = null;
    setCatalog(previous => ({ ...previous, calendars: previous.calendars.map(calendar => ({ ...calendar, canManage: false })) }));
    void refresh();
  }, [user?.id, refresh, invalidateRequest]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 3500); return () => clearTimeout(timer); }, [toast]);
  const toggleCollection = useCallback((kind: "saved" | "followed", id: string) => {
    if (!user) { router.push(loginUrl(window.location.pathname + window.location.search)); return; }
    if (auth.loading || auth.error) { setToast("Your account is still loading. Please try again."); return; }
    const key = `${user.id}:${kind}:${id}`;
    if (pendingCollections.current.has(key)) return;
    pendingCollections.current.add(key);
    const exists = (kind === "saved" ? saved : followed).includes(id);
    void setCollection(kind, id, !exists).then(() => {
      setToast(kind === "saved" ? exists ? "Removed from saved opportunities." : "Opportunity saved." : exists ? "Hub unfollowed." : "Hub added to Following.");
    }).catch(problem => setToast(problem instanceof Error ? problem.message : "Couldn’t update your collection.")).finally(() => pendingCollections.current.delete(key));
  }, [user, auth.loading, auth.error, router, saved, followed, setCollection]);
  const toggleSave = useCallback((opportunity: Opportunity) => toggleCollection("saved", opportunity.id), [toggleCollection]);
  const toggleFollow = useCallback((id: string) => toggleCollection("followed", id), [toggleCollection]);
  // Toast-only changes should not rerender the entire catalog underneath an animation.
  const value = useMemo(() => ({ ...catalog, loading, error, refresh, commitCalendar, commitOpportunity, saved, followed, toggleSave, toggleFollow, notify: setToast }), [catalog, loading, error, refresh, commitCalendar, commitOpportunity, saved, followed, toggleSave, toggleFollow]);
  return <CatalogContext.Provider value={value}>{children}<MotionToast message={toast} onDismiss={() => setToast("")} /></CatalogContext.Provider>;
}
export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used inside CatalogProvider.");
  return value;
}
