"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating?: number; // 0-10 rating
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
  animated?: boolean;
}

export function RatingStars({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = "md",
  className,
  showValue = true,
  animated = true
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  // Convert 0-10 rating to 0-5 stars
  const starRating = rating / 2;
  const displayRating = hoveredRating !== null ? hoveredRating : starRating;
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };
  
  const handleStarClick = (starIndex: number) => {
    if (readonly || !onRatingChange) return;
    // Convert back to 0-10 scale
    const newRating = starIndex * 2;
    onRatingChange(newRating);
  };
  
  const handleStarHover = (starIndex: number) => {
    if (readonly) return;
    setHoveredRating(starIndex);
  };
  
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(null);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex items-center gap-0.5" 
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = displayRating >= starIndex;
          const isPartial = displayRating >= starIndex - 0.5 && displayRating < starIndex;
          
          return (
            <div 
              key={starIndex}
              className="relative"
            >
              {animated ? (
                <motion.button
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  disabled={readonly}
                  className={cn(
                    "relative transition-all duration-200",
                    readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
                    "disabled:cursor-default"
                  )}
                  whileHover={!readonly ? { scale: 1.1 } : {}}
                  whileTap={!readonly ? { scale: 0.95 } : {}}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "transition-all duration-200",
                      isFilled || isPartial
                        ? "fill-amber-400 text-amber-400"
                        : readonly
                        ? "text-gray-600"
                        : "text-gray-500 hover:text-amber-400/50"
                    )}
                  />
                  {isPartial && !isFilled && (
                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                      <Star
                        className={cn(
                          sizeClasses[size],
                          "fill-amber-400 text-amber-400"
                        )}
                      />
                    </div>
                  )}
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  disabled={readonly}
                  className={cn(
                    "relative transition-all duration-200",
                    readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
                    "disabled:cursor-default"
                  )}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "transition-all duration-200",
                      isFilled || isPartial
                        ? "fill-amber-400 text-amber-400"
                        : readonly
                        ? "text-gray-600"
                        : "text-gray-500 hover:text-amber-400/50"
                    )}
                  />
                  {isPartial && !isFilled && (
                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                      <Star
                        className={cn(
                          sizeClasses[size],
                          "fill-amber-400 text-amber-400"
                        )}
                      />
                    </div>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {showValue && (
        <span className={cn(
          "font-medium tabular-nums",
          size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
          rating > 0 ? "text-amber-400" : "text-gray-500"
        )}>
          {rating > 0 ? `${rating.toFixed(1)}/10` : "No rating"}
        </span>
      )}
    </div>
  );
}