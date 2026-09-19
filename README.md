# Unique CD House — Professional Gaming Store

Professional Next.js gaming e-commerce storefront for **Unique CD House / Unique Store Sialkot**.

## Included
- Bright professional retail UI with navy and royal-blue gaming accents.
- Separate Consoles, Games, Controllers, Gaming Devices, PC Gaming, Accessories and Used departments.
- PlayStation, Xbox, Nintendo and PC shortcuts.
- Search, product cards, product detail galleries, stock, discounts and warranty states.
- Cart, checkout, wishlist and comparison.
- One login with customer/admin role routing.
- Customer account and order history.
- Gaming-store admin dashboard and product management.
- Supabase-backed secure guest order placement and tracking.
- Responsive desktop/tablet/mobile layouts.

## Supabase
For a new Unique CD House database, run `supabase/schema.sql`.
For an existing Unique CD House database, review and run `supabase/gaming-store-upgrade.sql`.

Never run Unique CD House SQL in the Hamza Dental Supabase project.

## Environment
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Do not commit secrets.

## Local verification
```bash
npm install
npm run build
npm run dev
```

## Production
Existing Vercel project: `uniquecdhouse`
Live domain: https://uniquecdhouse.vercel.app/
