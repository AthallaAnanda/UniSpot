import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { createClient } from "@supabase/supabase-js";

const source = JSON.parse(readFileSync(process.argv[2] ?? "/tmp/opencode/unispot-catalog-export.json", "utf8"));
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
for (const table of ["organizations", "hubs", "opportunities"]) {
  const { data, error } = await supabase.from(table).select("id,data");
  if (error) throw error;
  const expected = source[table].filter(row => table !== "opportunities" || row.status === "published");
  if (data.length !== expected.length) throw new Error(`${table}: count mismatch`);
  for (const row of expected) {
    if (!isDeepStrictEqual(row.data, data.find(record => record.id === row.id)?.data)) throw new Error(`${table}: content mismatch for ${row.id}`);
  }
  console.log(`${table}: ${data.length} records match the export exactly`);
}
