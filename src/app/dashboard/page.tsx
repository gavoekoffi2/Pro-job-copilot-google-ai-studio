'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getStatusColor, getStatusLabel, getRelativeTime } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ProgressBar from '@/components/ui/ProgressBar';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, applications, resumes, coverLetters, interviewSessions } = useAppStore();

  const stats = [
    {
      label: 'Applications',
      value: applications.length,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
      change: '+3 this week',
      href: '/dashboard/jobs',
    },
    {
      label: 'Interviews',
      value: applications.filter((a) => a.status === 'interview').length,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      change: '2 upcoming',
      href: '/dashboard/interview',
    },
    {
      label: 'Resumes',
      value: resumes.length,
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100',
      change: 'AI optimized',
      href: '/dashboard/resume',
    },
    {
      label: 'Offers',
      value: applications.filter((a) => a.status === 'offer' || a.status === 'accepted').length,
      icon: Target,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
      change: 'Keep going!',
      href: '/dashboard/jobs',
    },
  ];

  const quickActions = [
    {
      label: 'Create Resume',
      description: 'Build an ATS-optimized resume',
      icon: FileText,
      href: '/dashboard/resume',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Write Cover Letter',
      description: 'Generate a tailored cover letter',
      icon: Mail,
      href: '/dashboard/cover-letter',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Practice Interview',
      description: 'Prepare with AI coaching',
      icon: MessageSquare,
      href: '/dashboard/interview',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Track Application',
      description: 'Add a new job application',
      icon: Briefcase,
      href: '/dashboard/jobs',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const recentApplications = applications.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-gray-500">
            Here&apos;s an overview of your job search progress.
          </p>
        </div>
        <Link
          href="/dashboard/resume"
          className="btn-primary"
        >
          <Sparkles className="h-4 w-4" />
          New with AI
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href} className="card-hover block">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                  <stat.icon className="h-5 w-5 text-gray-700" />
                </div>
                <span className="text-xs font-medium text-gray-400">{stat.change}</span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${action.color} p-2.5`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-500" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <Link
                href="/dashboard/jobs"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            {recentApplications.length === 0 ? (
              <div className="py-8 text-center">
                <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No applications yet</p>
                <Link href="/dashboard/jobs" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  <Plus className="h-4 w-4" /> Add your first application
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-primary-600 shadow-sm">
                      {app.company.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {app.position}
                      </p>
                      <p className="truncate text-xs text-gray-500">{app.company}</p>
                    </div>
                    <span className={`badge ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Tips & Progress */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className="space-y-6">
          {/* AI Tip */}
          <div className="card border-primary-100 bg-gradient-to-br from-primary-50 to-purple-50">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary-100 p-2">
                <Sparkles className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Tip of the Day</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Tailor your resume keywords to match the exact job description. ATS systems scan for specific terms — mirror their language to boost your match score.
                </p>
              </div>
            </div>
          </div>

          {/* Job Search Progress */}
          <div className="card">
            <h3 className="mb-4 font-semibold text-gray-900">Search Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">
                    {user?.skills?.length ? '75%' : '25%'}
                  </span>
                </div>
                <ProgressBar value={user?.skills?.length ? 75 : 25} color="blue" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Resume Score</span>
                  <span className="font-medium text-gray-900">
                    {resumes.length > 0 ? `${resumes[0].score || 72}/100` : 'N/A'}
                  </span>
                </div>
                <ProgressBar value={resumes.length > 0 ? (resumes[0].score || 72) : 0} color="green" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Interview Readiness</span>
                  <span className="font-medium text-gray-900">
                    {interviewSessions.length > 0 ? '68%' : '0%'}
                  </span>
                </div>
                <ProgressBar value={interviewSessions.length > 0 ? 68 : 0} color="purple" />
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card">
            <h3 className="mb-4 font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: 'Account created', time: 'Just now', color: 'text-emerald-500' },
                { icon: AlertCircle, text: 'Complete your profile', time: 'Action needed', color: 'text-amber-500' },
                { icon: Sparkles, text: 'AI tools are ready', time: 'Get started', color: 'text-primary-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <activity.icon className={`mt-0.5 h-4 w-4 shrink-0 ${activity.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
