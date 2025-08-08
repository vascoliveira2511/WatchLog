"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaCard } from "@/components/media/media-card";

// Mock data for demonstration
const mockShows = [
  {
    id: 1,
    title: "Breaking Bad",
    year: 2008,
    posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    type: "tv" as const,
    rating: 5,
    genres: ["Crime", "Drama", "Thriller"],
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's financial future.",
    progress: 100,
    totalEpisodes: 62,
    watchedEpisodes: 62,
    isWatched: true,
    isInWatchlist: false,
  },
  {
    id: 2,
    title: "The Office",
    year: 2005,
    posterPath: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    type: "tv" as const,
    rating: 4,
    genres: ["Comedy"],
    overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    progress: 75,
    totalEpisodes: 201,
    watchedEpisodes: 150,
    isWatched: false,
    isInWatchlist: true,
  },
  {
    id: 3,
    title: "Stranger Things",
    year: 2016,
    posterPath: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    type: "tv" as const,
    genres: ["Drama", "Fantasy", "Horror"],
    overview: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    progress: 60,
    totalEpisodes: 42,
    watchedEpisodes: 25,
    isWatched: false,
    isInWatchlist: true,
  },
];

export default function ShowsPage() {
  const [shows, setShows] = useState(mockShows);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredShows = shows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterBy) {
      case "watching":
        return matchesSearch && !show.isWatched && show.progress > 0;
      case "completed":
        return matchesSearch && show.isWatched;
      case "watchlist":
        return matchesSearch && show.isInWatchlist;
      case "dropped":
        return matchesSearch && false; // No dropped shows in mock data
      default:
        return matchesSearch;
    }
  });

  const sortedShows = [...filteredShows].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "year":
        return (b.year || 0) - (a.year || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      default:
        return 0;
    }
  });

  const handleWatchedToggle = (id: number, watched: boolean) => {
    setShows(prev => prev.map(show => 
      show.id === id 
        ? { 
            ...show, 
            isWatched: watched,
            progress: watched ? 100 : show.progress,
            watchedEpisodes: watched ? show.totalEpisodes : show.watchedEpisodes
          }
        : show
    ));
  };

  const handleWatchlistToggle = (id: number, inWatchlist: boolean) => {
    setShows(prev => prev.map(show => 
      show.id === id ? { ...show, isInWatchlist: inWatchlist } : show
    ));
  };

  const handleRate = (id: number, rating: number) => {
    setShows(prev => prev.map(show => 
      show.id === id ? { ...show, rating } : show
    ));
  };

  const stats = {
    watching: shows.filter(s => !s.isWatched && s.progress > 0).length,
    completed: shows.filter(s => s.isWatched).length,
    watchlist: shows.filter(s => s.isInWatchlist).length,
    totalEpisodes: shows.reduce((sum, s) => sum + (s.watchedEpisodes || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TV Shows</h1>
          <p className="text-gray-600 mt-1">
            Track your favorite series and never miss an episode
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.watching}</div>
          <div className="text-sm text-gray-600">Currently Watching</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.watchlist}</div>
          <div className="text-sm text-gray-600">In Watchlist</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.totalEpisodes}</div>
          <div className="text-sm text-gray-600">Episodes Watched</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search TV shows..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter shows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shows</SelectItem>
              <SelectItem value="watching">Currently Watching</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="watchlist">Watchlist</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="year">Release Year</SelectItem>
              <SelectItem value="rating">My Rating</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Quick filters:</span>
          {["watching", "completed", "watchlist"].map((filter) => (
            <Badge
              key={filter}
              variant={filterBy === filter ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterBy(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Shows Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "space-y-4"
      }>
        {sortedShows.map((show) => (
          <MediaCard
            key={show.id}
            id={show.id}
            title={show.title}
            year={show.year}
            posterPath={show.posterPath}
            type={show.type}
            rating={show.rating}
            genres={show.genres}
            overview={show.overview}
            progress={show.progress}
            totalEpisodes={show.totalEpisodes}
            watchedEpisodes={show.watchedEpisodes}
            isWatched={show.isWatched}
            isInWatchlist={show.isInWatchlist}
            onWatchedToggle={handleWatchedToggle}
            onWatchlistToggle={handleWatchlistToggle}
            onRate={handleRate}
            className={viewMode === "list" ? "flex-row" : ""}
          />
        ))}
      </div>
      
      {sortedShows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No shows found.</p>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}