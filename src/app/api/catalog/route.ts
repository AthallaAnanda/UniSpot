import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/server/catalog-store";
import { apiError, ownerToken } from "@/lib/server/api";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  try { return NextResponse.json(getCatalog(ownerToken(request)), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
