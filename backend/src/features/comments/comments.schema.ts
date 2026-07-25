import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Commentaire vide').max(300, 'Commentaire trop long'),
    parentId: z.string().optional(),
  }),
  params: z.object({ postId: z.string() }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Commentaire vide').max(300, 'Commentaire trop long'),
  }),
  params: z.object({ id: z.string() }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>['body'];
