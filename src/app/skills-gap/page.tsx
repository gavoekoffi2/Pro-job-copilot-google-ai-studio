'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Sparkles, AlertCircle, CheckCircle2, BookOpen,
  Clock, TrendingUp, Upload, ChevronDown, ChevronUp, ArrowRight,
  Zap, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GradientText } from '@/components/ui/GradientText';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { analyzeSkillsGap } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { SkillsGapAnalysis, SkillGap } from '@/types';

// ─── Score Ring ────────────────────────────────────────────────
function ReadinessRing({ score }: { score: number }) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Ready' : score >= 40 ? 'Progressing' : 'Early Stage';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-black text-white leading-none">{score}</div>
        <div className="text-xs font-semibold mt-1" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Skill Gap Card ────────────────────────────────────────────
function GapCard({ gap, index }: { gap: SkillGap; index: number }) {
  const [open, setOpen] = useState(index < 2);

  const importanceConfig = {
    critical:     { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    dot: 'bg-red-400' },
    important:    { color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  dot: 'bg-amber-400' },
    'nice-to-have': { color: 'text-blue-400', bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   dot: 'bg-blue-400' },
  }[gap.importance];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border ${importanceConfig.border} ${importanceConfig.bg} overflow-hidden`}
    >
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${importanceConfig.dot}`} />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-white text-sm">{gap.skill}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${importanceConfig.bg} ${importanceConfig.color} border ${importanceConfig.border}`}>
            {gap.importance}
          </span>
          <span className={`text-xs flex items-center gap-1 ${importanceConfig.color}`}>
            <Clock className="w-3 h-3" />{gap.timeEstimate}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/6 pt-3">
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Learning Path</p>
                <p className="text-sm text-white/70 leading-relaxed">{gap.learningPath}</p>
              </div>
              {gap.resources.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {gap.resources.map((r, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs bg-white/6 border border-white/10 px-2.5 py-1 rounded-lg text-white/70">
                        <BookOpen className="w-3 h-3 text-purple-400 shrink-0" />{r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Plan Section ─────────────────────────────────────────────
function PlanSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${color}`}>
        <Target className="w-4 h-4" />{title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
            <ArrowRight className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function SkillsGapPage() {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillsGapAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target role');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const analysis = await analyzeSkillsGap(
        targetRole,
        resumeText || undefined,
        jobDescription || undefined
      );
      setResult(analysis);
      addActivity('resume', `Skills gap analysis for ${targetRole}`);
      toast.success('Analysis complete!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analysis failed. Please try again.';
      setError(msg);
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'text/plain') {
      toast.error('Please upload a .txt file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target?.result as string ?? '');
    reader.readAsText(file);
    toast.success('Resume loaded');
  };

  const criticalCount = result?.criticalGaps.filter(g => g.importance === 'critical').length ?? 0;
  const importantCount = result?.criticalGaps.filter(g => g.importance === 'important').length ?? 0;

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Skills Gap <GradientText variant="primary">Analyzer</GradientText>
                </h1>
                <p className="text-white/50 text-sm">Identify what's missing & get a personalized 90-day action plan</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Input Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Target Role */}
              <div className="glass rounded-xl p-5">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Target Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer, Product Manager, DevOps Lead..."
                  className="input-glass w-full px-4 py-3 text-sm"
                />
                <p className="text-xs text-white/30 mt-2">Be specific — include seniority level for better results</p>
              </div>

              {/* Resume (optional) */}
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Your Current Resume
                    <span className="ml-2 text-[10px] font-normal text-white/30 normal-case">(optional — improves accuracy)</span>
                  </label>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 text-xs font-medium text-white/60 hover:text-white cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" />Upload .txt
                    <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here so we can identify what you already have..."
                  className="input-glass w-full h-36 p-3 text-sm resize-none font-mono"
                  spellCheck={false}
                />
                {resumeText && (
                  <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />Resume loaded — analysis will show matching skills too
                  </p>
                )}
              </div>

              {/* Optional Job Description */}
              <div className="glass rounded-xl p-4">
                <button
                  onClick={() => setShowJobDesc(!showJobDesc)}
                  className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors w-full text-left"
                >
                  {showJobDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>Add specific job description</span>
                  <span className="text-xs text-white/30 ml-1">(optional)</span>
                </button>
                <AnimatePresence>
                  {showJobDesc && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste a specific job description to get even more targeted gap analysis..."
                        className="input-glass w-full h-32 p-3 text-sm resize-none mt-3"
                        spellCheck={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                loading={loading}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full"
                size="lg"
              >
                {loading ? 'Analyzing with Gemini AI...' : 'Analyze My Skills Gap'}
              </Button>

              {/* How it works */}
              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass rounded-xl p-4 border border-teal-500/15"
                >
                  <p className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />What you'll get
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      'Readiness score (0–100) for the target role',
                      'Exact skills you\'re missing with learning paths',
                      'Time estimates for each skill',
                      'Personalized 30/60/90 day action plan',
                      'Curated learning resources per skill',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>

            {/* ── Results Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="glass rounded-xl p-6 min-h-[400px]">
                      <AILoadingSkeleton />
                    </div>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Readiness Overview */}
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-6">
                        <ReadinessRing score={result.readinessScore} />
                        <div className="flex-1 min-w-0">
                          <h2 className="font-bold text-white text-lg mb-1">Readiness for</h2>
                          <p className="text-purple-300 font-semibold text-sm mb-3 truncate">{targetRole}</p>
                          <div className="flex flex-wrap gap-2">
                            {criticalCount > 0 && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                {criticalCount} critical gap{criticalCount > 1 ? 's' : ''}
                              </span>
                            )}
                            {importantCount > 0 && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                {importantCount} important gap{importantCount > 1 ? 's' : ''}
                              </span>
                            )}
                            {result.matchingSkills.length > 0 && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                                {result.matchingSkills.length} skills matched
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-3 leading-relaxed">{result.summary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Matching Skills */}
                    {result.matchingSkills.length > 0 && (
                      <div className="glass rounded-xl p-5">
                        <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />Skills You Already Have ({result.matchingSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.matchingSkills.map((skill, i) => (
                            <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Gaps */}
                    {result.criticalGaps.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                          Skills to Develop ({result.criticalGaps.length})
                        </h3>
                        <div className="space-y-2">
                          {result.criticalGaps.map((gap, i) => (
                            <GapCard key={gap.skill} gap={gap} index={i} />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {!result && !loading && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
                      <Target className="w-10 h-10 text-teal-400/40" />
                    </div>
                    <h3 className="font-bold text-white/50 text-lg mb-1">No analysis yet</h3>
                    <p className="text-white/30 text-sm max-w-xs">Enter a target role and optionally paste your resume to get a personalized gap analysis.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── 30/60/90 Day Action Plan ── */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">Your 90-Day Action Plan</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PlanSection title="Month 1 — Foundation" items={result.thirtyDayPlan} color="text-blue-400" />
                  <PlanSection title="Month 2 — Build" items={result.sixtyDayPlan} color="text-purple-400" />
                  <PlanSection title="Month 3 — Apply" items={result.ninetyDayPlan} color="text-green-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
