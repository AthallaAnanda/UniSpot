import { NextRequest, NextResponse } from "next/server";
import { createCalendar, newOwnerToken, ownerCookie } from "@/lib/server/catalog-store";
import { apiError, checkOrigin, ownerToken, readBody } from "@/lib/server/api";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    checkOrigin(request);
    const token = ownerToken(request) || newOwnerToken();
    const calendar = createCalendar(await readBody(request), token);
    const response = NextResponse.json({ calendar }, { status: 201 });
    response.cookies.set(ownerCookie, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) { return apiError(error); }
}
