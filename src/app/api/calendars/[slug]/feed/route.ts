import { getCalendar, getCatalog } from "@/lib/server/catalog-store";
import { calendarFeed } from "@/lib/calendar-feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const calendar = getCalendar((await params).slug);
  if (!calendar) return Response.json({ error: "Calendar not found." }, { status: 404 });
  const opportunities = getCatalog().opportunities.filter(opportunity => opportunity.calendarId === calendar.id);
  return new Response(calendarFeed(opportunities, calendar.name), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${calendar.slug}.ics"`, "Cache-Control": "no-store" } });
}
