"use client";

import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useDialogFocusReturn } from "@/hooks/useDialogFocusReturn";

export default function PublishingDialog({ open, onOpenChange, title, description, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const focusReturn = useDialogFocusReturn();
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal>
    <Dialog.Overlay className="publishing-dialog-overlay" />
    <Dialog.Content className="publishing-dialog" {...focusReturn}>
      <div className="publishing-dialog-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close aria-label={`Close ${title.toLowerCase()}`} className="publishing-dialog-close"><X size={18} /></Dialog.Close></div>
      <Dialog.Description>{description}</Dialog.Description>
      {children}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
