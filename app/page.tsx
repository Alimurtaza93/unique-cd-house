import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { loadPublishedProducts } from "@/lib/products";
import { matchesQuery } from "@/lib/gaming";

function takeBy(
  products: Awaited<ReturnType<typeof loadPublishedProducts>>,
  test: (p: (typeof products)[number]) => boolean,
  count = 6
) {
  const matched = products.filter(test).slice(0, count);
  return matched.length ? matched : products.slice(0, count);
}

const categories = [
  { name: "Consoles", href: "/shop?category=consoles", note: "Next gen gaming", mark: "01", className: "violet" },
  { name: "Games", href: "/shop?category=games", note: "Play what you love", mark: "02", className: "magenta" },
  { name: "Controllers", href: "/shop?category=controllers", note: "Precision & control", mark: "03", className: "indigo" },
  { name: "Accessories", href: "/shop?category=accessories", note: "Gear up & play", mark: "04", className: "purple" },
  { name: "PC Gaming", href: "/shop?category=pc-gaming", note: "Built for performance", mark: "05", className: "blueviolet" },
];

export default async function Home() {
  const products = await loadPublishedProducts(48);
  const featured = products.filter((p) => p.featured);
  const latest = (featured.length >= 4 ? featured : products).slice(0, 6);
  const games = takeBy(products, (p) => p.category.toLowerCase() === "games", 6);
  const accessories = takeBy(
    products,
    (p) =>
      ["accessories", "controllers", "gaming devices"].includes(p.category.toLowerCase()) ||
      matchesQuery(p, "headset") ||
      matchesQuery(p, "keyboard"),
    6
  );

  return (
    <main className="purple-home">
      <section className="premium-hero-shell">
        <div className="premium-hero">
          <div className="premium-hero-copy">
            <span className="premium-kicker">PLAY BEYOND LIMITS</span>
            <h1>
              UNIQUE <span>CD HOUSE</span>
            </h1>
            <p className="premium-hero-subtitle">YOUR ULTIMATE GAMING DESTINATION IN PAKISTAN</p>

            <div className="premium-hero-trust">
              <div><b>◇</b><span><strong>100% ORIGINAL</strong><small>Products</small></span></div>
              <div><b>⇢</b><span><strong>NATIONWIDE</strong><small>Delivery</small></span></div>
              <div><b>✓</b><span><strong>TRUSTED BY</strong><small>Gamers</small></span></div>
              <div><b>★</b><span><strong>GAMER-FIRST</strong><small>Support</small></span></div>
            </div>

            <div className="premium-hero-actions">
              <Link href="/shop" className="premium-cta">SHOP NOW <span>→</span></Link>
              <Link href="/shop?sort=sale" className="premium-ghost">VIEW DEALS</Link>
            </div>
          </div>

          <div className="hero-console-stage" aria-label="Gaming console showcase">
            <div className="neon-orbit one" />
            <div className="neon-orbit two" />
            <div className="console ps"><span /></div>
            <div className="console xbox"><span /></div>
            <div className="controller ctrl-left"><i /><i /></div>
            <div className="controller ctrl-right"><i /><i /></div>
            <div className="handheld"><span className="screen">UCD</span><i /><i /></div>
            <div className="hero-stage-copy">Good games.<br />Brighter days.</div>
          </div>
        </div>
      </section>

      <section className="premium-category-row" aria-label="Gaming categories">
        {categories.map((category) => (
          <Link href={category.href} key={category.name} className={`premium-category-card ${category.className}`}>
            <div className="category-number">{category.mark}</div>
            <div>
              <strong>{category.name}</strong>
              <span>{category.note}</span>
            </div>
            <b className="category-arrow">→</b>
          </Link>
        ))}
      </section>

      <section className="section premium-products">
        <div className="premium-section-heading">
          <div>
            <span className="premium-line" />
            <h2>FEATURED PRODUCTS</h2>
            <p>Popular gaming gear selected for every kind of player.</p>
          </div>
          <Link href="/shop">View All Products →</Link>
        </div>
        <div className="product-grid premium-product-grid">
          {latest.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>

      <section className="section premium-promo-wrap">
        <div className="premium-promo-banner">
          <div className="promo-left">
            <span>LEVEL UP YOUR SETUP</span>
            <h2>Premium gear. Better performance.</h2>
            <p>Controllers, audio, PC gaming equipment and accessories built for longer sessions.</p>
            <Link href="/shop?category=accessories">SHOP ACCESSORIES →</Link>
          </div>
          <div className="promo-center">
            <div className="promo-disc">UCD</div>
            <div className="promo-light" />
          </div>
          <div className="promo-right">
            <small>SELECTED GAMING GEAR</small>
            <strong>SHOP<br />SMARTER</strong>
            <Link href="/shop?sort=sale">EXPLORE DEALS →</Link>
          </div>
        </div>
      </section>

      <section className="section premium-products">
        <div className="premium-section-heading">
          <div>
            <span className="premium-line" />
            <h2>GAMES & NEW RELEASES</h2>
          </div>
          <Link href="/shop?category=games">Shop Games →</Link>
        </div>
        <div className="product-grid premium-product-grid">
          {games.slice(0, 6).map((product) => <ProductCard compact product={product} key={`games-${product.id}`} />)}
        </div>
      </section>

      <section className="section premium-products">
        <div className="premium-section-heading">
          <div>
            <span className="premium-line" />
            <h2>CONTROLLERS & ACCESSORIES</h2>
          </div>
          <Link href="/shop?category=accessories">Shop Gear →</Link>
        </div>
        <div className="product-grid premium-product-grid">
          {accessories.slice(0, 6).map((product) => <ProductCard compact product={product} key={`gear-${product.id}`} />)}
        </div>
      </section>

      <section className="premium-trust-strip">
        <div><b>◇</b><span><strong>100% ORIGINAL PRODUCTS</strong><small>Genuine gaming gear</small></span></div>
        <div><b>⇢</b><span><strong>FAST & RELIABLE DELIVERY</strong><small>Across Pakistan</small></span></div>
        <div><b>▣</b><span><strong>SECURE ORDERING</strong><small>Clear checkout & tracking</small></span></div>
        <div><b>◎</b><span><strong>FRIENDLY SUPPORT</strong><small>Help before & after purchase</small></span></div>
        <div><b>♛</b><span><strong>GAMERS COMMUNITY</strong><small>Sialkot & beyond</small></span></div>
      </section>
    </main>
  );
}
