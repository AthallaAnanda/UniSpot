"use client";
import { useAuth } from "@/components/AuthProvider";
export type { Profile } from "@/types/auth";
export function useProfile() {
  const { profile, saveProfile } = useAuth();
  return { profile, saveProfile };
}
