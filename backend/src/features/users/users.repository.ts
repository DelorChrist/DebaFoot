import { prisma } from '../../shared/prisma';

const userPublicSelect = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
  profile: {
    select: {
      displayName: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      location: true,
      website: true,
    },
  },
  _count: { select: { posts: true } },
};

export class UsersRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userPublicSelect });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username }, select: userPublicSelect });
  }

  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      coverUrl?: string;
      location?: string;
      website?: string;
    }
  ) {
    return prisma.profile.update({
      where: { userId },
      data,
      select: {
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        location: true,
        website: true,
      },
    });
  }

  async searchUsers(query: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 10,
      select: {
        id: true,
        username: true,
        profile: { select: { displayName: true, avatarUrl: true } },
      },
    });
  }
}
