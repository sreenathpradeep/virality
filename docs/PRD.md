# Virality Product Requirements Document

## Overview
Virality is an influencer discovery platform that aggregates public data from Instagram, YouTube, and TikTok to help marketers find relevant creators and their contact information. Users can search by keyword, topic, or handle to view influencer profiles, email addresses, and engagement metrics. Paid plans unlock full profile results and additional data filters.

## Objectives
- Provide a unified search experience across IG, YouTube, and TikTok
- Offer verified email addresses for potential outreach
- Enable subscription payments via Lemon Squeezy
- Use Supabase for authentication and database features

## Features
1. **Cross‑platform Search** – Query influencers by username or keywords across all supported networks.
2. **Email Discovery** – Display verified email addresses when available.
3. **Influencer Metrics** – Show follower counts and engagement data.
4. **Saved Lists** – Allow logged in users to bookmark influencers.
5. **Subscription Plans** – Gate advanced search and full results behind paid plans.

## Technical Stack
- **Next.js** app router
- **Supabase** for auth and database
- **Lemon Squeezy** for payment processing
- **Tailwind CSS** for styling

## User Flow
1. Visitor lands on marketing homepage.
2. User signs up or logs in via Supabase.
3. Free users can perform limited searches.
4. Upgrade via Lemon Squeezy checkout to unlock full results.
5. Users manage lists of influencers from their dashboard.

## Future Enhancements
- Import lists via CSV
- Automatic outreach templates
- Advanced analytics and reporting
