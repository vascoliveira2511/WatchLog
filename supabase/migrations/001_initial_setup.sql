-- Create profiles table for user data
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3),
  constraint username_format check (username ~ '^[a-z0-9_]+$')
);

-- Set up Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();