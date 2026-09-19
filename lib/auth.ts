import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getViewer() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile };
}

export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();
  if (viewer.profile?.role !== "admin") redirect("/account");
  return viewer;
}
