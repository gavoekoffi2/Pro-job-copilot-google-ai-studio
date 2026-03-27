'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[0.625rem] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'btn-primary text-white shadow-glow hover:shadow-glow-lg',
    secondary:
      'bg-white/8 border border-white/10 text-white hover:bg-white/12 hover:border-white/20',
    ghost:
      'text-white/70 hover:text-white hover:bg-white/8',
    danger:
      'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50',
    outline:
      'border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/60',
  };

  const sizes = {
    sm:  'px-3 py-1.5 text-sm',
    md:  'px-5 py-2.5 text-sm',
    lg:  'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.98, y: 0 }}
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
}
