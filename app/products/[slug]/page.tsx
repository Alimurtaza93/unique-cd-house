import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProduct } from "@/lib/products";
import { formatPKR } from "@/lib/money";
import { platformLabel, productFeatures } from "@/lib/gaming";
import { ProductActions } from "@/components/product-actions";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();
  const images = (product.images || []).filter(Boolean).slice(0, 5);
  const primaryImage = images[0];
  const discount = product.compare_at_price_pkr && product.compare_at_price_pkr > product.price_pkr ? Math.round((1 - product.price_pkr / product.compare_at_price_pkr) * 100) : null;
  const features = productFeatures(product);

  return (
    <main className="product-page">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/shop">Shop</Link><span>/</span><Link href={`/shop?category=${product.category.toLowerCase().replaceAll(" ", "-")}`}>{product.category}</Link><span>/</span><b>{product.name}</b></div>
      <div className="product-detail">
        <div className="gallery-panel">
          <div className="detail-placeholder">{primaryImage ? <Image src={primaryImage} fill sizes="(max-width:900px) 100vw, 50vw" alt={product.name} className="detail-image" priority /> : <div className="detail-empty"><span>{platformLabel(product)}</span><small>Product image coming soon</small></div>}{discount ? <span className="detail-sale-badge">Save {discount}%</span> : null}</div>
          <div className="thumb-row">{images.length ? images.map((src, index) => <div className={index === 0 ? "active thumb-image" : "thumb-image"} key={src}><Image src={src} fill sizes="72px" alt={`${product.name} view ${index + 1}`} /></div>) : <button className="active">01</button>}</div>
        </div>
        <div className="detail-copy">
          <div className="detail-label-row"><span className="eyebrow">{platformLabel(product)} · {product.category}</span><span className="condition-pill">{product.condition}</span></div>
          <h1>{product.name}</h1><p>{product.short_description}</p>
          <div className="detail-price"><strong>{formatPKR(product.price_pkr)}</strong>{product.compare_at_price_pkr ? <del>{formatPKR(product.compare_at_price_pkr)}</del> : null}</div>
          <div className="detail-stock-line"><span className={product.stock_qty > 0 ? "in" : "out"}>{product.stock_qty > 0 ? `● In stock (${product.stock_qty})` : "● Out of stock"}</span><span>SKU available from store</span></div>
          <ul className="gaming-feature-list">{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <ProductActions product={product}/>
          <div className="detail-notes"><div><small>Pickup</small><strong>Sialkot store</strong><span>Reserve and collect locally</span></div><div><small>Delivery</small><strong>Across Pakistan</strong><span>Details confirmed with order</span></div><div><small>Support</small><strong>Order tracking</strong><span>Track every order by code</span></div></div>
        </div>
      </div>
      <section className="product-info-tabs"><div className="product-info-main"><span className="eyebrow">Product information</span><h2>About this product</h2><p>{product.description || "Full product information will be updated by the store."}</p></div><aside className="product-spec-card"><strong>Product overview</strong><dl><div><dt>Department</dt><dd>{product.category}</dd></div><div><dt>Platform</dt><dd>{platformLabel(product)}</dd></div><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Warranty</dt><dd>{product.warranty || "Ask store"}</dd></div><div><dt>Availability</dt><dd>{product.stock_qty > 0 ? "In stock" : "Out of stock"}</dd></div></dl></aside></section>
    </main>
  );
}
