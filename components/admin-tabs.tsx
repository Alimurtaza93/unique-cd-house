"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./logout-button";
import type { Order, Product } from "@/lib/types";
import { formatPKR } from "@/lib/money";

const categories = ["Consoles", "Games", "Controllers", "Gaming Devices", "PC Gaming", "Accessories", "Used"];
const conditions = ["New", "Used", "Open Box", "Refurbished"];

function formPayload(form: FormData) {
  return {
    name: String(form.get("name") || ""),
    category: String(form.get("category") || "Accessories"),
    price_pkr: Number(form.get("price_pkr") || 0),
    compare_at_price_pkr: form.get("compare_at_price_pkr") ? Number(form.get("compare_at_price_pkr")) : null,
    stock_qty: Number(form.get("stock_qty") || 0),
    condition: String(form.get("condition") || "New"),
    warranty: String(form.get("warranty") || ""),
    short_description: String(form.get("short_description") || ""),
    description: String(form.get("description") || ""),
    images: String(form.get("images") || "").split(/\r?\n/).map((v) => v.trim()).filter(Boolean),
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
  };
}

export function AdminTabs({ adminName, products, orders }: { adminName: string; products: Product[]; orders: Order[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const [selected, setSelected] = useState<Product | null>(products[0] || null);
  const [notice, setNotice] = useState("");
  const lowStock = useMemo(() => products.filter(p => p.stock_qty <= 3).length, [products]);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setNotice("Saving…");
    const payload = formPayload(new FormData(event.currentTarget));
    const res = await fetch(`/api/admin/products/${selected.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    setNotice(res.ok ? "Saved successfully." : data.error || "Could not save.");
    if (res.ok) router.refresh();
  }

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Adding product…");
    const form = event.currentTarget;
    const payload = formPayload(new FormData(form));
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setNotice("Product added successfully.");
      form.reset();
      router.refresh();
      setTimeout(() => window.location.reload(), 350);
    } else setNotice(data.error || "Could not add product.");
  }

  const menu = [
    ["dashboard", "Dashboard"],
    ["orders", "Orders"],
    ["add", "Add Product"],
    ["products", "Product Management"],
    ["content", "Store Content"],
    ["policies", "Policies"],
    ["account", "My Account"]
  ];

  return (
    <div className="portal-shell admin-shell">
      <aside className="portal-nav">
        <div className="portal-person"><span>Administrator</span><strong>{adminName}</strong></div>
        {menu.map(([id, label]) => <button key={id} onClick={() => { setTab(id); setNotice(""); }} className={tab === id ? "active" : ""}>{label}</button>)}
        <LogoutButton />
      </aside>
      <section className="portal-panel">
        {tab === "dashboard" && <div className="panel-block"><span className="eyebrow">Administration</span><h1>Gaming store dashboard</h1><p className="section-intro">Manage inventory, gaming products and customer orders from one place.</p><div className="stat-grid"><div><small>Products</small><strong>{products.length}</strong></div><div><small>Orders</small><strong>{orders.length}</strong></div><div><small>Low stock</small><strong>{lowStock}</strong></div><div><small>Published</small><strong>{products.filter(p => p.published).length}</strong></div></div></div>}
        {tab === "orders" && <div className="panel-block"><span className="eyebrow">Orders</span><h1>Order history</h1>{orders.length ? <div className="order-list">{orders.map(o => <div className="order-row" key={o.id}><div><small>{new Date(o.created_at).toLocaleDateString("en-PK")}</small><strong>{o.tracking_code}</strong></div><span>{o.status}</span><b>{formatPKR(o.total_pkr)}</b></div>)}</div> : <p className="empty-state">No orders yet.</p>}</div>}
        {tab === "add" && <div className="panel-block"><span className="eyebrow">Inventory</span><h1>Add gaming product</h1><p className="section-intro">Add consoles, games, controllers, accessories or PC gaming gear. Brand management and dental-style variants are intentionally not part of this store.</p><ProductForm mode="add" onSubmit={addProduct}/>{notice ? <div className="form-message">{notice}</div> : null}</div>}
        {tab === "products" && <div className="panel-block"><span className="eyebrow">Inventory</span><h1>Product management</h1><p className="section-intro">Manage gaming categories, sale pricing, stock, condition, warranty, images and storefront visibility.</p><div className="admin-products"><div className="product-picker">{products.map(p => <button key={p.id} className={selected?.id === p.id ? "active" : ""} onClick={() => { setSelected(p); setNotice(""); }}><strong>{p.name}</strong><small>{p.category} · {p.stock_qty} in stock</small></button>)}</div>{selected ? <><ProductForm mode="edit" product={selected} onSubmit={saveProduct}/>{notice ? <div className="form-message admin-form-message">{notice}</div> : null}</> : <p className="empty-state">Select a product to edit.</p>}</div></div>}
        {tab === "content" && <div className="panel-block"><span className="eyebrow">Store content</span><h1>Gaming storefront content</h1><p>Homepage merchandising now uses gaming departments, platform links, latest arrivals, consoles, games, accessories and PC gaming sections. Store messages and policy copy can be connected here as editable fields.</p></div>}
        {tab === "policies" && <div className="panel-block"><span className="eyebrow">Policies</span><h1>Store policies</h1><div className="detail-grid"><div><small>Returns & warranty</small><strong>Editable</strong></div><div><small>Delivery information</small><strong>Editable</strong></div><div><small>Privacy policy</small><strong>Editable</strong></div><div><small>Terms & conditions</small><strong>Editable</strong></div></div></div>}
        {tab === "account" && <div className="panel-block"><span className="eyebrow">My account</span><h1>Welcome, {adminName}</h1><p>Use the persistent Admin button in the public header to return here at any time.</p></div>}
      </section>
    </div>
  );
}

function ProductForm({ mode, product, onSubmit }: { mode: "add" | "edit"; product?: Product; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="edit-form gaming-product-form" onSubmit={onSubmit} key={product?.id || "new"}>
    <label>Product name<input name="name" defaultValue={product?.name || ""} required /></label>
    <div className="two-col"><label>Category<select name="category" defaultValue={product?.category || "Consoles"}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Condition<select name="condition" defaultValue={product?.condition || "New"}>{conditions.map(c => <option key={c}>{c}</option>)}</select></label></div>
    <div className="three-col"><label>Price PKR<input name="price_pkr" type="number" min="0" defaultValue={product?.price_pkr ?? 0} required /></label><label>Previous / compare price<input name="compare_at_price_pkr" type="number" min="0" defaultValue={product?.compare_at_price_pkr ?? ""} /></label><label>Stock<input name="stock_qty" type="number" min="0" defaultValue={product?.stock_qty ?? 0} required /></label></div>
    <label>Warranty / checking warranty<input name="warranty" defaultValue={product?.warranty || ""} placeholder="e.g. 7-day checking warranty" /></label>
    <label>Short description<textarea name="short_description" defaultValue={product?.short_description || ""} placeholder="Short storefront description" /></label>
    <label>Full product details<textarea name="description" defaultValue={product?.description || ""} placeholder="Specifications, compatibility, package contents and details" /></label>
    <label>Product image URLs — one per line<textarea name="images" defaultValue={(product?.images || []).join("\n")} placeholder="Up to 5 image URLs" /></label>
    <div className="two-col check-grid"><label className="check-row"><input name="featured" type="checkbox" defaultChecked={product?.featured || false} /> Featured on homepage</label><label className="check-row"><input name="published" type="checkbox" defaultChecked={mode === "add" ? true : product?.published} /> Published</label></div>
    <button className="primary-button">{mode === "add" ? "Add product" : "Save changes"}</button>
  </form>;
}
