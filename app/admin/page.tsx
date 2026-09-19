import { AdminTabs } from "@/components/admin-tabs";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fallbackProducts } from "@/lib/mock-data";
import type { Order, Product } from "@/lib/types";

export default async function AdminPage() {
  const viewer = await requireAdmin();
  const supabase = await createClient();
  let products: Product[] = fallbackProducts;
  let orders: Order[] = [];
  if (supabase) {
    const [{ data: productData }, { data: orderData }] = await Promise.all([
      supabase.from("products").select("id,name,slug,category,short_description,description,price_pkr,compare_at_price_pkr,condition,stock_qty,warranty,featured,published,images").order("created_at", { ascending: false }),
      supabase.from("orders").select("id,tracking_code,status,total_pkr,created_at,delivery_method").order("created_at", { ascending: false }).limit(100),
    ]);
    if (productData?.length) products = productData as Product[];
    orders = (orderData || []) as Order[];
  }
  const name = viewer.profile?.full_name || viewer.user.email?.split("@")[0] || "Admin";
  return <main className="portal-page"><AdminTabs adminName={name} products={products} orders={orders} /></main>;
}
