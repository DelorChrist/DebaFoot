import { prisma } from '../../shared/prisma';
import { RegisterInput } from './auth.schema';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async findUserByVerificationToken(token: string) {
    return prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  async findUserByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
  }

  async createUser(data: RegisterInput & { hashedPassword: string; verificationToken: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.hashedPassword,
        verificationToken: data.verificationToken,
        profile: {
          create: {
            displayName: data.displayName ?? data.username,
          },
        },
      },
      include: { profile: true },
    });
  }

  async verifyUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isVerified: true, verificationToken: null },
    });
  }

  async setResetToken(id: string, token: string, expiry: Date) {
    return prisma.user.update({
      where: { id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
  }

  async createSession(userId: string, refreshToken: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, refreshToken, expiresAt },
    });
  }

  async findSession(refreshToken: string) {
    return prisma.session.findUnique({
      where: { refreshToken },
      include: { user: { include: { profile: true } } },
    });
  }

  async deleteSession(refreshToken: string) {
    return prisma.session.deleteMany({ where: { refreshToken } });
  }

  async deleteUserSessions(userId: string) {
    return prisma.session.deleteMany({ where: { userId } });
  }
}
