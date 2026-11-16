import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  redirect(`/hubs/${encodeURIComponent((await params).slug)}`);
}
