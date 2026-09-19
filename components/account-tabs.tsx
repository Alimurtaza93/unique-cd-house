"use client";

import { useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatPKR } from "@/lib/money";
import { LogoutButton } from "./logout-button";

type Profile = { full_name?: string | null; phone?: string | null; role?: string | null };

export function AccountTabs({ profile, email, orders }: { profile: Profile | null; email: string; orders: Order[] }) {
  const [tab, setTab] = useState("account");
  const tabs = [["account", "My Account"], ["orders", "Order History"], ["saved", "Saved Gear"], ["support", "Support"]];
  return <div className="portal-shell"><aside className="portal-nav"><div className="portal-person"><span>Customer</span><strong>{profile?.full_name || email}</strong></div>{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={tab===id?"active":""}>{label}</button>)}<LogoutButton/></aside><section className="portal-panel">
    {tab==="account"&&<div className="panel-block"><span className="eyebrow">My account</span><h1>Welcome, {profile?.full_name||"gamer"}</h1><div className="detail-grid"><div><small>Email</small><strong>{email}</strong></div><div><small>Phone</small><strong>{profile?.phone||"Not added"}</strong></div></div></div>}
    {tab==="orders"&&<div className="panel-block"><span className="eyebrow">History</span><h1>Your orders</h1>{orders.length?<div className="order-list">{orders.map(order=><div className="order-row" key={order.id}><div><small>{new Date(order.created_at).toLocaleDateString("en-PK")}</small><strong>{order.tracking_code}</strong></div><span>{order.status}</span><b>{formatPKR(order.total_pkr)}</b></div>)}</div>:<p className="empty-state">No orders yet. Your submitted orders will appear here automatically.</p>}</div>}
    {tab==="saved"&&<div className="panel-block"><span className="eyebrow">Gaming gear</span><h1>Saved & compared products</h1><div className="account-action-grid"><Link href="/wishlist"><strong>Wishlist</strong><span>Open saved gaming products →</span></Link><Link href="/compare"><strong>Compare</strong><span>Compare up to three products →</span></Link></div></div>}
    {tab==="support"&&<div className="panel-block"><span className="eyebrow">Customer care</span><h1>Need help with your gaming order?</h1><p>Use your tracking code when contacting the store so your order can be found quickly.</p><Link className="primary-button inline" href="/track">Track an order</Link></div>}
  </section></div>;
}
