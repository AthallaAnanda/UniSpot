import { NextRequest, NextResponse } from "next/server";
import { saveOpportunity } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, ownerToken, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try { checkOrigin(request); return NextResponse.json({ opportunity: saveOpportunity((await params).slug, await readBody(request), ownerToken(request)) }, { status: 201 }); }
  catch (error) { return apiError(error); }
}
