export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! }, cache: "no-store" });
    if (!response.ok) throw new Error("Provider settings unavailable");
    const data = await response.json();
    return Response.json({ google: data.external?.google === true, apple: data.external?.apple === true, x: data.external?.x === true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ google: false, apple: false, x: false }, { headers: { "Cache-Control": "no-store" } }); }
}
