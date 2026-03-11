'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import {
  Sparkles,
  FileText,
  Mail,
  MessageSquare,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Target,
  BarChart3,
  Brain,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-100/50 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-100/40 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-emerald-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
            >
              <Sparkles className="h-4 w-4" />
              Powered by Google Gemini AI
            </motion.div>

            {/* Headline */}
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Land Your Dream Job{' '}
              <span className="gradient-text">10x Faster</span>{' '}
              with AI
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Your AI-powered career copilot that crafts perfect resumes, writes compelling cover letters,
              prepares you for interviews, and tracks every application — all in one place.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/auth/register" className="btn-primary text-base px-8 py-4">
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
                See How It Works
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                  <div
                    key={letter}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-purple-500 text-xs font-bold text-white"
                    style={{ zIndex: 5 - i }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Trusted by <strong>10,000+</strong> job seekers
              </span>
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">ProJob Copilot Dashboard</span>
              </div>
              <div className="grid grid-cols-12 gap-0">
                {/* Mini sidebar */}
                <div className="col-span-3 hidden border-r border-gray-100 bg-gray-50/50 p-4 sm:block">
                  {['Dashboard', 'Resume', 'Cover Letters', 'Interview', 'Jobs'].map((item, i) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-lg px-3 py-2 text-xs font-medium ${
                        i === 0 ? 'bg-primary-50 text-primary-700' : 'text-gray-500'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main content preview */}
                <div className="col-span-12 p-6 sm:col-span-9">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="mt-2 h-3 w-48 rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-24 rounded-lg bg-primary-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: 'Applications', value: '24', color: 'bg-blue-500' },
                      { label: 'Interviews', value: '8', color: 'bg-purple-500' },
                      { label: 'Offers', value: '3', color: 'bg-emerald-500' },
                      { label: 'Score', value: '92%', color: 'bg-yellow-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-gray-50 p-3">
                        <div className={`mb-2 h-1.5 w-8 rounded ${stat.color}`} />
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 p-3">
                      <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-4/5 rounded bg-gray-100" />
                        <div className="h-2 w-3/5 rounded bg-gray-100" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3">
                      <div className="mb-2 h-3 w-24 rounded bg-gray-200" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-full rounded bg-primary-100" />
                        <div className="h-2 w-3/4 rounded bg-emerald-100" />
                        <div className="h-2 w-1/2 rounded bg-purple-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 top-8 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Resume Score</p>
                  <p className="text-xs text-emerald-600">95/100</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -left-4 bottom-12 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">AI Generated</p>
                  <p className="text-xs text-primary-600">Cover letter ready</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
              Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              From resume creation to interview preparation, our AI-powered tools give you an unfair advantage in your job search.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'AI Resume Builder',
                description: 'Create ATS-optimized resumes tailored to specific job descriptions. Get instant scoring and improvement suggestions.',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50',
              },
              {
                icon: Mail,
                title: 'Cover Letter Generator',
                description: 'Generate personalized, compelling cover letters in seconds. Customize tone and emphasis for each application.',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50',
              },
              {
                icon: MessageSquare,
                title: 'Interview Prep Coach',
                description: 'Practice with AI-generated questions specific to your role. Get real-time feedback on your answers.',
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'bg-emerald-50',
              },
              {
                icon: Briefcase,
                title: 'Job Application Tracker',
                description: 'Track all your applications in one place. Monitor status changes, deadlines, and follow-ups.',
                color: 'from-orange-500 to-amber-500',
                bgColor: 'bg-orange-50',
              },
              {
                icon: Brain,
                title: 'Skill Gap Analysis',
                description: 'Identify missing skills for your target role. Get personalized learning recommendations.',
                color: 'from-rose-500 to-red-500',
                bgColor: 'bg-rose-50',
              },
              {
                icon: BarChart3,
                title: 'Career Analytics',
                description: 'Visualize your job search progress. Track response rates, interview conversion, and more.',
                color: 'from-indigo-500 to-violet-500',
                bgColor: 'bg-indigo-50',
              },
            ].map((feature, index) => (
              <AnimatedSection key={feature.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3`}>
                    <feature.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section-padding">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              How it Works
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Three Steps to Your{' '}
              <span className="gradient-text">Dream Job</span>
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Add your experience, skills, and career goals. Our AI learns your unique professional story.',
                icon: Users,
              },
              {
                step: '02',
                title: 'AI Optimizes Everything',
                description: 'Get polished resumes, tailored cover letters, and personalized interview prep — instantly.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Land the Job',
                description: 'Apply with confidence, ace interviews, and track your progress all the way to your offer.',
                icon: Target,
              },
            ].map((item, index) => (
              <AnimatedSection key={item.step}>
                <div className="relative text-center">
                  {index < 2 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-primary-200 to-transparent md:block" />
                  )}
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-primary-500/30">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '10K+', label: 'Active Users', icon: Users },
              { value: '50K+', label: 'Resumes Created', icon: FileText },
              { value: '85%', label: 'Interview Success Rate', icon: TrendingUp },
              { value: '< 30s', label: 'Avg. Generation Time', icon: Clock },
            ].map((stat) => (
              <AnimatedSection key={stat.label}>
                <div className="text-center">
                  <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary-200" />
                  <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                  <p className="mt-1 text-primary-200">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Loved by Job Seekers{' '}
              <span className="gradient-text">Worldwide</span>
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer at Google',
                content: 'ProJob\'s AI resume builder helped me tailor my resume perfectly for each application. I landed 3 interviews in my first week!',
                rating: 5,
              },
              {
                name: 'Marcus Williams',
                role: 'Product Manager at Meta',
                content: 'The interview prep feature is incredible. The AI questions were spot-on and the feedback helped me nail my behavioral interviews.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Data Scientist at Netflix',
                content: 'I went from zero responses to 5 interviews in 2 weeks. The cover letter generator saved me hours of work every day.',
                rating: 5,
              },
              {
                name: 'James Park',
                role: 'UX Designer at Apple',
                content: 'The job tracker kept me organized during a chaotic job search. I could see exactly where each application stood at a glance.',
                rating: 5,
              },
              {
                name: 'Aisha Patel',
                role: 'Marketing Lead at Stripe',
                content: 'As a career changer, the skill gap analysis showed me exactly what to learn. I got my dream role in 3 months!',
                rating: 5,
              },
              {
                name: 'David Kim',
                role: 'Backend Engineer at Spotify',
                content: 'The AI feedback on my interview answers was like having a personal career coach. Best investment in my job search.',
                rating: 5,
              },
            ].map((testimonial) => (
              <AnimatedSection key={testimonial.name}>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-purple-500 text-sm font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <span className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
              Pricing
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Simple, Transparent{' '}
              <span className="gradient-text">Pricing</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                description: 'Perfect to get started',
                features: [
                  '1 Resume',
                  '3 Cover Letters/month',
                  '5 Interview Questions',
                  'Basic Job Tracker',
                  'Community Support',
                ],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                description: 'For active job seekers',
                features: [
                  'Unlimited Resumes',
                  'Unlimited Cover Letters',
                  'Full Interview Prep',
                  'Advanced Job Tracker',
                  'Skill Gap Analysis',
                  'Priority Support',
                  'Export to PDF',
                ],
                cta: 'Start Pro Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '$49',
                period: '/month',
                description: 'For teams and agencies',
                features: [
                  'Everything in Pro',
                  'Team Collaboration',
                  'Custom Branding',
                  'API Access',
                  'Dedicated Account Manager',
                  'SLA Guarantee',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan) => (
              <AnimatedSection key={plan.name}>
                <div
                  className={`relative rounded-2xl border p-6 ${
                    plan.popular
                      ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/10 scale-105'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  <div className="my-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/register"
                    className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 px-8 py-16 text-center shadow-2xl shadow-primary-500/25 sm:px-16">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAyMGgyME0yMCAwdjIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20" />
              <div className="relative">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to Supercharge Your Job Search?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
                  Join thousands of professionals who landed their dream jobs with ProJob Copilot.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                <p className="mt-4 text-sm text-primary-200">
                  No credit card required. Free plan available forever.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">ProJob</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                AI-powered career copilot helping you land your dream job faster.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-gray-900">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Career Tips</a></li>
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} ProJob Copilot. All rights reserved. Built with Google Gemini AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
