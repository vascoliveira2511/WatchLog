"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { Search, Bell, User, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchResults } from "@/components/media/search-results";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/dashboard" },
  { name: "Movies", href: "/movies" },
  { name: "TV Shows", href: "/shows" },
  { name: "My List", href: "/watchlist" },
  { name: "Stats", href: "/stats" },
];

export function Header() {
  const router = useRouter();
  const supabase = createClient();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-black/95 backdrop-blur-xl" : "bg-gradient-to-b from-black/80 to-transparent"
    )}>
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg" />
            <span className="text-xl font-bold">WatchLog</span>
          </Link>

          {/* Main Nav - Desktop Only */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "text-white" : "text-zinc-400 hover:text-white"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:border-purple-500 w-64"
            />
            <SearchResults 
              query={searchQuery}
              isVisible={searchQuery.length > 0 && isSearchFocused}
              onResultClick={() => {
                setIsSearchFocused(false);
                setSearchQuery("");
              }}
            />
          </div>

          {/* Notifications */}
          <Bell className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-300 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-56 bg-black/95 backdrop-blur-xl border border-zinc-800"
              align="end" 
              forceMount
            >
              <div className="flex items-center gap-3 p-3 border-b border-zinc-800">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">User Name</p>
                  <p className="text-zinc-400 text-xs">Cinema Enthusiast</p>
                </div>
              </div>

              <DropdownMenuItem 
                className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                onClick={() => router.push('/profile')}
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                onClick={() => router.push('/settings')}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-zinc-800" />
              
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-zinc-800">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block p-3 rounded-lg transition-colors",
                  pathname === item.href 
                    ? "text-white bg-purple-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}