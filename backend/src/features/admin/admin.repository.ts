import { prisma } from '../../shared/prisma';

export class AdminRepository {
  async getStats() {
    const [totalUsers, totalPosts, totalComments, pendingReports] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ]);
    return { totalUsers, totalPosts, totalComments, pendingReports };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isVerified: true,
          createdAt: true,
          profile: { select: { displayName: true, avatarUrl: true } },
          _count: { select: { posts: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, pages: Math.ceil(total / limit) };
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async getReports(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTIONED' } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reason: true,
          status: true,
          createdAt: true,
          post: { select: { id: true, content: true, imageUrl: true } },
          reporter: {
            select: { id: true, username: true, profile: { select: { displayName: true } } },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, pages: Math.ceil(total / limit) };
  }

  async updateReportStatus(id: string, status: string) {
    return prisma.report.update({
      where: { id },
      data: { status: status as 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTIONED' },
    });
  }
}
