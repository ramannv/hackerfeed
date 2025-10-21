import { useState, useEffect, useCallback } from 'react';
import { StoryWithRecommendation } from './types';
import { hnApi } from './services/hnApi';
import { storageService } from './services/storage';
import { recommendationEngine } from './services/recommendations';
import { Header } from './components/Header';
import { StoryCard } from './components/StoryCard';
import { exportStarredStoriesToCSV } from './utils/csv';

function App() {
  const [stories, setStories] = useState<StoryWithRecommendation[]>([]);
  const [starredIds, setStarredIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'feed' | 'starred'>('feed');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedStories = await hnApi.getTopStories(50);
      const scoredStories = recommendationEngine.scoreStories(fetchedStories);

      // Sort: recommended first, then by score
      const sorted = scoredStories.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return b.score - a.score;
      });

      setStories(sorted);
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
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const displayedStories = view === 'starred'
    ? stories.filter(s => starredIds.has(s.id))
    : stories;

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
        onExportCSV={handleExportCSV}
      />

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

            <div className="mt-2">
              {displayedStories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isStarred={starredIds.has(story.id)}
                  onToggleStar={() => handleToggleStar(story.id)}
                  index={index + 1}
                />
              ))}
            </div>

            {displayedStories.length === 0 && !isLoading && view === 'feed' && (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400 font-mono text-sm">
                No stories found.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
