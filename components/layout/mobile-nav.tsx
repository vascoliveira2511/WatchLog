"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Heart,
  BarChart3,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "Shows", href: "/shows", icon: Tv },
  { name: "Watchlist", href: "/watchlist", icon: Heart },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Bottom Tab Bar */}
      <div className="glass-premium border-t border-white/10 px-2 py-2">
        <nav className="flex items-center justify-around">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 min-w-[64px] rounded-xl transition-all duration-300",
                    isActive 
                      ? "text-purple-400" 
                      : "text-gray-400 hover:text-white"
                  )}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-purple-500/20 rounded-xl border border-purple-500/30"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon 
                    className={cn(
                      "w-6 h-6 mb-1 relative z-10",
                      isActive && "drop-shadow-neon-purple"
                    )} 
                  />
                  <span className={cn(
                    "text-xs font-medium relative z-10",
                    isActive ? "text-white" : "text-gray-500"
                  )}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-bottom bg-black/80" />
    </div>
  );
}