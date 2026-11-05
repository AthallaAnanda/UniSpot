"use client";

import { useEffect, useId, useState } from "react";
import { ImagePlus } from "lucide-react";
import PublishingDialog from "./PublishingDialog";

function previewUrl(value: string) {
  try { const url = new URL(value.trim()); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

export default function PublishingImagePicker({ value, onChange, label, className = "", children }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [failedImage, setFailedImage] = useState("");
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!open) return;
    // Avoid starting (and canceling) an image request for every URL keystroke.
    const timer = setTimeout(() => setPreview(previewUrl(draft)), 250);
    return () => clearTimeout(timer);
  }, [draft, open]);
  return <>
    <button type="button" className={className || "publishing-image-button"} onClick={() => { setDraft(value); setPreview(previewUrl(value)); setFailedImage(""); setOpen(true); }} aria-label={label}>{children || <><ImagePlus size={15} />{label}</>}</button>
    <PublishingDialog open={open} onOpenChange={setOpen} title={label} description="Use a direct link to an image for your community.">
      <form onSubmit={event => { event.preventDefault(); event.stopPropagation(); onChange(draft.trim()); setOpen(false); }}>
        <div className="publishing-image-preview">{preview && failedImage !== preview ? <img src={preview} alt="Image preview" decoding="async" onError={() => setFailedImage(preview)} /> : <><ImagePlus size={28} strokeWidth={1.4} /><span>{preview && failedImage === preview ? "Couldn’t load this image. Check the link." : "Your image preview"}</span></>}</div>
        <div className="publishing-field"><label htmlFor={id}>Image URL</label><input id={id} type="url" pattern="https?://.*" maxLength={2000} placeholder="https://example.com/image.jpg" value={draft} onChange={event => setDraft(event.target.value)} /></div>
        <div className="publishing-dialog-actions"><button type="button" className="publishing-text-button" onClick={() => { onChange(""); setOpen(false); }} disabled={!value}>Remove image</button><button type="submit" className="publishing-primary">Use image</button></div>
      </form>
    </PublishingDialog>
  </>;
}
