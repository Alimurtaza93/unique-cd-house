import Image from "next/image";
import Link from "next/link";
import { getViewer } from "@/lib/auth";
import { megaGroups } from "@/lib/gaming";
import { HeaderActions } from "./header-actions";

export async function SiteHeader() {
  const viewer = await getViewer();
  const isAdmin = viewer?.profile?.role === "admin";
  const displayName = viewer?.profile?.full_name || viewer?.user.email?.split("@")[0];

  return (
    <>
      <div className="announcement">
        <div className="announcement-inner">
          <span>Gaming store in Sialkot</span><span className="announcement-dot">•</span><span>Delivery across Pakistan</span><span className="announcement-dot">•</span><span>New & checked used gaming gear</span>
          <div className="utility-links"><Link href="/track">Track order</Link><Link href="/returns">Returns & warranty</Link></div>
        </div>
      </div>
      <header className="site-header">
        <Link href="/" className="brand-lockup" aria-label="Unique CD House home">
          <Image src="/unique-logo.png" width={220} height={70} alt="Unique CD House" priority />
        </Link>
        <form className="header-search" action="/shop" method="get">
          <input name="q" placeholder="Search PS5, Xbox, Nintendo, games, controllers…" aria-label="Search products" />
          <button type="submit">Search</button>
        </form>
        <HeaderActions loggedIn={Boolean(viewer)} isAdmin={isAdmin} displayName={displayName} />
      </header>
      <nav className="category-nav" aria-label="Shop categories">
        <div className="category-nav-inner">
          <details className="mega-menu">
            <summary>Browse Categories <span>⌄</span></summary>
            <div className="mega-panel">
              {megaGroups.map((group) => <div className="mega-group" key={group.title}><strong>{group.title}</strong>{group.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}
              <div className="mega-promo"><span>UNIQUE CD HOUSE</span><strong>Built for gamers.</strong><p>Console gaming, PC gear and accessories with local support in Sialkot.</p><Link href="/shop">Shop all gaming gear →</Link></div>
            </div>
          </details>
          <Link href="/">Home</Link>
          <Link href="/shop?category=consoles">Consoles</Link>
          <Link href="/shop?category=games">Games</Link>
          <Link href="/shop?category=controllers">Controllers</Link>
          <Link href="/shop?category=accessories">Accessories</Link>
          <Link href="/shop?category=pc-gaming">PC Gaming</Link>
          <Link href="/shop?category=used">Used</Link>
          <Link className="deals-nav" href="/shop?sort=sale">Deals</Link>
        </div>
      </nav>
    </>
  );
}
