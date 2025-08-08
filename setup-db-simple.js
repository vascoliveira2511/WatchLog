// Simple database setup using Supabase client
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function setupDatabase() {
  console.log('🔄 Setting up database schema...');

  try {
    // Create profiles table
    console.log('Creating profiles table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists public.profiles (
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
      `
    });

    if (tableError) {
      console.error('❌ Error creating table:', tableError);
    } else {
      console.log('✅ Profiles table created');
    }

    // Enable RLS
    console.log('Enabling Row Level Security...');
    await supabase.rpc('exec_sql', {
      sql: 'alter table public.profiles enable row level security;'
    });

    // Create policies
    console.log('Creating security policies...');
    const policies = [
      {
        name: 'Public profiles viewable',
        sql: `create policy if not exists "Public profiles are viewable by everyone" on profiles for select using (true);`
      },
      {
        name: 'Users can insert profile',
        sql: `create policy if not exists "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);`
      },
      {
        name: 'Users can update profile',
        sql: `create policy if not exists "Users can update own profile" on profiles for update using (auth.uid() = id);`
      }
    ];

    for (const policy of policies) {
      await supabase.rpc('exec_sql', { sql: policy.sql });
      console.log(`✅ ${policy.name}`);
    }

    // Create trigger function
    console.log('Creating user signup trigger...');
    await supabase.rpc('exec_sql', {
      sql: `
        create or replace function public.handle_new_user()
        returns trigger as $$ 
        begin
          insert into public.profiles (id, username, display_name)
          values (
            new.id,
            coalesce(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text, 1, 8)),
            coalesce(new.raw_user_meta_data->>'display_name', 'User')
          );
          return new;
        end;
        $$ language plpgsql security definer;
      `
    });

    // Create trigger
    await supabase.rpc('exec_sql', {
      sql: `
        drop trigger if exists on_auth_user_created on auth.users;
        create trigger on_auth_user_created
          after insert on auth.users
          for each row execute procedure public.handle_new_user();
      `
    });

    console.log('✅ Database schema setup complete!');
    console.log('🎉 You can now try creating your account again.');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabase();