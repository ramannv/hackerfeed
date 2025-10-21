interface HeaderProps {
  starredCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  view: 'feed' | 'starred';
  onViewChange: (view: 'feed' | 'starred') => void;
  onExportCSV?: () => void;
}

export const Header = ({ starredCount, onRefresh, isLoading, darkMode, onToggleDarkMode, view, onViewChange, onExportCSV }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-[#ff6600] dark:bg-black dark:border-b dark:border-green-600 text-white">
      <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold font-mono dark:text-green-400">
            <span className="dark:text-green-600">&gt;</span> hn_feed
            {starredCount > 0 && (
              <span className="ml-2 text-xs opacity-75">
                [{starredCount}★]
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('feed')}
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
            onClick={() => onViewChange('starred')}
            className={`touch-manipulation px-2 py-1 text-xs font-mono transition-colors ${
              view === 'starred'
                ? 'bg-white/20 dark:bg-green-600/30'
                : 'hover:bg-white/10 dark:hover:bg-green-600/20'
            }`}
            aria-label="View starred stories"
          >
            starred
          </button>

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

          {view === 'starred' && starredCount > 0 && onExportCSV && (
            <button
              onClick={onExportCSV}
              className="touch-manipulation px-2 py-1 text-xs font-mono hover:bg-white/10 dark:hover:bg-green-600/20 transition-colors"
              aria-label="Export starred stories as CSV"
            >
              export
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
