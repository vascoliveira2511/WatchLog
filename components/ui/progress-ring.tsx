"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
  color?: "primary" | "accent" | "success";
  animated?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  className,
  color = "primary",
  animated = true,
}: ProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    primary: "stroke-purple-500",
    accent: "stroke-amber-500",
    success: "stroke-emerald-500",
  };

  const glowColors = {
    primary: "filter drop-shadow(0 0 8px rgb(139 92 246 / 0.5))",
    accent: "filter drop-shadow(0 0 8px rgb(245 158 11 / 0.5))",
    success: "filter drop-shadow(0 0 8px rgb(16 185 129 / 0.5))",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Background Circle */}
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          stroke="rgb(39 39 42)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="opacity-20"
        />
        
        {/* Progress ring */}
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className={cn(
            colorClasses[color],
            "transition-all duration-300 ease-cinema"
          )}
          style={{
            filter: glowColors[color],
          }}
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={animated ? { strokeDashoffset } : false}
          transition={animated ? {
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.2,
          } : false}
        />
      </svg>

      {/* Center Content */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={animated ? { scale: 0, opacity: 0 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          transition={animated ? {
            duration: 0.5,
            delay: 0.8,
            type: "spring",
            stiffness: 200,
          } : false}
        >
          <div className="text-2xl font-bold text-white font-bebas">
            {Math.round(progress)}
          </div>
          <div className="text-xs text-gray-400 -mt-1">%</div>
        </motion.div>
      )}

      {/* Pulse Effect */}
      {progress > 0 && animated && (
        <motion.div
          className="absolute inset-0 border-2 border-current rounded-full opacity-0"
          style={{
            borderColor: 
              color === "primary" ? "rgb(139 92 246)" :
              color === "accent" ? "rgb(245 158 11)" :
              "rgb(16 185 129)",
          }}
          animate={{
            scale: [1, 1.1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}