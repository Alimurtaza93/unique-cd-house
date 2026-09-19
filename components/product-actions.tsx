"use client";

import type { Product } from "@/lib/types";
import { useStore } from "./store-provider";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, toggleCompare, inWishlist, inCompare } = useStore();
  const wished = inWishlist(product.id);
  const compared = inCompare(product.id);
  return (
    <div className="detail-actions">
      <button className="primary-button wide" disabled={product.stock_qty < 1} onClick={() => addToCart(product)}>{product.stock_qty > 0 ? "Add to cart" : "Out of stock"}</button>
      <div className="detail-secondary-actions">
        <button type="button" className={wished ? "active" : ""} onClick={() => toggleWishlist(product)}>♡ {wished ? "Saved" : "Add to wishlist"}</button>
        <button type="button" className={compared ? "active" : ""} onClick={() => toggleCompare(product)}>⇄ {compared ? "Comparing" : "Compare"}</button>
      </div>
    </div>
  );
}
