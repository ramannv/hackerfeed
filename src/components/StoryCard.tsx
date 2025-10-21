import { StoryWithRecommendation } from '../types';
import { storageService } from '../services/storage';

interface StoryCardProps {
  story: StoryWithRecommendation;
  isStarred: boolean;
  onToggleStar: () => void;
  index: number;
}

export const StoryCard = ({ story, isStarred, onToggleStar, index }: StoryCardProps) => {
  const domain = story.url ? storageService.extractDomain(story.url) : null;
  const timeAgo = formatTimeAgo(story.time);

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleStar();
  };

  const openStory = () => {
    if (story.url) {
      window.open(story.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-500 font-mono text-xs mt-0.5 w-6 flex-shrink-0">
          {index}.
        </span>

        <button
          onClick={handleStarClick}
          className="flex-shrink-0 mt-0.5 touch-manipulation"
          aria-label={isStarred ? 'Unstar story' : 'Star story'}
        >
          <span className={`text-base ${isStarred ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'}`}>
            {isStarred ? '★' : '☆'}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              onClick={openStory}
              className="text-gray-900 dark:text-gray-100 hover:underline cursor-pointer font-mono"
            >
              {story.isRecommended && (
                <span className="text-green-600 dark:text-green-400 mr-1">&gt;</span>
              )}
              {story.title}
            </span>
            {domain && (
              <span className="text-gray-500 dark:text-gray-500 text-xs font-mono">
                ({domain})
              </span>
            )}
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-mono">
            {story.score} pts · {story.by} · {timeAgo}
            {story.descendants !== undefined && ` · ${story.descendants} comments`}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
