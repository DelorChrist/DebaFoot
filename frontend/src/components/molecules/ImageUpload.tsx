import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  defaultPreview?: string | null;
  className?: string;
  circle?: boolean;
}

export function ImageUpload({ onImageSelected, defaultPreview, className, circle = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />
      
      {preview ? (
        <div className={cn(
          "relative group overflow-hidden border border-border",
          circle ? "rounded-full w-32 h-32" : "rounded-lg w-full max-h-[300px]"
        )}>
          <img 
            src={preview} 
            alt="Preview" 
            className={cn("object-cover", circle ? "w-full h-full" : "w-full max-h-[300px]")} 
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="danger" size="icon" onClick={handleRemove} className="rounded-full">
              <X size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={triggerUpload}
          className={cn(
            "flex flex-col items-center justify-center bg-surface-2 border-2 border-dashed border-border-light hover:border-primary cursor-pointer transition-colors",
            circle ? "rounded-full w-32 h-32" : "rounded-lg p-8 w-full h-full min-h-[150px]"
          )}
        >
          {circle ? (
            <Upload className="text-text-muted mb-2" size={24} />
          ) : (
            <>
              <ImageIcon className="text-text-muted mb-2" size={32} />
              <span className="text-sm font-medium text-text-primary">Ajouter une image</span>
              <span className="text-xs text-text-muted mt-1">JPEG, PNG, WebP (max 5MB)</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
