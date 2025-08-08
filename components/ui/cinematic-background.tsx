"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CinematicBackgroundProps {
  children: ReactNode;
  variant?: "default" | "hero" | "auth";
  className?: string;
}

export function CinematicBackground({ 
  children, 
  variant = "default", 
  className = "" 
}: CinematicBackgroundProps) {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  const getBackgroundStyles = () => {
    switch (variant) {
      case "hero":
        return "bg-gradient-to-r from-black via-black/90 to-purple-900/20";
      case "auth":
        return "bg-gradient-to-br from-black via-purple-950/30 to-amber-900/10";
      default:
        return "bg-black";
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${getBackgroundStyles()} ${className}`}>
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-amber-600/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Floating Particles */}
      {variant === "hero" && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Radial Gradient Overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
}