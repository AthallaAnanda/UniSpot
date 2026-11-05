import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ManageCalendar from "@/components/ManageCalendar";
import { getCalendar, ownerCookie } from "@/lib/server/catalog-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Manage calendar · UniSpot" };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const calendar = getCalendar((await params).slug, (await cookies()).get(ownerCookie)?.value);
  if (!calendar) notFound();
  return <ManageCalendar key={calendar.id} initialCalendar={calendar} />;
}
