"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Star, 
  Plus,
  ArrowRight,
  Flame,
  Users,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MediaCard } from "@/components/media/media-card";
import { ProgressBar } from "@/components/media/progress-bar";

// Mock data for demonstration
const mockUpNext = [
  {
    id: 1,
    showTitle: "Breaking Bad",
    showId: 1,
    seasonNumber: 3,
    episodeNumber: 7,
    episodeTitle: "One Minute",
    episodeOverview: "Hank's increasing volatility forces a confrontation with Jesse and trouble at work. Skyler pressures Walt to make a deal. Gus' actions have severe consequences.",
    airDate: "2010-05-02",
    runtime: 47,
    stillPath: "/image1.jpg",
    posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  },
  {
    id: 2,
    showTitle: "The Office",
    showId: 2,
    seasonNumber: 4,
    episodeNumber: 12,
    episodeTitle: "The Deposition",
    episodeOverview: "Michael is deposed when he's forced to appear in court after Jan sues Dunder Mifflin. Kelly and Ryan resume their on-and-off relationship.",
    airDate: "2008-04-17",
    runtime: 22,
    stillPath: "/image2.jpg",
    posterPath: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
  },
];

const mockCurrentlyWatching = [
  {
    id: 1,
    title: "Breaking Bad",
    posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    progress: 75,
    totalEpisodes: 62,
    watchedEpisodes: 47,
    status: "watching" as const,
  },
  {
    id: 2,
    title: "The Office",
    posterPath: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    progress: 60,
    totalEpisodes: 201,
    watchedEpisodes: 120,
    status: "watching" as const,
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: "watch",
    showTitle: "Breaking Bad",
    episodeTitle: "Phoenix",
    timestamp: "2 hours ago",
    rating: 5,
  },
  {
    id: 2,
    type: "complete",
    showTitle: "Stranger Things",
    season: 4,
    timestamp: "1 day ago",
  },
  {
    id: 3,
    type: "add",
    showTitle: "Better Call Saul",
    timestamp: "2 days ago",
  },
];

const mockStats = {
  thisWeek: {
    episodes: 12,
    movies: 3,
    timeWatched: 847, // minutes
  },
  thisMonth: {
    episodes: 45,
    movies: 8,
    timeWatched: 2340, // minutes
  },
  allTime: {
    shows: 156,
    movies: 342,
    episodes: 3204,
    timeWatched: 89340, // minutes
  },
};

export default function DashboardPage() {
  const [upNext, setUpNext] = useState(mockUpNext);
  const [currentlyWatching, setCurrentlyWatching] = useState(mockCurrentlyWatching);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [stats, setStats] = useState(mockStats);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimeShort = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Ready to continue your watch journey?</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Flame className="h-3 w-3" />
            <span>12-day streak</span>
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-lg font-bold">{stats.thisWeek.episodes} episodes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Watched</p>
                <p className="text-lg font-bold">{formatTimeShort(stats.thisWeek.timeWatched)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shows</p>
                <p className="text-lg font-bold">{currentlyWatching.length} watching</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">All Time</p>
                <p className="text-lg font-bold">{stats.allTime.episodes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Up Next Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span>Up Next</span>
              </CardTitle>
              <Link href="/shows">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {upNext.map((episode) => (
                <div
                  key={episode.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="relative w-20 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {episode.posterPath && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${episode.posterPath}`}
                        alt={episode.showTitle}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{episode.showTitle}</h4>
                      <Badge variant="outline" className="text-xs">
                        S{episode.seasonNumber}E{episode.episodeNumber}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-1 truncate">{episode.episodeTitle}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {episode.episodeOverview}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {episode.runtime}min
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(episode.airDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                </div>
              ))}
              
              {upNext.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No episodes up next!</p>
                  <p className="text-sm">Start watching a show to see your next episodes here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue Watching */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Watching</CardTitle>
              <Link href="/shows">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentlyWatching.map((show) => (
                  <div key={show.id} className="space-y-3">
                    <ProgressBar
                      title={show.title}
                      current={show.watchedEpisodes}
                      total={show.totalEpisodes}
                      type="episodes"
                      status={show.status}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
                  <div className="p-1 bg-blue-100 rounded">
                    {activity.type === "watch" && <Play className="h-3 w-3 text-blue-600" />}
                    {activity.type === "complete" && <Star className="h-3 w-3 text-yellow-600" />}
                    {activity.type === "add" && <Plus className="h-3 w-3 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.showTitle}</p>
                    {activity.type === "watch" && (
                      <p className="text-gray-600">{activity.episodeTitle}</p>
                    )}
                    {activity.type === "complete" && (
                      <p className="text-gray-600">Completed Season {activity.season}</p>
                    )}
                    {activity.type === "add" && (
                      <p className="text-gray-600">Added to watchlist</p>
                    )}
                    <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                  </div>
                  {activity.rating && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="ml-1 text-xs font-medium">{activity.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">{stats.thisMonth.episodes} episodes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Watched</span>
                  <span className="font-medium">{formatTime(stats.thisMonth.timeWatched)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Movies</span>
                  <span className="font-medium">{stats.thisMonth.movies}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Link href="/stats">
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Stats
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}