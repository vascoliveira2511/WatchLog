"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GlowingButton } from "@/components/ui/glowing-button";
import { FilmReel } from "@/components/ui/film-reel";
import { AlertCircle, Eye, EyeOff, Film, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      {/* Cinema-themed Card */}
      <div className="glass-premium border border-white/10 p-8 backdrop-blur-xl">
        {/* Header with Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <FilmReel size="lg" />
          </div>
          
          <h1 className="text-4xl font-bebas text-white mb-2">
            Welcome Back
          </h1>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">to</span>
            <div className="font-bebas text-2xl tracking-wider">
              <span className="text-white">Watch</span>
              <span className="gradient-text">Log</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 mt-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-sm">Your cinema journey continues</span>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleLogin}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm p-4 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "bg-black/40 border border-white/20 text-white placeholder:text-gray-500",
                  "focus:bg-black/60 focus:border-purple-500/50 focus:shadow-neon-purple",
                  "transition-all duration-300 backdrop-blur-sm"
                )}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "bg-black/40 border border-white/20 text-white placeholder:text-gray-500 pr-12",
                    "focus:bg-black/60 focus:border-purple-500/50 focus:shadow-neon-purple",
                    "transition-all duration-300 backdrop-blur-sm"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <GlowingButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-4 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Enter Cinema
                </div>
              )}
            </GlowingButton>
          </motion.div>
        </motion.form>
        
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-white/20" />
            <span className="text-gray-400 text-sm">New to WatchLog?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 via-white/20 to-transparent" />
          </div>
          
          <Link href="/auth/signup">
            <GlowingButton variant="ghost" size="lg" className="w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Free Account
              </div>
            </GlowingButton>
          </Link>
          
          <p className="text-gray-500 text-xs mt-4">
            Join thousands of cinema enthusiasts tracking their journey
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}