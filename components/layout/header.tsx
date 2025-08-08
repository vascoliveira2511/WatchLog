"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Settings, LogOut, Film, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlowingButton } from "@/components/ui/glowing-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full",
        "glass-premium border-b border-white/10",
        "transition-all duration-500 ease-cinema"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-amber-600/5" />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content Container */}
      <div className="relative px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-full">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/dashboard" className="group flex items-center space-x-2">
              {/* Film Reel Icon */}
              <motion.div
                className="relative p-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Film className="w-8 h-8 text-purple-400" />
                <motion.div
                  className="absolute inset-0 bg-purple-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              
              {/* Logo Text */}
              <div className="font-bebas text-3xl tracking-wider">
                <span className="text-white group-hover:text-purple-300 transition-colors duration-300">
                  Watch
                </span>
                <motion.span
                  className="gradient-text"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Log
                </motion.span>
              </div>
              
              {/* Underline Effect */}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-amber-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="flex-1 max-w-md mx-8 hidden md:block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className={cn(
              "relative group transition-all duration-300",
              isSearchFocused && "scale-105"
            )}>
              <Search className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300",
                isSearchFocused ? "text-purple-400" : "text-gray-400"
              )} />
              
              <Input
                type="text"
                placeholder="Search movies, shows, people..."
                className={cn(
                  "pl-12 pr-4 py-3 w-full",
                  "bg-black/40 border border-white/20",
                  "text-white placeholder:text-gray-400",
                  "focus:bg-black/60 focus:border-purple-500/50",
                  "focus:shadow-neon-purple focus:outline-none",
                  "transition-all duration-300 ease-cinema",
                  "backdrop-blur-sm"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              
              {/* Search Glow Effect */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Quick Search Results (placeholder) */}
              {searchQuery && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 max-h-96 overflow-y-auto z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 text-gray-400 text-sm">
                    Search results will appear here...
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Actions Section */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* Notifications */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GlowingButton
                variant="ghost"
                size="sm"
                className="relative p-2 w-10 h-10"
              >
                <Bell className="h-5 w-5" />
                
                {/* Notification Badge */}
                {hasNotifications && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-black"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-amber-400 rounded-full animate-ping"
                      initial={{ opacity: 0.7 }}
                    />
                  </motion.div>
                )}
              </GlowingButton>
            </motion.div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlowingButton
                    variant="ghost"
                    size="sm"
                    className="relative p-1 w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-amber-500 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online Status Indicator */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-black rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </GlowingButton>
                </motion.div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className={cn(
                  "w-64 p-2 mt-2",
                  "bg-black/90 backdrop-blur-xl border border-white/10",
                  "shadow-cinema-card"
                )}
                align="end" 
                forceMount
              >
                {/* User Info Header */}
                <div className="flex items-center space-x-3 p-3 mb-2 bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-white/10">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-amber-500 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">User Name</p>
                    <p className="text-gray-400 text-xs">Cinema Enthusiast</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400 ml-auto" />
                </div>

                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.header>
  );
}