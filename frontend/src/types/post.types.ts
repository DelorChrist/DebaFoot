import { User } from './auth.types';

export interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profile?: {
      displayName?: string | null;
      avatarUrl?: string | null;
    };
  };
  _count: {
    likes: number;
    comments: number;
  };
  likes?: { id: string }[];
}

export interface PostResponse {
  items: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}
