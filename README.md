# Virality - Influencer Discovery Platform

A subscription-based influencer discovery platform that aggregates data from Instagram, YouTube, and TikTok. Find influencers, view their metrics, and access their contact information.

## Features

- **Cross-Platform Search**: Search influencers across Instagram, YouTube, and TikTok
- **Advanced Filters**: Filter by platform, category, and follower count
- **Email Discovery**: Access verified email addresses for outreach
- **Saved Lists**: Bookmark your favorite influencers
- **Subscription Tiers**: Free users get limited results, Pro members see everything
- **User Authentication**: Secure signup/login with Supabase
- **Payment Processing**: Subscription payments via Lemon Squeezy

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Payments**: Lemon Squeezy
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Lemon Squeezy account (for payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd virality
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL to create tables and policies

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_VARIANT_ID=your_variant_id
```

### 4. Seed Sample Data

Populate your database with sample influencers:

```bash
npm run seed
```

This will add 20 sample influencers across different platforms and categories.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Project Structure

```
virality/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/       # Lemon Squeezy payment
│   │   │   ├── influencers/    # Search API
│   │   │   ├── saved-lists/    # Save/unsave influencers
│   │   │   └── subscription/   # Check subscription status
│   │   ├── dashboard/          # Main search interface
│   │   ├── saved/              # Saved influencers list
│   │   ├── login/              # Authentication
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   └── AuthButton.tsx
│   └── utils/
│       └── supabaseClient.ts
├── supabase/
│   └── schema.sql              # Database schema
├── scripts/
│   └── seed-influencers.ts     # Sample data seeder
└── docs/
    └── PRD.md                  # Product requirements
```

## Key Features Explained

### Search Functionality

The search API supports:
- Text search by username, display name, or category
- Platform filtering (Instagram, YouTube, TikTok, or all)
- Category filtering
- Minimum follower count filtering
- Results are ordered by follower count

### Subscription Gating

- **Free users**: See first 5 results, emails are partially hidden
- **Pro users**: See all results, full email access
- Upgrade flow integrated with Lemon Squeezy

### Database Schema

Three main tables:
- `influencers`: Core influencer data
- `saved_lists`: User bookmarks
- `user_subscriptions`: Subscription status tracking

Row Level Security (RLS) enabled for data protection.

## API Endpoints

- `GET /api/influencers/search` - Search influencers with filters
- `GET /api/saved-lists` - Get user's saved influencers
- `POST /api/saved-lists` - Save an influencer
- `DELETE /api/saved-lists` - Remove from saved
- `GET /api/subscription` - Check subscription status
- `POST /api/checkout` - Create payment checkout

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment

1. Run the seed script to populate data (or integrate real data sources)
2. Set up Lemon Squeezy webhooks for subscription updates
3. Configure email providers if adding email notifications

## Future Enhancements

See `docs/PRD.md` for planned features:
- CSV import/export
- Outreach templates
- Advanced analytics
- Campaign tracking
- API integrations with social platforms

## License

MIT
