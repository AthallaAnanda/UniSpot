import { NextRequest, NextResponse } from "next/server";
import { CatalogError } from "./catalog-store";

export function apiError(error: unknown) {
  if (error instanceof CatalogError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof SyntaxError) return NextResponse.json({ error: "Please send valid form data." }, { status: 400 });
  console.error("UniSpot API error", error);
  return NextResponse.json({ error: "We couldn’t save your changes. Please try again." }, { status: 500 });
}
export function checkOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) throw new CatalogError("This action must be made from UniSpot.", 403);
}
export async function readBody(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? "0") > 100_000) throw new CatalogError("This submission is too large.", 413);
  const value = await request.text();
  if (value.length > 100_000) throw new CatalogError("This submission is too large.", 413);
  return JSON.parse(value);
}
