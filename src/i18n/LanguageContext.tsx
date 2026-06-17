import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '../types';
import { dictionaries, fr } from './translations';

type Dictionary = typeof fr;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  /** Dictionnaire de la langue active (français par défaut). */
  t: Dictionary;
}

const STORAGE_KEY = 'pjc.locale';

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(): Locale {
  // Le français est la langue par défaut de toute la plateforme.
  if (typeof window === 'undefined') return 'fr';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'en' ? 'en' : 'fr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(
    () => setLocaleState((p) => (p === 'fr' ? 'en' : 'fr')),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: dictionaries[locale],
    }),
    [locale, setLocale, toggleLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage doit être utilisé dans un <LanguageProvider>.');
  }
  return ctx;
}

/** Raccourci pratique : renvoie le dictionnaire de la langue active. */
export function useT(): Dictionary {
  return useLanguage().t;
}
