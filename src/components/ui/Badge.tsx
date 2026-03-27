import { clsx } from 'clsx';
import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-white/8 text-white/70 border border-white/10',
  primary:  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  accent:   'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  success:  'bg-green-500/20 text-green-300 border border-green-500/30',
  warning:  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  danger:   'bg-red-500/20 text-red-300 border border-red-500/30',
  info:     'bg-blue-500/20 text-blue-300 border border-blue-500/30',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-white/40',
  primary: 'bg-purple-400',
  accent:  'bg-cyan-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
};

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
