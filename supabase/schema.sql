-- Unique CD House / Unique Store Sialkot
-- Fresh Supabase schema for the gaming store.
-- Intentionally excludes Hamza Dental brands, quotations and dental variants.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('admin','customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('Consoles','Games','Controllers','Gaming Devices','PC Gaming','Accessories','Used')),
  short_description text,
  description text,
  price_pkr numeric(12,2) not null check (price_pkr >= 0),
  compare_at_price_pkr numeric(12,2) check (compare_at_price_pkr is null or compare_at_price_pkr >= 0),
  condition text not null default 'New',
  stock_qty integer not null default 0 check (stock_qty >= 0),
  warranty text,
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_published_featured_idx on public.products(published, featured);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tracking_code text not null unique,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','packed','shipped','ready_for_pickup','delivered','cancelled')),
  delivery_method text not null default 'delivery' check (delivery_method in ('delivery','pickup')),
  shipping_address text,
  subtotal_pkr numeric(12,2) not null default 0 check (subtotal_pkr >= 0),
  delivery_pkr numeric(12,2) not null default 0 check (delivery_pkr >= 0),
  total_pkr numeric(12,2) not null default 0 check (total_pkr >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_pkr numeric(12,2) not null check (unit_price_pkr >= 0),
  line_total_pkr numeric(12,2) not null check (line_total_pkr >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.site_pages (
  slug text primary key,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_pages (slug,title,body) values
  ('delivery','Delivery Information','Delivery policy to be approved before launch.'),
  ('returns','Returns & Warranty','Returns and warranty policy to be approved before launch.'),
  ('privacy','Privacy Policy','Privacy policy to be approved before launch.'),
  ('terms','Terms & Conditions','Terms and conditions to be approved before launch.')
on conflict (slug) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name',''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.site_pages enable row level security;

revoke all on table public.profiles, public.products, public.orders, public.order_items, public.wishlist_items, public.site_pages from anon, authenticated;

grant select on table public.products, public.site_pages to anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, phone, updated_at) on table public.profiles to authenticated;
grant select, insert, update, delete on table public.products to authenticated;
grant select, update, delete on table public.orders to authenticated;
grant select, update, delete on table public.order_items to authenticated;
grant select, insert, delete on table public.wishlist_items to authenticated;
grant insert, update, delete on table public.site_pages to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
revoke all on function public.handle_new_user() from public;

drop policy if exists "profile read own" on public.profiles;
create policy "profile read own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()))
  with check ((select auth.uid()) = id or (select public.is_admin()));

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products for select to anon, authenticated
  using (published = true);
drop policy if exists "admin read all products" on public.products;
create policy "admin read all products" on public.products for select to authenticated
  using ((select public.is_admin()));
drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products for insert to authenticated
  with check ((select public.is_admin()));
drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products for delete to authenticated
  using ((select public.is_admin()));

drop policy if exists "customers read own orders" on public.orders;
create policy "customers read own orders" on public.orders for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));
drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders" on public.orders for delete to authenticated
  using ((select public.is_admin()));

drop policy if exists "customers read own order items" on public.order_items;
create policy "customers read own order items" on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = (select auth.uid()) or (select public.is_admin()))
    )
  );
drop policy if exists "admin update order items" on public.order_items;
create policy "admin update order items" on public.order_items for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admin delete order items" on public.order_items;
create policy "admin delete order items" on public.order_items for delete to authenticated
  using ((select public.is_admin()));

drop policy if exists "wishlist own read" on public.wishlist_items;
create policy "wishlist own read" on public.wishlist_items for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "wishlist own insert" on public.wishlist_items;
create policy "wishlist own insert" on public.wishlist_items for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "wishlist own delete" on public.wishlist_items;
create policy "wishlist own delete" on public.wishlist_items for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "public read site pages" on public.site_pages;
create policy "public read site pages" on public.site_pages for select to anon, authenticated
  using (true);
drop policy if exists "admin insert site pages" on public.site_pages;
create policy "admin insert site pages" on public.site_pages for insert to authenticated
  with check ((select public.is_admin()));
drop policy if exists "admin update site pages" on public.site_pages;
create policy "admin update site pages" on public.site_pages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admin delete site pages" on public.site_pages;
create policy "admin delete site pages" on public.site_pages for delete to authenticated
  using ((select public.is_admin()));

create or replace function public.place_store_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_delivery_method text,
  p_shipping_address text,
  p_notes text,
  p_items jsonb
)
returns table(order_id uuid, tracking_code text, total_pkr numeric)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_tracking text := 'UCD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id uuid;
  v_qty integer;
begin
  if coalesce(trim(p_customer_name), '') = '' or coalesce(trim(p_customer_phone), '') = '' then
    raise exception 'Name and phone number are required.';
  end if;
  if p_delivery_method not in ('delivery','pickup') then
    raise exception 'Invalid delivery method.';
  end if;
  if p_delivery_method = 'delivery' and coalesce(trim(p_shipping_address), '') = '' then
    raise exception 'Delivery address is required.';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'Too many cart items.';
  end if;

  insert into public.orders (
    id,user_id,tracking_code,customer_name,customer_email,customer_phone,status,
    delivery_method,shipping_address,subtotal_pkr,delivery_pkr,total_pkr,notes
  ) values (
    v_order_id,auth.uid(),v_tracking,trim(p_customer_name),nullif(trim(p_customer_email),''),
    trim(p_customer_phone),'pending',p_delivery_method,nullif(trim(p_shipping_address),''),
    0,0,0,nullif(trim(p_notes),'')
  );

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
      v_qty := greatest(1,least((v_item->>'quantity')::integer,20));
    exception when others then
      raise exception 'Invalid cart item.';
    end;

    select * into v_product
    from public.products
    where id = v_product_id and published = true
    for update;

    if not found then raise exception 'A product is no longer available.'; end if;
    if v_product.stock_qty < v_qty then raise exception '% does not have enough stock.',v_product.name; end if;

    insert into public.order_items(order_id,product_id,product_name,quantity,unit_price_pkr,line_total_pkr)
    values(v_order_id,v_product.id,v_product.name,v_qty,v_product.price_pkr,v_product.price_pkr*v_qty);

    update public.products
      set stock_qty = stock_qty - v_qty, updated_at = now()
      where id = v_product.id;

    v_total := v_total + (v_product.price_pkr*v_qty);
  end loop;

  update public.orders
    set subtotal_pkr=v_total,total_pkr=v_total,updated_at=now()
    where id=v_order_id;

  return query select v_order_id,v_tracking,v_total;
end;
$$;

create or replace function public.track_store_order(p_tracking_code text)
returns table(tracking_code text,status text,total_pkr numeric,delivery_method text,created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select o.tracking_code,o.status,o.total_pkr,o.delivery_method,o.created_at
  from public.orders o
  where o.tracking_code = upper(trim(p_tracking_code))
  limit 1;
$$;

revoke all on function public.place_store_order(text,text,text,text,text,text,jsonb) from public;
revoke all on function public.track_store_order(text) from public;
grant execute on function public.place_store_order(text,text,text,text,text,text,jsonb) to anon,authenticated;
grant execute on function public.track_store_order(text) to anon,authenticated;

commit;

-- After creating the administrator in Supabase Auth, set the role once using SQL:
-- update public.profiles
-- set role='admin', full_name='Your Admin Name'
-- where id='USER-UUID-HERE';
