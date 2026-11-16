import { NextRequest, NextResponse } from "next/server";
import { saveOpportunity } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  try { checkOrigin(request); const { slug, id } = await params; return NextResponse.json({ opportunity: await saveOpportunity(slug, await readBody(request), id) }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
