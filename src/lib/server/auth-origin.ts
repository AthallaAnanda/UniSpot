import "server-only";

export function authOrigin(request: Request) {
  const host = request.headers.get("host") ?? "";
  // Next's standalone server can expose 0.0.0.0 in Request.url locally.
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return `http://${host}`;
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return configured ? new URL(configured).origin : new URL(request.url).origin;
}
