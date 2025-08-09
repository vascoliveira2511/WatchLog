"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Filter, Grid3X3, List, Star, Clock, Calendar } from "lucide-react";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { MediaCard } from "@/components/media/media-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock watchlist data
const mockWatchlist = [
  {
    id: 1,
    title: "The Last of Us",
    type: "tv" as const,
    posterPath: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    year: 2023,
    rating: 8.8 * 10,
    genres: ["Drama", "Horror"],
    priority: "high" as const,
    addedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Oppenheimer",
    type: "movie" as const,
    posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    year: 2023,
    rating: 8.3 * 10,
    genres: ["Drama", "History"],
    priority: "high" as const,
    addedAt: "2024-01-10",
  },
  {
    id: 3,
    title: "House of the Dragon",
    type: "tv" as const,
    posterPath: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    year: 2022,
    rating: 8.5 * 10,
    genres: ["Fantasy", "Drama"],
    priority: "medium" as const,
    addedAt: "2024-01-08",
  },
  {
    id: 4,
    title: "Everything Everywhere All at Once",
    type: "movie" as const,
    posterPath: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    year: 2022,
    rating: 7.8 * 10,
    genres: ["Comedy", "Sci-Fi"],
    priority: "medium" as const,
    addedAt: "2024-01-05",
  },
  {
    id: 5,
    title: "Wednesday",
    type: "tv" as const,
    posterPath: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    year: 2022,
    rating: 8.1 * 10,
    genres: ["Comedy", "Horror"],
    priority: "low" as const,
    addedAt: "2024-01-03",
  },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"added" | "priority" | "title" | "year">("added");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        // Load real watchlist from database
        const userWatchlist = await trackingService.getUserWatchlist();
        
        if (userWatchlist.length > 0) {
          // Convert database format to component format
          const formattedWatchlist = userWatchlist.map((item, index) => ({
            id: item.media_id,
            title: `Media ${item.media_id}`, // Will be populated from TMDB
            type: item.media_type as "movie" | "tv",
            posterPath: null, // Will be populated from TMDB
            year: 2023, // Will be populated from TMDB
            rating: 80, // Mock rating
            genres: [], // Will be populated from TMDB
            priority: index < 2 ? "high" as const : index < 4 ? "medium" as const : "low" as const,
            addedAt: item.added_at || new Date().toISOString(),
          }));
          
          setWatchlist(formattedWatchlist);
        } else {
          setWatchlist([]);
        }
        
        console.log('Loaded watchlist:', userWatchlist);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading watchlist:", error);
        // Keep mock data as fallback
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const filteredWatchlist = watchlist.filter(item => {
    if (selectedTab === "all") return true;
    if (selectedTab === "movies") return item.type === "movie";
    if (selectedTab === "shows") return item.type === "tv";
    if (selectedTab === "high") return item.priority === "high";
    return true;
  });

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    switch (sortBy) {
      case "added":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "title":
        return a.title.localeCompare(b.title);
      case "year":
        return b.year - a.year;
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "low":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your watchlist...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bebas text-white mb-2">Your Watchlist</h1>
            <p className="text-gray-400">
              {watchlist.length} {watchlist.length === 1 ? "item" : "items"} to discover
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <GlowingButton
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <Grid3X3 className="w-4 h-4" />
            </GlowingButton>
            <GlowingButton
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </GlowingButton>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="glass-premium border-white/10 bg-black/40">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                All ({watchlist.length})
              </TabsTrigger>
              <TabsTrigger value="movies" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Movies ({watchlist.filter(item => item.type === "movie").length})
              </TabsTrigger>
              <TabsTrigger value="shows" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                TV Shows ({watchlist.filter(item => item.type === "tv").length})
              </TabsTrigger>
              <TabsTrigger value="high" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                High Priority ({watchlist.filter(item => item.priority === "high").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="added">Recently Added</option>
              <option value="priority">Priority</option>
              <option value="title">Title A-Z</option>
              <option value="year">Year</option>
            </select>
          </div>
        </motion.div>

        {/* Watchlist Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {sortedWatchlist.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                : "grid-cols-1 md:grid-cols-2"
            )}>
              {sortedWatchlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <MediaCard
                    id={item.id}
                    title={item.title}
                    year={item.year}
                    posterPath={item.posterPath}
                    type={item.type}
                    rating={item.rating}
                    genres={item.genres}
                    isInWatchlist={true}
                    onClick={(id) => {
                      const path = item.type === "movie" ? `/movies/${id}` : `/shows/${id}`;
                      window.location.href = path;
                    }}
                  />
                  
                  {/* Priority Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className={cn("text-xs", getPriorityColor(item.priority))}>
                      {item.priority}
                    </Badge>
                  </div>
                  
                  {/* Added Date */}
                  <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-black/60 text-gray-300 border-gray-600 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.addedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
              <p className="text-gray-400 mb-6">
                Start adding movies and TV shows you want to watch later
              </p>
              <GlowingButton 
                variant="primary" 
                onClick={() => window.location.href = '/movies'}
              >
                Discover Movies
              </GlowingButton>
            </div>
          )}
        </motion.div>
      </div>
    </CinematicBackground>
  );
}