"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Plus, Clock, Bookmark } from "lucide-react";
import { GlowingButton } from "./glowing-button";
import { cn } from "@/lib/utils";

export type WatchStatus = "unwatched" | "watching" | "watched" | "plan_to_watch" | "dropped";

interface WatchButtonProps {
  status: WatchStatus;
  onStatusChange?: (status: WatchStatus) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
  disabled?: boolean;
  className?: string;
}

const statusConfig = {
  unwatched: {
    label: "Add to Watchlist",
    icon: Plus,
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    hoverColor: "hover:bg-gray-500/30",
    nextStatus: "plan_to_watch" as WatchStatus
  },
  plan_to_watch: {
    label: "Plan to Watch", 
    icon: Bookmark,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    hoverColor: "hover:bg-blue-500/30", 
    nextStatus: "watching" as WatchStatus
  },
  watching: {
    label: "Watching",
    icon: Eye,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    hoverColor: "hover:bg-purple-500/30",
    nextStatus: "watched" as WatchStatus
  },
  watched: {
    label: "Watched",
    icon: Check,
    color: "text-emerald-400", 
    bgColor: "bg-emerald-500/20",
    hoverColor: "hover:bg-emerald-500/30",
    nextStatus: "unwatched" as WatchStatus
  },
  dropped: {
    label: "Dropped",
    icon: EyeOff,
    color: "text-red-400",
    bgColor: "bg-red-500/20", 
    hoverColor: "hover:bg-red-500/30",
    nextStatus: "unwatched" as WatchStatus
  }
};

export function WatchButton({
  status,
  onStatusChange,
  size = "md",
  variant = "default",
  disabled = false,
  className
}: WatchButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const handleClick = async () => {
    if (disabled || !onStatusChange) return;
    
    setIsAnimating(true);
    
    // Simple cycle to next status for now
    // In real app, this could show a dropdown menu
    await new Promise(resolve => setTimeout(resolve, 150));
    onStatusChange(config.nextStatus);
    
    setIsAnimating(false);
  };
  
  const sizeVariants = {
    sm: variant === "compact" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
    md: variant === "compact" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base", 
    lg: variant === "compact" ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
  };
  
  if (variant === "compact") {
    return (
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 font-medium transition-all duration-200",
          "border border-white/20 backdrop-blur-sm",
          config.bgColor,
          config.hoverColor,
          config.color,
          sizeVariants[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
        {variant !== "compact" && <span>{config.label}</span>}
      </motion.button>
    );
  }
  
  return (
    <GlowingButton
      onClick={handleClick}
      disabled={disabled}
      variant="ghost"
      size={size}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        config.bgColor,
        config.color,
        "border-white/20",
        !disabled && config.hoverColor,
        className
      )}
    >
      <motion.div
        className="flex items-center gap-2"
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Icon className={size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"} />
        <span className="font-medium">{config.label}</span>
      </motion.div>
      
      {/* Animated background effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </GlowingButton>
  );
}