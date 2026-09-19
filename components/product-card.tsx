"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/money";
import { platformLabel } from "@/lib/gaming";
import { useStore } from "./store-provider";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleWishlist, toggleCompare, inWishlist, inCompare } = useStore();
  const discount = product.compare_at_price_pkr && product.compare_at_price_pkr > product.price_pkr
    ? Math.round((1 - product.price_pkr / product.compare_at_price_pkr) * 100)
    : null;
  const image = product.images?.find(Boolean);
  const wished = inWishlist(product.id);
  const compared = inCompare(product.id);

  return (
    <article className={compact ? "product-card compact" : "product-card"}>
      <div className="product-card-tools">
        <button type="button" className={wished ? "active" : ""} onClick={() => toggleWishlist(product)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}>♡</button>
        <button type="button" className={compared ? "active" : ""} onClick={() => toggleCompare(product)} aria-label={compared ? "Remove from compare" : "Add to compare"}>⇄</button>
      </div>
      <Link href={`/products/${product.slug}`} className="product-visual" aria-label={product.name}>
        {image ? (
          <Image src={image} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" alt={product.name} className="product-image" />
        ) : (
          <div className="product-placeholder"><span>{platformLabel(product)}</span><small>Image coming soon</small></div>
        )}
        <div className="product-badges">
          <span className={product.stock_qty > 0 ? "stock in" : "stock out"}>{product.stock_qty > 0 ? "In stock" : "Out of stock"}</span>
          {discount ? <span className="discount">-{discount}%</span> : null}
        </div>
      </Link>
      <div className="product-copy">
        <div className="product-meta"><span>{platformLabel(product)}</span><span>{product.condition}</span></div>
        <Link href={`/products/${product.slug}`} className="product-title">{product.name}</Link>
        {!compact ? <p>{product.short_description}</p> : null}
        <div className="product-price">
          <strong>{formatPKR(product.price_pkr)}</strong>
          {product.compare_at_price_pkr ? <del>{formatPKR(product.compare_at_price_pkr)}</del> : null}
        </div>
        <div className="product-card-actions">
          <button type="button" className="quick-cart" disabled={product.stock_qty < 1} onClick={() => addToCart(product)}>{product.stock_qty > 0 ? "Add to cart" : "Out of stock"}</button>
          <Link href={`/products/${product.slug}`} className="quick-view">View</Link>
        </div>
      </div>
    </article>
  );
}
