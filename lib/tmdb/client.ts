const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export class TMDBClient {
  private apiKey: string;
  private readAccessToken: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
    this.readAccessToken = process.env.TMDB_API_READ_ACCESS_TOKEN || '';
    
    if (!this.apiKey && !this.readAccessToken) {
      console.warn('TMDB API credentials not found. Please add NEXT_PUBLIC_TMDB_API_KEY or TMDB_API_READ_ACCESS_TOKEN to your environment variables.');
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    
    // Add API key to params
    if (this.apiKey) {
      params.api_key = this.apiKey;
    }
    
    // Add all parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Use read access token if available (preferred method)
    if (this.readAccessToken) {
      headers.Authorization = `Bearer ${this.readAccessToken}`;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Search
  async searchMulti(query: string, page = 1): Promise<TMDBSearchResponse> {
    return this.request('/search/multi', {
      query,
      page: page.toString(),
    });
  }

  async searchMovies(query: string, page = 1): Promise<TMDBMovieSearchResponse> {
    return this.request('/search/movie', {
      query,
      page: page.toString(),
    });
  }

  async searchTVShows(query: string, page = 1): Promise<TMDBTVSearchResponse> {
    return this.request('/search/tv', {
      query,
      page: page.toString(),
    });
  }

  // Movies
  async getMovie(id: number): Promise<TMDBMovie> {
    return this.request(`/movie/${id}`, {
      append_to_response: 'credits,similar,recommendations,videos',
    });
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovieSearchResponse> {
    return this.request(`/trending/movie/${timeWindow}`);
  }

  async getPopularMovies(page = 1): Promise<TMDBMovieSearchResponse> {
    return this.request('/movie/popular', {
      page: page.toString(),
    });
  }

  // TV Shows
  async getTVShow(id: number): Promise<TMDBTVShow> {
    return this.request(`/tv/${id}`, {
      append_to_response: 'credits,similar,recommendations,videos',
    });
  }

  async getTVSeason(tvId: number, seasonNumber: number): Promise<TMDBTVSeason> {
    return this.request(`/tv/${tvId}/season/${seasonNumber}`, {
      append_to_response: 'credits',
    });
  }

  async getTVEpisode(tvId: number, seasonNumber: number, episodeNumber: number): Promise<TMDBTVEpisode> {
    return this.request(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, {
      append_to_response: 'credits',
    });
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTVSearchResponse> {
    return this.request(`/trending/tv/${timeWindow}`);
  }

  async getPopularTVShows(page = 1): Promise<TMDBTVSearchResponse> {
    return this.request('/tv/popular', {
      page: page.toString(),
    });
  }

  // Discover
  async discoverMovies(params: TMDBDiscoverMovieParams = {}): Promise<TMDBMovieSearchResponse> {
    const queryParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = String(value);
      }
    });

    return this.request('/discover/movie', queryParams);
  }

  async discoverTVShows(params: TMDBDiscoverTVParams = {}): Promise<TMDBTVSearchResponse> {
    const queryParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = String(value);
      }
    });

    return this.request('/discover/tv', queryParams);
  }

  // Genres
  async getMovieGenres(): Promise<TMDBGenresResponse> {
    return this.request('/genre/movie/list');
  }

  async getTVGenres(): Promise<TMDBGenresResponse> {
    return this.request('/genre/tv/list');
  }

  // Utility methods
  getImageUrl(path: string, size: TMDBImageSize = 'w500'): string {
    if (!path) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string, size: TMDBBackdropSize = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  // Configuration
  async getConfiguration(): Promise<TMDBConfiguration> {
    return this.request('/configuration');
  }
}

// Types
export type TMDBImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type TMDBBackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

export interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow | TMDBPerson)[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBTVSearchResponse {
  page: number;
  results: TMDBTVShow[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  runtime?: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  media_type?: 'movie';
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  episode_run_time?: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  status?: string;
  media_type?: 'tv';
  seasons?: TMDBTVSeason[];
}

export interface TMDBTVSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
  episodes?: TMDBTVEpisode[];
}

export interface TMDBTVEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime?: number;
  vote_average: number;
  vote_count: number;
  season_number: number;
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  media_type?: 'person';
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
}

export interface TMDBDiscoverMovieParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  primary_release_year?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

export interface TMDBDiscoverTVParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  first_air_date_year?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

// Create a singleton instance
export const tmdbClient = new TMDBClient();