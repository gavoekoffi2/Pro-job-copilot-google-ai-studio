'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, FileText, Mail, Search, MessageSquare, Linkedin,
  DollarSign, Kanban, ChevronRight, Star, Zap, Shield, Users,
  TrendingUp, Award, ArrowRight, CheckCircle,
} from 'lucide-react';
import { HeroBackground } from '@/components/features/HeroBackground';
import { FeatureCard } from '@/components/features/FeatureCard';
import { GradientText } from '@/components/ui/GradientText';
import { HeroTypewriter } from '@/components/ui/TypewriterText';

// ─── Animated Counter ────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  {
    href: '/resume', icon: FileText, title: 'Resume Analyzer',
    description: 'Get an AI-powered ATS score, identify gaps, and receive specific improvements to make your resume stand out.',
    color: 'text-blue-400', bgColor: '#3b82f6', badge: 'Most Popular',
  },
  {
    href: '/cover-letter', icon: Mail, title: 'Cover Letter Generator',
    description: 'Generate personalized, compelling cover letters that align perfectly with any job description.',
    color: 'text-green-400', bgColor: '#22c55e',
  },
  {
    href: '/job-analyzer', icon: Search, title: 'Job Analyzer',
    description: 'Decode any job description: extract key skills, detect red flags, and get your match score instantly.',
    color: 'text-amber-400', bgColor: '#f59e0b',
  },
  {
    href: '/interview-coach', icon: MessageSquare, title: 'Interview Coach',
    description: 'Practice with AI-generated role-specific questions and get detailed feedback on your answers.',
    color: 'text-pink-400', bgColor: '#ec4899',
  },
  {
    href: '/linkedin', icon: Linkedin, title: 'LinkedIn Optimizer',
    description: 'Transform your LinkedIn profile into a recruiter magnet with AI-powered section-by-section improvements.',
    color: 'text-cyan-400', bgColor: '#06b6d4',
  },
  {
    href: '/salary', icon: DollarSign, title: 'Salary Negotiator',
    description: 'Know your market value and get a complete negotiation script to maximize your offer.',
    color: 'text-emerald-400', bgColor: '#10b981',
  },
  {
    href: '/tracker', icon: Kanban, title: 'Application Tracker',
    description: 'Organize your entire job search with a visual Kanban board. Never lose track of an opportunity.',
    color: 'text-orange-400', bgColor: '#f97316',
  },
  {
    href: '/dashboard', icon: Sparkles, title: 'AI Dashboard',
    description: 'Your career command center with daily AI tips, progress stats, and quick access to all tools.',
    color: 'text-purple-400', bgColor: '#8b5cf6',
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Resumes Analyzed' },
  { value: 94,    suffix: '%', label: 'Interview Rate Improvement' },
  { value: 38000, suffix: '+', label: 'Cover Letters Generated' },
  { value: 4.9,   suffix: '/5', label: 'User Satisfaction', decimals: 1 },
];

const benefits = [
  { icon: Zap,      title: 'Instant AI Analysis',    desc: 'Results in seconds, not hours. Our Gemini-powered engine processes your content instantly.' },
  { icon: Shield,   title: 'Private & Secure',        desc: 'Your data stays in your browser. We never store your personal career information.' },
  { icon: TrendingUp, title: 'Proven Results',       desc: 'Users see 3x more callbacks after optimizing their resume with our AI suggestions.' },
  { icon: Award,    title: 'Expert-Level Guidance',   desc: 'AI trained on insights from top recruiters and hiring managers at Fortune 500 companies.' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Software Engineer', text: 'Got 4 interviews in 2 weeks after using the resume analyzer. The ATS tips were game-changing!', stars: 5 },
  { name: 'James K.', role: 'Product Manager', text: 'The salary negotiator helped me get $18K more than the initial offer. Worth every minute.', stars: 5 },
  { name: 'Priya L.', role: 'Data Scientist', text: 'The interview coach helped me feel so prepared. I landed my dream role at a top tech company!', stars: 5 },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* ─── Hero ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm font-medium text-purple-300 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            Your{' '}
            <GradientText variant="hero" className="text-5xl sm:text-6xl lg:text-7xl font-black">
              AI-Powered
            </GradientText>
            <br />
            Career Copilot
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/60 mb-4 font-medium"
          >
            Instantly{' '}
            <HeroTypewriter
              phrases={[
                'analyze your resume',
                'write cover letters',
                'prepare for interviews',
                'optimize your LinkedIn',
                'negotiate your salary',
                'track applications',
              ]}
              className="text-white font-semibold"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-10"
          >
            Join thousands of job seekers who land roles 3x faster using our suite of
            Gemini-powered career tools — all in one place, completely free.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5" />
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:bg-white/8 transition-all"
            >
              <FileText className="w-5 h-5" />
              Analyze Resume
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40"
          >
            {['No signup required', 'Powered by Gemini AI', 'Privacy-first', '100% Free'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-400/70" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats ────────────────────────────── */}
      <section className="py-16 border-y border-white/6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, suffix, label, decimals }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black gradient-text-primary mb-1">
                  {decimals
                    ? <span>{value}{suffix}</span>
                    : <AnimatedCounter end={value} suffix={suffix} />
                  }
                </div>
                <div className="text-sm text-white/50 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              8 AI-Powered Tools
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Everything you need to{' '}
              <GradientText variant="primary">land the job</GradientText>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From your first application to final offer negotiation — our AI has you covered at every step.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <FeatureCard key={feature.href} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits ─────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f0f1a]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              Why job seekers{' '}
              <GradientText variant="accent">choose ProJob</GradientText>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              Real results from{' '}
              <GradientText variant="hero">real users</GradientText>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-white/40">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 rounded-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Ready to land your{' '}
                <GradientText variant="hero">dream job?</GradientText>
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Start using all 8 AI-powered tools right now. No signup, no credit card — completely free.
              </p>
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg font-bold rounded-xl animate-pulse-glow"
              >
                <Sparkles className="w-5 h-5" />
                Launch Career Copilot
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────── */}
      <footer className="py-10 px-6 border-t border-white/6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white/50">ProJob Copilot</span>
            <span>— Built with Google Gemini AI</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>50,000+ job seekers helped</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
