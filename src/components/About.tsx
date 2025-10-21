export const About = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="font-mono text-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4 dark:text-green-400">
            <span className="dark:text-green-600">&gt;</span> about hackerfeed
          </h1>
        </div>

        <div className="space-y-4 text-gray-800 dark:text-gray-300">
          <p>
            HackerFeed is a minimal Hacker News reader that learns what you like.
          </p>

          <p>
            Star stories you enjoy, and after 3+ stars, the app will highlight
            similar content based on keywords, authors, and domains you prefer.
          </p>

          <div className="border-l-2 border-gray-300 dark:border-green-600 pl-4 my-4">
            <p className="text-xs">
              All data stays in your browser. No tracking, no backend, no data collection.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2 dark:text-green-400">Features</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Personalized recommendations</li>
              <li>Dark/light mode</li>
              <li>CSV export of starred stories</li>
              <li>Local storage only</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold mb-2 dark:text-green-400">Contact</h2>
            <div className="text-sm space-y-1">
              <p>Email: <a href="mailto:rnvnoc@gmail.com" className="underline hover:text-green-600 dark:hover:text-green-400">rnvnoc@gmail.com</a></p>
              <p>X: <a href="https://x.com/ignoraman" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">@ignoraman</a></p>
            </div>
          </div>

          <div className="pt-4 text-xs text-gray-600 dark:text-gray-500">
            <p>Open source • MIT License</p>
            <p className="mt-1">
              <a
                href="https://github.com/ramannv/hackerfeed"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-600 dark:hover:text-green-400"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
