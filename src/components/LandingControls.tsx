"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Pause, Play, X } from "lucide-react";
import landingMedia from "@/data/landing-media.json";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Opportunities", href: "/explore" },
  { label: "Hubs", href: "/hubs" },
];

export function LandingNavigation() {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.current?.open) return;
      menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const close = () => { if (menu.current) menu.current.open = false; };
  return <header className="lp-header"><div className="lp-header-inner"><Link href="/" className="lp-brand" aria-label="UniSpot home" prefetch={false}><img src="/brand/unispot.svg" alt="UniSpot" width={124} height={37} fetchPriority="high" /></Link><details className="lp-menu" ref={menu}><summary><span className="lp-menu-dots" aria-hidden="true">⠿</span><span className="lp-menu-label">Menu</span><X className="lp-menu-close-icon" size={17} aria-hidden="true" /></summary><button className="lp-menu-backdrop" type="button" onClick={close} aria-label="Close navigation" tabIndex={-1} /><nav className="lp-menu-panel" aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} prefetch={false} onClick={close}>{item.label}<ArrowRight size={23} strokeWidth={1.5} aria-hidden="true" /></Link>)}<p>Find your next opportunity.</p><Link href="/hubs/new" prefetch={false} className="lp-menu-create" onClick={close}>Create a Hub<ArrowRight size={18} aria-hidden="true" /></Link></nav></details><Link href="/explore" className="lp-nav-explore" prefetch={false}><span><img src="/brand/unispot-icon.svg" alt="" width={22} height={22} /></span>Explore</Link></div></header>;
}

const stories = landingMedia.stories;

export function LandingStories() {
  const container = useRef<HTMLDivElement>(null);
  // The server and first client render both show posters. Playback is progressive
  // enhancement, so reduced motion or a delayed script never hides the hero.
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlaying(!preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    container.current?.querySelectorAll("video").forEach(video => {
      if (playing) { video.muted = true; void video.play().catch(() => {}); }
      else video.pause();
    });
  }, [playing]);
  return <div className="lp-stories" ref={container}><div className="lp-story-track">{stories.map(story => <figure key={story.label} className="lp-story"><video src={story.src} poster={story.poster} width={480} height={660} muted loop playsInline preload="none" aria-label={`${story.label}: ${story.description}`} /><figcaption>{story.label}</figcaption></figure>)}</div><button className="lp-video-toggle" type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause hero videos" : "Play hero videos"}>{playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}<span>{playing ? "Pause" : "Play"}</span></button></div>;
}

const paths = {
  students: [
    { title: "Discover", description: "Find opportunities that fit your interests", word: "Find", features: ["Browse events, scholarships, and programs", "Filter by category and location", "Save opportunities to revisit", "Follow Hubs that interest you", "Check details and deadlines"], href: "/explore", action: "Explore opportunities" },
    { title: "Save", description: "Keep the next steps in one place", word: "Keep", features: ["Explore opportunities from Hubs", "See dates, formats, and locations", "Save the opportunities you like", "Follow communities and organizers", "Open the original source when ready"], href: "/saved", action: "View saved" },
    { title: "Follow", description: "Start with the opportunity that feels right", word: "Connect", features: ["Explore curated opportunities", "Browse local and international options", "Keep your saved list close", "Discover a new path forward", "Explore UniSpot today"], href: "/hubs", action: "Explore Hubs" },
  ],
  organizers: [
    { title: "Create", description: "Make a home for your community", word: "Create", features: ["Create a Hub for your opportunities", "Add your logo, cover, and links", "Share your Hub with students", "Publish opportunities in one place", "Manage drafts and published posts"], href: "/hubs/new", action: "Create a Hub" },
    { title: "Publish", description: "Keep your community’s updates together", word: "Publish", features: ["Add events, programs, and deadlines", "Publish details and official links", "Keep drafts private until ready", "Edit and update your opportunities", "Share a public Hub page"], href: "/create", action: "Add an opportunity" },
    { title: "Share", description: "Bring your next opportunity to UniSpot", word: "Share", features: ["Create a community Hub", "Add opportunities when they are ready", "Keep your page details up to date", "Share your Hub with students", "Publish through your Hub"], href: "/hubs", action: "Explore Hubs" },
  ],
};
type Audience = keyof typeof paths;

export function LandingPaths() {
  const [audience, setAudience] = useState<Audience>("students");
  const tabs = useRef<HTMLDivElement>(null);
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "students" : event.key === "End" ? "organizers" : audience === "students" ? "organizers" : "students";
    setAudience(next);
    tabs.current?.querySelector<HTMLButtonElement>(`#landing-tab-${next}`)?.focus();
  };
  return <div><div className="lp-path-tabs" role="tablist" aria-label="Choose your path" ref={tabs}>{(["students", "organizers"] as const).map(role => <button type="button" key={role} role="tab" id={`landing-tab-${role}`} aria-controls={`landing-panel-${role}`} aria-selected={audience === role} tabIndex={audience === role ? 0 : -1} onClick={() => setAudience(role)} onKeyDown={onKeyDown}>{role === "students" ? "Students" : "Organizers"}</button>)}</div>{(["students", "organizers"] as const).map(role => <div className="lp-path-grid" role="tabpanel" key={role} id={`landing-panel-${role}`} aria-labelledby={`landing-tab-${role}`} hidden={audience !== role} tabIndex={0}>{paths[role].map((path, index) => <article className={`lp-path-card${index === 1 ? " lp-path-highlight" : ""}`} key={path.title}>{index === 1 && <span className="lp-path-badge">{role === "students" ? "A quick start" : "Bring it to life"}</span>}<h3>{path.title}</h3><p>{path.description}</p><div className="lp-path-word"><strong>{path.word}</strong><span>on UniSpot</span></div><ul>{path.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul><Link href={path.href} prefetch={false} className="lp-button"><span className="lp-button-icon"><ArrowRight size={20} aria-hidden="true" /></span><span>{path.action}</span></Link></article>)}</div>)}</div>;
}
