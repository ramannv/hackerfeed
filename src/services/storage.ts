import { StarredStory, HNStory } from '../types';

const STARRED_STORIES_KEY = 'hn_starred_stories';

export const storageService = {
  getStarredStories(): StarredStory[] {
    const stored = localStorage.getItem(STARRED_STORIES_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  getStarredStoryIds(): Set<number> {
    const stories = this.getStarredStories();
    return new Set(stories.map(s => s.id));
  },

  isStarred(storyId: number): boolean {
    return this.getStarredStoryIds().has(storyId);
  },

  starStory(story: HNStory): void {
    const starred = this.getStarredStories();

    // Don't add if already starred
    if (starred.some(s => s.id === story.id)) return;

    const domain = story.url ? this.extractDomain(story.url) : undefined;

    const starredStory: StarredStory = {
      id: story.id,
      title: story.title,
      url: story.url,
      by: story.by,
      domain,
      starredAt: Date.now(),
    };

    starred.push(starredStory);
    localStorage.setItem(STARRED_STORIES_KEY, JSON.stringify(starred));
  },

  unstarStory(storyId: number): void {
    const starred = this.getStarredStories();
    const filtered = starred.filter(s => s.id !== storyId);
    localStorage.setItem(STARRED_STORIES_KEY, JSON.stringify(filtered));
  },

  toggleStar(story: HNStory): boolean {
    if (this.isStarred(story.id)) {
      this.unstarStory(story.id);
      return false;
    } else {
      this.starStory(story);
      return true;
    }
  },

  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  },
};
