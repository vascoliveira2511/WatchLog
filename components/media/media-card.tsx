"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Calendar, Clock, Plus, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  id: number;
  title: string;
  year?: number;
  posterPath?: string | null;
  type: "movie" | "tv";
  rating?: number;
  genres?: string[];
  overview?: string;
  progress?: number; // For TV shows, percentage watched
  totalEpisodes?: number;
  watchedEpisodes?: number;
  isWatched?: boolean;
  isInWatchlist?: boolean;
  onWatchedToggle?: (id: number, watched: boolean) => void;
  onWatchlistToggle?: (id: number, inWatchlist: boolean) => void;
  onRate?: (id: number, rating: number) => void;
  className?: string;
}

export function MediaCard({
  id,
  title,
  year,
  posterPath,
  type,
  rating,
  genres = [],
  overview,
  progress,
  totalEpisodes,
  watchedEpisodes,
  isWatched = false,
  isInWatchlist = false,
  onWatchedToggle,
  onWatchlistToggle,
  onRate,
  className,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating || 0);

  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w342${posterPath}`
    : "/placeholder-poster.jpg";

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchedToggle?.(id, !isWatched);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchlistToggle?.(id, !isInWatchlist);
  };

  const handleRatingClick = (e: React.MouseEvent, newRating: number) => {
    e.stopPropagation();
    setCurrentRating(newRating);
    onRate?.(id, newRating);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] bg-gray-100">
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Overlay with controls - visible on hover */}
          <div className={cn(
            "absolute inset-0 bg-black/60 flex flex-col justify-end p-4 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {/* Quick action buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant={isWatched ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={handleWatchedClick}
                >
                  {isWatched ? (
                    <Check className="h-4 w-4" />
                  ) : type === "movie" ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  size="icon"
                  variant={isInWatchlist ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={handleWatchlistClick}
                >
                  <Plus className={cn(
                    "h-4 w-4 transition-transform",
                    isInWatchlist && "rotate-45"
                  )} />
                </Button>
              </div>
              
              {/* Rating stars */}
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={(e) => handleRatingClick(e, star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-3 w-3 transition-colors",
                        star <= currentRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Progress bar for TV shows */}
            {type === "tv" && progress !== undefined && (
              <div className="mb-3">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-white/80 mt-1">
                  {watchedEpisodes || 0} / {totalEpisodes || 0} episodes
                </div>
              </div>
            )}
          </div>
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {isWatched && (
              <Badge variant="default" className="text-xs">
                {type === "movie" ? "Watched" : "Completed"}
              </Badge>
            )}
            {isInWatchlist && (
              <Badge variant="secondary" className="text-xs">
                Watchlist
              </Badge>
            )}
          </div>
          
          {/* Rating badge */}
          {currentRating > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {currentRating}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Info section */}
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            {year && (
              <>
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </>
            )}
            <Badge variant="outline" className="text-xs">
              {type === "movie" ? "Movie" : "TV Show"}
            </Badge>
          </div>
          
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
              {genres.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{genres.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {overview && (
            <p className="text-xs text-gray-600 line-clamp-3">
              {overview}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}