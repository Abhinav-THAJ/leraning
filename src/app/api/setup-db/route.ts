import { NextRequest, NextResponse } from "next/server";

const PROJECT_REF =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "") ?? "";

const SETUP_SQL = `
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  all_access boolean default false,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  price numeric default 25000.00,
  thumbnail_url text,
  instructor_id uuid references public.profiles(id),
  published boolean default false,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  duration_seconds integer default 0,
  order_index integer not null default 0,
  is_free_preview boolean default false,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric not null,
  currency text default 'INR',
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  last_watched_seconds integer default 0,
  updated_at timestamptz default timezone('utc', now()) not null,
  unique(user_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.courses  enable row level security;
alter table public.modules  enable row level security;
alter table public.lessons  enable row level security;
alter table public.progress enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Profiles viewable by everyone') then
    create policy "Profiles viewable by everyone" on public.profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can insert own profile') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='courses' and policyname='Courses viewable by everyone') then
    create policy "Courses viewable by everyone" on public.courses for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='courses' and policyname='Admins can insert courses') then
    create policy "Admins can insert courses" on public.courses for insert with check (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename='courses' and policyname='Admins can update courses') then
    create policy "Admins can update courses" on public.courses for update using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename='courses' and policyname='Admins can delete courses') then
    create policy "Admins can delete courses" on public.courses for delete using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename='modules' and policyname='Modules viewable by everyone') then
    create policy "Modules viewable by everyone" on public.modules for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='modules' and policyname='Admins can manage modules') then
    create policy "Admins can manage modules" on public.modules for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename='lessons' and policyname='Lessons viewable by everyone') then
    create policy "Lessons viewable by everyone" on public.lessons for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='lessons' and policyname='Admins can manage lessons') then
    create policy "Admins can manage lessons" on public.lessons for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename='progress' and policyname='Users can view own progress') then
    create policy "Users can view own progress" on public.progress for select using (auth.uid() = user_id);
    create policy "Users can insert own progress" on public.progress for insert with check (auth.uid() = user_id);
    create policy "Users can update own progress" on public.progress for update using (auth.uid() = user_id);
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.courses (id, title, slug, description, price, published) values
  ('d1f11111-1111-1111-1111-111111111111',
   'International Trade Specialist (ITS) Accreditation',
   'international-trade-specialist',
   'Comprehensive certification program covering global trade finance, logistics, and compliance.',
   25000.00, true),
  ('d2f22222-2222-2222-2222-222222222222',
   'Export / Import Certificate (EIC)',
   'export-import-certificate',
   'Master the fundamentals and advanced strategies of exporting and importing worldwide.',
   25000.00, true)
on conflict (id) do nothing;

insert into public.modules (id, course_id, title, order_index) values
  ('m1f11111-1111-1111-1111-111111111111', 'd1f11111-1111-1111-1111-111111111111', 'Introduction to Global Trade', 1),
  ('m2f22222-2222-2222-2222-222222222222', 'd1f11111-1111-1111-1111-111111111111', 'Trade Finance Mechanisms', 2),
  ('m3f33333-3333-3333-3333-333333333333', 'd2f22222-2222-2222-2222-222222222222', 'Export Fundamentals', 1),
  ('m4f44444-4444-4444-4444-444444444444', 'd2f22222-2222-2222-2222-222222222222', 'Import Procedures & Customs', 2)
on conflict (id) do nothing;

insert into public.lessons (id, module_id, title, is_free_preview, duration_seconds, order_index) values
  ('l1f11111-1111-1111-1111-111111111111', 'm1f11111-1111-1111-1111-111111111111', 'Understanding Incoterms 2020',        true,  1800, 1),
  ('l2f22222-2222-2222-2222-222222222222', 'm2f22222-2222-2222-2222-222222222222', 'Letters of Credit Explained',         false, 2400, 1),
  ('l3f33333-3333-3333-3333-333333333333', 'm3f33333-3333-3333-3333-333333333333', 'Export Documentation Basics',         true,  1500, 1),
  ('l4f44444-4444-4444-4444-444444444444', 'm3f33333-3333-3333-3333-333333333333', 'HS Codes and Tariff Classification',  false, 2100, 2),
  ('l5f55555-5555-5555-5555-555555555555', 'm4f44444-4444-4444-4444-444444444444', 'Customs Clearance Process',           false, 1950, 1),
  ('l6f66666-6666-6666-6666-666666666666', 'm4f44444-4444-4444-4444-444444444444', 'Import Duties and Taxes',             false, 2200, 2)
on conflict (id) do nothing;
`;

export async function POST(req: NextRequest) {
  // Accept token from request body OR from env
  let token: string | undefined;
  try {
    const body = await req.json();
    token = body.token;
  } catch {}

  if (!token) token = process.env.SUPABASE_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "No access token provided.",
        hint: `Get your Supabase Personal Access Token at: https://supabase.com/dashboard/account/tokens`,
      },
      { status: 400 }
    );
  }

  const apiUrl = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: SETUP_SQL }),
  });

  if (!response.ok) {
    const body = await response.text();
    return NextResponse.json(
      {
        success: false,
        error:
          response.status === 401
            ? "Invalid or expired token. Please generate a new one."
            : `API error ${response.status}: ${body}`,
        hint:
          response.status === 401
            ? "https://supabase.com/dashboard/account/tokens"
            : undefined,
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Database initialized successfully!",
  });
}
