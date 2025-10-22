import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { StoryWithRecommendation } from './types';
import { hnApi } from './services/hnApi';
import { storageService } from './services/storage';
import { recommendationEngine } from './services/recommendations';
import { Header } from './components/Header';
import { StoryCard } from './components/StoryCard';
import { About } from './components/About';
import { exportStarredStoriesToCSV } from './utils/csv';

// Helper function to format date as "Today", "Yesterday", or "Mon, Jan 1, 2025"
function formatDateGroup(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to midnight for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}

// Group stories by the date they were starred
function groupStoriesByDate(stories: StoryWithRecommendation[]): Map<string, StoryWithRecommendation[]> {
  const groups = new Map<string, StoryWithRecommendation[]>();

  stories.forEach(story => {
    const starredAt = (story as any).starredAt;
    if (starredAt) {
      const dateKey = formatDateGroup(starredAt);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(story);
    }
  });

  return groups;
}

function App() {
  const location = useLocation();
  const [stories, setStories] = useState<StoryWithRecommendation[]>([]);
  const [starredIds, setStarredIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'feed' | 'starred' | 'about'>('feed');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Update view based on route
  useEffect(() => {
    if (location.pathname === '/about') {
      setView('about');
    } else if (location.pathname === '/') {
      // Don't reset view if already on feed or starred
      if (view === 'about') {
        setView('feed');
      }
    }
  }, [location, view]);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedStories = await hnApi.getTopStories(50);
      const scoredStories = recommendationEngine.scoreStories(fetchedStories);

      // Keep HN's original ranking order, just add recommendation flags
      setStories(scoredStories);
      setStarredIds(storageService.getStarredStoryIds());
    } catch (err) {
      setError('Failed to load stories. Please try again.');
      console.error('Error loading stories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleToggleStar = useCallback((storyId: number) => {
    // Find story in current feed or create minimal story object for deletion
    let story = stories.find(s => s.id === storyId);

    if (!story) {
      // Story not in current feed, create minimal object for toggleStar
      story = { id: storyId, title: '', by: '', score: 0, time: 0, type: 'story' };
    }

    storageService.toggleStar(story);
    const newStarredIds = storageService.getStarredStoryIds();
    setStarredIds(newStarredIds);

    // Re-score stories to update recommendation badges without changing order
    const scoredStories = recommendationEngine.scoreStories(stories);

    // Preserve original order, just update the recommendation flags
    const updatedStories = stories.map(s => {
      const updated = scoredStories.find(scored => scored.id === s.id);
      return updated || s;
    });

    setStories(updatedStories);
  }, [stories]);

  const handleViewChange = useCallback((newView: 'feed' | 'starred') => {
    setView(newView);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  const handleExportCSV = useCallback(() => {
    const starredStories = storageService.getStarredStories();
    exportStarredStoriesToCSV(starredStories);
  }, []);

  const toggleDateCollapse = useCallback((dateKey: string) => {
    setCollapsedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const displayedStories = view === 'starred'
    ? (() => {
        const starredStories = storageService.getStarredStories();

        // Convert StarredStory to StoryWithRecommendation and sort by starred timestamp
        return starredStories
          .map(s => ({
            ...s,
            score: 0,
            time: Math.floor(s.starredAt / 1000),
            type: 'story',
            isRecommended: false
          } as StoryWithRecommendation))
          .sort((a, b) => {
            const timeA = (a as any).starredAt || 0;
            const timeB = (b as any).starredAt || 0;
            return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
          });
      })()
    : stories;

  const FeedContent = () => {
    return (
    <main className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-3 py-2 mx-2 mt-2 text-sm font-mono">
            [ERROR] {error}
          </div>
        )}

        {isLoading && stories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center font-mono text-sm">
              <p className="text-gray-600 dark:text-green-400">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {view === 'feed' && (
              <>
                {starredIds.size >= 3 && stories.some(s => s.isRecommended) && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-3 py-2 mx-2 mt-2 text-xs font-mono">
                    [INFO] Personalized feed active ({starredIds.size} starred stories)
                  </div>
                )}

                {starredIds.size > 0 && starredIds.size < 3 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 px-3 py-2 mx-2 mt-2 text-xs font-mono">
                    [INFO] Star {3 - starredIds.size} more to enable personalization
                  </div>
                )}
              </>
            )}

            {view === 'starred' && starredIds.size === 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 px-3 py-2 mx-2 mt-2 text-xs font-mono">
                [INFO] No starred stories yet. Star stories from the feed to see them here.
              </div>
            )}

            {view === 'starred' && starredIds.size > 0 && (
              <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {starredIds.size} starred
                  </span>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                    className="touch-manipulation px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {sortOrder === 'newest' ? '↓ newest first' : '↑ oldest first'}
                  </button>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="touch-manipulation px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  export csv
                </button>
              </div>
            )}

            <div className="mt-2">
              {view === 'starred' ? (
                (() => {
                  const groupedStories = groupStoriesByDate(displayedStories);
                  let storyIndex = 0;

                  return Array.from(groupedStories.entries()).map(([dateKey, stories]) => {
                    const isCollapsed = collapsedDates.has(dateKey);

                    return (
                      <div key={dateKey}>
                        <div
                          className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-2 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors z-10"
                          onClick={() => toggleDateCollapse(dateKey)}
                        >
                          <span className="text-base font-mono font-semibold text-gray-700 dark:text-gray-300">
                            {isCollapsed ? '▸' : '▾'} {dateKey}
                          </span>
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-500">
                            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                          </span>
                        </div>
                        {!isCollapsed && (
                          <div>
                            {stories.map(story => {
                              storyIndex++;
                              return (
                                <StoryCard
                                  key={story.id}
                                  story={story}
                                  isStarred={starredIds.has(story.id)}
                                  onToggleStar={() => handleToggleStar(story.id)}
                                  index={storyIndex}
                                  starredAt={(story as any).starredAt}
                                  showDelete={true}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()
              ) : (
                displayedStories.map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isStarred={starredIds.has(story.id)}
                    onToggleStar={() => handleToggleStar(story.id)}
                    index={index + 1}
                    starredAt={undefined}
                    showDelete={false}
                  />
                ))
              )}
            </div>

            {displayedStories.length === 0 && !isLoading && view === 'feed' && (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400 font-mono text-sm">
                No stories found.
              </div>
            )}
          </>
        )}
    </main>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Header
        starredCount={starredIds.size}
        onRefresh={loadStories}
        isLoading={isLoading}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        view={view}
        onViewChange={handleViewChange}
      />

      <Routes>
        <Route path="/" element={<FeedContent />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
