import type { Product } from "./types";

export const storeCategories: Array<{ name: string; slug: string; note: string; mark: string; query?: string }> = [
  { name: "Consoles", slug: "consoles", note: "PlayStation, Xbox, Nintendo & handhelds", mark: "CS" },
  { name: "Games", slug: "games", note: "PS5, PS4, Xbox, Switch & more", mark: "GM" },
  { name: "Controllers", slug: "controllers", note: "PlayStation, Xbox, Nintendo & racing controls", mark: "CT" },
  { name: "PC Gaming", slug: "pc-gaming", note: "PC gear, monitors, keyboards & mice", mark: "PC" },
  { name: "Gaming Devices", slug: "gaming-devices", note: "Headsets, VR, handhelds & specialist gear", mark: "GD" },
  { name: "Accessories", slug: "accessories", note: "Docks, cables, storage & setup essentials", mark: "AC" },
  { name: "VR & Handheld", slug: "consoles", query: "vr", note: "VR headsets and portable gaming", mark: "VR" },
  { name: "Used Gaming", slug: "used", note: "Checked pre-owned gaming products", mark: "UD" },
];

export const platformLinks: Array<{ label: string; query?: string; category?: string }> = [
  { label: "PlayStation 5", query: "ps5" },
  { label: "PlayStation 4", query: "ps4" },
  { label: "Xbox Series", query: "xbox series" },
  { label: "Nintendo Switch", query: "switch" },
  { label: "PC Gaming", category: "pc-gaming" },
  { label: "Gaming Accessories", category: "accessories" },
];

export const megaGroups = [
  {
    title: "Consoles",
    links: [
      ["PS5 Consoles", "/shop?category=consoles&q=ps5"],
      ["PS4 Consoles", "/shop?category=consoles&q=ps4"],
      ["Xbox Series", "/shop?category=consoles&q=xbox"],
      ["Nintendo Switch", "/shop?category=consoles&q=switch"],
      ["Handheld Gaming", "/shop?category=consoles&q=handheld"],
      ["Used Consoles", "/shop?category=used&q=console"],
    ],
  },
  {
    title: "Games",
    links: [
      ["PS5 Games", "/shop?category=games&q=ps5"],
      ["PS4 Games", "/shop?category=games&q=ps4"],
      ["Xbox Games", "/shop?category=games&q=xbox"],
      ["Nintendo Switch Games", "/shop?category=games&q=switch"],
      ["Latest Games", "/shop?category=games&sort=latest"],
    ],
  },
  {
    title: "Gaming Gear",
    links: [
      ["Controllers", "/shop?category=controllers"],
      ["Gaming Headsets", "/shop?category=gaming-devices&q=headset"],
      ["Gaming Keyboards", "/shop?category=pc-gaming&q=keyboard"],
      ["Gaming Mice", "/shop?category=pc-gaming&q=mouse"],
      ["Racing Wheels", "/shop?category=controllers&q=racing"],
      ["Monitors", "/shop?category=pc-gaming&q=monitor"],
    ],
  },
  {
    title: "More",
    links: [
      ["VR", "/shop?q=vr"],
      ["Storage & SSD", "/shop?q=ssd"],
      ["Docks & Stands", "/shop?q=dock"],
      ["Cables & Adapters", "/shop?q=cable"],
      ["Used Products", "/shop?category=used"],
      ["Track Order", "/track"],
    ],
  },
] as const;

export function normalizedText(product: Product) {
  return `${product.name} ${product.category} ${product.short_description || ""} ${product.description || ""}`.toLowerCase();
}

export function matchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return normalizedText(product).includes(q);
}

export function matchesCategory(product: Product, slug: string) {
  if (!slug || slug === "all") return true;
  const category = product.category.toLowerCase().replaceAll(" ", "-");
  if (slug === "used") return category === "used" || product.condition.toLowerCase().includes("used") || product.condition.toLowerCase().includes("pre-owned");
  return category === slug;
}

export function platformLabel(product: Product) {
  const text = normalizedText(product);
  if (text.includes("ps5") || text.includes("playstation 5")) return "PS5";
  if (text.includes("ps4") || text.includes("playstation 4")) return "PS4";
  if (text.includes("xbox")) return "Xbox";
  if (text.includes("switch") || text.includes("nintendo")) return "Nintendo";
  if (text.includes("pc ") || product.category.toLowerCase().includes("pc")) return "PC Gaming";
  if (text.includes("vr") || text.includes("quest")) return "VR";
  return product.category;
}

export function productFeatures(product: Product) {
  const features: string[] = [];
  if (product.condition) features.push(`${product.condition} condition`);
  if (product.warranty) features.push(product.warranty);
  features.push(product.stock_qty > 0 ? `${product.stock_qty} currently in stock` : "Currently out of stock");
  features.push(`${platformLabel(product)} gaming`);
  return features.slice(0, 4);
}
