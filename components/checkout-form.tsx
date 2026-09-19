"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/money";
import { useStore } from "./store-provider";

export function CheckoutForm() {
  const { cart, clearCart } = useStore();
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price_pkr * item.quantity, 0), [cart]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length) return;
    setStatus("Submitting your order…");
    const form = new FormData(event.currentTarget);
    const payload = {
      customer_name: String(form.get("customer_name") || ""),
      customer_phone: String(form.get("customer_phone") || ""),
      customer_email: String(form.get("customer_email") || ""),
      delivery_method: String(form.get("delivery_method") || "delivery"),
      shipping_address: String(form.get("shipping_address") || ""),
      notes: String(form.get("notes") || ""),
      items: cart.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
    };
    const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setStatus(data.error || "Could not submit the order."); return; }
    setTracking(data.tracking_code || "");
    setStatus("");
    clearCart();
  }

  if (tracking) return <div className="checkout-success"><div className="status-icon">✓</div><span className="eyebrow">Order received</span><h1>Thanks. Your order has been submitted.</h1><p>Keep this tracking code. The store will use it for order updates and stock confirmation.</p><div className="tracking-code-box">{tracking}</div><div className="hero-actions"><Link href={`/track?code=${encodeURIComponent(tracking)}`} className="primary-button">Track order</Link><Link href="/shop" className="secondary-button">Continue shopping</Link></div></div>;

  if (!cart.length) return <div className="empty-state large">Your cart is empty. <Link href="/shop">Browse products</Link> before checking out.</div>;

  return <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><span className="eyebrow">Checkout</span><h1>Order details</h1><div className="two-col"><label>Full name<input name="customer_name" required autoComplete="name"/></label><label>Phone number<input name="customer_phone" required autoComplete="tel"/></label></div><label>Email address<input name="customer_email" type="email" autoComplete="email"/></label><label>Delivery method<select name="delivery_method"><option value="delivery">Delivery across Pakistan</option><option value="pickup">Store pickup in Sialkot</option></select></label><label>Delivery address<textarea name="shipping_address" placeholder="Required for delivery orders"/></label><label>Order notes<textarea name="notes" placeholder="Optional: model, colour or delivery note"/></label><button className="primary-button wide">Place order</button>{status?<div className="form-message">{status}</div>:null}<p className="form-note">Submitting an order does not charge a card. The store confirms stock, delivery and payment details before dispatch.</p></form><aside className="checkout-summary"><span className="eyebrow">Your order</span><h2>{formatPKR(subtotal)}</h2>{cart.map(item=><div className="checkout-item" key={item.product.id}><span>{item.quantity} × {item.product.name}</span><b>{formatPKR(item.product.price_pkr*item.quantity)}</b></div>)}<div className="summary-row total"><span>Subtotal</span><b>{formatPKR(subtotal)}</b></div><p>Delivery charges, if any, are confirmed by the store.</p></aside></div>;
}
