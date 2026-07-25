import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Le contenu est requis')
      .max(500, 'Le post ne peut pas dépasser 500 caractères'),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Le contenu est requis')
      .max(500, 'Le post ne peut pas dépasser 500 caractères'),
  }),
  params: z.object({ id: z.string() }),
});

export const paginationSchema = z.object({
  query: z.object({
    cursor: z.string().optional(),
    limit: z.string().default('10').transform(Number),
  }),
});

export const reportPostSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Raison trop courte').max(200, 'Raison trop longue'),
  }),
  params: z.object({ id: z.string() }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type UpdatePostInput = z.infer<typeof updatePostSchema>['body'];
