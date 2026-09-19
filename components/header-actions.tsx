"use client";

import Link from "next/link";
import { useStore } from "./store-provider";

export function HeaderActions({ loggedIn, isAdmin, displayName }: { loggedIn: boolean; isAdmin: boolean; displayName?: string | null }) {
  const { cartCount, wishlist, compare } = useStore();
  return (
    <nav className="header-actions" aria-label="Account, wishlist, compare and cart">
      <Link href={loggedIn ? (isAdmin ? "/admin" : "/account") : "/login"} className="account-chip">
        <span className="chip-eyebrow">{loggedIn ? "My account" : "Account"}</span>
        <strong>{loggedIn ? (displayName || "Account") : "Login / Register"}</strong>
      </Link>
      <Link className="header-icon-link" href="/wishlist" aria-label="Wishlist"><span>♡</span><b>{wishlist.length}</b><small>Wishlist</small></Link>
      <Link className="header-icon-link compare-link" href="/compare" aria-label="Compare"><span>⇄</span><b>{compare.length}</b><small>Compare</small></Link>
      {isAdmin ? <Link className="admin-shortcut" href="/admin">Admin</Link> : null}
      <Link className="cart-button" href="/cart" aria-label="Open cart"><span className="cart-symbol">▣</span><span className="cart-label">Cart</span><b>{cartCount}</b></Link>
    </nav>
  );
}
