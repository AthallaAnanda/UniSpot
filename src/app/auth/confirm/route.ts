import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { authOrigin } from "@/lib/server/auth-origin";

export async function GET(request: NextRequest) {
  const origin = authOrigin(request);
  const hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = safeNext(request.nextUrl.searchParams.get("next"), type === "recovery" || type === "invite" ? "/reset-password" : "/discover");
  if (hash && type && ["signup", "email", "recovery", "invite", "email_change"].includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: hash, type: type as EmailOtpType });
    if (!error) return NextResponse.redirect(new URL(next, origin), { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.redirect(new URL("/login?error=confirmation", origin), { headers: { "Cache-Control": "private, no-store" } });
}
