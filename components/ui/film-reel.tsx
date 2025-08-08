"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilmReelProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FilmReel({ size = "md", className }: FilmReelProps) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 border-4 border-purple-500/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Ring */}
      <motion.div
        className="absolute inset-2 border-2 border-purple-400/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Film Holes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-${size === "sm" ? 8 : size === "md" ? 16 : 22}px)`,
            }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.125,
            }}
          />
        ))}
      </div>
      
      {/* Center Dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="w-2 h-2 bg-purple-500 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-sm animate-pulse" />
    </div>
  );
}