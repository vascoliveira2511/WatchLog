"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Play, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  posterPath?: string;
  rating?: number;
  year?: string | number;
  isWatched?: boolean;
  progress?: number; // 0-100 for shows
  className?: string;
  onClick?: () => void;
  onWatchToggle?: () => void;
  onPlay?: () => void;
}

export function MovieCard({
  title,
  posterPath,
  rating,
  year,
  isWatched = false,
  progress,
  className,
  onClick,
  onWatchToggle,
  onPlay,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1); // Convert from 10-point to 5-point scale
  };

  return (
    <motion.div
      className={cn(
        "group relative cursor-pointer select-none",
        "aspect-poster bg-background-card border border-border",
        "overflow-hidden transform-gpu perspective-1000",
        className
      )}
      whileHover={{ 
        scale: 1.05,
        rotateY: -5,
        rotateX: 5,
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
      onClick={onClick}
    >
      {/* Poster Image */}
      <div className="relative w-full h-full">
        {posterPath ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoadingComplete={() => setImageLoaded(true)}
              priority={false}
            />
            
            {/* Loading Shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-4xl font-bebas text-gray-500 text-center px-4">
              {title}
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

        {/* Rating Badge */}
        {rating && (
          <motion.div
            className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-white">
              {formatRating(rating)}
            </span>
          </motion.div>
        )}

        {/* Watched Badge */}
        {isWatched && (
          <motion.div
            className="absolute top-2 left-2 bg-success/90 backdrop-blur-sm p-1.5"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Progress Bar (for shows) */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <motion.div
              className="h-full progress-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        )}

        {/* Hover Controls */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex gap-2">
            {onPlay && (
              <motion.button
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }}
              >
                <Play className="w-5 h-5 text-white fill-white" />
              </motion.button>
            )}
            
            {onWatchToggle && (
              <motion.button
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchToggle();
                }}
              >
                {isWatched ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 text-shadow-sm">
              {title}
            </h3>
            {year && (
              <p className="text-xs text-gray-300 text-shadow-sm">{year}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 shadow-cinema-card" />
      </div>
    </motion.div>
  );
}