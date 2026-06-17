import { useLanguage } from '../../i18n/LanguageContext';
import { cn } from '../../lib/utils';

/** Bascule Français / Anglais (français par défaut). */
export function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLanguage();
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full p-0.5 text-xs font-bold',
        dark ? 'bg-white/10' : 'bg-ink-100',
      )}
      role="group"
      aria-label="Langue / Language"
    >
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            locale === l
              ? 'bg-white text-ink-900 shadow-sm'
              : dark
                ? 'text-white/70 hover:text-white'
                : 'text-ink-500 hover:text-ink-800',
          )}
          aria-pressed={locale === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
