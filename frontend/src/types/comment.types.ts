export interface Comment {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
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
    replies: number;
  };
}
