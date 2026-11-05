import type { Metadata } from "next";
import ExplorePage from "@/components/ExplorePage";
export const metadata: Metadata = { title: "Saved opportunities · UniSpot" };
export default function Page() { return <ExplorePage savedOnly />; }
