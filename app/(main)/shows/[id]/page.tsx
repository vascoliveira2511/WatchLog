"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { tmdbClient, TMDBTVShow } from "@/lib/tmdb/client";
import { trackingService } from "@/lib/database/tracking";
import {
  Star,
  Play,
  Plus,
  Check,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EpisodeTracker } from "@/components/media/episode-tracker";
import { ProgressBar } from "@/components/media/progress-bar";

// Mock data for demonstration
const mockShow = {
  id: 1,
  title: "Breaking Bad",
  year: 2008,
  endYear: 2013,
  posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  backdropPath: "/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg",
  genres: ["Crime", "Drama", "Thriller"],
  overview:
    "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's financial future.",
  rating: 9.5,
  userRating: 5,
  runtime: 47,
  seasons: 5,
  totalEpisodes: 62,
  watchedEpisodes: 45,
  status: "watching" as "watching" | "unwatched" | "completed",
  isInWatchlist: true,
  cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "RJ Mitte"],
  creator: "Vince Gilligan",
  network: "AMC",
};

const mockSeasons = [
  {
    seasonNumber: 1,
    episodes: [
      {
        id: 101,
        episodeNumber: 1,
        title: "Pilot",
        airDate: "2008-01-20",
        runtime: 58,
        overview:
          "Walter White, a struggling high school chemistry teacher, is diagnosed with advanced lung cancer. He turns to a life of crime and partners with a former student, Jesse Pinkman, in a quest to secure his family's financial future.",
        watched: true,
        rating: 5,
      },
      {
        id: 102,
        episodeNumber: 2,
        title: "Cat's in the Bag...",
        airDate: "2008-01-27",
        runtime: 48,
        overview:
          "Walt and Jesse attempt to tie up loose ends. The desperate situation gets more complicated with the flip of a coin. Walt's wife, Skyler, becomes suspicious of Walt's strange behavior.",
        watched: true,
        rating: 4,
      },
      // More episodes would be here...
    ],
  },
  // More seasons would be here...
];

export default function ShowDetailsPage() {
  const params = useParams();
  const showId = parseInt(params.id as string);

  const [show, setShow] = useState(mockShow);
  const [seasons, setSeasons] = useState(mockSeasons);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [activeTab, setActiveTab] = useState("episodes");
  const [, setIsLoading] = useState(true);
  const [realShow, setRealShow] = useState<TMDBTVShow | null>(null);

  useEffect(() => {
    const loadShowData = async () => {
      try {
        // Load show details from TMDB
        const showData = await tmdbClient.getTVShow(showId);
        setRealShow(showData);

        // Load user tracking data
        try {
          const userData = await trackingService.getShowUserData(showId);
          console.log("User show data:", userData);

          // Update show with real data
          setShow({
            ...mockShow,
            id: showData.id,
            title: showData.name,
            year: new Date(showData.first_air_date).getFullYear(),
            overview: showData.overview,
            rating: showData.vote_average,
            seasons: showData.number_of_seasons ?? 0,
            totalEpisodes: showData.number_of_episodes ?? 0,
            watchedEpisodes: userData.totalWatched,
            status:
              userData.watchStatus === "watching"
                ? "watching"
                : userData.watchStatus === "watched"
                ? "completed"
                : "unwatched",
            isInWatchlist: userData.inWatchlist,
          });
        } catch {
          console.log("User not authenticated or tracking data unavailable");
          // Use TMDB data only
          setShow({
            ...mockShow,
            id: showData.id,
            title: showData.name,
            year: new Date(showData.first_air_date).getFullYear(),
            overview: showData.overview,
            rating: showData.vote_average,
            seasons: showData.number_of_seasons ?? 0,
            totalEpisodes: showData.number_of_episodes ?? 0,
          });
        }

        // Load season data
        if (showData.seasons && showData.seasons.length > 0) {
          try {
            const seasonData = await tmdbClient.getTVSeason(
              showId,
              selectedSeason
            );
            if (seasonData.episodes) {
              const episodesWithProgress = seasonData.episodes.map(
                (episode) => ({
                  id: episode.id,
                  episodeNumber: episode.episode_number,
                  title: episode.name,
                  airDate: episode.air_date,
                  runtime: episode.runtime ?? 0,
                  overview: episode.overview,
                  watched: false, // Will be loaded from database
                  rating: 0,
                })
              );

              setSeasons([
                {
                  seasonNumber: selectedSeason,
                  episodes: episodesWithProgress,
                },
              ]);
            }
          } catch (error) {
            console.error("Error loading season data:", error);
          }
        }
      } catch (error) {
        console.error("Error loading show:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (showId) {
      loadShowData();
    }
  }, [showId, selectedSeason]);

  const selectedSeasonData = seasons.find(
    (s) => s.seasonNumber === selectedSeason
  );

  const handleEpisodeWatched = async (episodeId: number, watched: boolean) => {
    // Optimistic UI update
    setSeasons((prev) =>
      prev.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) =>
          episode.id === episodeId ? { ...episode, watched } : episode
        ),
      }))
    );

    // Update show's watched count
    const newWatchedCount = watched
      ? show.watchedEpisodes + 1
      : show.watchedEpisodes - 1;

    setShow((prev) => ({
      ...prev,
      watchedEpisodes: newWatchedCount,
      status:
        newWatchedCount === show.totalEpisodes
          ? ("completed" as const)
          : ("watching" as const),
    }));

    try {
      // Save to database
      // Note: This would need a new trackingService method for episodes
      console.log(
        `Marking episode ${episodeId} as ${watched ? "watched" : "unwatched"}`
      );

      // Update show status in database
      const newStatus =
        newWatchedCount === show.totalEpisodes
          ? "watched"
          : newWatchedCount > 0
          ? "watching"
          : "unwatched";
      await trackingService.updateShowStatus(
        showId,
        newStatus as "watching" | "watched" | "unwatched",
        realShow
      );
    } catch (error) {
      console.error("Error updating episode status:", error);
      // Could revert the optimistic update here
    }
  };

  const handleBulkMarkWatched = (episodeIds: number[]) => {
    setSeasons((prev) =>
      prev.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) =>
          episodeIds.includes(episode.id)
            ? { ...episode, watched: true }
            : episode
        ),
      }))
    );

    setShow((prev) => ({
      ...prev,
      watchedEpisodes: prev.watchedEpisodes + episodeIds.length,
    }));
  };

  const handleWatchlistToggle = () => {
    setShow((prev) => ({ ...prev, isInWatchlist: !prev.isInWatchlist }));
  };

  const handleRateShow = (rating: number) => {
    setShow((prev) => ({ ...prev, userRating: rating }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden">
        {show.backdropPath && (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${show.backdropPath}`}
            alt={show.title}
            fill
            className="object-cover opacity-50"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
          <div className="flex h-full items-end p-8">
            <div className="flex items-end space-x-6">
              {show.posterPath && (
                <div className="relative w-48 h-72 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${show.posterPath}`}
                    alt={show.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="text-white space-y-4 max-w-2xl">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
                  <p className="text-lg text-gray-300">
                    {show.year}
                    {show.endYear && ` - ${show.endYear}`} • {show.seasons}{" "}
                    Season{show.seasons > 1 ? "s" : ""} • {show.network}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-current text-yellow-400" />
                    <span className="font-semibold">{show.rating}</span>
                  </div>

                  <div className="flex space-x-2">
                    {show.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">{show.overview}</p>

                <div className="flex items-center space-x-3">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Continue Watching
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black"
                    onClick={handleWatchlistToggle}
                  >
                    {show.isInWatchlist ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        In Watchlist
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add to Watchlist
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    <Share className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar
                title={`${show.title} Progress`}
                current={show.watchedEpisodes}
                total={show.totalEpisodes}
                type="episodes"
                status={show.status === "unwatched" ? "planned" : show.status}
                size="lg"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Your Rating</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateShow(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= show.userRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Show Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Creator</span>
                  <span className="font-medium">{show.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Runtime</span>
                  <span className="font-medium">~{show.runtime}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge
                    variant={
                      show.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
          <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
          <TabsTrigger value="similar">Similar Shows</TabsTrigger>
          <TabsTrigger value="activity">Your Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="episodes" className="space-y-6">
          {/* Season Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Episodes</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSelectedSeason(Math.max(1, selectedSeason - 1))
                }
                disabled={selectedSeason === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="font-medium px-4">Season {selectedSeason}</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSelectedSeason(Math.min(show.seasons, selectedSeason + 1))
                }
                disabled={selectedSeason === show.seasons}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedSeasonData && (
            <EpisodeTracker
              showTitle={show.title}
              seasonNumber={selectedSeason}
              episodes={selectedSeasonData.episodes}
              onEpisodeWatched={handleEpisodeWatched}
              onBulkMarkWatched={handleBulkMarkWatched}
            />
          )}
        </TabsContent>

        <TabsContent value="cast">
          <Card>
            <CardHeader>
              <CardTitle>Cast & Crew</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Main Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {show.cast.map((actor) => (
                      <Badge key={actor} variant="secondary">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="similar">
          <Card>
            <CardHeader>
              <CardTitle>Similar Shows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Similar shows will appear here based on your viewing history and
                preferences.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Your watch history and activity for this show will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
