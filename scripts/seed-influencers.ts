import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample influencer data
const sampleInfluencers = [
  // Instagram influencers
  {
    username: 'fitnessguru_jane',
    platform: 'instagram',
    display_name: 'Jane Fitness',
    email: 'jane@fitnessguru.com',
    follower_count: 1250000,
    engagement_rate: 4.5,
    category: 'fitness',
    bio: 'Certified personal trainer & nutrition coach. Helping you reach your fitness goals 💪',
    profile_url: 'https://instagram.com/fitnessguru_jane',
    verified: true,
  },
  {
    username: 'beautyby_sarah',
    platform: 'instagram',
    display_name: 'Sarah Beauty',
    email: 'sarah@beautycontact.com',
    follower_count: 850000,
    engagement_rate: 5.2,
    category: 'beauty',
    bio: 'Makeup artist & beauty enthusiast. Cruelty-free beauty advocate 🐰',
    profile_url: 'https://instagram.com/beautyby_sarah',
    verified: true,
  },
  {
    username: 'techreview_mike',
    platform: 'instagram',
    display_name: 'Mike Tech',
    email: 'mike@techreviews.io',
    follower_count: 520000,
    engagement_rate: 3.8,
    category: 'technology',
    bio: 'Latest tech reviews and gadget unboxings. DM for collabs 📱',
    profile_url: 'https://instagram.com/techreview_mike',
    verified: false,
  },
  {
    username: 'traveler_emma',
    platform: 'instagram',
    display_name: 'Emma Wanderlust',
    email: 'emma@wanderlustlife.com',
    follower_count: 2100000,
    engagement_rate: 6.1,
    category: 'travel',
    bio: 'Travel blogger exploring the world one city at a time ✈️🌍',
    profile_url: 'https://instagram.com/traveler_emma',
    verified: true,
  },
  {
    username: 'foodie_alex',
    platform: 'instagram',
    display_name: 'Alex Foodie',
    email: 'alex@foodieparadise.com',
    follower_count: 680000,
    engagement_rate: 4.9,
    category: 'food',
    bio: 'Food photographer & recipe creator. NYC based 🍕🍔',
    profile_url: 'https://instagram.com/foodie_alex',
    verified: false,
  },

  // YouTube influencers
  {
    username: 'TechWithTom',
    platform: 'youtube',
    display_name: 'Tom - Tech Reviews',
    email: 'tom@techwithtom.com',
    follower_count: 3500000,
    engagement_rate: 7.2,
    category: 'technology',
    bio: 'In-depth tech reviews and tutorials. New videos every Tuesday!',
    profile_url: 'https://youtube.com/@TechWithTom',
    verified: true,
  },
  {
    username: 'GameMasterLily',
    platform: 'youtube',
    display_name: 'Lily - Gaming',
    email: 'lily@gamemaster.gg',
    follower_count: 4200000,
    engagement_rate: 8.5,
    category: 'gaming',
    bio: 'Professional gamer & streamer. Valorant, League, and more!',
    profile_url: 'https://youtube.com/@GameMasterLily',
    verified: true,
  },
  {
    username: 'DIYCraftStudio',
    platform: 'youtube',
    display_name: 'DIY Craft Studio',
    email: 'hello@diycraftstudio.com',
    follower_count: 1800000,
    engagement_rate: 5.8,
    category: 'diy',
    bio: 'Creative DIY projects and craft tutorials for everyone!',
    profile_url: 'https://youtube.com/@DIYCraftStudio',
    verified: true,
  },
  {
    username: 'CookingWithCarla',
    platform: 'youtube',
    display_name: 'Carla Kitchen',
    email: 'carla@cookingcarla.com',
    follower_count: 2900000,
    engagement_rate: 6.4,
    category: 'food',
    bio: 'Easy recipes for busy people. Cook with confidence!',
    profile_url: 'https://youtube.com/@CookingWithCarla',
    verified: true,
  },
  {
    username: 'FitnessRevolution',
    platform: 'youtube',
    display_name: 'Fitness Revolution',
    email: 'info@fitnessrev.com',
    follower_count: 1500000,
    engagement_rate: 4.7,
    category: 'fitness',
    bio: 'Transform your body with science-based workouts!',
    profile_url: 'https://youtube.com/@FitnessRevolution',
    verified: false,
  },

  // TikTok influencers
  {
    username: 'danceking_jay',
    platform: 'tiktok',
    display_name: 'Jay Dance',
    email: 'jay@danceking.net',
    follower_count: 5800000,
    engagement_rate: 12.3,
    category: 'dance',
    bio: 'Professional dancer & choreographer. Let\'s dance! 💃🕺',
    profile_url: 'https://tiktok.com/@danceking_jay',
    verified: true,
  },
  {
    username: 'comedyqueen_lisa',
    platform: 'tiktok',
    display_name: 'Lisa Comedy',
    email: 'lisa@comedyqueen.fun',
    follower_count: 7200000,
    engagement_rate: 15.8,
    category: 'comedy',
    bio: 'Making you laugh one video at a time 😂',
    profile_url: 'https://tiktok.com/@comedyqueen_lisa',
    verified: true,
  },
  {
    username: 'fashionista_zoe',
    platform: 'tiktok',
    display_name: 'Zoe Fashion',
    email: 'zoe@fashionista.style',
    follower_count: 3400000,
    engagement_rate: 9.1,
    category: 'fashion',
    bio: 'Affordable fashion hauls & styling tips! 👗✨',
    profile_url: 'https://tiktok.com/@fashionista_zoe',
    verified: true,
  },
  {
    username: 'petlover_max',
    platform: 'tiktok',
    display_name: 'Max & Pets',
    email: 'max@petlovers.com',
    follower_count: 4600000,
    engagement_rate: 11.5,
    category: 'pets',
    bio: 'Cute pets doing cute things 🐶🐱',
    profile_url: 'https://tiktok.com/@petlover_max',
    verified: true,
  },
  {
    username: 'lifehacks_sam',
    platform: 'tiktok',
    display_name: 'Sam Life Hacks',
    email: 'sam@lifehacks.tips',
    follower_count: 2800000,
    engagement_rate: 8.9,
    category: 'lifestyle',
    bio: 'Life hacks that actually work! Daily tips & tricks.',
    profile_url: 'https://tiktok.com/@lifehacks_sam',
    verified: false,
  },

  // Additional diverse influencers
  {
    username: 'yoga_mindful',
    platform: 'instagram',
    display_name: 'Mindful Yoga',
    email: 'hello@yogamindful.com',
    follower_count: 950000,
    engagement_rate: 5.5,
    category: 'wellness',
    bio: 'Yoga instructor promoting mindfulness & wellness 🧘‍♀️',
    profile_url: 'https://instagram.com/yoga_mindful',
    verified: true,
  },
  {
    username: 'crypto_insights',
    platform: 'youtube',
    display_name: 'Crypto Insights',
    email: 'contact@cryptoinsights.io',
    follower_count: 890000,
    engagement_rate: 6.8,
    category: 'finance',
    bio: 'Crypto news, analysis & investment strategies. Not financial advice.',
    profile_url: 'https://youtube.com/@crypto_insights',
    verified: false,
  },
  {
    username: 'plants_paradise',
    platform: 'tiktok',
    display_name: 'Plant Paradise',
    email: 'plants@paradise.green',
    follower_count: 1900000,
    engagement_rate: 7.6,
    category: 'gardening',
    bio: 'Plant care tips & tricks for urban gardeners 🌱',
    profile_url: 'https://tiktok.com/@plants_paradise',
    verified: false,
  },
  {
    username: 'art_by_rosa',
    platform: 'instagram',
    display_name: 'Rosa Art',
    email: 'rosa@artbyrosa.com',
    follower_count: 620000,
    engagement_rate: 4.2,
    category: 'art',
    bio: 'Digital artist & illustrator. Commissions open! 🎨',
    profile_url: 'https://instagram.com/art_by_rosa',
    verified: false,
  },
  {
    username: 'parenthood_real',
    platform: 'youtube',
    display_name: 'Real Parenthood',
    email: 'hello@parenthoodreal.com',
    follower_count: 1200000,
    engagement_rate: 5.9,
    category: 'parenting',
    bio: 'Honest parenting advice & family vlogs. Mom of 3!',
    profile_url: 'https://youtube.com/@parenthood_real',
    verified: true,
  },
];

async function seedInfluencers() {
  console.log('Starting to seed influencers...');

  try {
    const { data, error } = await supabase
      .from('influencers')
      .upsert(sampleInfluencers, {
        onConflict: 'username,platform',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} influencers!`);
    console.log('Sample influencers added across Instagram, YouTube, and TikTok.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

seedInfluencers();
