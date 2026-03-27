import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  variant?: 'hero' | 'primary' | 'accent';
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

export function GradientText({
  children,
  variant = 'hero',
  className,
  as: Tag = 'span',
}: GradientTextProps) {
  const variants = {
    hero:    'gradient-text',
    primary: 'gradient-text-primary',
    accent:  'gradient-text-accent',
  };

  return (
    <Tag className={clsx(variants[variant], className)}>
      {children}
    </Tag>
  );
}
