import { readFileSync } from "node:fs";
import { join } from "node:path";

export function GET() {
  const logo = readFileSync(join(process.cwd(), "public/brand/unispot.svg"), "utf8")
    .replace('id="unispot-wordmark" fill="#151515"', 'id="unispot-wordmark" fill="#ffffff"')
    .replace("Wordmark berwarna gelap.", "Wordmark berwarna putih.");

  return new Response(logo, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
