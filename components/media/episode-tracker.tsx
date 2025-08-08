"use client";

import { useState } from "react";
import { Check, Clock, Star, Play, MoreHorizontal, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  airDate?: string;
  runtime?: number;
  overview?: string;
  stillPath?: string;
  watched?: boolean;
  rating?: number;
  progress?: number; // 0-100 for partial watches
}

interface EpisodeTrackerProps {
  showTitle: string;
  seasonNumber: number;
  episodes: Episode[];
  onEpisodeWatched?: (episodeId: number, watched: boolean) => void;
  onEpisodeRating?: (episodeId: number, rating: number) => void;
  onBulkMarkWatched?: (episodeIds: number[]) => void;
  className?: string;
}

export function EpisodeTracker({
  showTitle,
  seasonNumber,
  episodes,
  onEpisodeWatched,
  onEpisodeRating,
  onBulkMarkWatched,
  className,
}: EpisodeTrackerProps) {
  const [selectedEpisodes, setSelectedEpisodes] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const watchedCount = episodes.filter(ep => ep.watched).length;
  const totalCount = episodes.length;
  const progressPercentage = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;

  const handleEpisodeClick = (episodeId: number) => {
    const episode = episodes.find(ep => ep.id === episodeId);
    if (episode && onEpisodeWatched) {
      onEpisodeWatched(episodeId, !episode.watched);
    }
  };

  const handleBulkAction = (action: "mark-watched" | "mark-unwatched") => {
    if (action === "mark-watched") {
      const unwatchedIds = episodes
        .filter(ep => !ep.watched)
        .map(ep => ep.id);
      onBulkMarkWatched?.(unwatchedIds);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Season Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {showTitle} - Season {seasonNumber}
          </h2>
          <p className="text-sm text-gray-600">
            {watchedCount} of {totalCount} episodes watched
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAction("mark-watched")}>
                Mark Season as Watched
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("mark-unwatched")}>
                Mark Season as Unwatched
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{progressPercentage.toFixed(0)}% complete</span>
          <span>{watchedCount}/{totalCount} episodes</span>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map((episode) => (
          <Card
            key={episode.id}
            className={cn(
              "group cursor-pointer transition-all duration-200 hover:shadow-md",
              episode.watched && "ring-2 ring-green-500 ring-opacity-20"
            )}
            onClick={() => handleEpisodeClick(episode.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      E{episode.episodeNumber}
                    </Badge>
                    {episode.airDate && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(episode.airDate)}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">
                    {episode.title}
                  </h4>
                  
                  {episode.overview && (
                    <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                      {episode.overview}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {episode.runtime && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatRuntime(episode.runtime)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {episode.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span className="text-xs font-medium">{episode.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-3 flex flex-col items-center space-y-2">
                  <Button
                    size="icon"
                    variant={episode.watched ? "default" : "outline"}
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEpisodeClick(episode.id);
                    }}
                  >
                    {episode.watched ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          // Rate episode logic
                        }}
                      >
                        Rate Episode
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add note logic
                        }}
                      >
                        Add Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Progress bar for partial watches */}
              {episode.progress !== undefined && episode.progress > 0 && episode.progress < 100 && (
                <div className="mt-2">
                  <Progress value={episode.progress} className="h-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    {episode.progress}% watched
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {episodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No episodes available for this season.</p>
        </div>
      )}
    </div>
  );
}