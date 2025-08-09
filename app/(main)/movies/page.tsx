"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  Eye,
  Grid3X3,
  List,
  X,
  ChevronDown,
  Flame
} from "lucide-react";
import { tmdbClient, TMDBMovie, TMDBGenre } from "@/lib/tmdb/client";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { MediaCard } from "@/components/media/media-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "release_date.desc", label: "Latest Release" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "revenue.desc", label: "Highest Grossing" },
  { value: "title.asc", label: "A-Z" },
];

const YEAR_RANGES = [
  { label: "2024", value: 2024 },
  { label: "2023", value: 2023 },
  { label: "2020s", value: "2020-2024" },
  { label: "2010s", value: "2010-2019" },
  { label: "2000s", value: "2000-2009" },
  { label: "1990s", value: "1990-1999" },
  { label: "Classic", value: "1900-1989" },
];

interface FilterState {
  genres: number[];
  yearRange: string | number | null;
  rating: [number, number];
  sortBy: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    yearRange: null,
    rating: [0, 10],
    sortBy: "popularity.desc"
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [moviesResponse, genresResponse, trendingResponse] = await Promise.all([
          tmdbClient.getPopularMovies(1),
          tmdbClient.getMovieGenres(),
          tmdbClient.getTrendingMovies('week')
        ]);

        setMovies(moviesResponse.results);
        setGenres(genresResponse.genres);
        setTrendingMovies(trendingResponse.results.slice(0, 6));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await tmdbClient.searchMovies(searchQuery, 1);
          setMovies(response.results);
          setPage(1);
          setHasMore(response.total_pages > 1);
        } catch (error) {
          console.error('Error searching movies:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Reset to popular movies if search is cleared
        handleFilterChange();
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Handle filter changes
  const handleFilterChange = async () => {
    if (searchQuery.trim()) return; // Don't filter while searching
    
    setIsLoading(true);
    try {
      const discoverParams: any = {
        page: 1,
        sort_by: filters.sortBy,
        vote_average_gte: filters.rating[0],
        vote_average_lte: filters.rating[1],
      };

      if (filters.genres.length > 0) {
        discoverParams.with_genres = filters.genres.join(',');
      }

      if (filters.yearRange) {
        if (typeof filters.yearRange === 'number') {
          discoverParams.primary_release_year = filters.yearRange;
        } else {
          const [startYear, endYear] = filters.yearRange.split('-').map(Number);
          discoverParams.primary_release_date_gte = `${startYear}-01-01`;
          discoverParams.primary_release_date_lte = `${endYear}-12-31`;
        }
      }

      const response = await tmdbClient.discoverMovies(discoverParams);
      setMovies(response.results);
      setPage(1);
      setHasMore(response.total_pages > 1);
    } catch (error) {
      console.error('Error filtering movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  // Load more movies
  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      let response;
      
      if (searchQuery.trim()) {
        response = await tmdbClient.searchMovies(searchQuery, nextPage);
      } else {
        const discoverParams: any = {
          page: nextPage,
          sort_by: filters.sortBy,
          vote_average_gte: filters.rating[0],
          vote_average_lte: filters.rating[1],
        };

        if (filters.genres.length > 0) {
          discoverParams.with_genres = filters.genres.join(',');
        }

        if (filters.yearRange) {
          if (typeof filters.yearRange === 'number') {
            discoverParams.primary_release_year = filters.yearRange;
          } else {
            const [startYear, endYear] = filters.yearRange.split('-').map(Number);
            discoverParams.primary_release_date_gte = `${startYear}-01-01`;
            discoverParams.primary_release_date_lte = `${endYear}-12-31`;
          }
        }

        response = await tmdbClient.discoverMovies(discoverParams);
      }

      setMovies(prev => [...prev, ...response.results]);
      setPage(nextPage);
      setHasMore(nextPage < response.total_pages);
    } catch (error) {
      console.error('Error loading more movies:', error);
    }
  };

  const toggleGenre = (genreId: number) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      yearRange: null,
      rating: [0, 10],
      sortBy: "popularity.desc"
    });
    setSearchQuery("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.genres.length > 0) count++;
    if (filters.yearRange) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 10) count++;
    if (filters.sortBy !== "popularity.desc") count++;
    return count;
  }, [filters]);

  if (isLoading && movies.length === 0) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading cinema collection...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bebas text-white mb-2">Movies</h1>
              <p className="text-gray-400">Discover your next cinematic adventure</p>
            </div>
            
            <div className="flex items-center gap-3">
              <GlowingButton
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </GlowingButton>
              <GlowingButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </GlowingButton>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-12 pr-4 py-3 bg-black/40 border border-white/20 text-white placeholder:text-gray-500",
                  "focus:bg-black/60 focus:border-purple-500/50 focus:shadow-neon-purple",
                  "transition-all duration-300 backdrop-blur-sm"
                )}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <GlowingButton
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-purple-500 text-white text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 ml-1 transition-transform",
                  showFilters && "rotate-180"
                )} />
              </GlowingButton>
              
              {activeFiltersCount > 0 && (
                <GlowingButton variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </GlowingButton>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-premium border border-white/10 p-6 space-y-6"
              >
                {/* Sort By */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                        className={cn(
                          "px-4 py-2 text-sm font-medium transition-all duration-300 border",
                          filters.sortBy === option.value
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                            : "bg-black/20 border-white/20 text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium transition-all duration-300 border",
                          filters.genres.includes(genre.id)
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                            : "bg-black/20 border-white/20 text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">Release Year</label>
                  <div className="flex flex-wrap gap-2">
                    {YEAR_RANGES.map((year) => (
                      <button
                        key={year.label}
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          yearRange: prev.yearRange === year.value ? null : year.value 
                        }))}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium transition-all duration-300 border",
                          filters.yearRange === year.value
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                            : "bg-black/20 border-white/20 text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {year.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trending Section */}
        {!searchQuery && trendingMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bebas text-white">Trending This Week</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  className="flex-shrink-0 w-48"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <MediaCard
                    id={movie.id}
                    title={movie.title}
                    year={new Date(movie.release_date).getFullYear()}
                    posterPath={movie.poster_path}
                    type="movie"
                    rating={movie.vote_average * 10}
                    genres={movie.genre_ids?.map(id => genres.find(g => g.id === id)?.name).filter(Boolean) as string[]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Movies Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bebas text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Movies'}
            </h2>
            <p className="text-gray-400 text-sm">{movies.length} movies</p>
          </div>

          {movies.length > 0 ? (
            <>
              <div className={cn(
                "grid gap-6 mb-8",
                viewMode === 'grid' 
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  : "grid-cols-1 md:grid-cols-2"
              )}>
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="stagger-item"
                  >
                    <MediaCard
                      id={movie.id}
                      title={movie.title}
                      year={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                      posterPath={movie.poster_path}
                      type="movie"
                      rating={movie.vote_average * 10}
                      genres={movie.genre_ids?.map(id => genres.find(g => g.id === id)?.name).filter(Boolean) as string[]}
                      overview={movie.overview}
                    />
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center">
                  <GlowingButton
                    variant="ghost"
                    size="lg"
                    onClick={loadMore}
                    className="px-12"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Load More Movies
                  </GlowingButton>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <Eye className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <GlowingButton variant="ghost" onClick={clearFilters}>
                Clear All Filters
              </GlowingButton>
            </div>
          )}
        </motion.section>
      </div>
    </CinematicBackground>
  );
}