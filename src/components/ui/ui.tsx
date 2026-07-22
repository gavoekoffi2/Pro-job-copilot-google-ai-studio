import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'gold' | 'dark' | 'outline' | 'ghost' | 'white';
type Size = 'sm' | 'md' | 'lg';

// Éditorial : surfaces pleines et franches, pas de dégradés ni de lueurs colorées.
// La hiérarchie se lit à la couleur et au poids, pas à l'ombre.
const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white bg-brand-600 hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600/30',
  gold: 'text-ink-950 bg-gold-400 hover:bg-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30',
  dark: 'text-white bg-ink-900 hover:bg-ink-800 focus-visible:ring-2 focus-visible:ring-ink-900/25',
  outline:
    'border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-2 focus-visible:ring-ink-300/40',
  ghost: 'text-ink-700 hover:bg-ink-100 focus-visible:ring-2 focus-visible:ring-ink-300/40',
  white: 'bg-white text-ink-900 ring-1 ring-black/5 hover:bg-ink-50 focus-visible:ring-2 focus-visible:ring-ink-300/50',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-lg gap-2',
  lg: 'h-13 px-7 text-base rounded-lg gap-2.5 py-3.5',
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
        'inline-flex items-center justify-center font-semibold outline-none transition-[background-color,border-color,color,transform] duration-150 focus-visible:ring-offset-1 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
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
            'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]',
            light ? 'text-brand-300' : 'text-brand-700',
          )}
        >
          <span className={cn('h-px w-6', light ? 'bg-brand-300/60' : 'bg-brand-600/50')} />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-3 font-display text-[1.75rem] font-bold tracking-[-0.02em] text-balance sm:text-[2.25rem]',
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
