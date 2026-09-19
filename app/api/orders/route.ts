import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Online orders are not connected yet. Please contact the store." }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || !body.items.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  const customerName = String(body.customer_name || "").trim();
  const customerPhone = String(body.customer_phone || "").trim();
  const customerEmail = String(body.customer_email || "").trim() || null;
  const deliveryMethod = body.delivery_method === "pickup" ? "pickup" : "delivery";
  const shippingAddress = String(body.shipping_address || "").trim() || null;
  const notes = String(body.notes || "").trim() || null;
  if (!customerName || !customerPhone) return NextResponse.json({ error: "Name and phone number are required." }, { status: 400 });
  if (deliveryMethod === "delivery" && !shippingAddress) return NextResponse.json({ error: "Delivery address is required for delivery orders." }, { status: 400 });

  const items = body.items.map((item: { product_id?: unknown; quantity?: unknown }) => ({
    product_id: String(item.product_id || ""),
    quantity: Math.max(1, Math.min(Number(item.quantity || 1), 20)),
  })).filter((item: { product_id: string }) => item.product_id && !item.product_id.startsWith("demo-"));
  if (items.length !== body.items.length) return NextResponse.json({ error: "Live inventory is required before this order can be submitted." }, { status: 400 });

  const { data, error } = await supabase.rpc("place_store_order", {
    p_customer_name: customerName,
    p_customer_phone: customerPhone,
    p_customer_email: customerEmail,
    p_delivery_method: deliveryMethod,
    p_shipping_address: shippingAddress,
    p_notes: notes,
    p_items: items,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.tracking_code) return NextResponse.json({ error: "Could not create order." }, { status: 400 });
  return NextResponse.json({ ok: true, tracking_code: result.tracking_code, total_pkr: result.total_pkr });
}
