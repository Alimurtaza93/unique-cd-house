-- Unique CD House production upgrade
-- Run this in the Unique CD House Supabase SQL Editor, not the Hamza Dental project.
-- Adds gaming departments and secure guest checkout / tracking RPCs.

begin;

alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('Consoles','Games','Controllers','Gaming Devices','PC Gaming','Accessories','Used'));

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
  v_tracking text := 'UCD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id uuid;
  v_qty integer;
begin
  if coalesce(trim(p_customer_name), '') = '' or coalesce(trim(p_customer_phone), '') = '' then raise exception 'Name and phone number are required.'; end if;
  if p_delivery_method not in ('delivery','pickup') then raise exception 'Invalid delivery method.'; end if;
  if p_delivery_method = 'delivery' and coalesce(trim(p_shipping_address), '') = '' then raise exception 'Delivery address is required.'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Your cart is empty.'; end if;

  insert into public.orders (id,user_id,tracking_code,customer_name,customer_email,customer_phone,status,delivery_method,shipping_address,subtotal_pkr,delivery_pkr,total_pkr,notes)
  values (v_order_id,auth.uid(),v_tracking,trim(p_customer_name),nullif(trim(p_customer_email),''),trim(p_customer_phone),'pending',p_delivery_method,nullif(trim(p_shipping_address),''),0,0,0,nullif(trim(p_notes),''));

  for v_item in select value from jsonb_array_elements(p_items) loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
      v_qty := greatest(1,least((v_item->>'quantity')::integer,20));
    exception when others then raise exception 'Invalid cart item.'; end;
    select * into v_product from public.products where id=v_product_id and published=true for update;
    if not found then raise exception 'A product is no longer available.'; end if;
    if v_product.stock_qty < v_qty then raise exception '% does not have enough stock.',v_product.name; end if;
    insert into public.order_items(order_id,product_id,product_name,quantity,unit_price_pkr,line_total_pkr)
      values(v_order_id,v_product.id,v_product.name,v_qty,v_product.price_pkr,v_product.price_pkr*v_qty);
    update public.products set stock_qty=stock_qty-v_qty,updated_at=now() where id=v_product.id;
    v_total := v_total + (v_product.price_pkr*v_qty);
  end loop;
  update public.orders set subtotal_pkr=v_total,total_pkr=v_total,updated_at=now() where id=v_order_id;
  return query select v_order_id,v_tracking,v_total;
end;
$$;

create or replace function public.track_store_order(p_tracking_code text)
returns table(tracking_code text,status text,total_pkr numeric,delivery_method text,created_at timestamptz)
language sql stable security definer set search_path=''
as $$
  select o.tracking_code,o.status,o.total_pkr,o.delivery_method,o.created_at
  from public.orders o where o.tracking_code=upper(trim(p_tracking_code)) limit 1;
$$;

revoke all on function public.place_store_order(text,text,text,text,text,text,jsonb) from public;
revoke all on function public.track_store_order(text) from public;
grant execute on function public.place_store_order(text,text,text,text,text,text,jsonb) to anon,authenticated;
grant execute on function public.track_store_order(text) to anon,authenticated;

drop policy if exists "customers create own orders" on public.orders;
drop policy if exists "customer insert order items" on public.order_items;
drop policy if exists "admin manage order items" on public.order_items;
revoke insert on table public.orders, public.order_items from anon, authenticated;
revoke select on table public.orders, public.order_items from anon;

drop policy if exists "customers read own orders" on public.orders;
create policy "customers read own orders" on public.orders for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));
drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders" on public.orders for delete to authenticated using ((select public.is_admin()));

drop policy if exists "customers read own order items" on public.order_items;
create policy "customers read own order items" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin())))
);
create policy "admin update order items" on public.order_items for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete order items" on public.order_items for delete to authenticated using ((select public.is_admin()));

commit;
