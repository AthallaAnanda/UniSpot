import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CatalogProvider } from "@/components/CatalogProvider";
import NavigationMotionProvider from "@/components/NavigationMotionProvider";
const inter = localFont({ src: "../../public/fonts/inter-variable.woff2", weight: "100 900", style: "normal", variable: "--font-inter", display: "swap", adjustFontFallback: false });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Discover your next opportunity · UniSpot",
  description: "Discover events, scholarships, learning opportunities, and communities for students across Indonesia. Find your people. Find your possibilities.",
  icons: { icon: { url: "/brand/unispot-icon.svg", type: "image/svg+xml" }, apple: "/brand/unispot-icon.svg" },
  openGraph: { title: "Find your next opportunity · UniSpot", description: "Your next chapter starts with showing up. Explore opportunities for students across Indonesia.", images: ["/brand/unispot.svg"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body><NavigationMotionProvider><CatalogProvider>{children}</CatalogProvider></NavigationMotionProvider></body></html>;
}
