-- Unique CD House: expand the product departments for a professional gaming catalogue.
-- Safe for existing products. Run once in Supabase SQL Editor if the products table already exists.

begin;
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('Consoles','Games','Controllers','Gaming Devices','PC Gaming','Accessories','Used'));
commit;
