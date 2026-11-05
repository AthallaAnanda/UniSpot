import icons from "@/data/luma-component-icons.json";

export type LumaIconName = keyof typeof icons;
/** Static SVG paths extracted from the reference component DOM. */
export default function LumaIcon({ name, size = 16, className = "" }: { name: LumaIconName; size?: number; className?: string }) {
  return <span className={`luma-icon ${className}`} style={{ width: size, height: size }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] }} />;
}
