import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginUrl } from "@/lib/auth";

export async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requirePageUser(next: string) {
  const user = await currentUser();
  if (!user) redirect(loginUrl(next));
  return user;
}
