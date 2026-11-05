"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { seedCatalog } from "@/lib/catalog-seed";
import type { CatalogData, Opportunity } from "@/types/unispot";
import MotionToast from "./MotionToast";

interface CatalogContextValue extends CatalogData {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  saved: string[];
  followed: string[];
  toggleSave: (opportunity: Opportunity) => void;
  toggleFollow: (id: string) => void;
  notify: (message: string) => void;
}
const CatalogContext = createContext<CatalogContextValue | null>(null);
const keys = { saved: "unispot-saved-opportunities", followed: "unispot-followed-calendars" };
function readCollection(key: string) {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string"))] : []; } catch { return []; }
}
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogData>(seedCatalog);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const requestId = useRef(0);
  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const response = await fetch("/api/catalog", { cache: "no-store" });
      if (!response.ok) throw new Error("Couldn’t refresh the opportunity catalog.");
      const data: CatalogData = await response.json();
      if (id === requestId.current) { setCatalog(data); setError(""); }
    } catch (problem) { if (id === requestId.current) setError(problem instanceof Error ? problem.message : "Couldn’t load opportunities."); }
    finally { if (id === requestId.current) setLoading(false); }
  }, []);
  useEffect(() => {
    setSaved(readCollection(keys.saved));
    setFollowed(readCollection(keys.followed));
    void refresh();
    const storage = () => { setSaved(readCollection(keys.saved)); setFollowed(readCollection(keys.followed)); };
    const focus = () => { storage(); void refresh(); };
    window.addEventListener("storage", storage);
    window.addEventListener("focus", focus);
    return () => { requestId.current++; window.removeEventListener("storage", storage); window.removeEventListener("focus", focus); };
  }, [refresh]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 3500); return () => clearTimeout(timer); }, [toast]);
  const toggleSave = useCallback((opportunity: Opportunity) => {
    const exists = saved.includes(opportunity.id);
    const next = exists ? saved.filter(id => id !== opportunity.id) : [...saved, opportunity.id];
    setSaved(next);
    try { localStorage.setItem(keys.saved, JSON.stringify(next)); setToast(exists ? "Removed from saved opportunities." : "Opportunity saved."); }
    catch { setToast(exists ? "Removed from saved opportunities." : "Saved for this visit."); }
  }, [saved]);
  const toggleFollow = useCallback((id: string) => {
    const exists = followed.includes(id);
    const next = exists ? followed.filter(item => item !== id) : [...followed, id];
    setFollowed(next);
    try { localStorage.setItem(keys.followed, JSON.stringify(next)); setToast(exists ? "Calendar unfollowed." : "Calendar added to Following."); }
    catch { setToast(exists ? "Calendar unfollowed." : "Following for this visit."); }
  }, [followed]);
  // Toast-only changes should not rerender the entire catalog underneath an animation.
  const value = useMemo(() => ({ ...catalog, loading, error, refresh, saved, followed, toggleSave, toggleFollow, notify: setToast }), [catalog, loading, error, refresh, saved, followed, toggleSave, toggleFollow]);
  return <CatalogContext.Provider value={value}>{children}<MotionToast message={toast} onDismiss={() => setToast("")} /></CatalogContext.Provider>;
}
export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used inside CatalogProvider.");
  return value;
}
