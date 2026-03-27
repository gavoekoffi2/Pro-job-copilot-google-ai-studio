'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
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
  Sparkles,
} from 'lucide-react';

const tools = [
  { href: '/dashboard',       label: 'Dashboard',      icon: LayoutDashboard, color: 'text-purple-400' },
  { href: '/resume',          label: 'Resume',         icon: FileText,        color: 'text-blue-400' },
  { href: '/cover-letter',    label: 'Cover Letter',   icon: Mail,            color: 'text-green-400' },
  { href: '/job-analyzer',    label: 'Job Analyzer',   icon: Search,          color: 'text-amber-400' },
  { href: '/interview-coach', label: 'Interview',      icon: MessageSquare,   color: 'text-pink-400' },
  { href: '/linkedin',        label: 'LinkedIn',       icon: Linkedin,        color: 'text-cyan-400' },
  { href: '/salary',          label: 'Salary',         icon: DollarSign,      color: 'text-emerald-400' },
  { href: '/tracker',         label: 'Tracker',        icon: Kanban,          color: 'text-orange-400' },
  { href: '/cv-builder',      label: 'CV Builder',     icon: FileEdit,        color: 'text-violet-400' },
  { href: '/outreach',        label: 'Email Generator',icon: Send,            color: 'text-indigo-400' },
  { href: '/skills-gap',      label: 'Skills Gap',     icon: Target,          color: 'text-teal-400' },
  { href: '/compare',         label: 'Offer Comparator',icon: Scale,          color: 'text-amber-400' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-6 px-3 border-r border-white/8"
    >
      <div className="mb-4 px-3">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">AI Tools</p>
      </div>

      <nav className="flex flex-col gap-1">
        {tools.map(({ href, label, icon: Icon, color }, i) => {
          const active = pathname === href;
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link
                href={href}
                className={clsx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-glow'
                    : 'text-white/60 hover:text-white hover:bg-white/6'
                )}
              >
                <span
                  className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                    active ? 'bg-purple-500/30' : 'bg-white/6 group-hover:bg-white/10'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', active ? 'text-purple-300' : color)} />
                </span>
                {label}

                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* AI Badge */}
      <div className="mt-auto pt-6 px-1">
        <div className="glass rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-white/70">Powered by</span>
          </div>
          <div className="gradient-text font-bold text-sm">Gemini AI</div>
          <p className="text-xs text-white/40 mt-1">Google AI Studio</p>
        </div>
      </div>
    </motion.aside>
  );
}
