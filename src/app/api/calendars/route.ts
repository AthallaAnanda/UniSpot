import { NextRequest, NextResponse } from "next/server";
import { createCalendar } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    checkOrigin(request);
    const calendar = await createCalendar(await readBody(request));
    return NextResponse.json({ calendar }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
