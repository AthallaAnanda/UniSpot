"use client";

import { useCallback, useRef } from "react";

// These dialogs can be opened by several independent controls rather than a
// Radix Trigger. Remember the actual opener, including through exit motion.
export function useDialogFocusReturn() {
  const opener = useRef<HTMLElement | null>(null);
  const onOpenAutoFocus = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);
  const onCloseAutoFocus = useCallback((event: Event) => {
    if (!opener.current?.isConnected) return;
    event.preventDefault();
    opener.current.focus({ preventScroll: true });
  }, []);
  return { onOpenAutoFocus, onCloseAutoFocus };
}
