"use server";

import { createClient } from "@/lib/supabase/server";
import { TMDBMovie, TMDBTVShow } from "@/lib/tmdb/client";

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  media_type: 'movie' | 'tv';
  media_id: number;
  priority: 1 | 2 | 3; // 1=must watch, 2=want to watch, 3=maybe
  added_at: string;
  notes?: string;
  // Populated from joins
  movie_data?: any;
  tv_data?: any;
}

export interface WatchHistoryItem {
  id: string;
  user_id: string;
  media_type: 'movie' | 'tv';
  media_id: number;
  watched_at: string;
  rating?: number;
  review?: string;
  // Populated from joins
  movie_data?: any;
  tv_data?: any;
}

export interface TVProgress {
  id: string;
  user_id: string;
  tv_show_id: number;
  current_season: number;
  current_episode: number;
  total_episodes_watched: number;
  status: 'watching' | 'completed' | 'dropped' | 'on_hold';
  started_at: string;
  updated_at: string;
  completed_at?: string;
  // Populated from joins
  tv_show?: any;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'watched_movie' | 'watched_episode' | 'completed_series' | 'rated_movie' | 'rated_episode' | 'added_to_watchlist';
  media_type: 'movie' | 'tv';
  media_id: number;
  episode_id?: number;
  rating?: number;
  review?: string;
  created_at: string;
  // Populated from joins
  user_profile?: UserProfile;
  movie_data?: any;
  tv_data?: any;
  episode_data?: any;
}

// User Profile Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export async function createUserProfile(profile: {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
}): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  
  return data;
}

// Media Caching Operations
export async function upsertMovie(movie: TMDBMovie): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('movies')
    .upsert({
      tmdb_id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date || null,
      runtime: movie.runtime || null,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      adult: movie.adult,
      genres: movie.genres || movie.genre_ids || [],
    }, {
      onConflict: 'tmdb_id'
    });
    
  if (error) {
    console.error('Error upserting movie:', error);
  }
}

export async function upsertTVShow(tvShow: TMDBTVShow): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('tv_shows')
    .upsert({
      tmdb_id: tvShow.id,
      name: tvShow.name,
      original_name: tvShow.original_name,
      overview: tvShow.overview,
      poster_path: tvShow.poster_path,
      backdrop_path: tvShow.backdrop_path,
      first_air_date: tvShow.first_air_date || null,
      number_of_seasons: tvShow.number_of_seasons || null,
      number_of_episodes: tvShow.number_of_episodes || null,
      episode_run_time: tvShow.episode_run_time || [],
      vote_average: tvShow.vote_average,
      vote_count: tvShow.vote_count,
      popularity: tvShow.popularity,
      status: tvShow.status || null,
      genres: tvShow.genres || tvShow.genre_ids || [],
    }, {
      onConflict: 'tmdb_id'
    });
    
  if (error) {
    console.error('Error upserting TV show:', error);
  }
}

// Watchlist Operations
export async function addToWatchlist(
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number,
  priority: 1 | 2 | 3 = 2,
  notes?: string
): Promise<WatchlistItem | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_watchlist')
    .insert({
      user_id: userId,
      media_type: mediaType,
      media_id: mediaId,
      priority,
      notes,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding to watchlist:', error);
    return null;
  }
  
  return data;
}

export async function removeFromWatchlist(userId: string, mediaType: 'movie' | 'tv', mediaId: number): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('media_type', mediaType)
    .eq('media_id', mediaId);
    
  if (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
  
  return true;
}

export async function getUserWatchlist(userId: string, mediaType?: 'movie' | 'tv'): Promise<WatchlistItem[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('user_watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
    
  if (mediaType) {
    query = query.eq('media_type', mediaType);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
  
  return data || [];
}

export async function isInWatchlist(userId: string, mediaType: 'movie' | 'tv', mediaId: number): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)
    .single();
    
  return !error && !!data;
}

// Watch History Operations
export async function markAsWatched(
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number,
  rating?: number,
  review?: string
): Promise<WatchHistoryItem | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_watch_history')
    .upsert({
      user_id: userId,
      media_type: mediaType,
      media_id: mediaId,
      rating,
      review,
      watched_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,media_type,media_id'
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error marking as watched:', error);
    return null;
  }
  
  // Remove from watchlist if it exists
  await removeFromWatchlist(userId, mediaType, mediaId);
  
  // Create activity
  await createUserActivity(userId, 'watched_movie', mediaType, mediaId, undefined, rating, review);
  
  return data;
}

export async function getUserWatchHistory(userId: string, limit = 50): Promise<WatchHistoryItem[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_watch_history')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }
  
  return data || [];
}

export async function isWatched(userId: string, mediaType: 'movie' | 'tv', mediaId: number): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_watch_history')
    .select('id')
    .eq('user_id', userId)
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)
    .single();
    
  return !error && !!data;
}

// TV Progress Operations
export async function updateTVProgress(
  userId: string,
  tvShowId: number,
  currentSeason: number,
  currentEpisode: number,
  status: 'watching' | 'completed' | 'dropped' | 'on_hold' = 'watching'
): Promise<TVProgress | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_tv_progress')
    .upsert({
      user_id: userId,
      tv_show_id: tvShowId,
      current_season: currentSeason,
      current_episode: currentEpisode,
      status,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,tv_show_id'
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error updating TV progress:', error);
    return null;
  }
  
  return data;
}

export async function getUserTVProgress(userId: string): Promise<TVProgress[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_tv_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'watching')
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching TV progress:', error);
    return [];
  }
  
  return data || [];
}

// Activity Operations
export async function createUserActivity(
  userId: string,
  activityType: UserActivity['activity_type'],
  mediaType: 'movie' | 'tv',
  mediaId: number,
  episodeId?: number,
  rating?: number,
  review?: string
): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_activities')
    .insert({
      user_id: userId,
      activity_type: activityType,
      media_type: mediaType,
      media_id: mediaId,
      episode_id: episodeId,
      rating,
      review,
    });
    
  if (error) {
    console.error('Error creating user activity:', error);
  }
}

export async function getUserActivities(userId: string, limit = 20): Promise<UserActivity[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_activities')
    .select(`
      *,
      user_profiles!inner(username, display_name, avatar_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
  
  return data || [];
}

export async function getFollowingActivities(userId: string, limit = 50): Promise<UserActivity[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_activities')
    .select(`
      *,
      user_profiles!inner(username, display_name, avatar_url)
    `)
    .in('user_id', 
      // Subquery to get users that the current user is following
      supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId)
    )
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching following activities:', error);
    return [];
  }
  
  return data || [];
}

// Statistics Operations
export async function getUserStats(userId: string) {
  const supabase = await createClient();
  
  // Get total movies watched
  const { count: moviesWatched } = await supabase
    .from('user_watch_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('media_type', 'movie');
    
  // Get total TV shows completed
  const { count: showsCompleted } = await supabase
    .from('user_tv_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');
    
  // Get total episodes watched
  const { count: episodesWatched } = await supabase
    .from('user_episode_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('watched', true);
    
  // Get watchlist count
  const { count: watchlistCount } = await supabase
    .from('user_watchlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
    
  return {
    moviesWatched: moviesWatched || 0,
    showsCompleted: showsCompleted || 0,
    episodesWatched: episodesWatched || 0,
    watchlistCount: watchlistCount || 0,
  };
}