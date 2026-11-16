import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { loginUrl } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  const path = request.nextUrl.pathname;
  const privatePage = ["/account", "/saved", "/create", "/hubs/new", "/calendars/new"].includes(path) || /^\/(hubs|calendars)\/[^/]+\/manage\/?$/.test(path);
  if (privatePage && !data?.claims) {
    const redirect = NextResponse.redirect(new URL(loginUrl(path + request.nextUrl.search), request.url));
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }
  if (request.cookies.getAll().some(cookie => cookie.name.startsWith("sb-")) || privatePage || path.startsWith("/auth")) response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|brand/|fonts/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|woff2)$).*)"],
};
