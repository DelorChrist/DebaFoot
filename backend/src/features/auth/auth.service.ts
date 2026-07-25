import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from './auth.repository';
import { AppError } from '../../shared/AppError';
import { env } from '../../config/env';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../shared/email.service';
import { RegisterInput, LoginInput } from './auth.schema';

const authRepository = new AuthRepository();

const SALT_ROUNDS = 12;

const generateAccessToken = (payload: {
  id: string;
  email: string;
  username: string;
  role: string;
}): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

const generateRefreshToken = (payload: { id: string }): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export class AuthService {
  async register(data: RegisterInput) {
    const existingEmail = await authRepository.findUserByEmail(data.email);
    if (existingEmail) throw AppError.conflict('Cet email est déjà utilisé');

    const existingUsername = await authRepository.findUserByUsername(data.username);
    if (existingUsername) throw AppError.conflict('Ce pseudo est déjà utilisé');

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const verificationToken = uuidv4();

    const user = await authRepository.createUser({
      ...data,
      hashedPassword,
      verificationToken,
    });

    await sendVerificationEmail(user.email, verificationToken);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.profile,
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) throw AppError.unauthorized('Email ou mot de passe incorrect');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw AppError.unauthorized('Email ou mot de passe incorrect');

    // Désactivé temporairement à votre demande
    // if (!user.isVerified) {
    //   throw AppError.forbidden('Veuillez vérifier votre email avant de vous connecter');
    // }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createSession(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, username: user.username, role: user.role, profile: user.profile },
    };
  }

  async logout(refreshToken: string) {
    await authRepository.deleteSession(refreshToken);
  }

  async refreshTokens(refreshToken: string) {
    let decoded: { id: string };
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    } catch {
      throw AppError.unauthorized('Refresh token invalide ou expiré');
    }

    const session = await authRepository.findSession(refreshToken);
    if (!session) throw AppError.unauthorized('Session invalide');

    const { user } = session;
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await authRepository.deleteSession(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createSession(user.id, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyEmail(token: string) {
    const user = await authRepository.findUserByVerificationToken(token);
    if (!user) throw AppError.badRequest('Token de vérification invalide');
    if (user.isVerified) throw AppError.badRequest('Email déjà vérifié');

    await authRepository.verifyUser(user.id);
    return { message: 'Email vérifié avec succès' };
  }

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);
    // Ne pas révéler si l'email existe ou non
    if (!user) return;

    const resetToken = uuidv4();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await authRepository.setResetToken(user.id, resetToken, expiry);
    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await authRepository.findUserByResetToken(token);
    if (!user) throw AppError.badRequest('Token de réinitialisation invalide ou expiré');

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await authRepository.updatePassword(user.id, hashedPassword);
    await authRepository.deleteUserSessions(user.id);
  }
}
