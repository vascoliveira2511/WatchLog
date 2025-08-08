"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  History, 
  BarChart3, 
  Calendar, 
  Users,
  Heart,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/shows", icon: Tv },
  { name: "History", href: "/history", icon: History },
  { name: "Statistics", href: "/stats", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Watch Party", href: "/watchparty", icon: Users },
  { name: "Watchlist", href: "/watchlist", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full pt-20 pb-4 overflow-y-auto">
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-blue-700" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-4">
          <Link
            href="/settings"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}