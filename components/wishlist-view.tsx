"use client";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { useStore } from "./store-provider";
export function WishlistView(){const { wishlist }=useStore();return <div className="collection-page"><div className="page-title-row"><div><span className="eyebrow">Saved gaming gear</span><h1>Wishlist</h1></div><Link href="/shop">Browse store →</Link></div>{wishlist.length?<div className="product-grid">{wishlist.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state large">Your wishlist is empty. Save products from any product card and they will appear here.</div>}</div>}
