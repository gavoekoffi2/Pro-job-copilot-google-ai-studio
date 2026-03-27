'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  index: number;
  badge?: string;
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  color,
  bgColor,
  index,
  badge,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <Link href={href} className="block h-full group">
        <div className="glass rounded-2xl p-6 h-full cursor-pointer relative overflow-hidden"
          style={{ transition: 'border-color 0.3s, box-shadow 0.3s' }}
        >
          {/* Hover glow */}
          <div
            className={clsx(
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            )}
            style={{
              background: `radial-gradient(ellipse at 20% 20%, ${bgColor}22 0%, transparent 60%)`,
            }}
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 right-4">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {badge}
              </span>
            </div>
          )}

          {/* Icon */}
          <div
            className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110'
            )}
            style={{ background: `${bgColor}26` }}
          >
            <Icon className={clsx('w-6 h-6', color)} />
          </div>

          {/* Content */}
          <h3 className="font-bold text-white text-lg mb-2 relative z-10 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed relative z-10 group-hover:text-white/70 transition-colors">
            {description}
          </p>

          {/* Arrow */}
          <div className="mt-4 flex items-center gap-1 text-sm font-medium relative z-10">
            <span className={clsx('transition-colors duration-200', color)}>Try now</span>
            <ArrowRight
              className={clsx(
                'w-4 h-4 transition-all duration-300 group-hover:translate-x-1',
                color
              )}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
