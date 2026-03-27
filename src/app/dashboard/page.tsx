'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Mail, Search, MessageSquare, Linkedin, DollarSign,
  Kanban, Sparkles, TrendingUp, CheckCircle, Clock, Lightbulb,
  ArrowRight, FileEdit, Target, Scale, Send, Camera,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { GradientText } from '@/components/ui/GradientText';
import { getStats, getActivity, formatRelativeTime } from '@/lib/storage';
import { getDailyTip } from '@/lib/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { DashboardStats, ActivityItem } from '@/types';

const tools = [
  { href: '/resume',          icon: FileText,        label: 'Resume Analyzer',      color: 'text-blue-400',    bg: 'bg-blue-500/15',    desc: 'Analyze & optimize' },
  { href: '/cover-letter',    icon: Mail,            label: 'Cover Letter',          color: 'text-green-400',   bg: 'bg-green-500/15',   desc: 'Generate letters' },
  { href: '/job-analyzer',    icon: Search,          label: 'Job Analyzer',          color: 'text-amber-400',   bg: 'bg-amber-500/15',   desc: 'Decode job posts' },
  { href: '/interview-coach', icon: MessageSquare,   label: 'Interview Coach',       color: 'text-pink-400',    bg: 'bg-pink-500/15',    desc: 'Practice & prepare' },
  { href: '/linkedin',        icon: Linkedin,        label: 'LinkedIn',              color: 'text-cyan-400',    bg: 'bg-cyan-500/15',    desc: 'Optimize profile' },
  { href: '/salary',          icon: DollarSign,      label: 'Salary Negotiator',     color: 'text-emerald-400', bg: 'bg-emerald-500/15', desc: 'Know your worth' },
  { href: '/tracker',         icon: Kanban,          label: 'App Tracker',           color: 'text-orange-400',  bg: 'bg-orange-500/15',  desc: 'Track applications' },
  { href: '/cv-builder',      icon: FileEdit,        label: 'CV Builder',            color: 'text-violet-400',  bg: 'bg-violet-500/15',  desc: '12 premium templates' },
  { href: '/outreach',        icon: Send,            label: 'Email Generator',       color: 'text-indigo-400',  bg: 'bg-indigo-500/15',  desc: 'Cold emails & follow-ups' },
  { href: '/skills-gap',      icon: Target,          label: 'Skills Gap Analyzer',   color: 'text-teal-400',    bg: 'bg-teal-500/15',    desc: '90-day growth plan' },
  { href: '/compare',         icon: Scale,           label: 'Offer Comparator',      color: 'text-amber-400',   bg: 'bg-amber-500/15',   desc: 'Compare job offers' },
  { href: '/cv-import',       icon: Camera,          label: 'Import CV Photo',        color: 'text-rose-400',    bg: 'bg-rose-500/15',    desc: 'Scan & digitize CV' },
];

const activityIcons: Record<ActivityItem['type'], typeof FileText> = {
  'resume': FileText,
  'cover-letter': Mail,
  'job-analysis': Search,
  'interview': MessageSquare,
  'linkedin': Linkedin,
  'salary': DollarSign,
  'tracker': Kanban,
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [tip, setTip] = useState<string>('');
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setStats(getStats());
    setActivity(getActivity().slice(0, 5));
  }, []);

  useEffect(() => {
    getDailyTip().then((t) => {
      setTip(t);
      setTipLoading(false);
    }).catch(() => {
      setTip('Focus on tailoring your resume for each job — it takes 5 minutes but triples your callback rate.');
      setTipLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Resumes Analyzed',       value: stats?.resumesAnalyzed ?? 0,       icon: FileText,   color: 'text-blue-400',    bg: 'bg-blue-500/10' },
    { label: 'Cover Letters',           value: stats?.coverLettersGenerated ?? 0, icon: Mail,       color: 'text-green-400',   bg: 'bg-green-500/10' },
    { label: 'Interviews Practiced',    value: stats?.interviewsCompleted ?? 0,   icon: MessageSquare, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Applications Tracked',   value: stats?.applicationsTracked ?? 0,   icon: Kanban,     color: 'text-orange-400',  bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {user ? `Bonjour, ${user.name.split(' ')[0]} 👋` : 'Career'}{' '}
                <GradientText variant="primary">Dashboard</GradientText>
              </h1>
              <p className="text-white/50 text-sm">Your AI-powered career command center</p>
            </div>
          </div>
        </motion.div>

        {/* AI Tip of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-5 mb-8 border border-purple-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">AI Tip of the Day</span>
                <Badge variant="primary" className="text-[10px]">Gemini</Badge>
              </div>
              {tipLoading ? (
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-4/5" />
                </div>
              ) : (
                <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div key={label} variants={staggerItem}>
              <div className="glass rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-2xl font-black text-white mb-0.5">{value}</div>
                <div className="text-xs text-white/50 font-medium">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Access Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Quick Access
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map(({ href, icon: Icon, label, color, bg, desc }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    whileHover={{ x: 3 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/6 transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{label}</div>
                        <div className="text-xs text-white/40">{desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto transition-all group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass rounded-xl p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Recent Activity
                </h2>
              </div>
              {activity.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/30">No activity yet.</p>
                  <p className="text-xs text-white/20 mt-1">Start using a tool!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activity.map((item) => {
                    const Icon = activityIcons[item.type] || Sparkles;
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/70 leading-relaxed truncate">{item.description}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{formatRelativeTime(item.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
