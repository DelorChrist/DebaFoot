import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).max(50).optional(),
    bio: z.string().max(300).optional(),
    location: z.string().max(100).optional(),
    website: z.string().url('URL invalide').optional().or(z.literal('')),
  }),
});

export const searchUsersSchema = z.object({
  query: z.object({
    q: z.string().min(1),
  }),
});
