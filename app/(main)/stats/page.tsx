"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  Flame,
  Users,
  Star,
  Film,
  Tv,
  Timer,
  Activity,
  Eye,
  Heart,
  PlayCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { trackingService } from "@/lib/database/tracking";

// Mock data for comprehensive stats - will be replaced with real data
const mockStats = {
  overview: {
    totalEpisodes: 3204,
    totalMovies: 342,
    totalShows: 156,
    totalTimeWatched: 89340, // minutes
    currentStreak: 12,
    longestStreak: 45,
    averageRating: 8.4,
    completionRate: 78.5,
  },
  thisYear: {
    episodes: 1245,
    movies: 78,
    shows: 42,
    timeWatched: 34560,
    newShows: 28,
    completedShows: 15,
  },
  byMonth: [
    { month: 'Jan', episodes: 98, movies: 12, time: 2840 },
    { month: 'Feb', episodes: 87, movies: 8, time: 2650 },
    { month: 'Mar', episodes: 145, movies: 15, time: 3890 },
    { month: 'Apr', episodes: 123, movies: 9, time: 3240 },
    { month: 'May', episodes: 167, movies: 11, time: 4120 },
    { month: 'Jun', episodes: 134, movies: 7, time: 3560 },
    { month: 'Jul', episodes: 189, movies: 13, time: 4780 },
    { month: 'Aug', episodes: 156, movies: 10, time: 4230 },
    { month: 'Sep', episodes: 132, movies: 8, time: 3680 },
    { month: 'Oct', episodes: 98, movies: 14, time: 3120 },
    { month: 'Nov', episodes: 78, movies: 6, time: 2890 },
    { month: 'Dec', episodes: 156, movies: 18, time: 4340 },
  ],
  topGenres: [
    { name: 'Drama', count: 89, percentage: 28.5 },
    { name: 'Comedy', count: 67, percentage: 21.4 },
    { name: 'Action', count: 54, percentage: 17.3 },
    { name: 'Thriller', count: 45, percentage: 14.4 },
    { name: 'Sci-Fi', count: 32, percentage: 10.3 },
    { name: 'Horror', count: 25, percentage: 8.0 },
  ],
  watchingPatterns: {
    mostActiveDay: 'Saturday',
    mostActiveHour: 21,
    averageSessionLength: 127,
    bingeWatcher: true,
    weekdayVsWeekend: { weekday: 45, weekend: 55 },
  },
  achievements: [
    { id: 1, name: 'Binge Watcher', description: 'Watch 5+ episodes in one day', completed: true, date: '2024-01-15' },
    { id: 2, name: 'Movie Marathon', description: 'Watch 3+ movies in one day', completed: true, date: '2024-02-20' },
    { id: 3, name: 'Genre Explorer', description: 'Watch shows from 10 different genres', completed: true, date: '2024-03-10' },
    { id: 4, name: 'Series Completionist', description: 'Complete 5 TV series', completed: true, date: '2024-04-05' },
    { id: 5, name: 'Rating Master', description: 'Rate 100 episodes/movies', completed: false, progress: 73 },
    { id: 6, name: 'Consistency King', description: '30-day watching streak', completed: false, progress: 12 },
  ],
  topShows: [
    { name: 'Breaking Bad', episodes: 62, timeWatched: 2914, rating: 9.5 },
    { name: 'The Office', episodes: 201, timeWatched: 4422, rating: 8.8 },
    { name: 'Game of Thrones', episodes: 73, timeWatched: 4380, rating: 8.2 },
    { name: 'Stranger Things', episodes: 42, timeWatched: 2520, rating: 9.1 },
    { name: 'Friends', episodes: 236, timeWatched: 5192, rating: 8.5 },
  ],
};

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(mockStats); // Will be replaced with real data

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        // TODO: Replace with real data from trackingService.getUserStats()
        // const stats = await trackingService.getUserStats();
        // setUserStats(stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user stats:', error);
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatHours = (minutes: number) => {
    return Math.round(minutes / 60);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const currentMonth = new Date().getMonth();
  const thisMonthData = userStats.byMonth[currentMonth];

  if (isLoading) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your cinema journey...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bebas text-white mb-2">Your Statistics</h1>
            <p className="text-gray-400">Your cinema journey in numbers</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center space-x-2">
              <Flame className="h-4 w-4" />
              <span>{userStats.overview.currentStreak}-day streak</span>
            </Badge>
            
            <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-36 bg-black/40 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Key Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="glass-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 border border-purple-500/30">
                  <Tv className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Episodes</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(userStats.overview.totalEpisodes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500/20 border border-amber-500/30">
                  <Film className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Movies</p>
                  <p className="text-3xl font-bold text-white">{userStats.overview.totalMovies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30">
                  <Clock className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Time Watched</p>
                  <p className="text-3xl font-bold text-white">{formatHours(userStats.overview.totalTimeWatched)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 border border-blue-500/30">
                  <Star className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">{userStats.overview.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Stats Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <TabsList className="glass-premium border-white/10 bg-black/40 grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Trends
              </TabsTrigger>
              <TabsTrigger value="genres" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Genres
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* This Month Stats */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <span>This Month</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Episodes Watched</span>
                        <span className="font-semibold text-white">{thisMonthData.episodes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Movies Watched</span>
                        <span className="font-semibold text-white">{thisMonthData.movies}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Time Watched</span>
                        <span className="font-semibold text-white">{formatTime(thisMonthData.time)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Watching Patterns */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-amber-400" />
                      <span>Watching Patterns</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Most Active Day</span>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {userStats.watchingPatterns.mostActiveDay}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Peak Time</span>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          {userStats.watchingPatterns.mostActiveHour}:00
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Session Length</span>
                        <span className="font-semibold text-white">{formatTime(userStats.watchingPatterns.averageSessionLength)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Completion Rate</span>
                        <span className="font-semibold text-white">{userStats.overview.completionRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Shows */}
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span>Your Top Shows</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.topShows.map((show, index) => (
                      <motion.div
                        key={show.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/20">
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{show.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>{show.episodes} episodes</span>
                            <span>{formatTime(show.timeWatched)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{show.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Activity This Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-4xl font-bold text-purple-400">{userStats.thisYear.episodes}</p>
                        <p className="text-sm text-gray-400 mt-1">Episodes This Year</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-amber-400">{userStats.thisYear.movies}</p>
                        <p className="text-sm text-gray-400 mt-1">Movies This Year</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-emerald-400">{formatHours(userStats.thisYear.timeWatched)}h</p>
                        <p className="text-sm text-gray-400 mt-1">Hours This Year</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-8 bg-white/5 border border-white/10 text-center">
                      <p className="text-gray-400">
                        📊 Monthly activity chart will be displayed here using a charting library
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="genres" className="space-y-6">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Genre Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userStats.topGenres.map((genre, index) => (
                      <motion.div
                        key={genre.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{genre.name}</span>
                          <span className="text-sm text-gray-400">{genre.count} shows</span>
                        </div>
                        <Progress 
                          value={genre.percentage} 
                          className="h-3 bg-white/10" 
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userStats.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "glass-premium border-white/10",
                      achievement.completed && "border-emerald-500/30 bg-emerald-500/5"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            "p-3 border",
                            achievement.completed 
                              ? "bg-emerald-500/20 border-emerald-500/30"
                              : "bg-white/10 border-white/20"
                          )}>
                            <Award className={cn(
                              "h-6 w-6",
                              achievement.completed ? "text-emerald-400" : "text-gray-400"
                            )} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                            <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                            
                            {achievement.completed ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                Completed {new Date(achievement.date!).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <div className="space-y-2">
                                <Progress value={achievement.progress} className="h-2 bg-white/10" />
                                <p className="text-xs text-gray-500">{achievement.progress}/100</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </CinematicBackground>
  );
}