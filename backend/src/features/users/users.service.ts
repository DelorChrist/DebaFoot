import { UsersRepository } from './users.repository';
import { AppError } from '../../shared/AppError';
import { uploadToCloudinary } from '../../middlewares/upload.middleware';

const usersRepository = new UsersRepository();

export class UsersService {
  async getMe(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw AppError.notFound('Utilisateur introuvable');
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await usersRepository.findByUsername(username);
    if (!user) throw AppError.notFound('Utilisateur introuvable');
    return user;
  }

  async updateProfile(
    userId: string,
    data: { displayName?: string; bio?: string; location?: string; website?: string }
  ) {
    return usersRepository.updateProfile(userId, data);
  }

  async updateAvatar(userId: string, buffer: Buffer) {
    const result = await uploadToCloudinary(buffer, 'avatars', {
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });
    await usersRepository.updateProfile(userId, { avatarUrl: result.url });
    return { avatarUrl: result.url };
  }

  async updateCover(userId: string, buffer: Buffer) {
    const result = await uploadToCloudinary(buffer, 'covers', {
      transformation: [{ width: 1200, height: 400, crop: 'fill' }],
    });
    await usersRepository.updateProfile(userId, { coverUrl: result.url });
    return { coverUrl: result.url };
  }

  async searchUsers(query: string) {
    return usersRepository.searchUsers(query);
  }
}
