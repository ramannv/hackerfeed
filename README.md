# HN Feed - Personalized Hacker News Reader

A minimal, mobile-first Hacker News reader with AI-powered personalized recommendations based on your starred stories.

## Features

- **Top 50 Stories**: Displays the top stories from Hacker News
- **Star System**: Click the star icon to save stories you enjoy
- **Personalized Recommendations**: After starring 3+ stories, the app learns your preferences and highlights similar content
- **Mobile-First UI**: Optimized for touch interactions with large tap targets
- **Minimal Design**: Clean interface focused on readability
- **Real-time Updates**: Refresh button to fetch latest stories

## How It Works

### Recommendation Algorithm

The app analyzes your starred stories to build a preference profile based on:

1. **Keywords**: Extracts and weights keywords from story titles
2. **Authors**: Tracks which authors you prefer
3. **Domains**: Identifies your favorite sources
4. **Score Patterns**: Learns your score range preferences

When you have 3+ starred stories, new stories are scored based on similarity to your preferences. The top 30% of matching stories are highlighted with an orange border and "Recommended" badge.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **localStorage** for persistence
- **Hacker News API** for data

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # App header with refresh button
│   └── StoryCard.tsx       # Individual story card component
├── services/
│   ├── hnApi.ts           # Hacker News API integration
│   ├── storage.ts         # localStorage management
│   └── recommendations.ts # Recommendation engine
├── types.ts               # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Tailwind CSS imports
```

## Usage Tips

1. **Star Stories**: Tap the star icon on stories you find interesting
2. **Build Your Profile**: Star at least 3 stories to activate recommendations
3. **Discover Content**: Recommended stories appear with an orange left border
4. **Refresh**: Use the refresh button in the header to load new stories
5. **Read Articles**: Tap anywhere on a story card to open it in a new tab

## API Reference

Uses the official Hacker News Firebase API:
- Top Stories: `https://hacker-news.firebaseio.com/v0/topstories.json`
- Story Details: `https://hacker-news.firebaseio.com/v0/item/{id}.json`

## Future Enhancements

- Pull-to-refresh gesture
- Infinite scroll for more stories
- Filter by story type (Show HN, Ask HN, etc.)
- Export/import starred stories
- More sophisticated ML-based recommendations
- Dark mode toggle
