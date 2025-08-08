export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          updated_at?: string
        }
      }
      movies: {
        Row: {
          id: number
          tmdb_id: number
          title: string
          year: number | null
          poster_path: string | null
          backdrop_path: string | null
          overview: string | null
          runtime: number | null
          genres: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tmdb_id: number
          title: string
          year?: number | null
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          runtime?: number | null
          genres?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tmdb_id?: number
          title?: string
          year?: number | null
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          runtime?: number | null
          genres?: Json | null
          updated_at?: string
        }
      }
      shows: {
        Row: {
          id: number
          tmdb_id: number
          title: string
          first_air_date: string | null
          poster_path: string | null
          backdrop_path: string | null
          overview: string | null
          genres: Json | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tmdb_id: number
          title: string
          first_air_date?: string | null
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          genres?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tmdb_id?: number
          title?: string
          first_air_date?: string | null
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          genres?: Json | null
          status?: string | null
          updated_at?: string
        }
      }
      seasons: {
        Row: {
          id: number
          show_id: number
          season_number: number
          episode_count: number
          air_date: string | null
          poster_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          show_id: number
          season_number: number
          episode_count: number
          air_date?: string | null
          poster_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          show_id?: number
          season_number?: number
          episode_count?: number
          air_date?: string | null
          poster_path?: string | null
          updated_at?: string
        }
      }
      episodes: {
        Row: {
          id: number
          show_id: number
          season_number: number
          episode_number: number
          title: string
          air_date: string | null
          runtime: number | null
          overview: string | null
          still_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          show_id: number
          season_number: number
          episode_number: number
          title: string
          air_date?: string | null
          runtime?: number | null
          overview?: string | null
          still_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          show_id?: number
          season_number?: number
          episode_number?: number
          title?: string
          air_date?: string | null
          runtime?: number | null
          overview?: string | null
          still_path?: string | null
          updated_at?: string
        }
      }
      movie_watches: {
        Row: {
          id: number
          user_id: string
          movie_id: number
          watched_at: string
          rating: number | null
          review: string | null
          device: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          movie_id: number
          watched_at?: string
          rating?: number | null
          review?: string | null
          device?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          movie_id?: number
          watched_at?: string
          rating?: number | null
          review?: string | null
          device?: string | null
          location?: string | null
          updated_at?: string
        }
      }
      episode_watches: {
        Row: {
          id: number
          user_id: string
          episode_id: number
          watched_at: string
          rating: number | null
          progress_percentage: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          episode_id: number
          watched_at?: string
          rating?: number | null
          progress_percentage?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          episode_id?: number
          watched_at?: string
          rating?: number | null
          progress_percentage?: number | null
          updated_at?: string
        }
      }
      show_progress: {
        Row: {
          id: number
          user_id: string
          show_id: number
          last_watched_episode: number | null
          total_watched: number
          status: 'watching' | 'completed' | 'dropped' | 'planned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          show_id: number
          last_watched_episode?: number | null
          total_watched?: number
          status?: 'watching' | 'completed' | 'dropped' | 'planned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          show_id?: number
          last_watched_episode?: number | null
          total_watched?: number
          status?: 'watching' | 'completed' | 'dropped' | 'planned'
          updated_at?: string
        }
      }
      watchlist: {
        Row: {
          id: number
          user_id: string
          media_type: 'movie' | 'tv'
          media_id: number
          added_at: string
          priority: number | null
        }
        Insert: {
          id?: number
          user_id: string
          media_type: 'movie' | 'tv'
          media_id: number
          added_at?: string
          priority?: number | null
        }
        Update: {
          user_id?: string
          media_type?: 'movie' | 'tv'
          media_id?: number
          priority?: number | null
        }
      }
      follows: {
        Row: {
          id: number
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: number
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
        }
      }
      watch_sessions: {
        Row: {
          id: number
          host_user_id: string
          media_type: 'movie' | 'episode'
          media_id: number
          participants: Json
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          host_user_id: string
          media_type: 'movie' | 'episode'
          media_id: number
          participants?: Json
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          host_user_id?: string
          media_type?: 'movie' | 'episode'
          media_id?: number
          participants?: Json
          started_at?: string
          ended_at?: string | null
          updated_at?: string
        }
      }
      activity_feed: {
        Row: {
          id: number
          user_id: string
          type: 'watch' | 'rate' | 'review' | 'add_to_watchlist' | 'complete_show' | 'check_in'
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          type: 'watch' | 'rate' | 'review' | 'add_to_watchlist' | 'complete_show' | 'check_in'
          metadata?: Json
          created_at?: string
        }
        Update: {
          user_id?: string
          type?: 'watch' | 'rate' | 'review' | 'add_to_watchlist' | 'complete_show' | 'check_in'
          metadata?: Json
        }
      }
      check_ins: {
        Row: {
          id: number
          user_id: string
          media_type: 'movie' | 'episode'
          media_id: number
          message: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          media_type: 'movie' | 'episode'
          media_id: number
          message?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          media_type?: 'movie' | 'episode'
          media_id?: number
          message?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}