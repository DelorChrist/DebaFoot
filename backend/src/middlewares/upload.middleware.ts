import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { AppError } from '../shared/AppError';
import { Request } from 'express';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Format de fichier non supporté. Utilisez JPEG, PNG, WebP ou GIF.', 400));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  options: Record<string, unknown> = {}
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `debafoot/${folder}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          ...options,
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError('Erreur lors du téléchargement de l\'image', 500));
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        }
      )
      .end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
