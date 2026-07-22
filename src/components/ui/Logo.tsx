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
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ring-1 ring-black/5 transition-transform duration-200 group-hover:-translate-y-0.5">
        <img src="/logo-mark.svg" alt="" className="h-11 w-11 rounded-[14px]" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-xl font-bold tracking-[-0.045em]',
            light ? 'text-white' : 'text-ink-950',
          )}
        >
          JobTask{' '}
          <span className={light ? 'text-brand-300' : 'text-brand-600'}>AI</span>
        </span>
        <span
          className={cn(
            'mt-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em]',
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
