"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/money";
import { useStore } from "./store-provider";

export function CartView() {
  const { cart, removeFromCart, setQuantity } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price_pkr * item.quantity, 0);

  if (!cart.length) return <div className="empty-cart"><div className="empty-cart-icon">▣</div><h1>Your cart is empty</h1><p>Browse consoles, games, controllers and gaming gear, then add items here.</p><Link href="/shop" className="primary-button inline">Start shopping</Link></div>;

  return (
    <div className="cart-layout">
      <section className="cart-lines">
        <div className="page-title-row"><div><span className="eyebrow">Shopping cart</span><h1>{cart.length} item{cart.length === 1 ? "" : "s"}</h1></div><Link href="/shop">Continue shopping →</Link></div>
        {cart.map(({ product, quantity }) => {
          const image = product.images?.find(Boolean);
          return <article className="cart-line" key={product.id}>
            <Link className="cart-line-image" href={`/products/${product.slug}`}>{image ? <Image src={image} fill sizes="120px" alt={product.name} /> : <span>UCD</span>}</Link>
            <div className="cart-line-copy"><small>{product.category} · {product.condition}</small><Link href={`/products/${product.slug}`}><strong>{product.name}</strong></Link><span>{formatPKR(product.price_pkr)} each</span></div>
            <div className="quantity-control"><button onClick={() => setQuantity(product.id, quantity - 1)}>−</button><b>{quantity}</b><button onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div>
            <div className="cart-line-total"><strong>{formatPKR(product.price_pkr * quantity)}</strong><button onClick={() => removeFromCart(product.id)}>Remove</button></div>
          </article>;
        })}
      </section>
      <aside className="cart-summary"><span className="eyebrow">Order summary</span><h2>{formatPKR(subtotal)}</h2><div className="summary-row"><span>Subtotal</span><b>{formatPKR(subtotal)}</b></div><div className="summary-row"><span>Delivery</span><b>Confirmed at order</b></div><p>Final stock availability and delivery details are confirmed when the store reviews your order.</p><Link href="/checkout" className="primary-button wide">Proceed to checkout</Link><div className="secure-note">Secure account & order tracking included</div></aside>
    </div>
  );
}
