-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Properties table
create table properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  reference_id text unique not null,
  slug text unique not null,
  listing_type text not null check (listing_type in ('buy', 'rent')),
  property_type text not null check (property_type in ('apartment', 'villa', 'house', 'office', 'land', 'commercial')),
  price numeric not null,
  city text not null,
  neighborhood text not null,
  address text,
  surface_area numeric not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  parking integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'sold', 'rented')),
  description text,
  amenities text[] default '{}',
  cover_image_url text,
  video_url text,
  map_url text,
  agent_name text,
  agent_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- Property images table
create table property_images (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid not null references properties(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz default now()
);

-- Indexes
create index properties_status_idx on properties(status);
create index properties_city_idx on properties(city);
create index properties_listing_type_idx on properties(listing_type);
create index properties_property_type_idx on properties(property_type);
create index properties_slug_idx on properties(slug);
create index property_images_property_id_idx on property_images(property_id);

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_properties_updated_at
before update on properties
for each row execute function update_updated_at_column();

-- RLS Policies
alter table properties enable row level security;
alter table property_images enable row level security;

-- Public can read published properties
create policy "Public can view published properties"
on properties for select
using (status = 'published');

-- Authenticated users (admins) can do everything
create policy "Admins can manage properties"
on properties for all
using (auth.role() = 'authenticated');

create policy "Public can view images of published properties"
on property_images for select
using (
  exists (
    select 1 from properties p
    where p.id = property_id and p.status = 'published'
  )
);

create policy "Admins can manage images"
on property_images for all
using (auth.role() = 'authenticated');

-- Storage bucket (run this in Supabase SQL editor or dashboard)
-- Create a public bucket called 'property-images'
-- insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true);
