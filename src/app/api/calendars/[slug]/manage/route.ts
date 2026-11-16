import { NextRequest, NextResponse } from "next/server";
import { managedOpportunities } from "@/lib/server/catalog-store";
import { apiError } from "@/lib/server/api";
export const runtime = "nodejs";
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try { return NextResponse.json(await managedOpportunities((await params).slug), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
