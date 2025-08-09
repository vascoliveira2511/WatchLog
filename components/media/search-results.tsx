"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, User, Search, Loader } from "lucide-react";
import { tmdbClient } from "@/lib/tmdb/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

interface SearchResultsProps {
  query: string;
  isVisible: boolean;
  onResultClick: () => void;
}

export function SearchResults({ query, isVisible, onResultClick }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchDebounced = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await tmdbClient.searchMulti(query);
        setResults(response.results.slice(0, 8)); // Limit to 8 results
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    onResultClick();
    
    if (result.media_type === "movie") {
      router.push(`/movies/${result.id}`);
    } else if (result.media_type === "tv") {
      router.push(`/shows/${result.id}`);
    }
    // Note: We don't handle person results yet
  };

  const getDisplayName = (result: SearchResult) => {
    return result.title || result.name || "Unknown";
  };

  const getYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "movie":
        return <Film className="w-4 h-4 text-purple-400" />;
      case "tv":
        return <Tv className="w-4 h-4 text-amber-400" />;
      case "person":
        return <User className="w-4 h-4 text-emerald-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImageUrl = (result: SearchResult) => {
    const path = result.poster_path || result.profile_path;
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 shadow-cinema-card max-h-96 overflow-y-auto z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="w-6 h-6 text-purple-400 animate-spin mr-3" />
              <span className="text-gray-400">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.media_type}-${result.id}`}
                  className={cn(
                    "flex items-center gap-4 p-4 hover:bg-white/10 transition-colors duration-200 cursor-pointer",
                    "border-b border-white/5 last:border-b-0"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-12 h-16 bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/10 overflow-hidden">
                    {getImageUrl(result) ? (
                      <img
                        src={getImageUrl(result)!}
                        alt={getDisplayName(result)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getMediaIcon(result.media_type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {getDisplayName(result)}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        className={cn(
                          "text-xs",
                          result.media_type === "movie" && "bg-purple-500/20 text-purple-300 border-purple-500/30",
                          result.media_type === "tv" && "bg-amber-500/20 text-amber-300 border-amber-500/30",
                          result.media_type === "person" && "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        )}
                      >
                        {result.media_type}
                      </Badge>
                      {getYear(result) && (
                        <span className="text-xs text-gray-400">
                          {getYear(result)}
                        </span>
                      )}
                      {result.vote_average && result.vote_average > 0 && (
                        <span className="text-xs text-gray-400">
                          ★ {result.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}