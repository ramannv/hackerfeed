import { HNStory } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const hnApi = {
  async getTopStoryIds(limit: number = 50): Promise<number[]> {
    const response = await fetch(`${BASE_URL}/topstories.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch top stories');
    }
    const ids: number[] = await response.json();
    return ids.slice(0, limit);
  },

  async getStory(id: number): Promise<HNStory | null> {
    const response = await fetch(`${BASE_URL}/item/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch story ${id}`);
    }
    const story: HNStory = await response.json();
    return story;
  },

  async getTopStories(limit: number = 50): Promise<HNStory[]> {
    const ids = await this.getTopStoryIds(limit);
    const storyPromises = ids.map(id => this.getStory(id));
    const stories = await Promise.all(storyPromises);
    return stories.filter((story): story is HNStory => story !== null && story.type === 'story');
  },
};
