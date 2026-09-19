import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import "./purple-theme.css";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";

export const viewport = { themeColor: "#6d28d9" };

export const metadata: Metadata = {
  title: { default: "Unique CD House | Gaming Store Sialkot", template: "%s | Unique CD House" },
  description: "Gaming consoles, games, controllers, PC gaming gear and accessories in Sialkot with delivery across Pakistan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <footer className="footer premium-footer">
            <div className="footer-brand premium-footer-brand">
              <Image src="/unique-logo.png" width={200} height={70} alt="Unique CD House" />
              <p>Gaming today. A brighter tomorrow.</p>
              <div className="footer-socials"><span>f</span><span>◎</span><span>▶</span><span>♪</span></div>
            </div>

            <div>
              <strong>Shop</strong>
              <Link href="/shop?category=consoles">Consoles</Link>
              <Link href="/shop?category=games">Games</Link>
              <Link href="/shop?category=controllers">Controllers</Link>
              <Link href="/shop?category=accessories">Accessories</Link>
              <Link href="/shop?category=pc-gaming">PC Gaming</Link>
              <Link href="/shop?sort=sale">Deals</Link>
            </div>

            <div>
              <strong>Help</strong>
              <Link href="/track">Track your order</Link>
              <Link href="/returns">Returns & warranty</Link>
              <Link href="/login">My account</Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/compare">Compare</Link>
            </div>

            <div>
              <strong>About</strong>
              <p>Unique CD House</p>
              <p>Sialkot, Pakistan</p>
              <p>Delivery across Pakistan</p>
              <p>Support for gamers before and after purchase.</p>
            </div>

            <div className="footer-bottom">
              <span>© 2026 Unique CD House. All rights reserved.</span>
              <span>Play More. Live Better.</span>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
