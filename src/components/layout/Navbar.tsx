'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Mail,
  Search,
  MessageSquare,
  Linkedin,
  DollarSign,
  Kanban,
  FileEdit,
  Target,
  Scale,
  Send,
  Camera,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard',       label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/resume',          label: 'Resume',        icon: FileText },
  { href: '/cover-letter',    label: 'Cover Letter',  icon: Mail },
  { href: '/job-analyzer',    label: 'Job Analyzer',  icon: Search },
  { href: '/interview-coach', label: 'Interview',     icon: MessageSquare },
  { href: '/linkedin',        label: 'LinkedIn',      icon: Linkedin },
  { href: '/salary',          label: 'Salary',        icon: DollarSign },
  { href: '/tracker',         label: 'Tracker',       icon: Kanban },
  { href: '/cv-builder',      label: 'CV Builder',    icon: FileEdit },
  { href: '/cv-import',       label: 'Import CV',     icon: Camera },
  { href: '/outreach',        label: 'Emails',        icon: Send },
  { href: '/skills-gap',      label: 'Skills Gap',    icon: Target },
  { href: '/compare',         label: 'Compare Offers',icon: Scale },
];

export function Navbar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isLanding
            ? 'bg-[#08080f]/80 backdrop-blur-xl border-b border-white/8'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Pro<span className="gradient-text-primary">Job</span>
              </span>
            </Link>

            {/* Desktop nav */}
            {!isLanding && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
                title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
              >
                <span className="text-sm">{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                <span className="hidden sm:block uppercase">{lang === 'fr' ? 'FR' : 'EN'}</span>
              </button>

              {isLanding && (
                <Link
                  href="/dashboard"
                  className="btn-primary hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  {lang === 'fr' ? 'Commencer' : 'Get Started'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-white/8 md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-white/60 hover:text-white hover:bg-white/8'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/dashboard"
                className="btn-primary mt-2 text-center py-3 rounded-xl text-sm font-semibold"
              >
                Get Started →
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
