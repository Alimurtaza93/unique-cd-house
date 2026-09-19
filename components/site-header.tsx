import Image from "next/image";
import Link from "next/link";
import { getViewer } from "@/lib/auth";
import { HeaderActions } from "./header-actions";

export async function SiteHeader() {
  const viewer = await getViewer();
  const isAdmin = viewer?.profile?.role === "admin";
  const displayName = viewer?.profile?.full_name || viewer?.user.email?.split("@")[0];

  return (
    <>
      <div className="announcement premium-announcement">
        <div className="announcement-inner">
          <span>🇵🇰 Pakistan&apos;s trusted gaming store</span>
          <span className="announcement-dot">•</span>
          <span>Fast delivery across Pakistan</span>
          <span className="announcement-dot">•</span>
          <span>Original products & clear warranty</span>
          <span className="announcement-dot">•</span>
          <span>Secure ordering</span>
          <div className="utility-links">
            <Link href="/track">Track order</Link>
            <Link href="/returns">Help & warranty</Link>
          </div>
        </div>
      </div>

      <header className="site-header premium-header">
        <Link href="/" className="brand-lockup" aria-label="Unique CD House home">
          <Image src="/unique-logo.png" width={230} height={78} alt="Unique CD House" priority />
        </Link>

        <form className="header-search premium-search" action="/shop" method="get">
          <span className="search-icon">⌕</span>
          <input name="q" placeholder="Search games, consoles, controllers, accessories…" aria-label="Search products" />
          <button type="submit" aria-label="Search">⌕</button>
        </form>

        <HeaderActions loggedIn={Boolean(viewer)} isAdmin={isAdmin} displayName={displayName} />
      </header>

      <nav className="category-nav premium-nav" aria-label="Shop categories">
        <div className="category-nav-inner premium-nav-inner">
          <Link className="active-home" href="/">⌂ <span>Home</span></Link>
          <Link href="/shop?category=consoles">▣ <span>Consoles</span></Link>
          <Link href="/shop?category=games">◉ <span>Games</span></Link>
          <Link href="/shop?category=controllers">✣ <span>Controllers</span></Link>
          <Link href="/shop?category=accessories">◌ <span>Accessories</span></Link>
          <Link href="/shop?category=pc-gaming">▱ <span>PC Gaming</span></Link>
          <Link href="/shop?sort=sale">◇ <span>Deals</span></Link>
          <Link className="special-offers" href="/shop?sort=sale">🔥 Special Offers</Link>
        </div>
      </nav>
    </>
  );
}
