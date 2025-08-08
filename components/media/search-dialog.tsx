"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  vote_average: number;
  media_type?: 'movie' | 'tv';
}

interface SearchDialogProps {
  onAddToWatchlist?: (item: SearchResult, mediaType: 'movie' | 'tv') => void;
  trigger?: React.ReactNode;
}

export function SearchDialog({ onAddToWatchlist, trigger }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [movieResults, setMovieResults] = useState<SearchResult[]>([]);
  const [tvResults, setTVResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovieResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setMovieResults(data.results || []);
      } else {
        console.error('Movie search error:', data.error);
        setMovieResults([]);
      }
    } catch (error) {
      console.error('Movie search error:', error);
      setMovieResults([]);
    }
  };

  const searchTVShows = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTVResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/shows/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setTVResults(data.results || []);
      } else {
        console.error('TV search error:', data.error);
        setTVResults([]);
      }
    } catch (error) {
      console.error('TV search error:', error);
      setTVResults([]);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovieResults([]);
      setTVResults([]);
      return;
    }

    setLoading(true);
    
    try {
      await Promise.all([
        searchMovies(searchQuery),
        searchTVShows(searchQuery)
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setMovieResults([]);
        setTVResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddToWatchlist = (item: SearchResult, mediaType: 'movie' | 'tv') => {
    const itemKey = `${mediaType}-${item.id}`;
    setAddedItems(prev => new Set([...prev, itemKey]));
    onAddToWatchlist?.(item, mediaType);
  };

  const isItemAdded = (item: SearchResult, mediaType: 'movie' | 'tv') => {
    return addedItems.has(`${mediaType}-${item.id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  };

  const getTitle = (item: SearchResult) => item.title || item.name || 'Unknown Title';

  const getYear = (item: SearchResult) => formatDate(item.release_date || item.first_air_date);

  const ResultCard = ({ item, mediaType }: { item: SearchResult; mediaType: 'movie' | 'tv' }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-16 h-24 bg-gray-200 flex-shrink-0">
            {item.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                alt={getTitle(item)}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{getTitle(item)}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {getYear(item) && (
                    <span className="text-xs text-gray-500">{getYear(item)}</span>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                  </Badge>
                  {item.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-yellow-600">★</span>
                      <span className="text-xs text-gray-600">{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                size="sm"
                variant={isItemAdded(item, mediaType) ? "default" : "outline"}
                className="ml-2 h-8"
                onClick={() => handleAddToWatchlist(item, mediaType)}
                disabled={isItemAdded(item, mediaType)}
              >
                {isItemAdded(item, mediaType) ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
            
            {item.overview && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.overview}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search Movies & Shows
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Movies & TV Shows</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for movies and TV shows..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Results */}
          {query && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="movies">
                  Movies {movieResults.length > 0 && `(${movieResults.length})`}
                </TabsTrigger>
                <TabsTrigger value="tv">
                  TV Shows {tvResults.length > 0 && `(${tvResults.length})`}
                </TabsTrigger>
              </TabsList>

              <div className="max-h-96 overflow-y-auto">
                <TabsContent value="movies" className="space-y-3 mt-4">
                  {movieResults.map((movie) => (
                    <ResultCard key={movie.id} item={movie} mediaType="movie" />
                  ))}
                  
                  {!loading && movieResults.length === 0 && query && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No movies found for "{query}"</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tv" className="space-y-3 mt-4">
                  {tvResults.map((show) => (
                    <ResultCard key={show.id} item={show} mediaType="tv" />
                  ))}
                  
                  {!loading && tvResults.length === 0 && query && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No TV shows found for "{query}"</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          )}

          {!query && (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search for movies and TV shows</p>
              <p className="text-sm text-gray-400 mt-2">
                Find your next favorite show or movie to add to your watchlist
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}