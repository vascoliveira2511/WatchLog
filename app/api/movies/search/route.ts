import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await tmdbClient.searchMovies(query, parseInt(page));
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Movie search error:', error);
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      page = 1,
      sort_by = 'popularity.desc',
      with_genres,
      primary_release_year,
      vote_average_gte,
      vote_average_lte,
      with_runtime_gte,
      with_runtime_lte,
    } = body;

    const results = await tmdbClient.discoverMovies({
      page,
      sort_by,
      with_genres,
      primary_release_year,
      vote_average_gte,
      vote_average_lte,
      with_runtime_gte,
      with_runtime_lte,
    });
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Movie discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover movies' },
      { status: 500 }
    );
  }
}