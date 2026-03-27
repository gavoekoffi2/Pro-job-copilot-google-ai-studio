'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
  LogOut,
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
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === '/';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

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

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/6 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-white/80 font-medium max-w-[100px] truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title={lang === 'fr' ? 'Déconnexion' : 'Log out'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="px-3 py-1.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/8 transition-all font-medium">
                    {lang === 'fr' ? 'Connexion' : 'Log in'}
                  </Link>
                  <Link href="/register" className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm">
                    {lang === 'fr' ? "S'inscrire" : 'Sign up'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
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
              {user ? (
                <div className="mt-2 pt-2 border-t border-white/8">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-white/80 font-medium">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Déconnexion' : 'Log out'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-white/8 flex flex-col gap-2">
                  <Link href="/login" className="text-center py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                    {lang === 'fr' ? 'Se connecter' : 'Log in'}
                  </Link>
                  <Link href="/register" className="btn-primary text-center py-3 rounded-xl text-sm font-semibold">
                    {lang === 'fr' ? "S'inscrire gratuitement" : 'Sign up free'} →
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
