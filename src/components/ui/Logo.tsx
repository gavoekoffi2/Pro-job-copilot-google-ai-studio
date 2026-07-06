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
  const content = (
    <>
      <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-ink-950 shadow-lg shadow-brand-500/25 ring-1 ring-white/15 transition-transform group-hover:scale-105">
        <img src="/logo-mark.svg" alt="" className="h-11 w-11 rounded-2xl" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gold-400 shadow-sm shadow-gold-400/60 ring-2 ring-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-xl font-extrabold tracking-tight',
            light ? 'text-white' : 'text-ink-950',
          )}
        >
          JobTask<span className="text-gold-500"> AI</span>
        </span>
        <span
          className={cn(
            'mt-1 text-[9px] font-bold uppercase tracking-[0.22em]',
            light ? 'text-white/65' : 'text-ink-500',
          )}
        >
          CV intelligent
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn('group inline-flex items-center gap-3 text-left', className)}
        aria-label="JobTask AI — accueil"
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn('group inline-flex items-center gap-3 text-left', className)} aria-label="JobTask AI">
      {content}
    </div>
  );
}
