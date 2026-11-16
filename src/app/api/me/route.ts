import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError, checkOrigin, readBody } from "@/lib/server/api";
import { CatalogError, requireApiUser } from "@/lib/server/catalog-store";

const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
      if (error && error.name !== "AuthSessionMissingError") return NextResponse.json({ error: "Couldn’t verify your session. Please try again." }, { status: 503, headers });
      return NextResponse.json({ user: null }, { headers });
    }
    let { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (profileError) throw profileError;
    if (!profile) {
      // Display metadata never determines ownership or authorization.
      const name = String(user.user_metadata.full_name ?? user.user_metadata.name ?? "").slice(0, 100);
      const result = await supabase.from("profiles").upsert({ id: user.id, name, created_at: user.created_at }, { onConflict: "id", ignoreDuplicates: true }).select().maybeSingle();
      if (result.error) throw result.error;
      profile = result.data ?? (await supabase.from("profiles").select("*").eq("id", user.id).single()).data;
    }
    const [saved, follows] = await Promise.all([
      supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", user.id),
      supabase.from("hub_follows").select("hub_id").eq("user_id", user.id),
    ]);
    if (saved.error || follows.error || !profile) throw saved.error ?? follows.error ?? new Error("Profile unavailable");
    return NextResponse.json({ user: { id: user.id, email: user.email }, profile: { name: profile.name, role: profile.role, campus: profile.campus, bio: profile.bio, joinedAt: profile.created_at }, saved: saved.data.map(row => row.opportunity_id), followed: follows.data.map(row => row.hub_id) }, { headers });
  } catch (error) { return apiError(error); }
}

export async function PATCH(request: NextRequest) {
  try {
    checkOrigin(request);
    const user = await requireApiUser();
    const input = await readBody(request);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new CatalogError("Please provide a profile.");
    const profile: Record<string, string> = {};
    for (const [field, max] of [["name", 100], ["campus", 100], ["bio", 200]] as const) {
      if (typeof input[field] !== "string" || input[field].trim().length > max) throw new CatalogError(`Please enter a valid ${field}.`);
      profile[field] = input[field].trim();
    }
    if (!["Student", "Community"].includes(input.role)) throw new CatalogError("Please choose an account type.");
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...profile, role: input.role });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) { return apiError(error); }
}
