"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Search, Plus } from "lucide-react";
import { useCatalog } from "./CatalogProvider";
import LumaIcon from "./LumaIcon";
import "./Header.css";

export default function Header() {
  const pathname = usePathname();
  const { saved } = useCatalog();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><nav className="header-inner" aria-label="Main navigation"><Link href="/discover" className="brand" aria-label="UniSpot home"><img className="brand-wordmark" src="/brand/unispot.svg" alt="UniSpot" width={96} height={28} /><img className="brand-symbol" src="/brand/unispot-icon.svg" alt="UniSpot" width={30} height={30} /></Link><div className="header-navigation">{[{ href: "/discover", label: "Discover", icon: <LumaIcon name="Compass" /> }, { href: "/explore", label: "Explore", icon: <Search size={16} /> }, { href: "/calendars", label: "Calendars", icon: <LumaIcon name="Calendar" /> }].map(item => {
    const active = pathname === item.href || (item.href === "/calendars" && pathname.startsWith("/calendars/")) || (item.href === "/discover" && pathname === "/");
    return <Link href={item.href} key={item.href} className={`nav-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>{item.icon}<span>{item.label}</span></Link>;
  })}</div><div className="header-actions"><Link href="/saved" className={`header-saved${pathname === "/saved" ? " active" : ""}`} aria-label={`Saved opportunities${saved.length ? ` (${saved.length})` : ""}`}><Bookmark size={16} /><span>Saved</span>{saved.length > 0 && <small>{saved.length}</small>}</Link><Link className="header-create" href="/calendars/new"><Plus size={14} /><span>Create calendar</span></Link></div></nav></header>;
}
