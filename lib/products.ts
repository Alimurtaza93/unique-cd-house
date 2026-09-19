import { createClient } from "@/lib/supabase/server";
import { fallbackProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

export const productSelect = "id,name,slug,category,short_description,description,price_pkr,compare_at_price_pkr,condition,stock_qty,warranty,featured,published,images";

export async function loadPublishedProducts(limit = 60): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackProducts;
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return fallbackProducts;
  return data as Product[];
}

export async function getPublishedProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("products").select(productSelect).eq("slug", slug).eq("published", true).maybeSingle();
    if (data) return data as Product;
  }
  return fallbackProducts.find((p) => p.slug === slug) || null;
}
