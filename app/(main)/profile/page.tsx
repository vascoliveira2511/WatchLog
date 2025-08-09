"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from '@/lib/supabase/client';
import { trackingService } from '@/lib/database/tracking';
import { 
  User, 
  Settings, 
  Heart, 
  Clock, 
  Calendar, 
  Film, 
  Tv, 
  Star,
  Activity,
  Users,
  Trophy,
  Edit2,
  MapPin,
  Mail,
  Globe,
  Play,
  Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowingButton } from "@/components/ui/glowing-button";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { MediaCard } from "@/components/media/media-card";
import { cn } from "@/lib/utils";

// Mock user data - will be replaced with real Supabase data
const mockUser = {
  id: "1",
  name: "Cinema Enthusiast",
  username: "cinephile123",
  email: "user@example.com",
  bio: "Passionate about cinema, from indie films to blockbusters. Always on the hunt for hidden gems.",
  avatar: null,
  location: "Los Angeles, CA",
  website: "https://myblog.com",
  joinedAt: "2024-01-15",
  isPrivate: false
};

const mockStats = {
  totalWatched: 1247,
  watchlistCount: 89,
  followers: 234,
  following: 156,
  moviesWatched: 342,
  showsWatched: 156,
  totalHours: 1489,
  averageRating: 8.4,
  favoriteGenres: ["Drama", "Sci-Fi", "Thriller"],
  currentStreak: 12
};

const mockRecentActivity = [
  { id: 1, type: "watched", title: "The Batman", mediaType: "movie", rating: 9.2, timestamp: "2024-01-10T20:30:00Z" },
  { id: 2, type: "rated", title: "House of the Dragon", mediaType: "tv", rating: 8.5, timestamp: "2024-01-09T19:15:00Z" },
  { id: 3, type: "watchlist", title: "Oppenheimer", mediaType: "movie", timestamp: "2024-01-08T14:22:00Z" },
  { id: 4, type: "completed", title: "The Bear", mediaType: "tv", rating: 9.8, timestamp: "2024-01-07T21:45:00Z" },
  { id: 5, type: "watched", title: "Dune: Part Two", mediaType: "movie", rating: 9.5, timestamp: "2024-01-06T18:00:00Z" },
];

const mockWatchlist = [
  { id: 1, title: "Oppenheimer", type: "movie", posterPath: null, year: 2023, rating: 8.3 },
  { id: 2, title: "The Last of Us", type: "tv", posterPath: null, year: 2023, rating: 8.7 },
  { id: 3, title: "Everything Everywhere All at Once", type: "movie", posterPath: null, year: 2022, rating: 7.8 },
  { id: 4, title: "Wednesday", type: "tv", posterPath: null, year: 2022, rating: 8.1 },
];

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [stats, setStats] = useState(mockStats);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load authenticated user
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error || !authUser) {
          console.log('No authenticated user');
          setIsLoading(false);
          return;
        }

        // Update user info
        setUser({
          ...mockUser,
          id: authUser.id,
          email: authUser.email || mockUser.email,
          name: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || mockUser.name,
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || mockUser.username,
        });

        // Load user stats
        const userStats = await trackingService.getUserStats();
        setStats({
          ...mockStats,
          totalWatched: userStats.moviesWatched + userStats.showsWatched,
          moviesWatched: userStats.moviesWatched,
          showsWatched: userStats.showsWatched,
          totalHours: Math.floor(userStats.totalWatchTime / 60),
        });

        // Load user watchlist
        const userWatchlist = await trackingService.getUserWatchlist();
        if (userWatchlist.length > 0) {
          setWatchlist(userWatchlist.slice(0, 4).map(item => ({
            id: item.media_id,
            title: `Media ${item.media_id}`, // Will be populated from TMDB
            type: item.media_type === 'movie' ? 'movie' : 'tv',
            posterPath: null, // Will be populated from TMDB
            year: 2023, // Will be populated from TMDB
            rating: 8.0, // Mock rating
          })));
        }

        console.log('Loaded profile data:', { authUser, userStats, userWatchlist });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watched': return <Play className="h-4 w-4 text-emerald-400" />;
      case 'rated': return <Star className="h-4 w-4 text-amber-400" />;
      case 'watchlist': return <Heart className="h-4 w-4 text-purple-400" />;
      case 'completed': return <Trophy className="h-4 w-4 text-blue-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'watched':
        return `Watched ${activity.title}`;
      case 'rated':
        return `Rated ${activity.title} ${activity.rating}/10`;
      case 'watchlist':
        return `Added ${activity.title} to watchlist`;
      case 'completed':
        return `Completed ${activity.title}`;
      default:
        return `Activity on ${activity.title}`;
    }
  };

  if (isLoading) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Cover Background */}
          <div className="relative h-64 bg-gradient-to-r from-purple-900/40 via-purple-600/30 to-amber-600/40 glass-premium border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute -bottom-20 left-8">
              <Avatar className="w-40 h-40 border-4 border-black glass-premium">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-amber-500 text-white text-4xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-24 px-8 pb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bebas text-white mb-1">{user.name}</h1>
                  <p className="text-xl text-gray-400">@{user.username}</p>
                </div>
                
                {user.bio && (
                  <p className="text-gray-300 max-w-2xl leading-relaxed">{user.bio}</p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                        {user.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatJoinDate(user.joinedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GlowingButton variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </GlowingButton>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalWatched}</p>
                <p className="text-sm text-gray-400">Total Watched</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.watchlistCount}</p>
                <p className="text-sm text-gray-400">Watchlist</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.followers}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.following}</p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <TabsList className="glass-premium border-white/10 bg-black/40 grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Activity
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Watchlist
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-400" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Movies</span>
                        <span className="text-white font-semibold">{stats.moviesWatched}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TV Shows</span>
                        <span className="text-white font-semibold">{stats.showsWatched}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Hours</span>
                        <span className="text-white font-semibold">{stats.totalHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Rating</span>
                        <span className="text-white font-semibold">{stats.averageRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Streak</span>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          {stats.currentStreak} days
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Genres */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400" />
                      Favorite Genres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {stats.favoriteGenres.map((genre) => (
                        <Badge key={genre} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Preview */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm text-white">{getActivityText(activity)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-white font-medium">{getActivityText(activity)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs">
                              {activity.mediaType}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-white font-semibold">{activity.rating}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="watchlist" className="space-y-6">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-purple-400" />
                      Watchlist ({watchlist.length})
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {watchlist.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MediaCard
                          id={item.id}
                          title={item.title}
                          year={item.year}
                          posterPath={item.posterPath}
                          type={item.type as "movie" | "tv"}
                          rating={item.rating * 10}
                          isInWatchlist={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-premium border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 border border-purple-500/30">
                        <Film className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Movies</p>
                        <p className="text-3xl font-bold text-white">{stats.moviesWatched}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-premium border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 border border-amber-500/30">
                        <Tv className="h-8 w-8 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">TV Shows</p>
                        <p className="text-3xl font-bold text-white">{stats.showsWatched}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-premium border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/30">
                        <Clock className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total Hours</p>
                        <p className="text-3xl font-bold text-white">{stats.totalHours}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-premium border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 border border-blue-500/30">
                        <Star className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Avg Rating</p>
                        <p className="text-3xl font-bold text-white">{stats.averageRating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </CinematicBackground>
  );
}