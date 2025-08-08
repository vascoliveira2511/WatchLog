# WatchLog

A completely free, open-source movie & TV show tracking webapp built with Next.js 15, TypeScript, Supabase, and shadcn/ui.

## 🎯 Features

### Core Tracking
- **Smart Episode Tracking**: One-click episode marking with automatic "Up Next" detection
- **Progress Visualization**: Beautiful progress bars and completion tracking
- **Bulk Operations**: Mark entire seasons as watched with one click
- **Rewatch Support**: Track multiple viewings of your favorite content
- **Custom Notes**: Add personal notes and ratings to episodes/movies

### Advanced Statistics
- **Detailed Analytics**: Heat maps, viewing patterns, and genre preferences
- **Time Tracking**: See exactly how much time you've spent watching
- **Completion Rates**: Track your show completion statistics
- **Yearly/Monthly Summaries**: Comprehensive viewing breakdowns
- **Achievement System**: Unlock achievements for various milestones

### Social Features
- **Friend System**: Follow friends and see their watching activity
- **Watch Parties**: Sync watching sessions with friends
- **Activity Feed**: See what your friends are watching in real-time
- **Shared Watchlists**: Create and share watchlists with friends
- **Check-ins**: Share what you're currently watching

### Discovery
- **TMDb Integration**: Rich metadata for movies and TV shows
- **Smart Recommendations**: Personalized suggestions based on your taste
- **Trending Content**: See what's popular among your friends
- **Calendar View**: Never miss a new episode with release calendar
- **Search & Filters**: Advanced search with genre, year, and rating filters

### Unique Features (Free Forever!)
- **Keyboard Shortcuts**: Lightning-fast navigation and actions
- **Offline Support**: Continue tracking even when offline
- **Data Export**: Full export of your watching data
- **API Access**: Build your own tools with our API
- **Self-Hosting**: Host your own instance with Docker
- **No Limits**: Unlimited history, stats, and features

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with server-side sessions
- **External APIs**: The Movie Database (TMDb) for media data
- **Deployment**: Vercel (recommended) or Docker

## 📁 Project Structure

```
watchlog/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (main)/                   # Main authenticated app
│   │   ├── dashboard/            # Personal dashboard
│   │   ├── movies/               # Movie browsing/tracking
│   │   ├── shows/                # TV show tracking
│   │   ├── history/              # Complete watch history
│   │   ├── stats/                # Detailed statistics
│   │   └── profile/[username]/   # User profiles
│   └── api/                      # API routes
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── media/                    # Media-specific components
│   └── layout/                   # Layout components
├── lib/                          # Utilities and configurations
│   ├── supabase/                 # Supabase client setup
│   ├── tmdb/                     # TMDb API client
│   └── types/                    # TypeScript type definitions
├── hooks/                        # Custom React hooks
└── supabase/                     # Database schema and migrations
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account (free tier available)
- TMDb API key (free)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/watchlog.git
cd watchlog
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# TMDb API
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
TMDB_API_READ_ACCESS_TOKEN=your-tmdb-read-access-token

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security on all tables (done automatically in schema)

### 4. TMDb API Setup

1. Create a free account at [The Movie Database](https://www.themoviedb.org/)
2. Go to Settings → API and request an API key
3. Add both the API key and read access token to your environment variables

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## ⌨️ Keyboard Shortcuts

WatchLog is designed for speed with comprehensive keyboard shortcuts:

### Navigation
- `D` - Dashboard
- `M` - Movies  
- `T` - TV Shows
- `H` - History
- `S` - Statistics
- `/` - Focus search
- `?` - Show all shortcuts

### Media Actions
- `Space` - Mark as watched
- `W` - Add to watchlist
- `1-5` - Rate (1-5 stars)
- `←/→` - Navigate episodes
- `Enter` - Toggle watched

## 📊 Database Schema

The app uses 13 optimized tables:

- **profiles** - User information and preferences
- **movies/shows** - Cached TMDb media data
- **seasons/episodes** - TV show structure
- **movie_watches/episode_watches** - Watch tracking
- **show_progress** - Series progress tracking
- **watchlist** - User watchlists
- **follows** - Friend connections
- **watch_sessions** - Watch party data
- **activity_feed** - Social activity
- **check_ins** - Currently watching updates

## 🚢 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Import to Vercel and add environment variables
3. Deploy automatically on every push

### Docker

```bash
# Build and run with Docker
docker build -t watchlog .
docker run -p 3000:3000 watchlog
```

### Self-Hosting

Full self-hosting instructions available in `DEPLOYMENT.md`

## 🤝 Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines.

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie and TV data
- [Supabase](https://supabase.com/) for the excellent backend platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set

## 📧 Support

- 📖 [Documentation](https://watchlog-docs.vercel.app)
- 🐛 [Report Issues](https://github.com/yourusername/watchlog/issues)
- 💬 [Discussions](https://github.com/yourusername/watchlog/discussions)
- 📧 Email: support@watchlog.app

---

**WatchLog is free forever. No premium tiers, no limits, no data selling. Just pure tracking joy! 🎬✨**