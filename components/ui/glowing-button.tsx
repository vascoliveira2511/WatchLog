"use client";

import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ 
    children, 
    variant = "primary", 
    size = "md", 
    className,
    disabled = false,
    type = "button",
    onClick,
    ...props 
  }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-semibold
      transition-all duration-300 ease-cinema transform-gpu
      focus:outline-none focus:ring-2 focus:ring-primary/50
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      overflow-hidden group
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-purple-600 to-purple-700 
        hover:from-purple-500 hover:to-purple-600
        text-white border border-purple-500/50
        shadow-neon-purple hover:shadow-neon-purple
        hover:scale-105 hover:-translate-y-0.5
      `,
      secondary: `
        bg-gradient-to-r from-gray-800 to-gray-900
        hover:from-gray-700 hover:to-gray-800
        text-white border border-gray-600/50
        hover:scale-105 hover:-translate-y-0.5
        hover:shadow-glow-subtle
      `,
      accent: `
        bg-gradient-to-r from-amber-500 to-amber-600
        hover:from-amber-400 hover:to-amber-500
        text-black border border-amber-400/50
        shadow-neon-amber hover:shadow-neon-amber
        hover:scale-105 hover:-translate-y-0.5
      `,
      ghost: `
        bg-transparent hover:bg-white/5
        text-white border border-white/20
        hover:border-purple-500/50 hover:text-purple-300
        hover:scale-105 hover:-translate-y-0.5
      `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-6 py-2.5 text-base h-10",
      lg: "px-8 py-3 text-lg h-12",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={!disabled ? { 
          scale: 1.05,
          y: -2,
        } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
        {...props}
      >
        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full scale-0"
          animate={{
            scale: [0, 1],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 0.6 }}
          key={Math.random()}
        />

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        {/* Magnetic Effect Container */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          whileHover={!disabled ? {
            scale: 1.02,
          } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {children}
        </motion.div>

        {/* Border Glow */}
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-none border border-purple-500/0 group-hover:border-purple-400/50 transition-colors duration-300" />
        )}
        {variant === "accent" && (
          <div className="absolute inset-0 rounded-none border border-amber-500/0 group-hover:border-amber-400/50 transition-colors duration-300" />
        )}
      </motion.button>
    );
  }
);

GlowingButton.displayName = "GlowingButton";