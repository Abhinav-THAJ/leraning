-- Supabase Schema for ITTA Academy LMS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  all_access boolean default false, -- Unlocks all courses
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Courses Table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  price numeric default 25000.00, -- Default ₹25,000
  thumbnail_url text,
  instructor_id uuid references public.profiles(id),
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Modules Table
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Lessons Table
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text, -- Vimeo or Bunny.net URL
  duration_seconds integer default 0,
  order_index integer not null default 0,
  is_free_preview boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Payments Table (Razorpay)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric not null,
  currency text default 'INR',
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Progress Table
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  last_watched_seconds integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- RLS Policies

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Courses
alter table public.courses enable row level security;
create policy "Courses are viewable by everyone." on public.courses for select using (true);
create policy "Admins can insert courses." on public.courses for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update courses." on public.courses for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete courses." on public.courses for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Modules
alter table public.modules enable row level security;
create policy "Modules are viewable by everyone." on public.modules for select using (true);
create policy "Admins can manage modules." on public.modules for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Lessons
alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone." on public.lessons for select using (true);
create policy "Admins can manage lessons." on public.lessons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Progress
alter table public.progress enable row level security;
create policy "Users can view own progress." on public.progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress." on public.progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress." on public.progress for update using (auth.uid() = user_id);

-- Setup auth trigger for profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Dummy Data based on internationaltradingtraining.com
insert into public.courses (id, title, slug, description, price, published) values
  ('d1f11111-1111-1111-1111-111111111111', 'International Trade Specialist (ITS) Accreditation', 'international-trade-specialist', 'Comprehensive certification program covering global trade finance, logistics, and compliance.', 25000.00, true),
  ('d2f22222-2222-2222-2222-222222222222', 'Export / Import Certificate (EIC)', 'export-import-certificate', 'Master the fundamentals and advanced strategies of exporting and importing worldwide.', 25000.00, true);

insert into public.modules (id, course_id, title, order_index) values
  ('m1f11111-1111-1111-1111-111111111111', 'd1f11111-1111-1111-1111-111111111111', 'Introduction to Global Trade', 1),
  ('m2f22222-2222-2222-2222-222222222222', 'd1f11111-1111-1111-1111-111111111111', 'Trade Finance Mechanisms', 2);

insert into public.lessons (id, module_id, title, is_free_preview) values
  ('l1f11111-1111-1111-1111-111111111111', 'm1f11111-1111-1111-1111-111111111111', 'Understanding Incoterms 2020', true),
  ('l2f22222-2222-2222-2222-222222222222', 'm2f22222-2222-2222-2222-222222222222', 'Letters of Credit Explained', false);
