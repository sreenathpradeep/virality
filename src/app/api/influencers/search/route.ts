import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const platform = searchParams.get('platform');
  const category = searchParams.get('category');
  const minFollowers = searchParams.get('minFollowers');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let queryBuilder = supabase
      .from('influencers')
      .select('*', { count: 'exact' });

    // Search by username or display name
    if (query) {
      queryBuilder = queryBuilder.or(
        `username.ilike.%${query}%,display_name.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    // Filter by platform
    if (platform && platform !== 'all') {
      queryBuilder = queryBuilder.eq('platform', platform);
    }

    // Filter by category
    if (category) {
      queryBuilder = queryBuilder.ilike('category', `%${category}%`);
    }

    // Filter by minimum followers
    if (minFollowers) {
      queryBuilder = queryBuilder.gte('follower_count', parseInt(minFollowers));
    }

    // Order and pagination
    queryBuilder = queryBuilder
      .order('follower_count', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
