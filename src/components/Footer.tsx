import { Heart } from 'lucide-react';
import { AppView } from '../types';
import { useT } from '../i18n/LanguageContext';
import { Logo } from './ui/Logo';

export function Footer({ setView }: { setView: (v: AppView) => void }) {
  const t = useT();
  const go = (v: AppView) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print relative overflow-hidden bg-ink-950 text-ink-300">
      <div className="aurora-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm text-ink-400">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.product}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button className="hover:text-brand-300" onClick={() => go(AppView.BUILDER)}>
                  {t.nav.builder}
                </button>
              </li>
              <li>
                <button className="hover:text-brand-300" onClick={() => go(AppView.ANALYZE)}>
                  {t.nav.analyze}
                </button>
              </li>
              <li>
                <button className="hover:text-brand-300" onClick={() => go(AppView.TRANSLATE)}>
                  {t.nav.translate}
                </button>
              </li>
              <li>
                <button className="hover:text-brand-300" onClick={() => go(AppView.TAILOR)}>
                  {t.nav.tailor}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.company}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><span className="cursor-default hover:text-brand-300">À propos</span></li>
              <li><span className="cursor-default hover:text-brand-300">Contact</span></li>
              <li><span className="cursor-default hover:text-brand-300">Blog</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Pro Job Copilot. {t.footer.rights}</p>
          <p className="inline-flex items-center gap-1.5">
            {t.footer.madeWith} <Heart className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
