import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PartnerCalendarPage from "@/components/PartnerCalendarPage";
import { getCalendar, ownerCookie } from "@/lib/server/catalog-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const calendar = getCalendar((await params).slug);
  return { title: calendar ? `${calendar.name} · UniSpot` : "Calendar not found · UniSpot", description: calendar?.description };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const calendar = getCalendar((await params).slug, (await cookies()).get(ownerCookie)?.value);
  if (!calendar) notFound();
  return <PartnerCalendarPage initialCalendar={calendar} />;
}
