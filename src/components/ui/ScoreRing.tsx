'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { clsx } from 'clsx';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  showPercent?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#22c55e', text: 'text-green-400' };
  if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-400' };
  if (score >= 40) return { stroke: '#f97316', text: 'text-orange-400' };
  return { stroke: '#ef4444', text: 'text-red-400' };
}

const colorMap = {
  primary: { stroke: '#8b5cf6', text: 'text-purple-400' },
  accent:  { stroke: '#06b6d4', text: 'text-cyan-400' },
  success: { stroke: '#22c55e', text: 'text-green-400' },
  warning: { stroke: '#f59e0b', text: 'text-amber-400' },
  danger:  { stroke: '#ef4444', text: 'text-red-400' },
};

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  className,
  showPercent = true,
  color,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));

  const motionScore = useMotionValue(0);
  const displayScore = useTransform(motionScore, (v) => Math.round(v));
  const strokeDashoffset = useTransform(
    motionScore,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    const controls = animate(motionScore, clampedScore, {
      duration: 1.5,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [clampedScore, motionScore]);

  const colors = color ? colorMap[color] : getScoreColor(clampedScore);

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Score: ${score}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={`drop-shadow(0 0 6px ${colors.stroke}80)`}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={clsx('font-bold leading-none', colors.text, size >= 120 ? 'text-3xl' : 'text-xl')}>
          <motion.span>{displayScore}</motion.span>
          {showPercent && <span className="text-lg">/100</span>}
        </div>
        {label && (
          <div className="text-xs text-white/50 mt-1 text-center px-2 leading-tight">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
