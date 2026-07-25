import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { ImageUpload } from '../molecules/ImageUpload';
import { Avatar } from '../atoms/Avatar';
import { useAuthStore } from '../../stores/authStore';
import { Post } from '../../types/post.types';

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, content: string, image: File | null) => Promise<void>;
  isLoading?: boolean;
}

export function EditPostModal({ post, isOpen, onClose, onSubmit, isLoading }: EditPostModalProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (post && isOpen) {
      setContent(post.content);
      setImage(null);
    }
  }, [post, isOpen]);

  const handleSubmit = async () => {
    if (!post || (!content.trim() && !image && !post.imageUrl)) return;
    await onSubmit(post.id, content, image);
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-surface border border-border w-full max-w-lg rounded-xl shadow-2xl p-0 overflow-hidden z-50 animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Dialog.Title className="text-lg font-semibold">Modifier le post</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-surface-2 rounded-full transition-colors text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4">
            <div className="flex gap-3 mb-4">
              <Avatar
                src={user?.profile?.avatarUrl}
                fallback={user?.profile?.displayName || user?.username}
              />
              <textarea
                placeholder="Quel est votre avis sur le match ?"
                className="w-full bg-transparent resize-none outline-none text-text-primary text-lg min-h-[100px] placeholder:text-text-muted"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
              />
            </div>

            <ImageUpload 
              onImageSelected={setImage} 
              defaultPreview={post.imageUrl}
              className="mb-4"
            />

            <div className="flex items-center justify-between pt-3 border-t border-border-light">
              <span className="text-sm text-text-muted">
                {content.length}/500
              </span>
              <Button 
                onClick={handleSubmit} 
                disabled={(!content.trim() && !image && !post.imageUrl) || isLoading}
                isLoading={isLoading}
              >
                Mettre à jour
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
