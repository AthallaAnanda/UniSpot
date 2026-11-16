import { NextRequest, NextResponse } from "next/server";
import { saveOpportunity } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try { checkOrigin(request); return NextResponse.json({ opportunity: await saveOpportunity((await params).slug, await readBody(request)) }, { status: 201, headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
