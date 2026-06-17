import { cn } from '../../lib/utils';

export function Logo({
  className,
  light = false,
  onClick,
}: {
  className?: string;
  light?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="Pro Job Copilot"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 shadow-md shadow-brand-500/30 transition-transform group-hover:scale-105">
        <span className="font-display text-lg font-extrabold text-white">P</span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-gold-400" />
      </span>
      <span
        className={cn(
          'font-display text-lg font-extrabold tracking-tight',
          light ? 'text-white' : 'text-ink-950',
        )}
      >
        Pro Job<span className="text-brand-600"> Copilot</span>
      </span>
    </button>
  );
}
