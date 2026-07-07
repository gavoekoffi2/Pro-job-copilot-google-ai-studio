import { useEffect, useState } from 'react';
import { FileText, Languages, Menu, RefreshCw, ScanSearch, Target, UserRound, X } from 'lucide-react';
import { AppView } from '../types';
import { useT } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';
import { Logo } from './ui/Logo';
import { Button } from './ui/ui';
import { LanguageToggle } from './ui/LanguageToggle';

interface NavbarProps {
  view: AppView;
  setView: (v: AppView) => void;
}

export function Navbar({ view, setView }: NavbarProps) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items: { view: AppView; label: string; icon: typeof FileText }[] = [
    { view: AppView.BUILDER, label: t.nav.builder, icon: FileText },
    { view: AppView.UPDATE, label: t.nav.update, icon: RefreshCw },
    { view: AppView.ANALYZE, label: t.nav.analyze, icon: ScanSearch },
    { view: AppView.TRANSLATE, label: t.nav.translate, icon: Languages },
    { view: AppView.TAILOR, label: t.nav.tailor, icon: Target },
    { view: AppView.ACCOUNT, label: 'Mes CV', icon: UserRound },
  ];

  const go = (v: AppView) => {
    setView(v);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onLanding = view === AppView.HOME;
  const solid = scrolled || !onLanding;

  return (
    <header
      className={cn(
        'no-print fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid ? 'glass border-b border-ink-100/70 shadow-sm' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo onClick={() => go(AppView.HOME)} light={onLanding && !scrolled} />

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((it) => {
            const active = view === it.view;
            return (
              <button
                key={it.view}
                onClick={() => go(it.view)}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : onLanding && !scrolled
                      ? 'text-white/85 hover:bg-white/10 hover:text-white'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                )}
              >
                {it.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle dark={onLanding && !scrolled} />
          <Button size="sm" onClick={() => go(AppView.BUILDER)}>
            {t.common.startFree}
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle dark={onLanding && !scrolled} />
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-lg',
              onLanding && !scrolled ? 'text-white' : 'text-ink-800',
            )}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-ink-100/70 lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {items.map((it) => (
              <button
                key={it.view}
                onClick={() => go(it.view)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold',
                  view === it.view ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-100',
                )}
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </button>
            ))}
            <Button className="mt-2 w-full" onClick={() => go(AppView.BUILDER)}>
              {t.common.startFree}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
