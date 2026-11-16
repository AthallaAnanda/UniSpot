import { landingAdapterSource } from "@/lib/landing-adapter";

export function GET() {
  return new Response(landingAdapterSource(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
