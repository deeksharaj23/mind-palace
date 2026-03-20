# Mind Palace

A constellation-based journaling insight system. Capture thoughts, moods, and dreams as nodes. The system detects patterns and reveals insights through a calming constellation interface.

## Features

- **Nodes**: Capture thoughts, journal entries, dreams, moods, and health data
- **Pattern detection**: Recurring tags, negative sentiment clusters, similar content, mood streaks
- **Constellation UI**: Full-screen graph with glowing nodes and tag-based connections
- **Reveal experience**: Insights emerge through dimming, highlighting, and animated connections
- **Node expansion**: Click nodes to view full content in a glassmorphism card

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- Supabase (database)
- Framer Motion (animations)
- Custom SVG graph (lightweight)

## Setup

1. Install dependencies:

```bash
npm install
```

2. (Optional) Configure Supabase:

- Create a Supabase project
- Run the migration in `supabase/migrations/001_create_nodes.sql`
- Copy `.env.example` to `.env.local` and add your Supabase URL and anon key

3. Run the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Development

The app uses **mock data** by default, so you can explore the constellation and insights without a database. The mock data includes work stress, anxiety, and dream entries that trigger the pattern engine.

- **Home** (`/`): Landing page with link to insights
- **Insights** (`/insights`): Constellation view with reveal experience, navigation, and node expansion

## Data Model

Nodes have: `id`, `type`, `content`, `tags`, `timestamp`, `emotion`, `intensity`, and optional `embedding` (for future vector search).

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Constellation, NodeExpansionCard, InsightMessage, etc.
├── data/             # Mock nodes for development
├── hooks/            # useGraphData
├── lib/
│   ├── graph/        # Layout, links from tags
│   ├── pattern-engine/  # detectPatterns, selectRepresentativeNodes, generateInsight
│   └── supabase/     # Client and types
├── store/            # Zustand store
└── types/            # Node, Pattern, Insight types
```
