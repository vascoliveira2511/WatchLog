"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from '@/lib/supabase/client';
import { trackingService } from '@/lib/database/tracking';
import { tmdbClient } from '@/lib/tmdb/client';
import {
  Play,
  Clock,
  TrendingUp,
  Star,
  Plus,
  ArrowRight,
  Flame,
  Users,
  Eye,
  Info,
  Calendar,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaCard } from "@/components/media/media-card";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { FilmReel } from "@/components/ui/film-reel";
import { cn } from "@/lib/utils";

// Mock hero show data
const mockHeroShow = {
  id: 1,
  title: "Breaking Bad",
  overview: "Walter White, a struggling high school chemistry teacher, is diagnosed with inoperable lung cancer. He turns to a life of crime, producing and selling methamphetamine with his former student Jesse Pinkman.",
  backdropPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", // Using poster as backdrop for demo
  rating: 9.5,
  year: 2008,
  seasons: 5,
  episodes: 62,
  watchedEpisodes: 47,
  progress: 75,
  genres: ["Drama", "Crime", "Thriller"],
  runtime: 47,
  status: "watching" as const,
};

// Mock data
const mockCurrentlyWatching = [
  {
    id: 1,
    title: "Breaking Bad",
    posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    progress: 75,
    totalEpisodes: 62,
    watchedEpisodes: 47,
    year: 2008,
    type: "tv" as const,
    rating: 9.5 * 2, // Convert to 10-point scale
    genres: ["Drama", "Crime"],
  },
  {
    id: 2,
    title: "The Office",
    posterPath: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    progress: 60,
    totalEpisodes: 201,
    watchedEpisodes: 120,
    year: 2005,
    type: "tv" as const,
    rating: 8.7 * 2,
    genres: ["Comedy", "Sitcom"],
  },
  {
    id: 3,
    title: "Stranger Things",
    posterPath: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    progress: 90,
    totalEpisodes: 42,
    watchedEpisodes: 38,
    year: 2016,
    type: "tv" as const,
    rating: 8.7 * 2,
    genres: ["Sci-Fi", "Horror"],
  },
  {
    id: 4,
    title: "Better Call Saul",
    posterPath: "/fC2HDm5t0kHl7mTm7jxMR31EPot.jpg",
    progress: 45,
    totalEpisodes: 63,
    watchedEpisodes: 28,
    year: 2015,
    type: "tv" as const,
    rating: 8.9 * 2,
    genres: ["Drama", "Crime"],
  },
  {
    id: 5,
    title: "The Crown",
    posterPath: "/1M876KPjulVwppEpldhdc8V4o68.jpg",
    progress: 25,
    totalEpisodes: 60,
    watchedEpisodes: 15,
    year: 2016,
    type: "tv" as const,
    rating: 8.6 * 2,
    genres: ["Drama", "History"],
  },
];

const mockRecentlyAdded = [
  {
    id: 10,
    title: "The Last of Us",
    posterPath: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    year: 2023,
    type: "tv" as const,
    rating: 8.8 * 2,
    genres: ["Drama", "Horror"],
  },
  {
    id: 11,
    title: "House of the Dragon",
    posterPath: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    year: 2022,
    type: "tv" as const,
    rating: 8.5 * 2,
    genres: ["Fantasy", "Drama"],
  },
  {
    id: 12,
    title: "Wednesday",
    posterPath: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    year: 2022,
    type: "tv" as const,
    rating: 8.1 * 2,
    genres: ["Comedy", "Horror"],
  },
  {
    id: 13,
    title: "Top Gun: Maverick",
    posterPath: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    year: 2022,
    type: "movie" as const,
    rating: 8.3 * 2,
    genres: ["Action", "Drama"],
  },
];

const mockStats = {
  thisWeek: {
    episodes: 12,
    movies: 3,
    timeWatched: 847, // minutes
  },
  thisMonth: {
    episodes: 45,
    movies: 8,
    timeWatched: 2340, // minutes
  },
  allTime: {
    shows: 156,
    movies: 342,
    episodes: 3204,
    timeWatched: 89340, // minutes
  },
  streak: 12,
};

export default function DashboardPage() {
  const [currentlyWatching, setCurrentlyWatching] = useState(mockCurrentlyWatching);
  const [recentlyAdded, setRecentlyAdded] = useState(mockRecentlyAdded);
  const [stats, setStats] = useState(mockStats);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.log('No authenticated user');
          setIsLoading(false);
          return;
        }

        setUser(user);

        // Load user stats
        const userStats = await trackingService.getUserStats();
        setStats({
          ...mockStats,
          allTime: {
            movies: userStats.moviesWatched,
            shows: userStats.showsWatched, 
            episodes: userStats.episodesWatched,
            timeWatched: userStats.totalWatchTime,
          }
        });

        // Load continue watching (user's in-progress shows)
        try {
          const watchlist = await trackingService.getUserWatchlist();
          if (watchlist.length > 0) {
            // Filter for items that are being watched (not completed)
            const continueWatchingItems = watchlist.slice(0, 4);
            if (continueWatchingItems.length > 0) {
              setCurrentlyWatching(continueWatchingItems.map(item => ({
                ...item,
                progress: Math.floor(Math.random() * 80) + 10, // Mock progress for now
              })));
            }
          }
        } catch (error) {
          console.log('Error loading continue watching:', error);
        }

        // Load trending content from TMDB
        try {
          const trending = await tmdbClient.getTrendingMovies();
          if (trending.results?.length > 0) {
            setRecentlyAdded(trending.results.slice(0, 6).map(movie => ({
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
              year: new Date(movie.release_date).getFullYear(),
              type: 'movie' as const,
              rating: movie.vote_average * 10,
              genres: [], // Will be populated from movie details if needed
            })));
          }
        } catch (error) {
          console.log('Error loading trending content:', error);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (isLoading) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-12 pb-16">
        {/* Cinematic Hero Section */}
        <motion.section
          className="relative h-[80vh] flex items-end overflow-hidden -mx-6 md:-mx-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Hero Background */}
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${mockHeroShow.backdropPath}`}
              alt={mockHeroShow.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Multi-layer Gradients */}
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 px-6 md:px-8 pb-16 max-w-2xl">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Featured Badge */}
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
                  Continue Watching
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-6xl md:text-7xl font-bebas text-white mb-4 text-shadow-lg">
                {mockHeroShow.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white font-semibold">
                    {mockHeroShow.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">{mockHeroShow.year}</span>
                <span className="text-gray-300">
                  {mockHeroShow.seasons} Season{mockHeroShow.seasons > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {mockHeroShow.genres.slice(0, 2).map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="bg-black/30 border-white/20 text-white"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <p className="text-gray-200 text-lg mb-8 max-w-xl leading-relaxed">
                {mockHeroShow.overview}
              </p>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">
                    Episode {mockHeroShow.watchedEpisodes} of {mockHeroShow.episodes}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {mockHeroShow.progress}% Complete
                  </span>
                </div>
                <div className="w-full bg-black/50 h-2">
                  <motion.div
                    className="h-full progress-neon"
                    initial={{ width: 0 }}
                    animate={{ width: `${mockHeroShow.progress}%` }}
                    transition={{ delay: 1, duration: 1.5 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <GlowingButton
                  variant="primary"
                  size="lg"
                  className="px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-3 fill-current" />
                  Continue Watching
                </GlowingButton>
                
                <GlowingButton variant="ghost" size="lg" className="px-8 py-4">
                  <Info className="w-5 h-5 mr-3" />
                  More Info
                </GlowingButton>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-8 right-8 hidden lg:block"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <ProgressRing
              progress={mockHeroShow.progress}
              size={120}
              strokeWidth={6}
              color="primary"
              className="backdrop-blur-sm bg-black/20 rounded-full p-4"
            />
          </motion.div>
        </motion.section>

        <div className="px-6 md:px-8 space-y-16">
          {/* Stats Overview */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Play,
                  label: "This Week",
                  value: `${stats.thisWeek.episodes}`,
                  subtitle: "episodes",
                  color: "purple",
                },
                {
                  icon: Clock,
                  label: "Time Watched",
                  value: formatTime(stats.thisWeek.timeWatched),
                  subtitle: "this week",
                  color: "emerald",
                },
                {
                  icon: Users,
                  label: "Active Shows",
                  value: `${currentlyWatching.length}`,
                  subtitle: "watching",
                  color: "amber",
                },
                {
                  icon: TrendingUp,
                  label: "All Time",
                  value: formatNumber(stats.allTime.episodes),
                  subtitle: "episodes",
                  color: "blue",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stagger-item"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Card className="bg-background-card/80 backdrop-blur-sm border-border hover:bg-background-card/90 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "p-3 rounded-full bg-gradient-to-br",
                          stat.color === "purple" && "from-purple-500/20 to-purple-600/20",
                          stat.color === "emerald" && "from-emerald-500/20 to-emerald-600/20",
                          stat.color === "amber" && "from-amber-500/20 to-amber-600/20",
                          stat.color === "blue" && "from-blue-500/20 to-blue-600/20"
                        )}>
                          <stat.icon className={cn(
                            "w-6 h-6",
                            stat.color === "purple" && "text-purple-400",
                            stat.color === "emerald" && "text-emerald-400",
                            stat.color === "amber" && "text-amber-400",
                            stat.color === "blue" && "text-blue-400"
                          )} />
                        </div>
                        <div>
                          <p className="text-foreground-muted text-sm">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {stat.value}
                          </p>
                          <p className="text-foreground-muted text-xs">
                            {stat.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Streak Badge */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-2 text-lg font-semibold animate-pulse-glow">
                <Flame className="w-4 h-4 mr-2" />
                {stats.streak} Day Streak! 🔥
              </Badge>
            </motion.div>
          </motion.section>

          {/* Continue Watching Section */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bebas text-white">Continue Watching</h2>
              <Link href="/shows">
                <GlowingButton variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </GlowingButton>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentlyWatching.map((show) => (
                <MediaCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  year={show.year}
                  posterPath={show.posterPath}
                  type={show.type}
                  rating={show.rating}
                  genres={show.genres}
                  progress={show.progress}
                  totalEpisodes={show.totalEpisodes}
                  watchedEpisodes={show.watchedEpisodes}
                  className="stagger-item"
                />
              ))}
            </div>
          </motion.section>

          {/* Recently Added Section */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bebas text-white">Recently Added</h2>
              <Link href="/shows">
                <GlowingButton variant="ghost" size="sm">
                  Explore More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </GlowingButton>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyAdded.map((item) => (
                <MediaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  year={item.year}
                  posterPath={item.posterPath}
                  type={item.type}
                  rating={item.rating}
                  genres={item.genres}
                  className="stagger-item"
                />
              ))}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 hover:from-purple-600/30 hover:to-purple-800/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Discover New</h3>
                <p className="text-gray-400 text-sm">Find your next favorite show or movie</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-amber-500/30 hover:from-amber-600/30 hover:to-amber-800/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">View Stats</h3>
                <p className="text-gray-400 text-sm">See your watching patterns and achievements</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-emerald-500/30 hover:from-emerald-600/30 hover:to-emerald-800/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Add Content</h3>
                <p className="text-gray-400 text-sm">Build your personal watchlist</p>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </CinematicBackground>
  );
}