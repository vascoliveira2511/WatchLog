"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function addToWatchlistClient(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  priority: 1 | 2 | 3 = 2
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to add to watchlist");
      return false;
    }

    const { error } = await supabase
      .from('user_watchlist')
      .insert({
        user_id: user.id,
        media_type: mediaType,
        media_id: mediaId,
        priority,
      });
      
    if (error) {
      console.error('Error adding to watchlist:', error);
      toast.error("Failed to add to watchlist");
      return false;
    }
    
    toast.success("Added to watchlist");
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    toast.error("Failed to add to watchlist");
    return false;
  }
}

export async function removeFromWatchlistClient(
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in");
      return false;
    }

    const { error } = await supabase
      .from('user_watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('media_type', mediaType)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error('Error removing from watchlist:', error);
      toast.error("Failed to remove from watchlist");
      return false;
    }
    
    toast.success("Removed from watchlist");
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    toast.error("Failed to remove from watchlist");
    return false;
  }
}

export async function markAsWatchedClient(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  rating?: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to mark as watched");
      return false;
    }

    // Add to watch history
    const { error: watchError } = await supabase
      .from('user_watch_history')
      .upsert({
        user_id: user.id,
        media_type: mediaType,
        media_id: mediaId,
        rating,
        watched_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,media_type,media_id'
      });
      
    if (watchError) {
      console.error('Error marking as watched:', watchError);
      toast.error("Failed to mark as watched");
      return false;
    }

    // Remove from watchlist if it exists
    await supabase
      .from('user_watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('media_type', mediaType)
      .eq('media_id', mediaId);

    // Create activity
    await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        activity_type: mediaType === 'movie' ? 'watched_movie' : 'watched_episode',
        media_type: mediaType,
        media_id: mediaId,
        rating,
      });
    
    toast.success(`Marked as watched`);
    return true;
  } catch (error) {
    console.error('Error marking as watched:', error);
    toast.error("Failed to mark as watched");
    return false;
  }
}

export async function unmarkAsWatchedClient(
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in");
      return false;
    }

    const { error } = await supabase
      .from('user_watch_history')
      .delete()
      .eq('user_id', user.id)
      .eq('media_type', mediaType)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error('Error unmarking as watched:', error);
      toast.error("Failed to remove from watched");
      return false;
    }
    
    toast.success("Removed from watched");
    return true;
  } catch (error) {
    console.error('Error unmarking as watched:', error);
    toast.error("Failed to remove from watched");
    return false;
  }
}

export async function clearAllUserDataClient(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in");
      return false;
    }

    // Delete all user data in parallel
    const promises = [
      supabase.from('user_watch_history').delete().eq('user_id', user.id),
      supabase.from('user_watchlist').delete().eq('user_id', user.id),
      supabase.from('user_tv_progress').delete().eq('user_id', user.id),
      supabase.from('user_activities').delete().eq('user_id', user.id),
      supabase.from('user_episode_progress').delete().eq('user_id', user.id),
    ];

    const results = await Promise.allSettled(promises);
    
    const hasErrors = results.some(result => result.status === 'rejected');
    if (hasErrors) {
      console.error('Some data clearing operations failed:', results);
      toast.error("Some data could not be cleared");
      return false;
    }
    
    toast.success("All data cleared successfully");
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    toast.error("Failed to clear data");
    return false;
  }
}