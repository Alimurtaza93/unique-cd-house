import type { Product } from "./types";

export const categories = [
  { name: "Consoles", slug: "consoles", note: "PlayStation, Xbox & Nintendo" },
  { name: "Games", slug: "games", note: "New releases & classics" },
  { name: "PC Gaming", slug: "pc-gaming", note: "Components & complete setups" },
  { name: "Accessories", slug: "accessories", note: "Controllers, audio & gear" },
  { name: "Used", slug: "used", note: "Tested pre-owned products" }
];

export const fallbackProducts: Product[] = [
  {
    id: "demo-ps5",
    name: "PlayStation 5 Slim Console",
    slug: "playstation-5-slim-console",
    category: "Consoles",
    short_description: "Disc edition console with next-generation performance.",
    description: "Demo product used only until live inventory is connected in Supabase.",
    price_pkr: 189999,
    compare_at_price_pkr: 199999,
    condition: "New",
    stock_qty: 4,
    warranty: "Store warranty",
    featured: true,
    published: true,
    images: []
  },
  {
    id: "demo-controller",
    name: "Wireless Gaming Controller",
    slug: "wireless-gaming-controller",
    category: "Accessories",
    short_description: "Responsive wireless controller for everyday gaming.",
    description: "Demo product used only until live inventory is connected in Supabase.",
    price_pkr: 18900,
    compare_at_price_pkr: null,
    condition: "New",
    stock_qty: 11,
    warranty: "Checking warranty",
    featured: true,
    published: true,
    images: []
  },
  {
    id: "demo-headset",
    name: "7.1 Surround Gaming Headset",
    slug: "7-1-surround-gaming-headset",
    category: "Accessories",
    short_description: "Over-ear headset with detachable microphone.",
    description: "Demo product used only until live inventory is connected in Supabase.",
    price_pkr: 12900,
    compare_at_price_pkr: 14900,
    condition: "New",
    stock_qty: 7,
    warranty: "7-day checking warranty",
    featured: true,
    published: true,
    images: []
  }
];
