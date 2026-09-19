export type Role = "admin" | "customer";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  price_pkr: number;
  compare_at_price_pkr: number | null;
  condition: string;
  stock_qty: number;
  warranty: string | null;
  featured: boolean;
  published: boolean;
  images: string[];
};

export type Order = {
  id: string;
  tracking_code: string;
  status: string;
  total_pkr: number;
  created_at: string;
  delivery_method: string;
};
