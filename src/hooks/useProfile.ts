"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

export type Profile = { name: string; role: "Student" | "Community"; campus: string; bio: string; joinedAt?: string };
const initial: Profile = { name: "", role: "Student", campus: "", bio: "" };
const key = "unispot-profile";
const changeEvent = "unispot-profile-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(changeEvent, callback); };
}

function snapshot() {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}

export function useProfile() {
  const stored = useSyncExternalStore(subscribe, snapshot, () => "");
  const profile = useMemo<Profile>(() => {
    try {
      const value = JSON.parse(stored);
      return {
        name: typeof value?.name === "string" ? value.name : "",
        role: value?.role === "Community" ? "Community" : "Student",
        campus: typeof value?.campus === "string" ? value.campus : "",
        bio: typeof value?.bio === "string" ? value.bio : "",
        joinedAt: typeof value?.joinedAt === "string" && !Number.isNaN(Date.parse(value.joinedAt)) ? value.joinedAt : undefined,
      };
    } catch { return initial; }
  }, [stored]);

  useEffect(() => {
    if (profile.joinedAt) return;
    try {
      const existing = JSON.parse(snapshot() || "{}");
      if (typeof existing?.joinedAt === "string" && !Number.isNaN(Date.parse(existing.joinedAt))) return;
      localStorage.setItem(key, JSON.stringify({ ...profile, joinedAt: new Date().toISOString() }));
      window.dispatchEvent(new Event(changeEvent));
    } catch { /* A profile can still be displayed when browser storage is unavailable. */ }
  }, [profile]);

  function saveProfile(value: Profile) {
    localStorage.setItem(key, JSON.stringify({ ...value, name: value.name.trim(), campus: value.campus.trim(), bio: value.bio.trim() }));
    window.dispatchEvent(new Event(changeEvent));
  }
  return { profile, saveProfile };
}
