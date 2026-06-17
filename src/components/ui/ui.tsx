import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'gold' | 'dark' | 'outline' | 'ghost' | 'white';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white shadow-lg shadow-brand-500/25 bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-600',
  gold: 'text-ink-950 shadow-lg shadow-gold-500/25 bg-gradient-to-br from-gold-300 to-gold-500 hover:from-gold-200 hover:to-gold-400',
  dark: 'text-white bg-ink-900 hover:bg-ink-800 shadow-lg shadow-ink-900/20',
  outline:
    'border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  white: 'bg-white text-ink-900 shadow-lg shadow-black/10 hover:bg-ink-50',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-xl gap-2',
  lg: 'h-13 px-7 text-base rounded-xl gap-2.5 py-3.5',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin', className)} />;
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** En-tête de section centré (eyebrow + titre + sous-titre). */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <span
          className={cn(
            'text-sm font-bold uppercase tracking-[0.18em]',
            light ? 'text-brand-300' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl',
          light ? 'text-white' : 'text-ink-950',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg', light ? 'text-ink-300' : 'text-ink-500')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
