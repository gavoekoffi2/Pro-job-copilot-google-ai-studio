import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Languages,
  Quote,
  ScanSearch,
  Sparkles,
  Star,
  Target,
  Layout,
  FileDown,
  Mail,
} from 'lucide-react';
import { AppView, type TemplateId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Button, SectionHeading } from './ui/ui';
import { Reveal } from './ui/Reveal';
import { TemplateThumb } from './cv/TemplateThumb';
import { exampleCV } from '../lib/sampleData';
import { TEMPLATES } from '../data/templates';
import {
  HERO_IMAGES,
  SCENE_IMAGES,
  FACE_IMAGES,
  pexels,
  face,
  onImageError,
} from '../lib/images';

interface LandingProps {
  setView: (v: AppView) => void;
  onPickTemplate: (id: TemplateId) => void;
}

const SHOWCASE: TemplateId[] = [
  'atlas',
  'volta',
  'aurora',
  'heritage',
  'lome',
  'kpalime',
];

export function LandingPage({ setView, onPickTemplate }: LandingProps) {
  const { t, locale } = useLanguage();
  const sample = exampleCV();

  return (
    <div className="overflow-hidden">
      <Hero t={t} setView={setView} />
      <Features t={t} />
      <TemplatesShowcase
        t={t}
        locale={locale}
        sample={sample}
        onPickTemplate={onPickTemplate}
        setView={setView}
      />
      <Steps t={t} />
      <Testimonials t={t} locale={locale} />
      <CtaBand t={t} setView={setView} />
    </div>
  );
}

/* ------------------------------- HERO ------------------------------- */
function Hero({ t, setView }: { t: any; setView: (v: AppView) => void }) {
  return (
    <section className="noise relative min-h-screen overflow-hidden bg-ink-950 pb-20 pt-28 text-white">
      <div className="aurora-bg" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(80% 60% at 50% 30%, #000 30%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-brand-200 backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold-400" />
            {t.hero.badge}
          </span>

          <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.06] tracking-[-0.025em] text-balance sm:text-6xl lg:text-[4.25rem]">
            {t.hero.title1}
            <br />
            <span className="text-brand-300">{t.hero.title2}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-ink-300 sm:text-xl">{t.hero.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" icon={<FileText className="h-5 w-5" />} onClick={() => setView(AppView.BUILDER)}>
              {t.hero.ctaPrimary}
            </Button>
            <Button
              size="lg"
              variant="white"
              icon={<ScanSearch className="h-5 w-5" />}
              onClick={() => setView(AppView.ANALYZE)}
            >
              {t.hero.ctaSecondary}
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <Stat value="12K+" label={t.hero.stat1} />
            <Stat value="3×" label={t.hero.stat2} />
            <Stat value={String(TEMPLATES.length)} label={t.hero.stat3} />
          </div>
        </motion.div>

        <HeroVisual t={t} />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-sm text-ink-400">{label}</div>
    </div>
  );
}

function HeroVisual({ t }: { t: any }) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-md"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Halo discret */}
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-brand-500/12 to-gold-500/12 blur-2xl" />

      {/* Image principale */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-2xl">
        <img
          src={pexels(HERO_IMAGES.womanOrange, 720, 900)}
          onError={onImageError}
          alt="Professionnelle africaine"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
      </div>

      {/* Carte flottante — score ATS */}
      <motion.div
        className="absolute -left-6 top-12 w-44 rounded-2xl border border-white/15 bg-ink-900/80 p-4 shadow-xl backdrop-blur-xl"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-3">
          <ScoreRing value={92} />
          <div>
            <p className="text-xs text-ink-400">Score ATS</p>
            <p className="font-display text-xl font-bold text-white">92<span className="text-sm text-ink-400">/100</span></p>
          </div>
        </div>
      </motion.div>

      {/* Carte flottante — CV optimisé */}
      <motion.div
        className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/95 p-3 pr-4 shadow-xl"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <img
          src={face(FACE_IMAGES.amenan, 88)}
          onError={onImageError}
          alt=""
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <p className="flex items-center gap-1 text-sm font-bold text-ink-900">
            <CheckCircle2 className="h-4 w-4 text-brand-500" /> {t.builder.ai.applied}
          </p>
          <p className="text-xs text-ink-500">{t.common.poweredByAi}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" className="-rotate-90">
      <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
      <circle
        cx="21"
        cy="21"
        r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
      />
    </svg>
  );
}

/* ----------------------------- FEATURES ----------------------------- */
function Features({ t }: { t: any }) {
  const items = [
    { icon: FileText, ...t.features.builder, color: 'text-brand-600 bg-brand-50' },
    { icon: ScanSearch, ...t.features.analyze, color: 'text-blue-600 bg-blue-50' },
    { icon: Languages, ...t.features.translate, color: 'text-violet-600 bg-violet-50' },
    { icon: Target, ...t.features.tailor, color: 'text-rose-600 bg-rose-50' },
    { icon: Mail, ...t.features.coverLetter, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Layout, ...t.features.templates, color: 'text-gold-600 bg-gold-50' },
    { icon: FileDown, ...t.features.pdf, color: 'text-teal-600 bg-teal-50' },
  ];
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow={t.features.eyebrow} title={t.features.title} subtitle={t.features.subtitle} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="group h-full rounded-3xl border border-ink-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${it.color}`}>
                  <it.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink-950">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- TEMPLATES SHOWCASE -------------------------- */
function TemplatesShowcase({
  t,
  locale,
  sample,
  onPickTemplate,
  setView,
}: {
  t: any;
  locale: any;
  sample: ReturnType<typeof exampleCV>;
  onPickTemplate: (id: TemplateId) => void;
  setView: (v: AppView) => void;
}) {
  return (
    <section id="templates" className="bg-ink-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.templatesSection.eyebrow}
          title={t.templatesSection.title}
          subtitle={t.templatesSection.subtitle}
        />
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {SHOWCASE.map((id, i) => {
            const meta = TEMPLATES.find((tp) => tp.id === id)!;
            return (
              <Reveal key={id} delay={i * 0.05}>
                <button
                  onClick={() => onPickTemplate(id)}
                  className="group block w-full"
                >
                  <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-brand-400">
                    <TemplateThumb
                      templateId={id}
                      data={sample}
                      accent={meta.accent}
                      locale={locale}
                      width={260}
                      className="w-full"
                    />
                  </div>
                  <p className="mt-2.5 text-center text-sm font-bold text-ink-900">{meta.name}</p>
                  <p className="text-center text-xs text-ink-400">{meta.category}</p>
                </button>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" variant="dark" iconRight={<ArrowRight className="h-5 w-5" />} onClick={() => setView(AppView.BUILDER)}>
            {t.templatesSection.viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- STEPS ------------------------------- */
function Steps({ t }: { t: any }) {
  const steps = [
    { n: '01', title: t.steps.step1Title, desc: t.steps.step1Desc },
    { n: '02', title: t.steps.step2Title, desc: t.steps.step2Desc },
    { n: '03', title: t.steps.step3Title, desc: t.steps.step3Desc },
  ];
  return (
    <section id="steps" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand-500/15 to-gold-500/15 blur-2xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 shadow-xl">
                <img
                  src={pexels(SCENE_IMAGES.team, 900, 680)}
                  onError={onImageError}
                  alt="Équipe de professionnels africains"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl bg-ink-950 px-5 py-4 text-white shadow-xl">
                <p className="font-display text-2xl font-bold text-gold-400">5 min</p>
                <p className="text-xs text-ink-300">CV prêt à l'emploi</p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow={t.steps.eyebrow}
              title={t.steps.title}
              className="!mx-0 !text-left"
            />
            <div className="mt-8 space-y-6">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="flex gap-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-ink-200 bg-white font-display text-lg font-bold text-brand-700">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-950">{s.title}</h3>
                      <p className="mt-1 text-[15px] text-ink-500">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TESTIMONIALS ---------------------------- */
function Testimonials({ t, locale }: { t: any; locale: string }) {
  const data = [
    {
      id: FACE_IMAGES.kwame,
      name: 'Kodjo Mensah',
      role: locale === 'fr' ? 'Développeur Full-Stack — Lomé' : 'Full-Stack Developer — Lomé',
      quote:
        locale === 'fr'
          ? "J'ai décroché 3 entretiens à Lomé en deux semaines. L'analyse IA a transformé mon CV."
          : 'I landed 3 interviews in Lomé in two weeks. The AI analysis transformed my resume.',
    },
    {
      id: FACE_IMAGES.fatou,
      name: 'Afi Lawson',
      role: locale === 'fr' ? 'Data Analyst — Lomé' : 'Data Analyst — Lomé',
      quote:
        locale === 'fr'
          ? 'La traduction en anglais était parfaite, avec le bon vocabulaire métier pour postuler au Togo et à distance.'
          : 'The English translation was flawless, with the right wording to apply in Togo and remotely.',
    },
    {
      id: FACE_IMAGES.amenan,
      name: 'Aménan Koffi',
      role: locale === 'fr' ? 'Cheffe de projet — Kara' : 'Project Manager — Kara',
      quote:
        locale === 'fr'
          ? 'Les modèles Lomé et Kpalimé sont magnifiques. Mon CV inspire confiance dès le premier regard.'
          : 'The Lomé and Kpalimé templates are gorgeous. My CV inspires confidence at first glance.',
    },
  ];
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 text-white">
      <div className="aurora-bg opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} light />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
                <Quote className="h-8 w-8 text-gold-400" />
                <p className="mt-4 text-[15px] leading-relaxed text-ink-200">“{d.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={face(d.id, 96)}
                    onError={onImageError}
                    alt={d.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div>
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-xs text-ink-400">{d.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA BAND ------------------------------ */
function CtaBand({ t, setView }: { t: any; setView: (v: AppView) => void }) {
  return (
    <section className="bg-ink-50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-950 px-8 py-16 text-center">
            <div className="aurora-bg" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t.ctaBand.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-50">{t.ctaBand.subtitle}</p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" variant="gold" iconRight={<ArrowRight className="h-5 w-5" />} onClick={() => setView(AppView.BUILDER)}>
                  {t.ctaBand.button}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
