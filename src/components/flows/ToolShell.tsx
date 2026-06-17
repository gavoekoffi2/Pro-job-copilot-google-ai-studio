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
      <div className="mb-8 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 text-white shadow-lg shadow-brand-500/20">
          {icon}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-ink-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
