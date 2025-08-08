"use client";

import { useState, useMemo } from "react";
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
  Timer
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

// Mock data for comprehensive stats
const mockStats = {
  overview: {
    totalEpisodes: 3204,
    totalMovies: 342,
    totalShows: 156,
    totalTimeWatched: 89340, // minutes
    currentStreak: 12,
    longestStreak: 45,
    averageRating: 4.2,
    completionRate: 78.5,
  },
  thisYear: {
    episodes: 1245,
    movies: 78,
    shows: 42,
    timeWatched: 34560, // minutes
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
    averageSessionLength: 127, // minutes
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
    { name: 'Breaking Bad', episodes: 62, timeWatched: 2914, rating: 5 },
    { name: 'The Office', episodes: 201, timeWatched: 4422, rating: 4 },
    { name: 'Game of Thrones', episodes: 73, timeWatched: 4380, rating: 4 },
    { name: 'Stranger Things', episodes: 42, timeWatched: 2520, rating: 5 },
    { name: 'Friends', episodes: 236, timeWatched: 5192, rating: 4 },
  ],
};

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedTab, setSelectedTab] = useState('overview');

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

  const getWatchingStreak = () => {
    return mockStats.overview.currentStreak;
  };

  const getCompletionPercentage = () => {
    return mockStats.overview.completionRate;
  };

  const currentMonth = new Date().getMonth();
  const thisMonthData = mockStats.byMonth[currentMonth];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">Your watching journey in numbers</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Flame className="h-3 w-3" />
            <span>{getWatchingStreak()}-day streak</span>
          </Badge>
          
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tv className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Episodes</p>
                <p className="text-2xl font-bold">{mockStats.overview.totalEpisodes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Film className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Movies</p>
                <p className="text-2xl font-bold">{mockStats.overview.totalMovies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Watched</p>
                <p className="text-2xl font-bold">{formatHours(mockStats.overview.totalTimeWatched)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{mockStats.overview.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* This Month Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Episodes Watched</span>
                    <span className="font-semibold">{thisMonthData.episodes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Movies Watched</span>
                    <span className="font-semibold">{thisMonthData.movies}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time Watched</span>
                    <span className="font-semibold">{formatTime(thisMonthData.time)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watching Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Watching Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Most Active Day</span>
                    <Badge variant="secondary">{mockStats.watchingPatterns.mostActiveDay}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Peak Time</span>
                    <Badge variant="secondary">{mockStats.watchingPatterns.mostActiveHour}:00</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Session Length</span>
                    <span className="font-semibold">{formatTime(mockStats.watchingPatterns.averageSessionLength)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{getCompletionPercentage()}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Shows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Your Top Shows</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.topShows.map((show, index) => (
                  <div key={show.name} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{show.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{show.episodes} episodes</span>
                        <span>{formatTime(show.timeWatched)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium">{show.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{mockStats.thisYear.episodes}</p>
                    <p className="text-sm text-gray-600">Episodes This Year</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{mockStats.thisYear.movies}</p>
                    <p className="text-sm text-gray-600">Movies This Year</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{formatHours(mockStats.thisYear.timeWatched)}h</p>
                    <p className="text-sm text-gray-600">Hours This Year</p>
                  </div>
                </div>
                
                {/* Monthly breakdown would have a chart here */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 text-center">
                    Monthly activity chart would be displayed here using a charting library
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genre Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.topGenres.map((genre) => (
                  <div key={genre.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{genre.name}</span>
                      <span className="text-sm text-gray-600">{genre.count} shows</span>
                    </div>
                    <Progress value={genre.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockStats.achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.completed ? "border-green-200 bg-green-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${achievement.completed ? "bg-green-100" : "bg-gray-100"}`}>
                      <Award className={`h-5 w-5 ${achievement.completed ? "text-green-600" : "text-gray-400"}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      
                      {achievement.completed ? (
                        <Badge variant="default" className="mt-2">
                          Completed {new Date(achievement.date!).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <Progress value={(achievement.progress! / 100) * 100} className="h-2" />
                          <p className="text-xs text-gray-500">{achievement.progress}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}