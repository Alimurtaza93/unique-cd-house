import { AccountTabs } from "@/components/account-tabs";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export default async function AccountPage() {
  const viewer = await requireViewer();
  if (viewer.profile?.role === "admin") {
    const { redirect } = await import("next/navigation");
    redirect("/admin");
  }
  const supabase = await createClient();
  let orders: Order[] = [];
  if (supabase) {
    const { data } = await supabase.from("orders").select("id,tracking_code,status,total_pkr,created_at,delivery_method").eq("user_id", viewer.user.id).order("created_at", { ascending: false });
    orders = (data || []) as Order[];
  }
  return <main className="portal-page"><AccountTabs profile={viewer.profile} email={viewer.user.email || ""} orders={orders} /></main>;
}
