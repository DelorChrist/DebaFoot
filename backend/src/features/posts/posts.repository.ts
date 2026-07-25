import { prisma } from '../../shared/prisma';

const postSelect = {
  id: true,
  content: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      profile: {
        select: { displayName: true, avatarUrl: true },
      },
    },
  },
  _count: { select: { likes: true, comments: true } },
};

export class PostsRepository {
  async findMany(cursor?: string, limit = 10, userId?: string) {
    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: {
        ...postSelect,
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor, hasMore };
  }

  async findByUserId(authorId: string, cursor?: string, limit = 10) {
    const posts = await prisma.post.findMany({
      where: { authorId },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: postSelect,
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor, hasMore };
  }

  async findById(id: string, userId?: string) {
    return prisma.post.findUnique({
      where: { id },
      select: {
        ...postSelect,
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });
  }

  async create(data: { content: string; imageUrl?: string; authorId: string }) {
    return prisma.post.create({
      data,
      select: postSelect,
    });
  }

  async update(id: string, data: { content?: string; imageUrl?: string }) {
    return prisma.post.update({
      where: { id },
      data,
      select: postSelect,
    });
  }

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  }

  async findOwner(id: string): Promise<{ authorId: string } | null> {
    return prisma.post.findUnique({ where: { id }, select: { authorId: true } });
  }

  async addLike(postId: string, userId: string) {
    return prisma.like.create({ data: { postId, userId } });
  }

  async removeLike(postId: string, userId: string) {
    return prisma.like.deleteMany({ where: { postId, userId } });
  }

  async isLiked(postId: string, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    return !!like;
  }

  async createReport(postId: string, reporterId: string, reason: string) {
    return prisma.report.create({ data: { postId, reporterId, reason } });
  }

  async search(query: string, cursor?: string, limit = 10) {
    const posts = await prisma.post.findMany({
      where: { content: { contains: query, mode: 'insensitive' } },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: postSelect,
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor, hasMore };
  }
}
