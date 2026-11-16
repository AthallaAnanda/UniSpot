import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

const assets = join(process.cwd(), "public/assets/unispot");
const logos: Record<string, { file: string; type: string }> = {
  gdg: { file: "gdg.png", type: "image/png" },
  lpdp: { file: "lpdp.png", type: "image/png" },
  itb: { file: "itb.png", type: "image/png" },
  indorelawan: { file: "indorelawan.svg", type: "image/svg+xml" },
  kaggle: { file: "kaggle.png", type: "image/png" },
};

export function GET() {
  const template = readFileSync(join(assets, "landing/hub-network.svg"), "utf8");
  const svg = template.replace(/hub-logo:(gdg|lpdp|itb|indorelawan|kaggle)/g, (_, id: string) => {
    const logo = logos[id];
    const data = readFileSync(join(assets, "organizations", logo.file)).toString("base64");
    return `data:${logo.type};base64,${data}`;
  });

  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
