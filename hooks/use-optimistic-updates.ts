"use client";

import { useState, useCallback, useTransition } from 'react';

interface OptimisticState<T> {
  data: T;
  pending: boolean;
  error: string | null;
}

interface OptimisticAction<T, P = any> {
  optimisticUpdate: (current: T, params: P) => T;
  serverAction: (params: P) => Promise<T>;
  revertOnError?: boolean;
}

export function useOptimisticUpdates<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    pending: false,
    error: null,
  });
  
  const [isPending, startTransition] = useTransition();

  const executeOptimistic = useCallback(
    <P>(action: OptimisticAction<T, P>) => 
      (params: P) => {
        const previousData = state.data;
        
        // Apply optimistic update immediately
        setState(prev => ({
          ...prev,
          data: action.optimisticUpdate(prev.data, params),
          pending: true,
          error: null,
        }));

        startTransition(async () => {
          try {
            // Execute server action
            const result = await action.serverAction(params);
            
            setState({
              data: result,
              pending: false,
              error: null,
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            
            setState({
              data: action.revertOnError !== false ? previousData : state.data,
              pending: false,
              error: errorMessage,
            });
          }
        });
      },
    [state.data]
  );

  return {
    ...state,
    pending: isPending || state.pending,
    executeOptimistic,
    clearError: () => setState(prev => ({ ...prev, error: null })),
  };
}

// Specialized hooks for common use cases

export function useOptimisticWatched(initialWatched = false) {
  const { data: isWatched, pending, error, executeOptimistic } = useOptimisticUpdates(initialWatched);

  const toggleWatched = executeOptimistic({
    optimisticUpdate: (current) => !current,
    serverAction: async (mediaId: string) => {
      // Simulated server action - replace with actual API call
      const response = await fetch(`/api/media/${mediaId}/watched`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !isWatched }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update watched status');
      }
      
      const result = await response.json();
      return result.watched;
    },
  });

  return {
    isWatched,
    pending,
    error,
    toggleWatched,
  };
}

export function useOptimisticWatchlist(initialInWatchlist = false) {
  const { data: inWatchlist, pending, error, executeOptimistic } = useOptimisticUpdates(initialInWatchlist);

  const toggleWatchlist = executeOptimistic({
    optimisticUpdate: (current) => !current,
    serverAction: async (mediaId: string) => {
      const response = await fetch(`/api/watchlist/${mediaId}`, {
        method: inWatchlist ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update watchlist');
      }
      
      const result = await response.json();
      return result.inWatchlist;
    },
  });

  return {
    inWatchlist,
    pending,
    error,
    toggleWatchlist,
  };
}

export function useOptimisticRating(initialRating = 0) {
  const { data: rating, pending, error, executeOptimistic } = useOptimisticUpdates(initialRating);

  const updateRating = executeOptimistic({
    optimisticUpdate: (current, newRating: number) => newRating,
    serverAction: async ({ mediaId, rating: newRating }: { mediaId: string; rating: number }) => {
      const response = await fetch(`/api/media/${mediaId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update rating');
      }
      
      const result = await response.json();
      return result.rating;
    },
  });

  return {
    rating,
    pending,
    error,
    updateRating,
  };
}

export function useOptimisticEpisodeProgress(initialProgress: number[] = []) {
  const { data: watchedEpisodes, pending, error, executeOptimistic } = useOptimisticUpdates(initialProgress);

  const toggleEpisode = executeOptimistic({
    optimisticUpdate: (current, episodeId: number) => {
      const isWatched = current.includes(episodeId);
      return isWatched 
        ? current.filter(id => id !== episodeId)
        : [...current, episodeId].sort((a, b) => a - b);
    },
    serverAction: async (episodeId: number) => {
      const isCurrentlyWatched = watchedEpisodes.includes(episodeId);
      
      const response = await fetch(`/api/episodes/${episodeId}/watched`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !isCurrentlyWatched }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update episode status');
      }
      
      const result = await response.json();
      return result.watchedEpisodes;
    },
  });

  const markSeasonWatched = executeOptimistic({
    optimisticUpdate: (current, episodeIds: number[]) => {
      const newWatched = new Set([...current, ...episodeIds]);
      return Array.from(newWatched).sort((a, b) => a - b);
    },
    serverAction: async (episodeIds: number[]) => {
      const response = await fetch('/api/episodes/bulk-watched', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeIds, watched: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark season as watched');
      }
      
      const result = await response.json();
      return result.watchedEpisodes;
    },
  });

  return {
    watchedEpisodes,
    pending,
    error,
    toggleEpisode,
    markSeasonWatched,
    isEpisodeWatched: (episodeId: number) => watchedEpisodes.includes(episodeId),
  };
}