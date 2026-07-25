import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, getInitials } from '../../lib/utils';

const avatarVariants = cva(
  'avatar inline-flex items-center justify-center font-medium bg-surface-3 text-text-secondary overflow-hidden',
  {
    variants: {
      size: {
        sm: 'avatar-sm text-xs',
        md: 'avatar-md text-sm',
        lg: 'avatar-lg text-base',
        xl: 'avatar-xl text-lg',
        '2xl': 'avatar-2xl text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div
        className={cn(avatarVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{fallback ? getInitials(fallback) : '??'}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
