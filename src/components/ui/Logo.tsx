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
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[14px] shadow-lg shadow-brand-500/20 ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
        <img src="/logo-mark.svg" alt="" className="h-11 w-11 rounded-[14px]" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-xl font-extrabold tracking-[-0.045em]',
            light ? 'text-white' : 'text-ink-950',
          )}
        >
          JobTask{' '}
          <span className={light ? 'text-brand-300' : 'bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent'}>
            AI
          </span>
        </span>
        <span
          className={cn(
            'mt-1 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.2em]',
            light ? 'text-white/65' : 'text-ink-500',
          )}
        >
          <span className="h-[2px] w-4 rounded-full bg-brand-500" />
          CV • Carrière • IA
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
