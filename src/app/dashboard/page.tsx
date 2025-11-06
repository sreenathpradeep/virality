"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

interface Influencer {
  id: string;
  username: string;
  platform: string;
  display_name: string;
  email: string;
  follower_count: number;
  engagement_rate: number;
  category: string;
  bio: string;
  profile_image_url: string;
  profile_url: string;
  verified: boolean;
}

interface SearchResult {
  data: Influencer[];
  count: number;
  limit: number;
  offset: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [results, setResults] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [savedInfluencers, setSavedInfluencers] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    await checkSubscription(user);
    await loadSavedInfluencers(user);
  };

  const checkSubscription = async (user: any) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) return;

    const res = await fetch('/api/subscription', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setHasSubscription(data.hasActiveSubscription);
    }
  };

  const loadSavedInfluencers = async (user: any) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) return;

    const res = await fetch('/api/saved-lists', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const ids = new Set(data.data.map((item: any) => item.influencer_id));
      setSavedInfluencers(ids);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (platform !== 'all') params.append('platform', platform);
    if (category) params.append('category', category);
    if (minFollowers) params.append('minFollowers', minFollowers);

    const res = await fetch(`/api/influencers/search?${params.toString()}`);
    if (res.ok) {
      const data: SearchResult = await res.json();

      // Limit results for free users
      if (!hasSubscription && data.data.length > 5) {
        setResults(data.data.slice(0, 5));
        setTotalCount(data.count || 0);
      } else {
        setResults(data.data);
        setTotalCount(data.count || 0);
      }
    }

    setLoading(false);
  };

  const handleSave = async (influencerId: string) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) return;

    if (savedInfluencers.has(influencerId)) {
      // Remove from saved
      const res = await fetch(`/api/saved-lists?influencer_id=${influencerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSavedInfluencers(prev => {
          const newSet = new Set(prev);
          newSet.delete(influencerId);
          return newSet;
        });
      }
    } else {
      // Add to saved
      const res = await fetch('/api/saved-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ influencer_id: influencerId }),
      });

      if (res.ok) {
        setSavedInfluencers(prev => new Set(prev).add(influencerId));
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpgrade = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (data.attributes?.url) {
        window.location.href = data.attributes.url;
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Virality</h1>
          <div className="flex items-center gap-4">
            {!hasSubscription && (
              <button
                onClick={handleUpgrade}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Upgrade to Pro
              </button>
            )}
            {hasSubscription && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Pro Member
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Influencers</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
              <input
                type="text"
                placeholder="Category (e.g., beauty)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                placeholder="Min followers"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Results ({totalCount} found)
              </h2>
              {!hasSubscription && totalCount > 5 && (
                <p className="text-sm text-gray-600">
                  Showing 5 of {totalCount} results.
                  <button onClick={handleUpgrade} className="text-blue-600 ml-1 underline">
                    Upgrade
                  </button> to see all.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((influencer) => (
                <div key={influencer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {influencer.profile_image_url ? (
                        <img
                          src={influencer.profile_image_url}
                          alt={influencer.username}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {influencer.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {influencer.display_name || influencer.username}
                        </h3>
                        <p className="text-sm text-gray-600">@{influencer.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSave(influencer.id)}
                      className={`p-2 rounded-full ${
                        savedInfluencers.has(influencer.id)
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {savedInfluencers.has(influencer.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                        {influencer.platform}
                      </span>
                      {influencer.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {influencer.category}
                        </span>
                      )}
                      {influencer.verified && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </div>

                    <div className="flex justify-between py-2 border-t">
                      <div>
                        <p className="text-gray-600 text-xs">Followers</p>
                        <p className="font-semibold">
                          {formatNumber(influencer.follower_count)}
                        </p>
                      </div>
                      {influencer.engagement_rate && (
                        <div>
                          <p className="text-gray-600 text-xs">Engagement</p>
                          <p className="font-semibold">{influencer.engagement_rate}%</p>
                        </div>
                      )}
                    </div>

                    {influencer.bio && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {influencer.bio}
                      </p>
                    )}

                    {influencer.email && (hasSubscription || !influencer.email.includes('*')) ? (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">Email</p>
                        <a
                          href={`mailto:${influencer.email}`}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {influencer.email}
                        </a>
                      </div>
                    ) : influencer.email ? (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm text-gray-400">
                          {influencer.email.split('@')[0].slice(0, 3)}***@***
                        </p>
                        <button
                          onClick={handleUpgrade}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Upgrade to see full email
                        </button>
                      </div>
                    ) : null}

                    {influencer.profile_url && (
                      <a
                        href={influencer.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center mt-4 text-blue-600 hover:underline text-sm"
                      >
                        View Profile →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Search for influencers by name, keyword, or filter by platform and category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
