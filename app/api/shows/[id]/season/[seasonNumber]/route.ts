import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  try {
    const { id: idParam, seasonNumber: seasonParam } = await params;
    const showId = parseInt(idParam);
    const seasonNumber = parseInt(seasonParam);
    
    if (isNaN(showId) || isNaN(seasonNumber)) {
      return NextResponse.json(
        { error: 'Invalid show ID or season number' },
        { status: 400 }
      );
    }

    const season = await tmdbClient.getTVSeason(showId, seasonNumber);
    
    return NextResponse.json(season);
  } catch (error) {
    console.error('TV season fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV season details' },
      { status: 500 }
    );
  }
}