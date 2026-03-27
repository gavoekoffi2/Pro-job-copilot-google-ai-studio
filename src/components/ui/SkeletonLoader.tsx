import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  lines?: number;
  width?: string;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-full', 'w-3/4', 'w-5/6'];
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-4', widths[i % widths.length])} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function AILoadingSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <div className="ai-thinking w-full mb-6" />
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 border-t-transparent animate-spin" />
        </div>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <SkeletonText lines={5} />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
