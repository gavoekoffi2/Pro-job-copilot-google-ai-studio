'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  delay?: number;
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
  gradient = false,
  onClick,
  padding = 'md',
  animate = true,
  delay = 0,
}: CardProps) {
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  const content = (
    <div
      className={clsx(
        'glass rounded-xl',
        paddings[padding],
        glow && 'glow-primary',
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={clsx(
        'glass rounded-xl',
        paddings[padding],
        glow && 'glow-primary',
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={{ transition: 'box-shadow 0.2s ease' }}
    >
      {children}
    </motion.div>
  );
}
