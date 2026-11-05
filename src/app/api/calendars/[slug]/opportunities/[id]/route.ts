import { NextRequest, NextResponse } from "next/server";
import { saveOpportunity } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, ownerToken, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  try { checkOrigin(request); const { slug, id } = await params; return NextResponse.json({ opportunity: saveOpportunity(slug, await readBody(request), ownerToken(request), id) }); }
  catch (error) { return apiError(error); }
}
