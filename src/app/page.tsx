import type { Metadata } from "next";
import DiscoverPage from "@/components/DiscoverPage";

export const metadata: Metadata = {
  title: "Find your next opportunity · UniSpot",
  alternates: { canonical: "/" },
};

export default function Page() {
  // The root rewrite serves the preserved Ugency template document.
  return <DiscoverPage />;
}
