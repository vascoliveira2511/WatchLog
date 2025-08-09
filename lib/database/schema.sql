-- WatchLog Database Schema
-- This file contains the SQL schema for all database tables

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Movies table (cache TMDB data)
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  original_title TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date DATE,
  runtime INTEGER,
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  popularity DECIMAL(10,3),
  adult BOOLEAN DEFAULT FALSE,
  genres JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TV Shows table (cache TMDB data)
CREATE TABLE IF NOT EXISTS tv_shows (
  id INTEGER PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  original_name TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  first_air_date DATE,
  last_air_date DATE,
  number_of_seasons INTEGER,
  number_of_episodes INTEGER,
  episode_run_time JSONB,
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  popularity DECIMAL(10,3),
  status TEXT,
  genres JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TV Seasons table
CREATE TABLE IF NOT EXISTS tv_seasons (
  id INTEGER PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  tv_show_id INTEGER NOT NULL REFERENCES tv_shows(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  air_date DATE,
  episode_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TV Episodes table
CREATE TABLE IF NOT EXISTS tv_episodes (
  id INTEGER PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  tv_show_id INTEGER NOT NULL REFERENCES tv_shows(id) ON DELETE CASCADE,
  season_id INTEGER NOT NULL REFERENCES tv_seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  still_path TEXT,
  air_date DATE,
  runtime INTEGER,
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User watchlist
CREATE TABLE IF NOT EXISTS user_watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  media_id INTEGER NOT NULL,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 3), -- 1=must watch, 2=want to watch, 3=maybe
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  UNIQUE(user_id, media_type, media_id)
);

-- RLS for watchlist
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist"
  ON user_watchlist
  TO authenticated
  USING (auth.uid() = user_id);

-- User watch history
CREATE TABLE IF NOT EXISTS user_watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  media_id INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating DECIMAL(2,1) CHECK (rating >= 0.5 AND rating <= 5.0), -- 0.5 to 5.0 stars
  review TEXT,
  
  UNIQUE(user_id, media_type, media_id)
);

-- RLS for watch history
ALTER TABLE user_watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watch history"
  ON user_watch_history
  TO authenticated
  USING (auth.uid() = user_id);

-- TV Show progress tracking
CREATE TABLE IF NOT EXISTS user_tv_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tv_show_id INTEGER NOT NULL REFERENCES tv_shows(id) ON DELETE CASCADE,
  current_season INTEGER DEFAULT 1,
  current_episode INTEGER DEFAULT 1,
  total_episodes_watched INTEGER DEFAULT 0,
  status TEXT DEFAULT 'watching' CHECK (status IN ('watching', 'completed', 'dropped', 'on_hold')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, tv_show_id)
);

-- RLS for TV progress
ALTER TABLE user_tv_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own TV progress"
  ON user_tv_progress
  TO authenticated
  USING (auth.uid() = user_id);

-- Episode watch tracking
CREATE TABLE IF NOT EXISTS user_episode_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id INTEGER NOT NULL REFERENCES tv_episodes(id) ON DELETE CASCADE,
  tv_show_id INTEGER NOT NULL REFERENCES tv_shows(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMP WITH TIME ZONE,
  rating DECIMAL(2,1) CHECK (rating >= 0.5 AND rating <= 5.0),
  
  UNIQUE(user_id, episode_id)
);

-- RLS for episode progress
ALTER TABLE user_episode_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own episode progress"
  ON user_episode_progress
  TO authenticated
  USING (auth.uid() = user_id);

-- User follows/social features
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- RLS for follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public follows"
  ON user_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON user_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON user_follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- User activity feed
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('watched_movie', 'watched_episode', 'completed_series', 'rated_movie', 'rated_episode', 'added_to_watchlist')),
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  media_id INTEGER NOT NULL,
  episode_id INTEGER REFERENCES tv_episodes(id) ON DELETE CASCADE,
  rating DECIMAL(2,1),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for activities (public viewing)
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_tv_shows_tmdb_id ON tv_shows(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_tv_seasons_tv_show_id ON tv_seasons(tv_show_id);
CREATE INDEX IF NOT EXISTS idx_tv_episodes_tv_show_id ON tv_episodes(tv_show_id);
CREATE INDEX IF NOT EXISTS idx_tv_episodes_season_id ON tv_episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watch_history_user_id ON user_watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tv_progress_user_id ON user_tv_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_episode_progress_user_id ON user_episode_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tv_shows_updated_at
    BEFORE UPDATE ON tv_shows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tv_progress_updated_at
    BEFORE UPDATE ON user_tv_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();