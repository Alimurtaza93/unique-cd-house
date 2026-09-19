import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { loadPublishedProducts } from "@/lib/products";
import { matchesCategory, matchesQuery, platformLinks, storeCategories } from "@/lib/gaming";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "all";
  const sort = params.sort || "";
  let products = (await loadPublishedProducts(120)).filter((p) => matchesCategory(p, category) && matchesQuery(p, q));
  if (sort === "sale") products = products.filter((p) => Boolean(p.compare_at_price_pkr && p.compare_at_price_pkr > p.price_pkr));
  const title = q ? `Search: ${q}` : category !== "all" ? storeCategories.find((c) => c.slug === category)?.name || category.replaceAll("-", " ") : "All gaming products";

  return <main className="shop-page">
    <div className="shop-top"><div><span className="eyebrow">Unique CD House store</span><h1>{title}</h1><p>{products.length} product{products.length === 1 ? "" : "s"} shown</p></div><form action="/shop" className="shop-search"><input name="q" defaultValue={q} placeholder="Search the store"/><button>Search</button></form></div>
    <div className="shop-layout">
      <aside className="shop-sidebar"><div className="filter-block"><strong>Departments</strong><Link className={category === "all" ? "active" : ""} href="/shop">All products</Link>{storeCategories.slice(0, 6).map((cat) => <Link className={category === cat.slug ? "active" : ""} href={`/shop?category=${cat.slug}`} key={cat.name}>{cat.name}</Link>)}</div><div className="filter-block"><strong>Platforms</strong>{platformLinks.map((item) => <Link href={`/shop?${item.category ? `category=${item.category}` : `q=${encodeURIComponent(item.query || "")}`}`} key={item.label}>{item.label}</Link>)}</div><div className="filter-block"><strong>Quick links</strong><Link href="/shop?sort=sale">Products on sale</Link><Link href="/shop?category=used">Used gaming gear</Link><Link href="/track">Track an order</Link></div></aside>
      <section className="shop-results">{products.length ? <div className="product-grid">{products.map((product) => <ProductCard product={product} key={product.id}/>)}</div> : <div className="empty-state large"><h2>No matching products</h2><p>Try another search or browse all gaming departments.</p><Link href="/shop" className="primary-button inline">View all products</Link></div>}</section>
    </div>
  </main>;
}
