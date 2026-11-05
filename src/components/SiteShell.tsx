"use client";
import { useState } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigationMotion } from "./NavigationMotionProvider";

export default function SiteShell({ children, wide = false, className = "" }: { children: React.ReactNode; wide?: boolean; className?: string }) {
  const [about, setAbout] = useState(false);
  const router = useRouter();
  const navigation = useNavigationMotion();
  return <div className={`unispot-app ${className}`}>
    <a className="skip-content" href="#main-content">Skip to content</a>
    <div className="brand-atmosphere" aria-hidden="true" /><Header />
    <main key={navigation.pathname} id="main-content" data-motion-enter={navigation.enter ? "true" : undefined} className={`page-container${wide ? " wide-container" : ""}`}>
      {children}<Footer onAbout={() => setAbout(true)} onDiscover={() => router.push("/discover")} />
    </main>
    <Dialog.Root open={about} onOpenChange={setAbout}><Dialog.Portal><Dialog.Overlay className="detail-overlay about-overlay"><Dialog.Content className="about-panel">
      <Dialog.Close className="icon-button about-close" aria-label="Close about UniSpot"><X size={19} /></Dialog.Close>
      <img src="/brand/unispot.svg" alt="UniSpot" width={136} height={40} />
      <Dialog.Title>Your campus. Your communities. Your opportunities.</Dialog.Title>
      <Dialog.Description>UniSpot brings together events, scholarships, learning opportunities, and community calendars for students across Indonesia.</Dialog.Description>
      <div className="about-answer"><h3>Discover and explore</h3><p>Discover highlights what’s worth a look. Explore searches every published opportunity, including individual posts from community calendars.</p><h3>Community calendars</h3><p>Partners can create a calendar and publish their own opportunities. Curated calendars bring together information from official sources.</p><h3>Your collection</h3><p>Saved opportunities and followed calendars stay in this browser. Calendars and published posts are stored on UniSpot.</p></div>
      <Dialog.Close className="primary-button">Keep exploring</Dialog.Close>
    </Dialog.Content></Dialog.Overlay></Dialog.Portal></Dialog.Root>
  </div>;
}
