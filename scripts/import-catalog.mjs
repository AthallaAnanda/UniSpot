// Administrative import for future environments. Never ship a secret key to a
// browser or commit it to Git. The initial hosted import was fingerprint-pinned.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SECRET_KEY) throw new Error("Set SUPABASE_SECRET_KEY in your local environment for an administrative import.");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const catalog = JSON.parse(readFileSync(process.argv[2] ?? "/tmp/opencode/unispot-catalog-export.json", "utf8"));
for (const table of ["organizations", "hubs", "opportunities"]) {
  const { error } = await supabase.from(table).upsert(catalog[table], { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
  console.log(`${table}: ${catalog[table].length} records imported or already present`);
}
