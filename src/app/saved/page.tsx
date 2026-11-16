import type { Metadata } from "next";
import ExplorePage from "@/components/ExplorePage";
import { requirePageUser } from "@/lib/server/auth";
export const metadata: Metadata = { title: "Saved opportunities · UniSpot" };
export default async function Page() { await requirePageUser("/saved"); return <ExplorePage savedOnly />; }
