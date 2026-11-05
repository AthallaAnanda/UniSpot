"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

export default function MotionToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const [displayed, setDisplayed] = useState(message);
  // Keep the last message through exit, but replace it immediately on a new notification.
  if (message && message !== displayed) setDisplayed(message);
  if (!displayed) return null;
  return <div className="app-toast" role="status" data-state={message ? "open" : "closed"} aria-hidden={message ? undefined : true} inert={!message} onAnimationEnd={event => {
    if (event.target === event.currentTarget && event.animationName === "motion-toast-out" && !message) setDisplayed("");
  }}><Check size={16} aria-hidden="true" /><span>{displayed}</span><button type="button" aria-label="Dismiss notification" onClick={onDismiss}><X size={14} /></button></div>;
}
