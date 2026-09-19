import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedCategories = new Set(["Consoles", "Games", "Controllers", "Gaming Devices", "PC Gaming", "Accessories", "Used"]);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not connected." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = await request.json();
  const name = String(body.name || "").trim();
  const category = allowedCategories.has(String(body.category)) ? String(body.category) : "Accessories";
  const price = Number(body.price_pkr || 0);
  const stock = Number(body.stock_qty || 0);
  if (!name || price < 0 || stock < 0) return NextResponse.json({ error: "Name, price and stock are required." }, { status: 400 });
  let slug = slugify(name);
  const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;
  const compare = body.compare_at_price_pkr === null || body.compare_at_price_pkr === "" ? null : Number(body.compare_at_price_pkr);
  const payload = {
    name,
    slug,
    category,
    short_description: String(body.short_description || "").trim(),
    description: String(body.description || "").trim(),
    price_pkr: price,
    compare_at_price_pkr: compare,
    condition: String(body.condition || "New").trim(),
    stock_qty: stock,
    warranty: String(body.warranty || "").trim() || null,
    images: Array.isArray(body.images) ? body.images.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 5) : [],
    featured: Boolean(body.featured),
    published: Boolean(body.published),
  };
  const { data, error } = await supabase.from("products").insert(payload).select("id,slug").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, ...data });
}
