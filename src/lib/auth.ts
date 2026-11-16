// Only same-origin relative destinations; also reject backslashes and controls.
export function safeNext(value: string | null | undefined, fallback = "/discover") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f\x7f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://unispot.invalid");
    if (url.origin !== "https://unispot.invalid" || /^\/(?:login|signup|auth)(?:\/|$)/.test(url.pathname)) return fallback;
    return url.pathname + url.search + url.hash;
  } catch { return fallback; }
}

export function loginUrl(next: string) { return `/login?next=${encodeURIComponent(safeNext(next))}`; }
