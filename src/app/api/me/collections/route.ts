import { NextRequest, NextResponse } from "next/server";
import { apiError, checkOrigin, readBody } from "@/lib/server/api";
import { CatalogError, requireApiUser } from "@/lib/server/catalog-store";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    checkOrigin(request);
    const user = await requireApiUser();
    const input = await readBody(request);
    if (!input || !["saved", "followed"].includes(input.kind) || typeof input.id !== "string" || input.id.length > 200 || typeof input.active !== "boolean") throw new CatalogError("Please provide a valid collection item.");
    const supabase = await createClient();
    const table = input.kind === "saved" ? "saved_opportunities" : "hub_follows";
    const column = input.kind === "saved" ? "opportunity_id" : "hub_id";
    const row = { user_id: user.id, [column]: input.id };
    // Explicit desired state makes retries safe; RLS checks identity and visibility.
    const { error } = input.active ? await supabase.from(table).upsert(row, { onConflict: `user_id,${column}`, ignoreDuplicates: true }) : await supabase.from(table).delete().match(row);
    if (error) throw new CatalogError("Couldn’t update your collection. Please try again.", error.code === "42501" ? 403 : 400);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
