import { notFound } from "next/navigation";
import PartnerCalendarPage from "@/components/PartnerCalendarPage";
import { getCalendar } from "@/lib/server/catalog-store";
import { currentUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const hub = await getCalendar((await params).slug);
  return { title: hub ? `${hub.name} · UniSpot` : "Hub not found · UniSpot", description: hub?.description };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const hub = await getCalendar((await params).slug, (await currentUser())?.id);
  if (!hub) notFound();
  return <PartnerCalendarPage initialCalendar={hub} />;
}
