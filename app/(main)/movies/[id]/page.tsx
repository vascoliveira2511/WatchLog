"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Plus, 
  Check, 
  Heart,
  Share,
  BookOpen,
  Film,
  Eye
} from "lucide-react";
import { tmdbClient, TMDBMovie } from "@/lib/tmdb/client";
import { trackingService } from "@/lib/database/tracking";
import { CinematicBackground } from "@/components/ui/cinematic-background";
import { GlowingButton } from "@/components/ui/glowing-button";
import { RatingStars } from "@/components/ui/rating-stars";
import { WatchButton, WatchStatus } from "@/components/ui/watch-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  
  const [movie, setMovie] = useState<TMDBMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [watchStatus, setWatchStatus] = useState<WatchStatus>("unwatched");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movieData = await tmdbClient.getMovie(movieId);
        setMovie(movieData);
        
        // Load user tracking data
        try {
          const userData = await trackingService.getMovieUserData(movieId);
          setWatchStatus(userData.watchStatus);
          if (userData.rating) {
            setUserRating(userData.rating);
          }
        } catch (error) {
          console.log('User not authenticated or tracking data unavailable');
        }
      } catch (error) {
        console.error('Error loading movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      loadMovie();
    }
  }, [movieId]);

  const handleRatingChange = async (rating: number) => {
    setUserRating(rating);
    try {
      await trackingService.rateMovie(movieId, rating);
    } catch (error) {
      console.error('Error saving rating:', error);
      // Revert on error
      setUserRating(userRating);
    }
  };

  const handleWatchStatusChange = async (status: WatchStatus) => {
    const previousStatus = watchStatus;
    setWatchStatus(status);
    try {
      await trackingService.updateMovieStatus(movieId, status, movie);
    } catch (error) {
      console.error('Error updating watch status:', error);
      // Revert on error
      setWatchStatus(previousStatus);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  if (isLoading) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  if (!movie) {
    return (
      <CinematicBackground variant="default" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Movie Not Found</h1>
            <p className="text-gray-400">The requested movie could not be found.</p>
          </div>
        </div>
      </CinematicBackground>
    );
  }

  return (
    <CinematicBackground variant="default" className="min-h-screen">
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] min-h-[500px] overflow-hidden"
        >
          {/* Backdrop Image */}
          {movie.backdrop_path && (
            <div className="absolute inset-0">
              <Image
                src={tmdbClient.getBackdropUrl(movie.backdrop_path, 'w1280')}
                alt={movie.title}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          
          {/* Content */}
          <div className="relative h-full flex items-end p-8">
            <div className="flex items-end gap-8 max-w-7xl mx-auto w-full">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex-shrink-0"
              >
                <div className="relative w-64 h-96 glass-premium border border-white/20 overflow-hidden group">
                  {movie.poster_path ? (
                    <Image
                      src={tmdbClient.getImageUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center">
                      <Film className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 text-white space-y-6"
              >
                <div>
                  <h1 className="text-5xl font-bebas tracking-wide mb-2">
                    {movie.title}
                  </h1>
                  {movie.original_title !== movie.title && (
                    <p className="text-xl text-gray-300 mb-2">
                      {movie.original_title}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    {movie.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <Badge 
                      key={genre.id} 
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                
                {/* Overview */}
                <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
                  {movie.overview}
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <WatchButton
                    status={watchStatus}
                    onStatusChange={handleWatchStatusChange}
                    size="lg"
                  />
                  
                  <GlowingButton variant="ghost" size="lg">
                    <Share className="w-5 h-5 mr-2" />
                    Share
                  </GlowingButton>
                  
                  <GlowingButton variant="ghost" size="lg">
                    <Heart className="w-5 h-5 mr-2" />
                    Favorite
                  </GlowingButton>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* User Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-7xl mx-auto px-8"
        >
          <Card className="glass-premium border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                Your Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RatingStars
                rating={userRating}
                onRatingChange={handleRatingChange}
                size="lg"
                animated
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-7xl mx-auto px-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass-premium border-white/10 bg-black/40">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="cast" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Cast & Crew
              </TabsTrigger>
              <TabsTrigger value="similar" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Similar Movies
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Movie Details */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Movie Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Release Date</span>
                        <p className="text-white font-medium">
                          {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                      </div>
                      {movie.runtime && (
                        <div>
                          <span className="text-gray-400">Runtime</span>
                          <p className="text-white font-medium">
                            {formatRuntime(movie.runtime)}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Rating</span>
                        <p className="text-white font-medium">
                          {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString()} votes)
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Status</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Released
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Stats */}
                <Card className="glass-premium border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Watch Status</span>
                        <p className="text-white font-medium capitalize">
                          {watchStatus.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Your Rating</span>
                        <p className="text-white font-medium">
                          {userRating > 0 ? `${userRating}/10` : 'Not rated'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Times Watched</span>
                        <p className="text-white font-medium">
                          {watchStatus === 'watched' ? '1' : '0'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Added On</span>
                        <p className="text-white font-medium">
                          {watchStatus !== 'unwatched' ? 'Today' : 'Not added'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cast">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Cast & Crew</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Cast and crew information will be available soon with TMDb integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="similar">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Similar Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Similar movies will be recommended based on this movie's genres and your preferences.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="glass-premium border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    User reviews and ratings will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </CinematicBackground>
  );
}