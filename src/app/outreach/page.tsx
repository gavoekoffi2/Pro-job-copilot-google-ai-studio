'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Linkedin,
  UserPlus,
  RefreshCw,
  Heart,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { generateOutreachEmail } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { OutreachEmailType, OutreachContext, OutreachEmail } from '@/types';

// ─── Email type config ───────────────────────────────────────────────────────

interface EmailTypeConfig {
  value: OutreachEmailType;
  label: string;
  icon: React.ReactNode;
  description: string;
  tip: string;
}

const EMAIL_TYPES: EmailTypeConfig[] = [
  {
    value: 'cold-email',
    label: 'Cold Email',
    icon: <Mail className="w-4 h-4" />,
    description: 'Outreach to a hiring manager before applying',
    tip: 'Mention something specific about the company to stand out.',
  },
  {
    value: 'linkedin-connect',
    label: 'LinkedIn Connect',
    icon: <Linkedin className="w-4 h-4" />,
    description: 'Short connection request (≤300 chars)',
    tip: 'Keep it brief — LinkedIn limits connection notes to 300 characters.',
  },
  {
    value: 'follow-up',
    label: 'Application Follow-up',
    icon: <RefreshCw className="w-4 h-4" />,
    description: 'Following up after submitting your application',
    tip: 'Wait 5–7 business days after applying before following up.',
  },
  {
    value: 'thank-you',
    label: 'Interview Thank You',
    icon: <Heart className="w-4 h-4" />,
    description: 'Thank you note after an interview',
    tip: 'Send within 24 hours of your interview for best impact.',
  },
  {
    value: 'referral',
    label: 'Referral Request',
    icon: <Users className="w-4 h-4" />,
    description: 'Asking someone to refer you for a role',
    tip: 'Make it easy for them — include the job link and your resume.',
  },
];

// ─── Field visibility helpers ────────────────────────────────────────────────

function showJobTitle(type: OutreachEmailType) {
  return type === 'cold-email' || type === 'follow-up' || type === 'thank-you' || type === 'referral';
}
function showRecipientName(type: OutreachEmailType) {
  return type === 'linkedin-connect' || type === 'thank-you' || type === 'referral';
}
function showSpecificInsight(type: OutreachEmailType) {
  return type === 'cold-email';
}
function showInterviewDate(type: OutreachEmailType) {
  return type === 'thank-you';
}
function showReferrerName(type: OutreachEmailType) {
  return type === 'referral';
}

// ─── Tone options ────────────────────────────────────────────────────────────

const TONES: { value: OutreachContext['tone']; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Formal & polished' },
  { value: 'friendly',     label: 'Friendly',     desc: 'Warm & personable' },
  { value: 'concise',      label: 'Concise',      desc: 'Short & direct' },
];

// ─── Copy button component ───────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copié !`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-white/6 hover:bg-white/12 text-white/60 hover:text-white border border-white/8 hover:border-white/20"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─── Input field ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">
        {label}
        {required && <span className="text-purple-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function OutreachPage() {
  const [emailType, setEmailType] = useState<OutreachEmailType>('cold-email');
  const [yourName, setYourName]         = useState('');
  const [yourBackground, setYourBackground] = useState('');
  const [companyName, setCompanyName]   = useState('');
  const [jobTitle, setJobTitle]         = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [specificInsight, setSpecificInsight] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [tone, setTone] = useState<OutreachContext['tone']>('professional');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutreachEmail | null>(null);
  const [error, setError] = useState('');

  const activeType = EMAIL_TYPES.find(t => t.value === emailType)!;

  const linkedInNoteLength = result
    ? `${result.subject}\n\n${result.body}`.length
    : 0;

  const handleGenerate = async () => {
    if (!yourName.trim()) {
      toast.error('Entrez votre prénom');
      return;
    }
    if (!yourBackground.trim()) {
      toast.error('Décrivez votre parcours en quelques mots');
      return;
    }
    if (!companyName.trim()) {
      toast.error("Entrez le nom de l'entreprise");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const ctx: OutreachContext = {
        type: emailType,
        yourName,
        yourBackground,
        recipientName,
        companyName,
        jobTitle,
        specificInsight,
        interviewDate,
        referrerName,
        tone,
      };

      const email = await generateOutreachEmail(ctx);
      setResult(email);
      addActivity('cover-letter', `Generated ${emailType} email for ${companyName}`);
      toast.success('Email généré avec succès !');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Génération échouée. Réessayez.';
      setError(msg);
      toast.error('Génération échouée — réessayez');
    } finally {
      setLoading(false);
    }
  };

  const fullEmailText = result
    ? `Subject: ${result.subject}\n\n${result.body}`
    : '';

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Professional Email <GradientText variant="primary">Generator</GradientText>
                </h1>
                <p className="text-white/50 text-sm">
                  AI-crafted outreach emails that get responses
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Left panel — Inputs ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >

              {/* Email type selector */}
              <div className="glass rounded-xl p-5">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Email Type
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {EMAIL_TYPES.map(({ value, label, icon, description }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setEmailType(value);
                        setResult(null);
                        setError('');
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                        emailType === value
                          ? 'bg-purple-500/20 border-purple-500/40 text-white'
                          : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white/75'
                      }`}
                    >
                      <span className={emailType === value ? 'text-purple-300' : 'text-white/40'}>
                        {icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs opacity-60 truncate">{description}</div>
                      </div>
                      {emailType === value && (
                        <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="glass rounded-xl p-5 space-y-4">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Your Details
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Your Name" required>
                    <input
                      type="text"
                      value={yourName}
                      onChange={e => setYourName(e.target.value)}
                      placeholder="Jane Smith"
                      className="input-glass w-full px-3 py-2.5 text-sm"
                    />
                  </Field>

                  <Field label="Company" required>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Google, Stripe..."
                      className="input-glass w-full px-3 py-2.5 text-sm"
                    />
                  </Field>
                </div>

                <Field label="Your Background" required>
                  <input
                    type="text"
                    value={yourBackground}
                    onChange={e => setYourBackground(e.target.value)}
                    placeholder="e.g. 5 years full-stack eng, ex-Shopify, built 3 SaaS products"
                    className="input-glass w-full px-3 py-2.5 text-sm"
                  />
                </Field>

                {/* Conditional fields */}
                <AnimatePresence>
                  {showJobTitle(emailType) && (
                    <motion.div
                      key="jobTitle"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Field label="Job Title">
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={e => setJobTitle(e.target.value)}
                          placeholder="Senior Software Engineer"
                          className="input-glass w-full px-3 py-2.5 text-sm"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {showRecipientName(emailType) && (
                    <motion.div
                      key="recipientName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Field label="Recipient Name">
                        <input
                          type="text"
                          value={recipientName}
                          onChange={e => setRecipientName(e.target.value)}
                          placeholder="Alex Johnson"
                          className="input-glass w-full px-3 py-2.5 text-sm"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {showSpecificInsight(emailType) && (
                    <motion.div
                      key="specificInsight"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Field label="Something specific about the company you admire">
                        <input
                          type="text"
                          value={specificInsight}
                          onChange={e => setSpecificInsight(e.target.value)}
                          placeholder="e.g. Your recent open-source ML framework, the product-led growth model..."
                          className="input-glass w-full px-3 py-2.5 text-sm"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {showInterviewDate(emailType) && (
                    <motion.div
                      key="interviewDate"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Field label="Interview Date">
                        <input
                          type="text"
                          value={interviewDate}
                          onChange={e => setInterviewDate(e.target.value)}
                          placeholder="e.g. Tuesday, March 25"
                          className="input-glass w-full px-3 py-2.5 text-sm"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {showReferrerName(emailType) && (
                    <motion.div
                      key="referrerName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Field label="Person You're Asking for a Referral">
                        <input
                          type="text"
                          value={referrerName}
                          onChange={e => setReferrerName(e.target.value)}
                          placeholder="Chris (your contact at the company)"
                          className="input-glass w-full px-3 py-2.5 text-sm"
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tone selector */}
              <div className="glass rounded-xl p-5">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Tone
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setTone(value)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        tone === value
                          ? 'bg-purple-500/20 border-purple-500/40 text-white'
                          : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-0.5">{label}</div>
                      <div className="text-xs opacity-70">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                loading={loading}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full"
                size="lg"
              >
                {loading ? 'Generating with Gemini AI...' : `Generate ${activeType.label}`}
              </Button>
            </motion.div>

            {/* ── Right panel — Output ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass rounded-xl p-6 min-h-[560px] flex flex-col">

                {loading ? (
                  <AILoadingSkeleton />
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 h-full"
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white/80">Generated Email</h2>
                      <div className="flex items-center gap-2">
                        <CopyButton text={result.subject} label="Copy Subject" />
                        <CopyButton text={fullEmailText} label="Copy All" />
                      </div>
                    </div>

                    {/* Subject line */}
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider shrink-0 mt-0.5">
                          Subject
                        </span>
                        <p className="text-sm font-semibold text-white leading-snug">
                          {result.subject}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-h-0 relative">
                      <div className="h-full overflow-y-auto rounded-xl bg-white/4 p-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-mono scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {result.body}
                      </div>
                    </div>

                    {/* LinkedIn note counter */}
                    {emailType === 'linkedin-connect' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${
                          linkedInNoteLength > 300
                            ? 'bg-red-500/10 border-red-500/25 text-red-400'
                            : linkedInNoteLength > 260
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                            : 'bg-green-500/10 border-green-500/25 text-green-400'
                        }`}
                      >
                        <Linkedin className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          LinkedIn note:{' '}
                          <strong>{result.body.length}</strong> / 300 chars
                          {result.body.length > 300 && ' — over limit, please shorten'}
                          {result.body.length <= 300 && ' — fits!'}
                        </span>
                      </motion.div>
                    )}

                    {/* Tip badge */}
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/8 border border-purple-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-white/50 leading-relaxed">
                        <span className="text-purple-300 font-medium">Pro tip: </span>
                        {activeType.tip}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-indigo-400/40" />
                    </div>
                    <div>
                      <p className="text-white/40 font-medium mb-1">Your email will appear here</p>
                      <p className="text-white/25 text-sm max-w-xs mx-auto">
                        Choose an email type, fill in your details, and hit generate
                      </p>
                    </div>

                    {/* Email type hints */}
                    <div className="grid grid-cols-1 gap-2 w-full max-w-xs mt-2">
                      {EMAIL_TYPES.map(({ value, label, icon }) => (
                        <button
                          key={value}
                          onClick={() => setEmailType(value)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all border ${
                            emailType === value
                              ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                              : 'bg-white/3 border-white/8 text-white/35 hover:bg-white/6 hover:text-white/55'
                          }`}
                        >
                          <span className={emailType === value ? 'text-purple-400' : 'text-white/30'}>
                            {icon}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
