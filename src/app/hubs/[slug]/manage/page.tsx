import { notFound } from "next/navigation";
import ManageCalendar from "@/components/ManageCalendar";
import { getCalendar } from "@/lib/server/catalog-store";
import { requirePageUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Hub · UniSpot" };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requirePageUser(`/hubs/${encodeURIComponent(slug)}/manage`);
  const hub = await getCalendar(slug, user.id);
  if (!hub) notFound();
  if (!hub.canManage) return <main className="empty-state"><h1>Only this Hub’s owner can manage it.</h1><a href={`/hubs/${encodeURIComponent(slug)}`}>View public Hub</a></main>;
  return <ManageCalendar key={hub.id} initialCalendar={hub} />;
}
