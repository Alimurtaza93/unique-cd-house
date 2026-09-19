import { createClient } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/money";

type TrackingOrder = { tracking_code: string; status: string; total_pkr: number; delivery_method: string; created_at: string };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const supabase = await createClient();
  let order: TrackingOrder | null = null;
  if (code && supabase) {
    const { data } = await supabase.rpc("track_store_order", { p_tracking_code: code.trim().toUpperCase() });
    const row = Array.isArray(data) ? data[0] : data;
    if (row) order = row as TrackingOrder;
  }
  return <main className="track-page"><div className="track-card"><span className="eyebrow">Order tracking</span><h1>Track your gaming order</h1><p>Enter the tracking ID you received after placing your order.</p><form><input name="code" defaultValue={code || ""} placeholder="Example: UCD-20260919-ABC123" required /><button className="primary-button">Track order</button></form>{code && !order ? <div className="form-message">No order was found for that tracking ID.</div> : null}{order ? <div className="tracking-result"><div><small>Tracking ID</small><strong>{order.tracking_code}</strong></div><div><small>Status</small><strong>{order.status.replaceAll("_", " ")}</strong></div><div><small>Total</small><strong>{formatPKR(order.total_pkr)}</strong></div><div><small>Delivery</small><strong>{order.delivery_method}</strong></div></div> : null}</div></main>;
}
