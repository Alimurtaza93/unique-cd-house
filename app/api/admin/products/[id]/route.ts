import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedCategories = new Set(["Consoles", "Games", "Controllers", "Gaming Devices", "PC Gaming", "Accessories", "Used"]);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not connected." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = await request.json();
  const category = allowedCategories.has(String(body.category)) ? String(body.category) : "Accessories";
  const compare = body.compare_at_price_pkr === null || body.compare_at_price_pkr === "" ? null : Number(body.compare_at_price_pkr);
  const payload = {
    name: String(body.name || "").trim(),
    category,
    price_pkr: Number(body.price_pkr || 0),
    compare_at_price_pkr: compare,
    stock_qty: Number(body.stock_qty || 0),
    condition: String(body.condition || "New").trim(),
    warranty: String(body.warranty || "").trim() || null,
    short_description: String(body.short_description || "").trim(),
    description: String(body.description || "").trim(),
    images: Array.isArray(body.images) ? body.images.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 5) : [],
    featured: Boolean(body.featured),
    published: Boolean(body.published),
    updated_at: new Date().toISOString(),
  };
  if (!payload.name || payload.price_pkr < 0 || payload.stock_qty < 0 || (compare !== null && compare < 0)) return NextResponse.json({ error: "Check the product fields." }, { status: 400 });
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: data.id });
}
