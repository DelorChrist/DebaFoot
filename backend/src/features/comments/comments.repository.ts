import { prisma } from '../../shared/prisma';

const commentSelect = {
  id: true,
  content: true,
  postId: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  },
  _count: { select: { replies: true } },
};

export class CommentsRepository {
  async findByPostId(postId: string) {
    return prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      select: commentSelect,
    });
  }

  async findReplies(parentId: string) {
    return prisma.comment.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
      select: commentSelect,
    });
  }

  async findById(id: string) {
    return prisma.comment.findUnique({ where: { id }, select: commentSelect });
  }

  async findOwner(id: string): Promise<{ authorId: string; postId: string } | null> {
    return prisma.comment.findUnique({
      where: { id },
      select: { authorId: true, postId: true },
    });
  }

  async create(data: { content: string; postId: string; authorId: string; parentId?: string }) {
    return prisma.comment.create({ data, select: commentSelect });
  }

  async update(id: string, content: string) {
    return prisma.comment.update({ where: { id }, data: { content }, select: commentSelect });
  }

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  }
}
