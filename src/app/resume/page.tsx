'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Sparkles, AlertCircle, CheckCircle2, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { GradientText } from '@/components/ui/GradientText';
import { analyzeResume } from '@/lib/gemini';
import { incrementStat, addActivity } from '@/lib/storage';
import type { ResumeAnalysis } from '@/types';

const sectionLabels: Record<string, string> = {
  summary: 'Summary', experience: 'Experience', education: 'Education',
  skills: 'Skills', formatting: 'Formatting',
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/60">{label}</span>
        <span className="font-semibold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

const MAX_CHARS = 12000;

export default function ResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState('');

  const charCount = resumeText.length;
  const charWarning = charCount > MAX_CHARS;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Collez votre CV en texte ci-dessous');
      return;
    }
    if (resumeText.trim().length < 100) {
      toast.error('Le texte semble trop court — collez votre CV complet');
      return;
    }
    if (charWarning) {
      toast.error(`CV trop long (${charCount.toLocaleString()} car.) — limitez à ${MAX_CHARS.toLocaleString()} caractères`);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const analysis = await analyzeResume(resumeText, jobTitle || undefined);
      setResult(analysis);
      incrementStat('resumesAnalyzed');
      addActivity('resume', `Analyzed resume${jobTitle ? ` for ${jobTitle}` : ''}`);
      toast.success('CV analysé avec succès !');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analyse échouée. Réessayez.';
      setError(msg);
      toast.error('Analyse échouée — vérifiez votre clé API');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'text/plain') {
      toast.error('Uploadez un fichier .txt (le PDF n\'est pas supporté en local)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      setResumeText(typeof text === 'string' ? text : '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Resume <GradientText variant="primary">Analyzer</GradientText>
                </h1>
                <p className="text-white/50 text-sm">AI-powered ATS scoring and improvement suggestions</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="glass rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-white text-sm uppercase tracking-wider">Votre CV</h2>
                  <div className="flex items-center gap-2">
                    {charCount > 0 && (
                      <span className={`text-xs font-mono ${charWarning ? 'text-red-400' : 'text-white/30'}`}>
                        {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
                      </span>
                    )}
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 text-xs font-medium text-white/60 hover:text-white cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      Upload .txt
                      <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                {charWarning && (
                  <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    CV trop long — raccourcissez-le à {MAX_CHARS.toLocaleString()} caractères max
                  </p>
                )}

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text here...

Example:
John Doe
Software Engineer
john@example.com | LinkedIn | GitHub

EXPERIENCE
Senior Developer at TechCorp (2021-Present)
• Led development of microservices architecture...

EDUCATION
BS Computer Science, MIT 2019

SKILLS
Python, TypeScript, React, AWS, Docker..."
                  className="input-glass w-full flex-1 min-h-[280px] p-4 text-sm resize-none font-mono"
                  spellCheck={false}
                />

                <div className="mt-4">
                  <label className="block text-xs font-medium text-white/60 mb-2">
                    Target Job Title <span className="text-white/30">(optional — improves analysis)</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer, Product Manager"
                    className="input-glass w-full px-4 py-2.5 text-sm"
                  />
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleAnalyze}
                    loading={loading}
                    icon={<Sparkles className="w-4 h-4" />}
                    className="w-full py-3"
                    size="lg"
                  >
                    {loading ? 'Analyzing with Gemini AI...' : 'Analyze My Resume'}
                  </Button>
                </div>

                {error && (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass rounded-xl p-6 min-h-[400px]">
                {loading ? (
                  <AILoadingSkeleton />
                ) : result ? (
                  <AnimatePresence mode="wait">
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      {/* Score Overview */}
                      <div className="flex items-center justify-around py-4 border-b border-white/8">
                        <div className="text-center">
                          <ScoreRing score={result.overallScore} size={100} label="Overall" />
                        </div>
                        <div className="text-center">
                          <ScoreRing score={result.atsScore} size={100} label="ATS Score" color="accent" />
                        </div>
                      </div>

                      {/* Section Scores */}
                      <div>
                        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" /> Section Breakdown
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(result.sectionScores).map(([key, score]) => (
                            <ScoreBar key={key} label={sectionLabels[key] ?? key} score={score} />
                          ))}
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </h3>
                        <ul className="space-y-1.5">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div>
                        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5" /> Improvements
                        </h3>
                        <ul className="space-y-1.5">
                          {result.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Keywords */}
                      {result.missingKeywords.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                            Missing Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((kw) => (
                              <Badge key={kw} variant="primary">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-blue-400/50" />
                    </div>
                    <p className="text-white/40 font-medium mb-1">No analysis yet</p>
                    <p className="text-white/25 text-sm">Paste your resume and click Analyze</p>
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
