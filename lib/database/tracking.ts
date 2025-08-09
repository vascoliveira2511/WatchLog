import { createClient } from '@/lib/supabase/client';
import { WatchStatus } from '@/components/ui/watch-button';

export interface UserMovieData {
  watchStatus: WatchStatus;
  rating?: number;
  watchedAt?: string;
  inWatchlist: boolean;
}

export interface UserShowData {
  watchStatus: WatchStatus;
  totalWatched: number;
  inWatchlist: boolean;
  lastWatchedEpisode?: number;
}

export class TrackingService {
  private supabase = createClient();

  // Movie tracking functions
  async getMovieUserData(tmdbId: number): Promise<UserMovieData> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get movie record, create if doesn't exist
    let { data: movie } = await this.supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbId)
      .single();

    if (!movie) {
      return {
        watchStatus: 'unwatched',
        inWatchlist: false
      };
    }

    const movieId = movie.id;

    // Check if watched
    const { data: watches } = await this.supabase
      .from('movie_watches')
      .select('id, watched_at, rating')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .order('watched_at', { ascending: false })
      .limit(1);

    // Check watchlist status
    const { data: watchlistEntry } = await this.supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_type', 'movie')
      .eq('media_id', movieId)
      .single();

    if (watches && watches.length > 0) {
      const lastWatch = watches[0];
      return {
        watchStatus: 'watched',
        rating: lastWatch.rating,
        watchedAt: lastWatch.watched_at,
        inWatchlist: !!watchlistEntry
      };
    }

    if (watchlistEntry) {
      return {
        watchStatus: 'plan_to_watch',
        inWatchlist: true
      };
    }

    return {
      watchStatus: 'unwatched',
      inWatchlist: false
    };
  }

  async updateMovieStatus(tmdbId: number, status: WatchStatus, movieData?: any): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Ensure movie exists in database
    let { data: movie } = await this.supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbId)
      .single();

    if (!movie && movieData) {
      const { data: newMovie } = await this.supabase
        .from('movies')
        .insert({
          tmdb_id: tmdbId,
          title: movieData.title,
          year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : null,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          overview: movieData.overview,
          runtime: movieData.runtime,
          genres: movieData.genres || []
        })
        .select('id')
        .single();
      
      movie = newMovie;
    }

    if (!movie) throw new Error('Movie not found');

    const movieId = movie.id;

    // Remove from watchlist if changing to unwatched
    if (status === 'unwatched') {
      await this.supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('media_type', 'movie')
        .eq('media_id', movieId);
    }
    
    // Add to watchlist if plan_to_watch
    else if (status === 'plan_to_watch') {
      await this.supabase
        .from('watchlist')
        .upsert({
          user_id: user.id,
          media_type: 'movie',
          media_id: movieId
        });
    }
    
    // Add to watched if watched
    else if (status === 'watched') {
      await this.supabase
        .from('movie_watches')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          watched_at: new Date().toISOString()
        });

      // Remove from watchlist since it's now watched
      await this.supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('media_type', 'movie')
        .eq('media_id', movieId);

      // Add to activity feed
      await this.supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          type: 'watch',
          metadata: {
            media_type: 'movie',
            media_id: movieId,
            tmdb_id: tmdbId,
            title: movieData?.title
          }
        });
    }
  }

  async rateMovie(tmdbId: number, rating: number): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get movie record
    const { data: movie } = await this.supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbId)
      .single();

    if (!movie) throw new Error('Movie not found');

    // Update the most recent watch record or create one
    const { data: watches } = await this.supabase
      .from('movie_watches')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movie.id)
      .order('watched_at', { ascending: false })
      .limit(1);

    if (watches && watches.length > 0) {
      // Update existing watch
      await this.supabase
        .from('movie_watches')
        .update({ rating })
        .eq('id', watches[0].id);
    } else {
      // Create new watch record
      await this.supabase
        .from('movie_watches')
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          rating,
          watched_at: new Date().toISOString()
        });
    }

    // Add to activity feed
    await this.supabase
      .from('activity_feed')
      .insert({
        user_id: user.id,
        type: 'rate',
        metadata: {
          media_type: 'movie',
          media_id: movie.id,
          tmdb_id: tmdbId,
          rating
        }
      });
  }

  // TV Show tracking functions
  async getShowUserData(tmdbId: number): Promise<UserShowData> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get show record
    const { data: show } = await this.supabase
      .from('shows')
      .select('id')
      .eq('tmdb_id', tmdbId)
      .single();

    if (!show) {
      return {
        watchStatus: 'unwatched',
        totalWatched: 0,
        inWatchlist: false
      };
    }

    const showId = show.id;

    // Get show progress
    const { data: progress } = await this.supabase
      .from('show_progress')
      .select('status, total_watched, last_watched_episode')
      .eq('user_id', user.id)
      .eq('show_id', showId)
      .single();

    // Check watchlist status
    const { data: watchlistEntry } = await this.supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_type', 'tv')
      .eq('media_id', showId)
      .single();

    if (progress) {
      // Convert database status to WatchStatus
      let watchStatus: WatchStatus = 'unwatched';
      switch (progress.status) {
        case 'watching':
          watchStatus = 'watching';
          break;
        case 'completed':
          watchStatus = 'watched';
          break;
        case 'dropped':
          watchStatus = 'dropped';
          break;
        case 'planned':
          watchStatus = 'plan_to_watch';
          break;
      }

      return {
        watchStatus,
        totalWatched: progress.total_watched,
        lastWatchedEpisode: progress.last_watched_episode,
        inWatchlist: !!watchlistEntry || progress.status !== 'completed'
      };
    }

    if (watchlistEntry) {
      return {
        watchStatus: 'plan_to_watch',
        totalWatched: 0,
        inWatchlist: true
      };
    }

    return {
      watchStatus: 'unwatched',
      totalWatched: 0,
      inWatchlist: false
    };
  }

  async updateShowStatus(tmdbId: number, status: WatchStatus, showData?: any): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Ensure show exists in database
    let { data: show } = await this.supabase
      .from('shows')
      .select('id')
      .eq('tmdb_id', tmdbId)
      .single();

    if (!show && showData) {
      const { data: newShow } = await this.supabase
        .from('shows')
        .insert({
          tmdb_id: tmdbId,
          title: showData.name || showData.title,
          first_air_date: showData.first_air_date,
          poster_path: showData.poster_path,
          backdrop_path: showData.backdrop_path,
          overview: showData.overview,
          genres: showData.genres || [],
          status: showData.status
        })
        .select('id')
        .single();
      
      show = newShow;
    }

    if (!show) throw new Error('Show not found');

    const showId = show.id;

    // Convert WatchStatus to database status
    let dbStatus: 'watching' | 'completed' | 'dropped' | 'planned' = 'watching';
    switch (status) {
      case 'watching':
        dbStatus = 'watching';
        break;
      case 'watched':
        dbStatus = 'completed';
        break;
      case 'dropped':
        dbStatus = 'dropped';
        break;
      case 'plan_to_watch':
        dbStatus = 'planned';
        break;
      case 'unwatched':
        // Remove from progress and watchlist
        await this.supabase
          .from('show_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('show_id', showId);

        await this.supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('media_type', 'tv')
          .eq('media_id', showId);
        return;
    }

    // Update or create show progress
    await this.supabase
      .from('show_progress')
      .upsert({
        user_id: user.id,
        show_id: showId,
        status: dbStatus,
        total_watched: 0
      });

    // Handle watchlist
    if (status === 'plan_to_watch') {
      await this.supabase
        .from('watchlist')
        .upsert({
          user_id: user.id,
          media_type: 'tv',
          media_id: showId
        });
    } else {
      // Remove from watchlist if actively watching/watched/dropped
      await this.supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('media_type', 'tv')
        .eq('media_id', showId);
    }
  }

  // Utility functions
  async getUserWatchlist(mediaType?: 'movie' | 'tv'): Promise<any[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = this.supabase
      .from('watchlist')
      .select(`
        id,
        media_type,
        media_id,
        added_at,
        priority
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (mediaType) {
      query = query.eq('media_type', mediaType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  async getUserStats(): Promise<{
    moviesWatched: number;
    showsWatched: number;
    episodesWatched: number;
    totalWatchTime: number;
  }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get movies watched count
    const { count: moviesWatched } = await this.supabase
      .from('movie_watches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get shows completed count
    const { count: showsWatched } = await this.supabase
      .from('show_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    // Get episodes watched count
    const { count: episodesWatched } = await this.supabase
      .from('episode_watches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // TODO: Calculate total watch time from movie runtimes and episode watches
    
    return {
      moviesWatched: moviesWatched || 0,
      showsWatched: showsWatched || 0,
      episodesWatched: episodesWatched || 0,
      totalWatchTime: 0 // Placeholder
    };
  }
}

export const trackingService = new TrackingService();