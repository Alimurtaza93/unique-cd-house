import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { loadPublishedProducts } from "@/lib/products";
import { matchesQuery, platformLinks, storeCategories } from "@/lib/gaming";

function takeBy(products: Awaited<ReturnType<typeof loadPublishedProducts>>, test: (p: (typeof products)[number]) => boolean, count = 4) {
  const matched = products.filter(test).slice(0, count);
  return matched.length ? matched : products.slice(0, count);
}

export default async function Home() {
  const products = await loadPublishedProducts(48);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const latest = (featured.length >= 4 ? featured : products).slice(0, 8);
  const consoles = takeBy(products, (p) => p.category.toLowerCase() === "consoles");
  const games = takeBy(products, (p) => p.category.toLowerCase() === "games");
  const accessories = takeBy(products, (p) => ["accessories", "controllers", "gaming devices"].includes(p.category.toLowerCase()));
  const pcGaming = takeBy(products, (p) => p.category.toLowerCase().includes("pc") || matchesQuery(p, "monitor") || matchesQuery(p, "keyboard") || matchesQuery(p, "mouse"));
  const heroProduct = latest[0];
  const heroImage = heroProduct?.images?.find(Boolean);

  return (
    <main>
      <section className="gaming-hero-wrap">
        <div className="gaming-hero">
          <div className="gaming-hero-copy">
            <span className="hero-kicker">UNIQUE CD HOUSE · SIALKOT</span>
            <h1>Everything a gamer needs, in one serious gaming store.</h1>
            <p>Shop consoles, games, controllers, PC gaming gear and accessories with clear pricing, checked stock and local support.</p>
            <div className="hero-actions"><Link href="/shop" className="primary-button">Shop gaming gear</Link><Link href="/shop?category=consoles" className="secondary-button">Browse consoles</Link></div>
            <div className="hero-mini-trust"><span>✓ Pakistan-wide delivery</span><span>✓ Sialkot pickup</span><span>✓ New & used gear</span></div>
          </div>
          <div className="hero-feature-card">
            <div className="hero-feature-label"><span>FEATURED GAMING PICK</span><Link href="/shop">View store →</Link></div>
            {heroProduct ? <>
              <Link href={`/products/${heroProduct.slug}`} className="hero-product-image">{heroImage ? <Image src={heroImage} fill sizes="440px" alt={heroProduct.name} priority /> : <div className="hero-product-placeholder"><b>UCD</b><span>Gaming gear</span></div>}</Link>
              <div className="hero-product-bottom"><div><small>{heroProduct.category} · {heroProduct.condition}</small><Link href={`/products/${heroProduct.slug}`}><strong>{heroProduct.name}</strong></Link></div><Link href={`/products/${heroProduct.slug}`} className="hero-arrow">→</Link></div>
            </> : <div className="hero-product-placeholder large"><b>UCD</b><span>Products are being added</span></div>}
          </div>
        </div>
      </section>

      <section className="platform-strip" aria-label="Shop by gaming platform">
        <div className="platform-strip-inner"><span className="platform-title">Shop by platform</span>{platformLinks.map((item) => <Link key={item.label} href={`/shop?${item.category ? `category=${item.category}` : `q=${encodeURIComponent(item.query || "")}`}`}>{item.label}</Link>)}</div>
      </section>

      <section className="section category-section">
        <div className="section-heading"><div><span className="eyebrow">Gaming departments</span><h2>Find your setup faster</h2></div><Link href="/shop">View all products</Link></div>
        <div className="gaming-category-grid">{storeCategories.map((cat) => <Link href={`/shop?category=${cat.slug}${cat.query ? `&q=${encodeURIComponent(cat.query)}` : ""}`} className="gaming-category-card" key={cat.name}><span className="gaming-category-mark">{cat.mark}</span><div><strong>{cat.name}</strong><p>{cat.note}</p></div><b>→</b></Link>)}</div>
      </section>

      <section className="section merch-section">
        <div className="section-heading products-heading"><div><span className="eyebrow">New & featured</span><h2>Latest gaming arrivals</h2></div><Link href="/shop?sort=latest">View latest</Link></div>
        <div className="product-grid">{latest.map((product) => <ProductCard product={product} key={product.id} />)}</div>
      </section>

      <section className="gaming-banner-section section">
        <div className="gaming-banner blue"><div><span>CONSOLE GAMING</span><h2>PlayStation, Xbox, Nintendo & handheld gaming.</h2><p>Explore current-generation consoles and checked pre-owned options.</p><Link href="/shop?category=consoles">Shop consoles →</Link></div><div className="banner-code">01</div></div>
        <div className="gaming-banner graphite"><div><span>BUILD YOUR SETUP</span><h2>Controllers, headsets, PC gear and accessories.</h2><p>Upgrade the parts of your setup that matter every session.</p><Link href="/shop?category=accessories">Shop accessories →</Link></div><div className="banner-code">02</div></div>
      </section>

      <ProductRail title="Gaming consoles" eyebrow="Console zone" products={consoles} href="/shop?category=consoles" />
      <ProductRail title="Games for every platform" eyebrow="Game library" products={games} href="/shop?category=games" />
      <ProductRail title="Controllers & accessories" eyebrow="Gear up" products={accessories} href="/shop?category=accessories" />
      <ProductRail title="PC gaming & displays" eyebrow="Performance setup" products={pcGaming} href="/shop?category=pc-gaming" />

      <section className="service-strip" aria-label="Store services">
        <div><span className="service-icon">↗</span><small>DELIVERY</small><strong>Across Pakistan</strong><p>Clear order updates and delivery information.</p></div>
        <div><span className="service-icon">⌂</span><small>PICKUP</small><strong>Sialkot store</strong><p>Reserve your order and collect locally.</p></div>
        <div><span className="service-icon">✓</span><small>PRODUCTS</small><strong>New & used clearly marked</strong><p>Condition and stock are shown on every listing.</p></div>
        <div><span className="service-icon">?</span><small>SUPPORT</small><strong>Help after purchase</strong><p>Use your tracking ID whenever you contact the store.</p></div>
      </section>
    </main>
  );
}

function ProductRail({ title, eyebrow, products, href }: { title: string; eyebrow: string; products: Awaited<ReturnType<typeof loadPublishedProducts>>; href: string }) {
  return <section className="section product-rail-section"><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><Link href={href}>View all →</Link></div><div className="product-grid product-rail">{products.map((product) => <ProductCard compact product={product} key={product.id} />)}</div></section>;
}
