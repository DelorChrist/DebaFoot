import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/atoms/Button';
import { Input } from '../../../components/atoms/Input';
import { Profile } from '../../../types/auth.types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | undefined;
  username: string;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

export function EditProfileModal({ isOpen, onClose, profile, username, onSubmit, isLoading }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile?.displayName || '');
      setBio(profile?.bio || '');
      setLocation(profile?.location || '');
      setWebsite(profile?.website || '');
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      displayName,
      bio,
      location,
      website
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl p-0 overflow-hidden z-50 animate-scale-in max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <Dialog.Title className="text-lg font-semibold">Éditer le profil</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-surface-2 rounded-full transition-colors text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Nom d'affichage</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={username}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:border-primary outline-none transition-colors min-h-[100px] resize-y"
                placeholder="Parlez-nous de vous..."
                maxLength={160}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Localisation</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Paris, France"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Site web</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://votre-site.com"
              />
            </div>
            
            <div className="pt-4 border-t border-border mt-6">
              <Button type="submit" fullWidth isLoading={isLoading}>
                Enregistrer
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
