"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { emptyProfile, type Profile } from "@/types/auth";

type Account = { id: string; email?: string };
type Personal = { user: Account | null; profile: Profile; saved: string[]; followed: string[] };
const empty: Personal = { user: null, profile: emptyProfile, saved: [], followed: [] };
interface AuthContextValue extends Personal {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<void>;
  setCollection: (kind: "saved" | "followed", id: string, active: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [personal, setPersonal] = useState<Personal>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const accountId = useRef<string | null>(null);
  const version = useRef(0);
  const router = useRouter();
  const refresh = useCallback(async () => {
    const id = ++version.current;
    try {
      const response = await fetch("/api/me", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn’t load your account.");
      if (id !== version.current) return;
      accountId.current = data.user?.id ?? null;
      setPersonal(data.user ? data : empty);
      setError("");
    } catch (problem) {
      if (id === version.current) setError(problem instanceof Error ? problem.message : "Couldn’t load your account.");
    } finally { if (id === version.current) setLoading(false); }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout>;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      const nextId = session?.user.id ?? null;
      if (accountId.current !== nextId) {
        ++version.current;
        accountId.current = nextId;
        setPersonal(empty);
        setLoading(!!nextId);
      }
      clearTimeout(timer);
      timer = setTimeout(() => { void refresh(); }, 0);
    });
    const focus = () => { void refresh(); };
    window.addEventListener("focus", focus);
    return () => { subscription.unsubscribe(); clearTimeout(timer); ++version.current; window.removeEventListener("focus", focus); };
  }, [refresh]);

  const saveProfile = useCallback(async (profile: Profile) => {
    const response = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    if (!response.ok) throw new Error((await response.json()).error ?? "Couldn’t save your profile.");
    await refresh();
  }, [refresh]);
  const setCollection = useCallback(async (kind: "saved" | "followed", id: string, active: boolean) => {
    const userId = accountId.current;
    if (!userId) throw new Error("Please sign in to continue.");
    const response = await fetch("/api/me/collections", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id, active }) });
    if (!response.ok) throw new Error((await response.json()).error ?? "Couldn’t update your collection.");
    if (accountId.current === userId) setPersonal(previous => ({ ...previous, [kind]: active ? [...new Set([...previous[kind], id])] : previous[kind].filter(value => value !== id) }));
  }, []);
  const signOut = useCallback(async () => {
    const { error } = await createClient().auth.signOut({ scope: "local" });
    if (error) throw error;
    ++version.current;
    accountId.current = null;
    setPersonal(empty);
    router.push("/discover");
    router.refresh();
  }, [router]);
  const value = useMemo(() => ({ ...personal, loading, error, refresh, saveProfile, setCollection, signOut }), [personal, loading, error, refresh, saveProfile, setCollection, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
