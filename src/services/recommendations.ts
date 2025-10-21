import { HNStory, StarredStory, StoryWithRecommendation } from '../types';
import { storageService } from './storage';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
  'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'your', 'my', 'we', 'you', 'i', 'it',
  'this', 'that', 'these', 'those', 'how', 'why', 'what', 'when', 'where',
]);

export const recommendationEngine = {
  extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOPWORDS.has(word));
  },

  buildKeywordProfile(starredStories: StarredStory[]): Map<string, number> {
    const keywordFreq = new Map<string, number>();

    starredStories.forEach(story => {
      const keywords = this.extractKeywords(story.title);
      keywords.forEach(keyword => {
        keywordFreq.set(keyword, (keywordFreq.get(keyword) || 0) + 1);
      });
    });

    return keywordFreq;
  },

  buildAuthorProfile(starredStories: StarredStory[]): Map<string, number> {
    const authorFreq = new Map<string, number>();

    starredStories.forEach(story => {
      authorFreq.set(story.by, (authorFreq.get(story.by) || 0) + 1);
    });

    return authorFreq;
  },

  buildDomainProfile(starredStories: StarredStory[]): Map<string, number> {
    const domainFreq = new Map<string, number>();

    starredStories.forEach(story => {
      if (story.domain) {
        domainFreq.set(story.domain, (domainFreq.get(story.domain) || 0) + 1);
      }
    });

    return domainFreq;
  },

  calculateRecommendationScore(
    story: HNStory,
    keywordProfile: Map<string, number>,
    authorProfile: Map<string, number>,
    domainProfile: Map<string, number>,
  ): number {
    let score = 0;

    // Keyword matching (weighted by frequency)
    const keywords = this.extractKeywords(story.title);
    keywords.forEach(keyword => {
      const freq = keywordProfile.get(keyword) || 0;
      score += freq * 2; // Weight keyword matches heavily
    });

    // Author matching
    const authorFreq = authorProfile.get(story.by) || 0;
    score += authorFreq * 5; // Bonus for known authors

    // Domain matching
    if (story.url) {
      const domain = storageService.extractDomain(story.url);
      const domainFreq = domainProfile.get(domain) || 0;
      score += domainFreq * 3; // Bonus for known domains
    }

    return score;
  },

  scoreStories(stories: HNStory[]): StoryWithRecommendation[] {
    const starredStories = storageService.getStarredStories();
    const starredIds = storageService.getStarredStoryIds();

    // Need at least 3 starred stories to make recommendations
    if (starredStories.length < 3) {
      return stories.map(story => ({ ...story, recommendationScore: 0, isRecommended: false }));
    }

    const keywordProfile = this.buildKeywordProfile(starredStories);
    const authorProfile = this.buildAuthorProfile(starredStories);
    const domainProfile = this.buildDomainProfile(starredStories);

    // Score all stories including starred ones
    const scoredStories = stories.map(story => {
      const recommendationScore = this.calculateRecommendationScore(
        story,
        keywordProfile,
        authorProfile,
        domainProfile,
      );
      return {
        ...story,
        recommendationScore,
        isRecommended: false,
      };
    });

    // Only consider unstarred stories for threshold calculation
    const unstarredScored = scoredStories.filter(s => !starredIds.has(s.id));
    const sorted = [...unstarredScored].sort((a, b) =>
      (b.recommendationScore || 0) - (a.recommendationScore || 0)
    );

    // Mark top 30% of unstarred as recommended
    const recommendedCount = Math.ceil(sorted.length * 0.3);
    const threshold = sorted[recommendedCount - 1]?.recommendationScore || 0;

    return scoredStories.map(story => ({
      ...story,
      isRecommended: !starredIds.has(story.id) && (story.recommendationScore || 0) > 0 && (story.recommendationScore || 0) >= threshold,
    }));
  },
};
