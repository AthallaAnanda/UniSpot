"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const NavigationMotionContext = createContext({ pathname: "", enter: false });

export default function NavigationMotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const [route, setRoute] = useState({ pathname, enter: false });
  // Adjust during this provider's render so the newly mounted main gets the right
  // state before paint. Query-only changes never change this path or restart motion.
  if (route.pathname !== pathname) setRoute({ pathname, enter: Boolean(route.pathname) });
  const value = useMemo(() => route, [route]);
  return <NavigationMotionContext.Provider value={value}>{children}</NavigationMotionContext.Provider>;
}

export function useNavigationMotion() { return useContext(NavigationMotionContext); }
