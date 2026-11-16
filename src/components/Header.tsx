"use client";
import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Search, Plus, UserRound, ChevronDown, UsersRound, LogOut } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useAuth } from "./AuthProvider";
import { loginUrl } from "@/lib/auth";
import { useCatalog } from "./CatalogProvider";
import ProfileAvatar from "./ProfileAvatar";
import LumaIcon from "./LumaIcon";
import "./Header.css";

export default memo(function Header() {
  const pathname = usePathname();
  const { saved, notify } = useCatalog();
  const { user, profile, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><nav className="header-inner" aria-label="Main navigation"><Link href="/" className="brand" aria-label="UniSpot home"><img className="brand-wordmark" src="/brand/unispot.svg" alt="UniSpot" width={96} height={28} /><img className="brand-symbol" src="/brand/unispot-icon.svg" alt="UniSpot" width={30} height={30} /></Link><div className="header-navigation">{[{ href: "/discover", label: "Discover", icon: <LumaIcon name="Compass" /> }, { href: "/explore", label: "Explore", icon: <Search size={16} /> }, { href: "/hubs", label: "Hubs", icon: <UsersRound size={16} /> }].map(item => {
    const active = pathname === item.href || (item.href === "/hubs" && pathname.startsWith("/hubs/")) || (item.href === "/discover" && pathname === "/");
    return <Link href={item.href} key={item.href} className={`nav-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>{item.icon}<span>{item.label}</span></Link>;
  })}</div><div className="header-actions"><Link href="/saved" className={`header-saved${pathname === "/saved" ? " active" : ""}`} aria-label={`Saved opportunities${saved.length ? ` (${saved.length})` : ""}`}><Bookmark size={16} /><span>Saved</span>{saved.length > 0 && <small key={saved.length}>{saved.length}</small>}</Link><Link className="header-create" href="/create"><Plus size={14} /><span>Create</span></Link>
    {loading ? <span className="header-auth-loading" aria-label="Loading account" /> : !user ? <div className="header-auth-links"><Link className="header-login" href={loginUrl(pathname)}>Log in</Link><Link className="header-signup" href="/signup">Sign up</Link></div> : <DropdownMenu.Root>
      <DropdownMenu.Trigger className={`header-account${pathname === "/account" ? " active" : ""}`} aria-label="Account menu"><ProfileAvatar name={profile.name} /><ChevronDown className="header-account-chevron" size={12} /></DropdownMenu.Trigger>
      <DropdownMenu.Portal><DropdownMenu.Content className="header-account-menu" align="end" sideOffset={10} collisionPadding={12}>
        <div className="header-account-identity"><ProfileAvatar name={profile.name} /><div><strong>{profile.name || "Your account"}</strong><span>{user.email || profile.role}</span></div></div>
        <DropdownMenu.Separator className="header-account-separator" />
        <DropdownMenu.Item asChild><Link href="/account" className="header-account-menu-item"><UserRound size={16} />My profile</Link></DropdownMenu.Item>
        <DropdownMenu.Item asChild><Link href="/saved" className="header-account-menu-item"><Bookmark size={16} />Saved opportunities{saved.length > 0 && <small>{saved.length}</small>}</Link></DropdownMenu.Item>
        <DropdownMenu.Separator className="header-account-separator" />
        <DropdownMenu.Item asChild><Link href="/create" className="header-account-menu-item"><Plus size={16} />Create opportunity</Link></DropdownMenu.Item>
        <DropdownMenu.Item asChild><Link href="/hubs/new" className="header-account-menu-item"><UsersRound size={16} />Create a Hub</Link></DropdownMenu.Item>
        <DropdownMenu.Separator className="header-account-separator" />
        <DropdownMenu.Item className="header-account-menu-item" onSelect={() => { void signOut().catch(() => notify("Couldn’t log out. Please try again.")); }}><LogOut size={16} />Log out</DropdownMenu.Item>
      </DropdownMenu.Content></DropdownMenu.Portal>
    </DropdownMenu.Root>}
  </div></nav></header>;
});
