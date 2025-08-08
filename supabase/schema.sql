-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
CREATE TYPE watch_status AS ENUM ('watching', 'completed', 'dropped', 'planned');
CREATE TYPE media_type AS ENUM ('movie', 'tv', 'episode');
CREATE TYPE activity_type AS ENUM ('watch', 'rate', 'review', 'add_to_watchlist', 'complete_show', 'check_in');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Movies table (cached TMDb data)
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    year INTEGER,
    poster_path TEXT,
    backdrop_path TEXT,
    overview TEXT,
    runtime INTEGER,
    genres JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shows table (cached TMDb data)
CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    first_air_date DATE,
    poster_path TEXT,
    backdrop_path TEXT,
    overview TEXT,
    genres JSONB DEFAULT '[]',
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seasons table
CREATE TABLE seasons (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE NOT NULL,
    season_number INTEGER NOT NULL,
    episode_count INTEGER NOT NULL DEFAULT 0,
    air_date DATE,
    poster_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(show_id, season_number)
);

-- Episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE NOT NULL,
    season_number INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    air_date DATE,
    runtime INTEGER,
    overview TEXT,
    still_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(show_id, season_number, episode_number),
    FOREIGN KEY (show_id, season_number) REFERENCES seasons(show_id, season_number) ON DELETE CASCADE
);

-- Movie watches table
CREATE TABLE movie_watches (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    review TEXT,
    device TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episode watches table
CREATE TABLE episode_watches (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    progress_percentage INTEGER DEFAULT 100 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, episode_id)
);

-- Show progress tracking
CREATE TABLE show_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE NOT NULL,
    last_watched_episode INTEGER REFERENCES episodes(id),
    total_watched INTEGER DEFAULT 0,
    status watch_status DEFAULT 'watching',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, show_id)
);

-- Watchlist table
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    media_type media_type NOT NULL,
    media_id INTEGER NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    priority INTEGER DEFAULT 0,
    
    UNIQUE(user_id, media_type, media_id)
);

-- Follows/Friends table
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Watch sessions (for watch parties)
CREATE TABLE watch_sessions (
    id SERIAL PRIMARY KEY,
    host_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    media_type media_type NOT NULL,
    media_id INTEGER NOT NULL,
    participants JSONB DEFAULT '[]',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity feed table
CREATE TABLE activity_feed (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    type activity_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table (social sharing)
CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    media_type media_type NOT NULL,
    media_id INTEGER NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX idx_shows_tmdb_id ON shows(tmdb_id);
CREATE INDEX idx_seasons_show_id ON seasons(show_id);
CREATE INDEX idx_episodes_show_id ON episodes(show_id);
CREATE INDEX idx_episodes_show_season ON episodes(show_id, season_number);
CREATE INDEX idx_movie_watches_user_id ON movie_watches(user_id);
CREATE INDEX idx_movie_watches_movie_id ON movie_watches(movie_id);
CREATE INDEX idx_movie_watches_watched_at ON movie_watches(watched_at);
CREATE INDEX idx_episode_watches_user_id ON episode_watches(user_id);
CREATE INDEX idx_episode_watches_episode_id ON episode_watches(episode_id);
CREATE INDEX idx_episode_watches_watched_at ON episode_watches(watched_at);
CREATE INDEX idx_show_progress_user_id ON show_progress(user_id);
CREATE INDEX idx_show_progress_show_id ON show_progress(show_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_created_at ON check_ins(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Movie watches policies
CREATE POLICY "Users can view their own watches" ON movie_watches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own watches" ON movie_watches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own watches" ON movie_watches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own watches" ON movie_watches FOR DELETE USING (auth.uid() = user_id);

-- Episode watches policies
CREATE POLICY "Users can view their own episode watches" ON episode_watches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own episode watches" ON episode_watches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own episode watches" ON episode_watches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own episode watches" ON episode_watches FOR DELETE USING (auth.uid() = user_id);

-- Show progress policies
CREATE POLICY "Users can view their own show progress" ON show_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own show progress" ON show_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own show progress" ON show_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own show progress" ON show_progress FOR DELETE USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can view their own watchlist" ON watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to their own watchlist" ON watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own watchlist" ON watchlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own watchlist" ON watchlist FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Watch sessions policies
CREATE POLICY "Users can view sessions they participate in" ON watch_sessions FOR SELECT USING (
    auth.uid() = host_user_id OR 
    participants ? auth.uid()::text
);
CREATE POLICY "Users can create watch sessions" ON watch_sessions FOR INSERT WITH CHECK (auth.uid() = host_user_id);
CREATE POLICY "Users can update their own sessions" ON watch_sessions FOR UPDATE USING (auth.uid() = host_user_id);

-- Activity feed policies
CREATE POLICY "Users can view activity from people they follow" ON activity_feed FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = auth.uid() AND following_id = activity_feed.user_id
    )
);
CREATE POLICY "Users can insert their own activity" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Check-ins policies
CREATE POLICY "Users can view check-ins from people they follow" ON check_ins FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = auth.uid() AND following_id = check_ins.user_id
    )
);
CREATE POLICY "Users can create their own check-ins" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own check-ins" ON check_ins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own check-ins" ON check_ins FOR DELETE USING (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shows_updated_at BEFORE UPDATE ON shows FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_movie_watches_updated_at BEFORE UPDATE ON movie_watches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_episode_watches_updated_at BEFORE UPDATE ON episode_watches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_show_progress_updated_at BEFORE UPDATE ON show_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_watch_sessions_updated_at BEFORE UPDATE ON watch_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();