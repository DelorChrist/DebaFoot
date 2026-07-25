import { useId } from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const maskId = useId();
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center gap-2.5 shrink-0', className)}>
      <svg 
        viewBox="0 0 100 100" 
        className={cn("text-primary", iconSizes[size])}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            <polygon points="50,16 63.3,25.7 58.2,41.3 41.8,41.3 36.7,25.7" fill="black" />
            <polygon points="50,16 63.3,25.7 58.2,41.3 41.8,41.3 36.7,25.7" fill="black" transform="rotate(120 50 50)" />
            <polygon points="50,16 63.3,25.7 58.2,41.3 41.8,41.3 36.7,25.7" fill="black" transform="rotate(240 50 50)" />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="50" fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
      <span className={cn("font-black tracking-tight", sizeClasses[size])}>
        <span className="text-text-primary">Deba</span>
        <span className="text-primary">Foot</span>
      </span>
    </div>
  );
}
