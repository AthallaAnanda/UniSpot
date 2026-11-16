import { randomBytes, createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync(".local", { recursive: true, mode: 0o700 });
const filename = ".local/hub-accounts.json";
if (!existsSync(filename)) {
  const catalog = JSON.parse(readFileSync(process.argv[2] ?? "/tmp/opencode/unispot-catalog-export.json", "utf8"));
  const accounts = catalog.hubs.map(hub => ({ slug: hub.slug, name: hub.data.name, email: `${hub.slug}@hubs.unispot.test`, password: `${randomBytes(24).toString("base64url")}Aa1!` }));
  writeFileSync(filename, JSON.stringify(accounts, null, 2), { mode: 0o600, flag: "wx" });
}
const payload = readFileSync(filename, "utf8");
console.log(JSON.stringify({ filename, count: JSON.parse(payload).length, sha256: createHash("sha256").update(payload).digest("hex") }));
