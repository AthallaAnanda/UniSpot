// Usage: node --env-file=.env.local scripts/invite-hub-owners.mjs /private/hub-owners.json
// Mapping format: { "hub-slug": "owner@example.com" }. Supply the admin key via
// SUPABASE_SECRET_KEY in your environment, never in Git or a NEXT_PUBLIC variable.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SECRET_KEY || !process.argv[2]) throw new Error("Provide SUPABASE_SECRET_KEY and the path to the owner-email mapping.");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const mapping = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) throw new Error("Expected a Hub-slug to owner-email mapping.");
// Validate the entire input before sending any invitations.
const hubs = [];
for (const [slug, email] of Object.entries(mapping)) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`A valid owner email is required for ${slug}.`);
  const { data, error } = await supabase.from("hubs").select("id,slug,organization_id,owner_id").eq("slug", slug).single();
  if (error) throw error;
  hubs.push({ ...data, email: email.toLowerCase() });
}
const users = [];
for (let page = 1; ; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) throw error;
  users.push(...data.users);
  if (data.users.length < 1000) break;
}
for (const hub of hubs) {
  let user = users.find(value => value.email?.toLowerCase() === hub.email);
  if (hub.owner_id && hub.owner_id !== user?.id) throw new Error(`${hub.slug} already has a different owner. Resolve ownership before continuing.`);
  if (!user) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(hub.email, { data: { full_name: hub.slug }, redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password` });
    if (error) throw error;
    user = data.user;
    users.push(user);
  }
  // Each update is retry-safe and refuses to overwrite an existing owner.
  for (const [table, id] of [["organizations", hub.organization_id], ["hubs", hub.id]]) {
    const { error } = await supabase.from(table).update({ owner_id: user.id }).eq("id", id).is("owner_id", null);
    if (error) throw error;
  }
  console.log(`${hub.slug}: owner assigned`);
}
