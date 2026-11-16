import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { authOrigin } from "@/lib/server/auth-origin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = authOrigin(request);
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin), { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.redirect(new URL(`/login?error=callback&next=${encodeURIComponent(next)}`, origin), { headers: { "Cache-Control": "private, no-store" } });
}
