-- Create 'uploads' bucket and set policies
-- Run this in Supabase SQL Editor

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- 2. Enable RLS on objects (it's usually enabled by default, but good to ensure)
alter table storage.objects enable row level security;

-- 3. Drop existing policies to avoid conflicts (optional, but safe)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Anon Upload" on storage.objects;
drop policy if exists "Anon Update" on storage.objects;
drop policy if exists "Anon Delete" on storage.objects;

-- 4. Create Policies

-- Allow everyone to view files (Public Read)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'uploads' );

-- Allow everyone (Anon) to upload files
-- Note: Since we use a simple frontend password, we allow anon uploads.
create policy "Anon Upload"
  on storage.objects for insert
  with check ( bucket_id = 'uploads' );

-- Allow everyone (Anon) to update/delete their files
create policy "Anon Update"
  on storage.objects for update
  using ( bucket_id = 'uploads' );

create policy "Anon Delete"
  on storage.objects for delete
  using ( bucket_id = 'uploads' );
