"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Star, Plus, Check, Play, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GlowingButton } from "@/components/ui/glowing-button";
import { cn } from "@/lib/utils";
import { addToWatchlistClient, removeFromWatchlistClient, markAsWatchedClient, unmarkAsWatchedClient } from "@/lib/database/client-operations";
import { useRouter } from "next/navigation";

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
  onClick?: (id: number) => void;
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
  progress = 0,
  totalEpisodes,
  watchedEpisodes,
  isWatched = false,
  isInWatchlist = false,
  onWatchedToggle,
  onWatchlistToggle,
  onRate,
  onClick,
  className,
}: MediaCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentRating, setCurrentRating] = useState((rating || 0) / 20); // Convert TMDB rating to 5-star scale  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localIsWatched, setLocalIsWatched] = useState(isWatched);
  const [localIsInWatchlist, setLocalIsInWatchlist] = useState(isInWatchlist);

  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;

  // Update local state when props change
  useEffect(() => {
    setLocalIsWatched(isWatched);
    setLocalIsInWatchlist(isInWatchlist);
  }, [isWatched, isInWatchlist]);

  const handleWatchedClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newWatchedState = !localIsWatched;
    setLocalIsWatched(newWatchedState);
    
    let success: boolean;
    if (newWatchedState) {
      success = await markAsWatchedClient(type, id);
    } else {
      success = await unmarkAsWatchedClient(type, id);
    }
    
    if (!success) {
      // Revert on failure
      setLocalIsWatched(!newWatchedState);
    } else {
      // Call the optional callback
      onWatchedToggle?.(id, newWatchedState);
    }
  };

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newWatchlistState = !localIsInWatchlist;
    setLocalIsInWatchlist(newWatchlistState);
    
    let success: boolean;
    if (newWatchlistState) {
      success = await addToWatchlistClient(type, id);
    } else {
      success = await removeFromWatchlistClient(type, id);
    }
    
    if (!success) {
      // Revert on failure
      setLocalIsInWatchlist(!newWatchlistState);
    } else {
      // Call the optional callback
      onWatchlistToggle?.(id, newWatchlistState);
    }
  };

  const handleRatingClick = (e: React.MouseEvent, newRating: number) => {
    e.stopPropagation();
    setCurrentRating(newRating);
    onRate?.(id, newRating * 2); // Convert back to 10-point scale
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to the media detail page
    router.push(`/${type}s/${id}`);
  };

  return (
    <motion.div
      className={cn(
        "group relative cursor-pointer select-none",
        "aspect-poster bg-background-card overflow-hidden",
        "transform-gpu perspective-1000 stagger-item",
        className
      )}
      whileHover={{ 
        scale: 1.05,
        rotateY: -3,
        rotateX: 2,
        z: 50,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Main Poster Container */}
      <div className="relative w-full h-full">
        {posterUrl ? (
          <>
            {/* Loading Shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
            )}
            
            <Image
              src={posterUrl}
              alt={title}
              fill
              className={cn(
                "object-cover transition-all duration-500 transform-gpu",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Show fallback even on error
              priority={false}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-4xl font-bebas text-gray-500 leading-tight">
                {title}
              </div>
              {year && (
                <div className="text-sm text-gray-600 mt-2">{year}</div>
              )}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-poster-gradient opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={isHovered ? {
              x: ["-100%", "100%"],
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {localIsWatched && (
            <motion.div
              className="bg-success/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Check className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {type === "movie" ? "WATCHED" : "COMPLETED"}
              </span>
            </motion.div>
          )}
          
          {localIsInWatchlist && (
            <motion.div
              className="bg-purple-600/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Plus className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">WATCHLIST</span>
            </motion.div>
          )}
        </div>

        {/* Rating Badge */}
        {rating && rating > 0 && (
          <motion.div
            className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-white">
              {Math.round(rating)}%
            </span>
          </motion.div>
        )}

        {/* Progress Ring for TV Shows */}
        {type === "tv" && progress > 0 && (
          <motion.div
            className="absolute top-3 right-3 z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <ProgressRing
              progress={progress}
              size={40}
              strokeWidth={3}
              showPercentage={false}
              color="primary"
              animated={false}
            />
          </motion.div>
        )}

        {/* Hover Controls Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GlowingButton
                variant="primary"
                size="sm"
                className="px-4 py-2 text-sm"
                onClick={handlePlayClick}
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Play
              </GlowingButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GlowingButton
                variant={localIsWatched ? "accent" : "ghost"}
                size="sm"
                className="p-2"
                onClick={handleWatchedClick}
              >
                {localIsWatched ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </GlowingButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GlowingButton
                variant={localIsInWatchlist ? "accent" : "ghost"}
                size="sm"
                className="p-2"
                onClick={handleWatchlistClick}
              >
                <Plus className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  localIsInWatchlist && "rotate-45"
                )} />
              </GlowingButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-white text-base mb-2 line-clamp-2 text-shadow-sm">
              {title}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              {year && (
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <Calendar className="w-3 h-3" />
                  {year}
                </div>
              )}
              
              <Badge
                variant={type === "movie" ? "secondary" : "outline"}
                className="text-xs bg-black/50 text-white border-white/20"
              >
                {type === "movie" ? "Movie" : "TV Show"}
              </Badge>
            </div>
            
            {/* TV Show Progress */}
            {type === "tv" && watchedEpisodes && totalEpisodes && (
              <div className="text-xs text-gray-300 mb-2">
                {watchedEpisodes} / {totalEpisodes} episodes
              </div>
            )}
            
            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs text-gray-400 bg-black/30 px-2 py-1"
                  >
                    {genre}
                  </span>
                ))}
                {genres.length > 2 && (
                  <span className="text-xs text-gray-400 bg-black/30 px-2 py-1">
                    +{genres.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onClick={(e) => handleRatingClick(e, star)}
                  className="p-0.5 group/star"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star
                    className={cn(
                      "w-3 h-3 transition-all duration-200",
                      star <= currentRating
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-gray-400 group-hover/star:text-amber-300"
                    )}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Progress Bar for TV Shows (bottom edge) */}
        {type === "tv" && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 z-30">
            <motion.div
              className="h-full progress-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* 3D Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 shadow-cinema-card transform-gpu" />
      </div>
    </motion.div>
  );
}