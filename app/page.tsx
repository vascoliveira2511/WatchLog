"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Star, 
  Eye,
  Calendar,
  Heart,
  Sparkles,
  Film,
  CheckCircle,
  ArrowRight,
  Github
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { FilmReel } from "@/components/ui/film-reel";

// Mock featured movies for the hero background slideshow
const featuredMovies = [
  {
    title: "Inception",
    backdrop: "https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
    tagline: "Your mind is the scene of the crime"
  },
  {
    title: "Interstellar", 
    backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    tagline: "Love transcends dimensions of time and space"
  },
  {
    title: "The Dark Knight",
    backdrop: "https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg", 
    tagline: "Why so serious?"
  }
];

const features = [
  {
    icon: Eye,
    title: "Track Everything",
    description: "Movies, TV shows, episodes - keep a complete record of your viewing journey with detailed progress tracking."
  },
  {
    icon: TrendingUp,
    title: "Discover Trends",
    description: "Get personalized recommendations and discover what's trending among cinema enthusiasts worldwide."
  },
  {
    icon: BarChart3,
    title: "Rich Statistics",
    description: "Detailed analytics of your viewing habits with beautiful charts, heatmaps, and insights about your preferences."
  },
  {
    icon: Heart,
    title: "Smart Watchlists",
    description: "Organize your must-watch content with priority levels, notes, and intelligent suggestions."
  },
  {
    icon: Users,
    title: "Social Features",
    description: "Follow friends, share reviews, and see what your network is watching in real-time activity feeds."
  },
  {
    icon: Calendar,
    title: "Release Calendar",
    description: "Never miss new episodes or movie releases with our comprehensive calendar and notification system."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Film Student",
    content: "WatchLog completely changed how I organize my film studies. The statistics help me understand my viewing patterns.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
  },
  {
    name: "Marcus Rodriguez", 
    role: "TV Enthusiast",
    content: "Finally, a tracker that handles TV shows properly. Episode-by-episode tracking is a game-changer.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
  },
  {
    name: "Emma Thompson",
    role: "Movie Critic",
    content: "The social features make discovering new content so much better. My friends' recommendations are spot-on.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
  }
];

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
      
      // Redirect to dashboard if already logged in
      if (user) {
        window.location.href = '/dashboard';
      }
    };
    
    checkUser();

    // Auto-rotate hero background
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FilmReel size="lg" />
      </div>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Movie Slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovieIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
              <Image
                src={featuredMovies[currentMovieIndex].backdrop}
                alt={featuredMovies[currentMovieIndex].title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <FilmReel size="lg" />
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bebas text-white mb-4 tracking-wider">
              Track Every
              <span className="block gradient-text">Frame</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-2 max-w-2xl mx-auto leading-relaxed">
              Your personal cinema companion for movies and TV shows
            </p>
            
            <motion.p
              className="text-amber-400 font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Forever Free • No Ads • Open Source
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/auth/signup">
              <GlowingButton variant="primary" size="lg" className="px-12 py-4 text-xl">
                <Sparkles className="w-6 h-6 mr-3" />
                Start Your Journey
              </GlowingButton>
            </Link>
            
            <Link href="/auth/login">
              <GlowingButton variant="ghost" size="lg" className="px-12 py-4 text-xl">
                <Film className="w-6 h-6 mr-3" />
                Sign In
              </GlowingButton>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            {[
              { icon: Eye, text: "Track 50k+ Movies" },
              { icon: Calendar, text: "Episode Tracking" },
              { icon: Users, text: "Social Features" },
              { icon: BarChart3, text: "Rich Analytics" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <item.icon className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm">Discover More</span>
          <div className="w-6 h-10 border border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-500 to-transparent rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bebas text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed for true cinema enthusiasts who want to track, 
              discover, and share their viewing journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-premium border border-white/10 p-8 h-full hover:border-purple-500/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bebas text-white mb-6">
              Loved by Cinema Fans
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of movie and TV enthusiasts tracking their journeys
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-premium border border-white/10 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-premium border border-white/10 p-12">
              <h2 className="text-5xl font-bebas text-white mb-6">
                Ready to Start Tracking?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join WatchLog today and never lose track of your cinematic journey again.
                It's completely free, forever.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/auth/signup">
                  <GlowingButton variant="primary" size="lg" className="px-12 py-4 text-lg">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Create Free Account
                  </GlowingButton>
                </Link>
                
                <a
                  href="https://github.com/your-username/watchlog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlowingButton variant="ghost" size="lg" className="px-8 py-4 text-lg">
                    <Github className="w-5 h-5 mr-3" />
                    View on GitHub
                  </GlowingButton>
                </a>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Always free
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Open source
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FilmReel size="sm" />
              <span className="text-white font-bebas text-2xl tracking-wider">
                Watch<span className="gradient-text">Log</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <a
                href="https://github.com/your-username/watchlog"
                className="hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; 2024 WatchLog. Made with ❤️ for cinema lovers everywhere.</p>
            <p className="mt-2">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          </div>
        </div>
      </footer>
    </CinematicBackground>
  );
}