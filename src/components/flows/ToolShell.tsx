import type { ReactNode } from 'react';

/** En-tête + conteneur communs aux outils (Analyser, Traduire, Adapter). */
export function ToolShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-ink-100 pb-6">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink-200 bg-white text-brand-700">
            {icon}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink-950 sm:text-[1.9rem]">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
