import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  starredCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  view: 'feed' | 'starred' | 'about';
  onViewChange: (view: 'feed' | 'starred') => void;
}

export const Header = ({ starredCount, onRefresh, isLoading, darkMode, onToggleDarkMode, view, onViewChange }: HeaderProps) => {
  const navigate = useNavigate();

  const handleFeedClick = () => {
    if (view === 'about') navigate('/');
    onViewChange('feed');
  };

  const handleStarredClick = () => {
    if (view === 'about') navigate('/');
    onViewChange('starred');
  };

  return (
    <header className="sticky top-0 z-10 bg-[#ff6600] dark:bg-black dark:border-b dark:border-green-600 text-white">
      <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold font-mono dark:text-green-400">
            <span className="dark:text-green-600">&gt;</span> hackerfeed
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFeedClick}
            className={`touch-manipulation px-2 py-1 text-xs font-mono transition-colors ${
              view === 'feed'
                ? 'bg-white/20 dark:bg-green-600/30'
                : 'hover:bg-white/10 dark:hover:bg-green-600/20'
            }`}
            aria-label="View feed"
          >
            feed
          </button>

          <button
            onClick={handleStarredClick}
            className={`touch-manipulation px-2 py-1 text-xs font-mono transition-colors ${
              view === 'starred'
                ? 'bg-white/20 dark:bg-green-600/30'
                : 'hover:bg-white/10 dark:hover:bg-green-600/20'
            }`}
            aria-label="View starred stories"
          >
            starred{starredCount > 0 && ` (${starredCount})`}
          </button>

          <Link
            to="/about"
            className={`touch-manipulation px-2 py-1 text-xs font-mono transition-colors ${
              view === 'about'
                ? 'bg-white/20 dark:bg-green-600/30'
                : 'hover:bg-white/10 dark:hover:bg-green-600/20'
            }`}
            aria-label="About"
          >
            about
          </Link>

          <button
            onClick={onToggleDarkMode}
            className="touch-manipulation px-2 py-1 text-xs font-mono hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀' : '☾'}
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="touch-manipulation px-2 py-1 text-xs font-mono hover:bg-white/10 dark:hover:bg-green-600/20 transition-colors disabled:opacity-50"
            aria-label="Refresh stories"
          >
            {isLoading ? '...' : 'refresh'}
          </button>
        </div>
      </div>
    </header>
  );
};
