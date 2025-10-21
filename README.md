# HN Feed - Personalized Hacker News Reader

> A minimal, privacy-first Hacker News reader with intelligent personalization based on your reading habits.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7)](https://app.netlify.com/start)

**[Live Demo](https://your-demo-url.netlify.app)** | **[Report Bug](https://github.com/yourusername/hnfeed/issues)** | **[Request Feature](https://github.com/yourusername/hnfeed/issues)**

---

## ✨ Features

- 🎯 **Smart Recommendations** - Content-based filtering learns your preferences from starred stories
- ⭐ **Star System** - Save stories you enjoy with a single click
- 📱 **Mobile-First** - Terminal-inspired UI optimized for all devices
- 🌙 **Dark Mode** - Easy on the eyes with command-line aesthetic
- 💾 **Local Persistence** - Your data stays in your browser via localStorage
- 📊 **CSV Export** - Download your starred stories anytime
- 🔒 **Privacy-First** - No tracking, no backend, no data collection
- ⚡ **Fast & Lightweight** - Client-side only, works offline after first load

---

## 🚀 Quick Start

### Use the Live Version
Visit the deployed app (link above) and start starring stories!

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/hnfeed.git
cd hnfeed

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🧠 How Recommendations Work

The app uses a **content-based filtering algorithm** that runs entirely in your browser:

### 1. **Feature Extraction**
When you star stories, the app extracts:
- **Keywords** from titles (with stopword filtering)
- **Author names** you prefer
- **Source domains** you trust
- **Score patterns** (high/low engagement stories)

### 2. **Profile Building**
Your preferences are weighted by frequency:
- Keyword matches: **2x weight**
- Author matches: **5x weight**
- Domain matches: **3x weight**

### 3. **Story Scoring**
Each new story is scored against your profile:
```
score = (keyword_overlap × 2) + (author_match × 5) + (domain_match × 3)
```

### 4. **Highlighting**
- ✅ **Requires 3+ starred stories** to activate
- 🎯 **Top 30% of scored stories** are marked "Recommended"
- 💚 **Green `>` indicator** shows personalized picks in dark mode

### Why This Approach?
- ✅ **No user data needed** - works for single users
- ✅ **Transparent** - you can see why stories are recommended
- ✅ **Privacy-preserving** - all computation happens locally
- ✅ **Fast** - no API calls for recommendations

---

## 📖 How to Use

### Basic Usage
1. **Browse** top 50 HN stories on the main feed
2. **Star** stories you find interesting (☆ → ★)
3. **Wait** until you have 3+ starred stories
4. **See** personalized recommendations with green `>` markers

### Views
- **Feed**: All stories with recommendations highlighted
- **Starred**: Only your saved stories

### Export Your Data
1. Go to the **"starred"** view
2. Click **"export"** button in header
3. Download CSV with: Title, URL, Author, Domain, Date

### Customize
- 🌙 Toggle **dark mode** with ☾/☀ button
- 🔄 **Refresh** to get latest stories
- 🗑️ **Unstar** by clicking filled ★

---

## 🛠️ Technical Details

### Tech Stack
- **React 18** + **TypeScript** - Type-safe UI components
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **localStorage** - Client-side persistence
- **Hacker News API** - Real-time story data

### Architecture
```
src/
├── components/       # React components (Header, StoryCard, Auth)
├── services/         # API & storage logic
│   ├── hnApi.ts           # HN API integration
│   ├── storage.ts         # localStorage wrapper
│   └── recommendations.ts # Recommendation engine
├── utils/           # CSV export & helpers
└── types.ts         # TypeScript definitions
```

### Recommendation Engine
- **Algorithm**: TF-IDF-inspired content-based filtering
- **Storage**: Profile stored in localStorage
- **Privacy**: No data leaves your browser
- **Performance**: O(n) complexity per story scoring

---

## 🌐 Deployment

### Netlify (Recommended)
```bash
# One-click deploy
npm run build
# Drag `dist` folder to https://app.netlify.com/drop

# Or connect GitHub repo for auto-deploy
```

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions.

### Other Platforms
Works on any static hosting:
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

---

## 🔮 Roadmap

### Current Version (v1.0)
- ✅ Local storage persistence
- ✅ Content-based recommendations
- ✅ CSV export
- ✅ Dark mode
- ✅ Mobile-responsive

### Planned Features (v2.0)
- 🔐 **User Authentication** - Sign in with email/OAuth
- ☁️ **Cloud Sync** - Access starred stories across devices
- 🤝 **Collaborative Filtering** - "Users like you also liked..."
- 🧪 **Advanced ML** - LightFM/Surprise integration for better recommendations
- 📈 **Analytics Dashboard** - Visualize your reading habits
- 🏷️ **Tags & Categories** - Organize starred stories
- 🔔 **Notifications** - Daily digest of recommended stories

> **Note**: Future versions will offer **optional** cloud features while maintaining the local-only mode for privacy-conscious users.

---

## 🤝 Contributing

Contributions are welcome! This is an **open-source project** under the MIT License.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/yourusername/hnfeed.git
cd hnfeed
npm install
npm run dev
```

### Ideas for Contributions
- 🎨 UI/UX improvements
- 🧠 Better recommendation algorithms
- 🌍 Internationalization (i18n)
- ♿ Accessibility enhancements
- 📱 PWA support (offline mode)
- 🧪 Unit tests
- 📚 Documentation improvements

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

- [Hacker News API](https://github.com/HackerNews/API) - For the free, public API
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [Vite](https://vitejs.dev) - For the blazing-fast build tool
- The HN community - For great content to recommend!

---

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/hnfeed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hnfeed/discussions)
- **Author**: [@yourusername](https://github.com/yourusername)

---

## 🌟 Star History

If you find this project useful, consider giving it a ⭐ on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/hnfeed&type=Date)](https://star-history.com/#yourusername/hnfeed&Date)

---

**Built with ❤️ for the Hacker News community**
