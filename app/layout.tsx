import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";

export const viewport = { themeColor: "#ffffff" };

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
          <footer className="footer">
            <div className="footer-brand"><strong>Unique CD House</strong><p>Gaming consoles, games, controllers, PC gear and accessories from Sialkot.</p><div className="footer-pills"><span>Store pickup</span><span>Pakistan delivery</span><span>Order tracking</span></div></div>
            <div><strong>Gaming</strong><Link href="/shop?category=consoles">Consoles</Link><Link href="/shop?category=games">Games</Link><Link href="/shop?category=controllers">Controllers</Link><Link href="/shop?category=pc-gaming">PC Gaming</Link><Link href="/shop?category=used">Used products</Link></div>
            <div><strong>Customer care</strong><Link href="/track">Track order</Link><Link href="/login">My account</Link><Link href="/wishlist">Wishlist</Link><Link href="/compare">Compare</Link><Link href="/returns">Returns & warranty</Link></div>
            <div><strong>Store</strong><p>Sialkot, Punjab, Pakistan</p><p>Pickup available</p><p>Delivery across Pakistan</p><p>Support available before and after purchase</p></div>
            <div className="footer-bottom"><span>© 2026 Unique CD House. All rights reserved.</span><span>Gaming store · Sialkot</span></div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
