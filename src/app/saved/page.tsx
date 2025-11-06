"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface SavedItem {
  id: string;
  created_at: string;
  influencer_id: string;
  influencers: Influencer;
}

export default function SavedPage() {
  const router = useRouter();
  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    await loadSavedInfluencers();
  };

  const loadSavedInfluencers = async () => {
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
      setSavedList(data.data);
    }

    setLoading(false);
  };

  const handleRemove = async (influencerId: string) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) return;

    const res = await fetch(`/api/saved-lists?influencer_id=${influencerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setSavedList(prev => prev.filter(item => item.influencer_id !== influencerId));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Virality</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Search
            </Link>
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
        <h2 className="text-2xl font-bold mb-6">Saved Influencers ({savedList.length})</h2>

        {savedList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">You haven't saved any influencers yet.</p>
            <Link
              href="/dashboard"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((item) => {
              const influencer = item.influencers;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow p-6">
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
                      onClick={() => handleRemove(influencer.id)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                    >
                      🗑️
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

                    {influencer.email && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">Email</p>
                        <a
                          href={`mailto:${influencer.email}`}
                          className="text-blue-600 text-sm hover:underline break-all"
                        >
                          {influencer.email}
                        </a>
                      </div>
                    )}

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
