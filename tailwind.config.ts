import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Cinema-themed color system
      colors: {
        // Background layers
        background: "hsl(var(--background))",
        "background-elevated": "hsl(var(--background-elevated))",
        "background-surface": "hsl(var(--background-surface))",
        "background-card": "hsl(var(--background-card))",
        
        // Foreground colors
        foreground: "hsl(var(--foreground))",
        "foreground-secondary": "hsl(var(--foreground-secondary))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        
        // Primary purple system
        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Golden amber accent
        accent: {
          DEFAULT: "hsl(var(--accent))",
          dark: "hsl(var(--accent-dark))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Success/error states
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Card system
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Borders and inputs
        border: {
          DEFAULT: "hsl(var(--border))",
          elevated: "hsl(var(--border-elevated))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Legacy support (keeping for shadcn/ui compatibility)
        popover: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--background-surface))",
          foreground: "hsl(var(--foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--background-surface))",
          foreground: "hsl(var(--foreground-muted))",
        },
        
        // Chart colors (keeping for components)
        chart: {
          "1": "hsl(var(--primary))",
          "2": "hsl(var(--accent))",
          "3": "hsl(var(--success))",
          "4": "#10B981",
          "5": "#F59E0B",
        },
      },
      
      // Typography - cinema fonts
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        bebas: ["Bebas Neue", "cursive"],
      },
      
      // No rounded corners - sharp cinema aesthetic
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px", // Keep for circular elements like avatars
      },
      
      // Extended spacing for cinema layouts
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      
      // Animation timing functions
      transitionTimingFunction: {
        "cinema": "cubic-bezier(0.23, 1, 0.320, 1)",
        "bounce-subtle": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      
      // Extended animation durations
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      
      // Custom aspect ratios for movie content
      aspectRatio: {
        poster: "2/3",
        backdrop: "16/9",
        square: "1/1",
      },
      
      // Box shadow for neon effects
      boxShadow: {
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        "neon-amber": "0 0 20px rgba(255, 193, 7, 0.4), 0 0 40px rgba(255, 193, 7, 0.2)",
        "glow-subtle": "0 0 10px rgba(255, 255, 255, 0.1)",
        "cinema-card": "0 8px 32px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(139, 92, 246, 0.1)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      
      // Backdrop blur utilities
      backdropBlur: {
        "cinema": "32px",
        "glass": "24px",
      },
      
      // Custom gradients for cinema effects
      backgroundImage: {
        "cinema-gradient": "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(255, 193, 7, 0.05) 100%)",
        "poster-gradient": "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)",
        "hero-gradient": "linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)",
        "text-gradient": "linear-gradient(135deg, #8B5CF6, #FFC107, #10B981)",
      },
      
      // Custom grid templates for movie layouts
      gridTemplateColumns: {
        "auto-fill-posters": "repeat(auto-fill, minmax(200px, 1fr))",
        "auto-fit-cards": "repeat(auto-fit, minmax(300px, 1fr))",
      },
      
      // Z-index scale for layering
      zIndex: {
        "1": "1",
        "5": "5",
        "25": "25",
        "75": "75",
        "100": "100",
        "backdrop": "998",
        "modal": "999",
        "overlay": "1000",
      },
      
      // Animation keyframes
      keyframes: {
        // Stagger entrance animation
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Film reel spinning
        "film-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Gradient animation
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // Fade in animation
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Slide up animation
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Pulse glow animation
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)" },
        },
        // Shimmer loading effect
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      
      // Animation classes
      animation: {
        "stagger-in": "stagger-in 0.6s ease-out forwards",
        "film-spin": "film-spin 2s linear infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s cubic-bezier(0.23, 1, 0.320, 1)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for cinema utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        // Perspective utilities for 3D effects
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".perspective-2000": {
          perspective: "2000px",
        },
        ".transform-gpu": {
          transform: "translateZ(0)",
        },
        // Text shadow utilities
        ".text-shadow-cinema": {
          textShadow: "2px 4px 8px rgba(0, 0, 0, 0.8)",
        },
        // Smooth scroll
        ".scroll-smooth": {
          scrollBehavior: "smooth",
        },
        // Glass morphism utilities
        ".glass-effect": {
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        // Cinema grid
        ".grid-cinema": {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;