'use client';

import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles, FileText, Mail, Search, MessageSquare, Linkedin,
  DollarSign, Kanban, ChevronRight, Star, Zap, Shield, TrendingUp,
  Award, ArrowRight, CheckCircle, FileEdit, Target, Scale, Send,
  Camera, Globe, Play, Users, BookOpen,
} from 'lucide-react';
import { HeroBackground } from '@/components/features/HeroBackground';
import { GradientText } from '@/components/ui/GradientText';
import { HeroTypewriter } from '@/components/ui/TypewriterText';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', decimals = 0, duration = 2 }: { end: number; suffix?: string; decimals?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, decimals]);
  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}</span>;
}

// ─── 3D Tilt Card ─────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Avatar with gradient ─────────────────────────────────────
function Avatar({ initials, gradient, size = 48 }: { initials: string; gradient: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, background: gradient, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────
const features = [
  { href: '/resume',          icon: FileText,    title_fr: 'Analyse de CV',          title_en: 'Resume Analyzer',       desc_fr: "Score ATS, mots-clés manquants, conseils d'amélioration personnalisés.",    desc_en: 'ATS score, missing keywords, personalized improvement tips.',          color: 'text-blue-400',    bg: 'bg-blue-500/12',   border: 'border-blue-500/20',  badge_fr: 'Populaire', badge_en: 'Popular' },
  { href: '/cover-letter',    icon: Mail,        title_fr: 'Lettre de motivation',   title_en: 'Cover Letter',          desc_fr: 'Générez des lettres personnalisées et convaincantes en quelques secondes.',  desc_en: 'Generate personalized, compelling cover letters in seconds.',          color: 'text-green-400',   bg: 'bg-green-500/12',  border: 'border-green-500/20' },
  { href: '/cv-builder',      icon: FileEdit,    title_fr: 'Créateur de CV',         title_en: 'CV Builder',            desc_fr: '12 templates premium ultra-modernes. Exportez en PDF en un clic.',          desc_en: '12 ultra-modern premium templates. Export to PDF in one click.',       color: 'text-violet-400',  bg: 'bg-violet-500/12', border: 'border-violet-500/20', badge_fr: 'Nouveau', badge_en: 'New' },
  { href: '/cv-import',       icon: Camera,      title_fr: 'Import photo CV',        title_en: 'Import CV Photo',       desc_fr: "Photographiez votre CV — l'IA extrait tout et applique un design moderne.", desc_en: 'Photo your CV — AI extracts everything and applies a modern design.',  color: 'text-rose-400',    bg: 'bg-rose-500/12',   border: 'border-rose-500/20',   badge_fr: 'Nouveau', badge_en: 'New' },
  { href: '/interview-coach', icon: MessageSquare,title_fr:'Coach entretien',        title_en: 'Interview Coach',       desc_fr: 'Questions adaptées à votre poste. Feedback IA détaillé sur vos réponses.',  desc_en: 'Role-specific questions. Detailed AI feedback on your answers.',       color: 'text-pink-400',    bg: 'bg-pink-500/12',   border: 'border-pink-500/20' },
  { href: '/skills-gap',      icon: Target,      title_fr: 'Analyse compétences',    title_en: 'Skills Gap',            desc_fr: 'Identifiez vos lacunes. Plan d\'action 30/60/90 jours personnalisé.',       desc_en: 'Identify your gaps. Personalized 30/60/90 day action plan.',          color: 'text-teal-400',    bg: 'bg-teal-500/12',   border: 'border-teal-500/20',   badge_fr: 'Nouveau', badge_en: 'New' },
  { href: '/job-analyzer',    icon: Search,      title_fr: "Analyser une offre",     title_en: 'Job Analyzer',          desc_fr: 'Décodez les offres : compétences requises, red flags, score de match.',      desc_en: 'Decode job posts: required skills, red flags, match score.',           color: 'text-amber-400',   bg: 'bg-amber-500/12',  border: 'border-amber-500/20' },
  { href: '/linkedin',        icon: Linkedin,    title_fr: 'LinkedIn Optimizer',     title_en: 'LinkedIn Optimizer',    desc_fr: 'Transformez votre profil LinkedIn en aimant à recruteurs.',                 desc_en: 'Transform your LinkedIn profile into a recruiter magnet.',             color: 'text-cyan-400',    bg: 'bg-cyan-500/12',   border: 'border-cyan-500/20' },
  { href: '/salary',          icon: DollarSign,  title_fr: 'Négociation salaire',    title_en: 'Salary Negotiator',     desc_fr: 'Connaissez votre valeur marché. Script de négociation complet.',            desc_en: 'Know your market value. Complete negotiation script.',                 color: 'text-emerald-400', bg: 'bg-emerald-500/12',border: 'border-emerald-500/20' },
  { href: '/outreach',        icon: Send,        title_fr: 'Emails professionnels',  title_en: 'Email Generator',       desc_fr: 'Cold emails, remerciements, relances — tous personnalisés par IA.',         desc_en: 'Cold emails, thank-yous, follow-ups — all AI-personalized.',          color: 'text-indigo-400',  bg: 'bg-indigo-500/12', border: 'border-indigo-500/20',  badge_fr: 'Nouveau', badge_en: 'New' },
  { href: '/compare',         icon: Scale,       title_fr: 'Comparer offres',        title_en: 'Offer Comparator',      desc_fr: 'Comparez jusqu\'à 3 offres avec projections financières sur 5 ans.',         desc_en: 'Compare up to 3 offers with 5-year financial projections.',           color: 'text-amber-400',   bg: 'bg-amber-500/12',  border: 'border-amber-500/20',   badge_fr: 'Nouveau', badge_en: 'New' },
  { href: '/tracker',         icon: Kanban,      title_fr: 'Suivi candidatures',     title_en: 'App Tracker',           desc_fr: 'Kanban visuel pour ne jamais perdre le fil de vos candidatures.',           desc_en: 'Visual Kanban to never lose track of your applications.',              color: 'text-orange-400',  bg: 'bg-orange-500/12', border: 'border-orange-500/20' },
];

const testimonials = [
  {
    name: 'Amara Diallo',
    role_fr: 'Ingénieure logicielle, Dakar',
    role_en: 'Software Engineer, Dakar',
    text_fr: "J'ai décroché 4 entretiens en 2 semaines après avoir optimisé mon CV. Les conseils ATS ont tout changé pour moi !",
    text_en: "Got 4 interviews in 2 weeks after optimizing my resume. The ATS tips were game-changing for me!",
    stars: 5,
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  },
  {
    name: 'Kofi Mensah',
    role_fr: 'Product Manager, Accra',
    role_en: 'Product Manager, Accra',
    text_fr: "Le coach d'entretien m'a vraiment préparé. J'ai obtenu le poste que je voulais avec une augmentation de 35% !",
    text_en: "The interview coach really prepared me. I got the position I wanted with a 35% raise!",
    stars: 5,
    gradient: 'linear-gradient(135deg, #059669, #0891b2)',
  },
  {
    name: 'Fatima Ouedraogo',
    role_fr: 'Data Scientist, Abidjan',
    role_en: 'Data Scientist, Abidjan',
    text_fr: "La traduction de CV m'a permis de postuler à l'international sans effort. Plateforme absolument exceptionnelle.",
    text_en: "The CV translation let me apply internationally effortlessly. Absolutely exceptional platform.",
    stars: 5,
    gradient: 'linear-gradient(135deg, #dc2626, #ea580c)',
  },
  {
    name: 'Ibrahima Sow',
    role_fr: 'Développeur Full-Stack, Lagos',
    role_en: 'Full-Stack Developer, Lagos',
    text_fr: "Le générateur de CV avec 12 templates premium m'a impressionné. Mon CV a été remarqué immédiatement.",
    text_en: "The CV generator with 12 premium templates impressed me. My CV was noticed immediately.",
    stars: 5,
    gradient: 'linear-gradient(135deg, #0891b2, #7c3aed)',
  },
  {
    name: 'Nadia Benali',
    role_fr: 'RH Senior, Casablanca',
    role_en: 'Senior HR, Casablanca',
    text_fr: "J'utilise ProJob pour conseiller mes clients en recherche d'emploi. Les outils IA sont d'une précision remarquable.",
    text_en: "I use ProJob to advise my clients in job searching. The AI tools are remarkably precise.",
    stars: 5,
    gradient: 'linear-gradient(135deg, #db2777, #7c3aed)',
  },
  {
    name: 'Jean-Baptiste Mwamba',
    role_fr: 'Finance, Kinshasa',
    role_en: 'Finance, Kinshasa',
    text_fr: "L'outil de négociation salariale m'a aidé à obtenir 20K€ de plus que l'offre initiale. Incroyable !",
    text_en: "The salary negotiation tool helped me get €20K more than the initial offer. Incredible!",
    stars: 5,
    gradient: 'linear-gradient(135deg, #b45309, #d97706)',
  },
];

const benefits = [
  { icon: Zap,        title_fr: 'Résultats instantanés',   title_en: 'Instant Results',      desc_fr: 'Gemini AI analyse en secondes. Pas de délai, pas d\'attente.',           desc_en: 'Gemini AI analyzes in seconds. No delay, no waiting.' },
  { icon: Shield,     title_fr: 'Données privées',         title_en: 'Private & Secure',     desc_fr: 'Vos données restent dans votre navigateur. Nous ne stockons rien.',      desc_en: 'Your data stays in your browser. We store nothing.' },
  { icon: Globe,      title_fr: 'Multilingue',             title_en: 'Multilingual',         desc_fr: 'Interface FR/EN. Traduisez votre CV en 7 langues en un clic.',           desc_en: 'FR/EN interface. Translate your CV into 7 languages in one click.' },
  { icon: Award,      title_fr: 'Qualité experte',         title_en: 'Expert Quality',       desc_fr: 'IA entraînée sur les standards des meilleurs recruteurs mondiaux.',       desc_en: 'AI trained on standards from the world\'s top recruiters.' },
];

// ─── Main Component ───────────────────────────────────────────
export default function LandingPage() {
  const { lang, t } = useLanguage();

  const typewriterPhrases_fr = [
    'analysez votre CV',
    'rédigez vos lettres',
    'préparez vos entretiens',
    'optimisez votre LinkedIn',
    'négociez votre salaire',
    'traduisez votre CV',
  ];
  const typewriterPhrases_en = [
    'analyze your resume',
    'write cover letters',
    'prepare for interviews',
    'optimize your LinkedIn',
    'negotiate your salary',
    'translate your CV',
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
        <HeroBackground />

        {/* Floating 3D orbs */}
        <motion.div animate={{ y: [0, -24, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[8%] w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/15 backdrop-blur-sm hidden xl:flex items-center justify-center">
          <FileEdit className="w-8 h-8 text-purple-400/60" />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-[8%] w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/10 border border-cyan-500/15 backdrop-blur-sm hidden xl:flex items-center justify-center">
          <Target className="w-7 h-7 text-cyan-400/60" />
        </motion.div>
        <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-48 left-[12%] w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/10 border border-green-500/15 backdrop-blur-sm hidden xl:flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-400/60" />
        </motion.div>
        <motion.div animate={{ y: [0, 18, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-52 right-[12%] w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-600/20 to-pink-600/10 border border-rose-500/15 backdrop-blur-sm hidden xl:flex items-center justify-center">
          <Camera className="w-6 h-6 text-rose-400/60" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-20">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm font-medium text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            {t('landing.badge')}
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">{t('landing.title1')}</span>
            <br />
            <GradientText variant="hero" className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black">
              {t('landing.title2')}
            </GradientText>
          </motion.h1>

          {/* Typewriter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/60 mb-4 font-medium h-8">
            {lang === 'fr' ? 'Instantanément ' : 'Instantly '}{' '}
            <HeroTypewriter
              phrases={lang === 'fr' ? typewriterPhrases_fr : typewriterPhrases_en}
              className="text-white font-semibold"
            />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl animate-pulse-glow group">
              <Sparkles className="w-5 h-5" />
              {t('landing.cta1')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/resume"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:bg-white/8 transition-all">
              <FileText className="w-5 h-5" />
              {t('landing.cta2')}
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            {([
              ['landing.trust1', CheckCircle],
              ['landing.trust2', Sparkles],
              ['landing.trust3', Shield],
              ['landing.trust4', Award],
            ] as [string, typeof CheckCircle][]).map(([key, Icon]) => (
              <span key={key} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-green-400/70" />
                {t(key)}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 via-transparent to-cyan-500/3" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {([
              { end: 50000, suffix: '+', key: 'landing.stats.resumes' },
              { end: 94, suffix: '%', key: 'landing.stats.interview' },
              { end: 38000, suffix: '+', key: 'landing.stats.letters' },
              { end: 4.9, suffix: '/5', key: 'landing.stats.rating', decimals: 1 },
              { end: 45, suffix: '+', key: 'landing.stats.countries' },
            ]).map(({ end, suffix, key, decimals }) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-center">
                <div className="text-3xl sm:text-4xl font-black gradient-text-primary mb-1">
                  <AnimatedCounter end={end} suffix={suffix} decimals={decimals} />
                </div>
                <div className="text-xs sm:text-sm text-white/50 font-medium">{t(key)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">{t('landing.features.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map(({ href, icon: Icon, title_fr, title_en, desc_fr, desc_en, color, bg, border, badge_fr, badge_en }, i) => (
              <motion.div key={href} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}>
                <TiltCard className="h-full">
                  <Link href={href} className={`block glass rounded-2xl p-5 h-full border ${border ?? 'border-white/8'} hover:bg-white/6 transition-all group relative overflow-hidden`}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bg}`} />
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-white text-sm leading-snug">
                          {lang === 'fr' ? title_fr : title_en}
                        </h3>
                        {(badge_fr || badge_en) && (
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${color} border ${border ?? ''}`}>
                            {lang === 'fr' ? badge_fr : badge_en}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {lang === 'fr' ? desc_fr : desc_en}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
                        <span className={color}>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${color} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/3 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title_fr, title_en, desc_fr, desc_en }, i) => (
              <motion.div key={title_en} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 text-center border border-white/6 hover:border-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{lang === 'fr' ? title_fr : title_en}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{lang === 'fr' ? desc_fr : desc_en}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">{t('landing.testimonials.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map(({ name, role_fr, role_en, text_fr, text_en, stars, gradient }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}>
                <div className="glass rounded-2xl p-5 h-full border border-white/8 hover:border-white/14 transition-colors flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed flex-1 mb-4">
                    "{lang === 'fr' ? text_fr : text_en}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/6">
                    <Avatar initials={name.split(' ').map(n => n[0]).join('')} gradient={gradient} size={38} />
                    <div>
                      <p className="font-semibold text-white text-sm">{name}</p>
                      <p className="text-xs text-white/45">{lang === 'fr' ? role_fr : role_en}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative glass rounded-3xl p-12 border border-purple-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-cyan-500/8" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {lang === 'fr' ? 'Prêt à décrocher votre emploi idéal ?' : 'Ready to land your dream job?'}
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                {lang === 'fr'
                  ? "Commencez maintenant — sans inscription, sans carte bancaire, 100% gratuit."
                  : "Start now — no signup, no credit card, 100% free."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl group">
                  <Sparkles className="w-5 h-5" />
                  {t('landing.cta1')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/cv-builder"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:bg-white/8 transition-all">
                  <FileEdit className="w-5 h-5" />
                  {lang === 'fr' ? 'Créer mon CV' : 'Build my CV'}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Pro<span className="gradient-text-primary">Job</span> Copilot</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/40">
              {[
                ['/resume', lang === 'fr' ? 'CV' : 'Resume'],
                ['/cv-builder', lang === 'fr' ? 'Créateur CV' : 'CV Builder'],
                ['/interview-coach', lang === 'fr' ? 'Entretien' : 'Interview'],
                ['/tracker', lang === 'fr' ? 'Suivi' : 'Tracker'],
                ['/cv-import', lang === 'fr' ? 'Import photo' : 'Photo Import'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-white/80 transition-colors">{label}</Link>
              ))}
            </div>
            <p className="text-xs text-white/25">
              {lang === 'fr' ? 'Propulsé par Google Gemini AI' : 'Powered by Google Gemini AI'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
