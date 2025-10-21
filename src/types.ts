export interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
  descendants?: number;
  kids?: number[];
  type: string;
}

export interface StoryWithRecommendation extends HNStory {
  recommendationScore?: number;
  isRecommended?: boolean;
}

export interface StarredStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  domain?: string;
  starredAt: number;
}
