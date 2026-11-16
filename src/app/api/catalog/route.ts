import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/server/catalog-store";
import { apiError } from "@/lib/server/api";
import { currentUser } from "@/lib/server/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: NextRequest) {
  try { return NextResponse.json(await getCatalog((await currentUser())?.id), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
