'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, AlertTriangle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { GradientText } from '@/components/ui/GradientText';
import { analyzeJobDescription } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { JobAnalysis } from '@/types';

export default function JobAnalyzerPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobAnalysis | null>(null);
  const [error, setError] = useState('');
  const [showResume, setShowResume] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Collez la description du poste ci-dessous");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const analysis = await analyzeJobDescription(jobDescription, resumeText || undefined);
      setResult(analysis);
      addActivity('job-analysis', `Analyzed job description${resumeText ? ' with resume match' : ''}`);
      toast.success('Offre analysée avec succès !');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analyse échouée.';
      setError(msg);
      toast.error('Analyse échouée — réessayez');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Job Description <GradientText variant="primary">Analyzer</GradientText>
                </h1>
                <p className="text-white/50 text-sm">Decode any job posting — skills, red flags, salary & match score</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="glass rounded-xl p-5">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="input-glass w-full h-52 p-3 text-sm resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Optional resume toggle */}
              <div className="glass rounded-xl p-4">
                <button
                  onClick={() => setShowResume(!showResume)}
                  className="flex items-center justify-between w-full text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  <span>Add resume for match scoring</span>
                  <Badge variant={showResume ? 'primary' : 'default'}>
                    {showResume ? 'On' : 'Off'}
                  </Badge>
                </button>
                <AnimatePresence>
                  {showResume && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume here for a match score..."
                        className="input-glass w-full h-32 p-3 text-sm resize-none mt-3 font-mono"
                        spellCheck={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                loading={loading}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full"
                size="lg"
              >
                {loading ? 'Analyzing...' : 'Analyze Job Description'}
              </Button>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass rounded-xl p-6 min-h-[400px]">
                {loading ? (
                  <AILoadingSkeleton />
                ) : result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Summary */}
                    <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                      <p className="text-white/80 text-sm leading-relaxed">{result.summary}</p>
                    </div>

                    {/* Match + Experience */}
                    <div className="flex items-center gap-6 flex-wrap">
                      {result.matchScore !== undefined && (
                        <ScoreRing score={result.matchScore} size={90} label="Match" />
                      )}
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-white/40">Experience Level</span>
                          <Badge variant="primary" className="ml-2">{result.experienceLevel}</Badge>
                        </div>
                        <div>
                          <span className="text-xs text-white/40">Estimated Salary</span>
                          <Badge variant="accent" className="ml-2">{result.estimatedSalaryRange}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.requiredSkills.map((s) => (
                          <Badge key={s} variant="danger">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Nice to have */}
                    {result.niceToHaveSkills.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                          Nice to Have
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.niceToHaveSkills.map((s) => (
                            <Badge key={s} variant="warning">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing from resume */}
                    {result.missingFromResume && result.missingFromResume.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                          Missing from Your Resume
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingFromResume.map((s) => (
                            <Badge key={s} variant="warning">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Culture */}
                    {result.cultureHints.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" /> Culture Signals
                        </h3>
                        <ul className="space-y-1">
                          {result.cultureHints.map((h, i) => (
                            <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Red Flags */}
                    {result.redFlags.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Red Flags
                        </h3>
                        <ul className="space-y-1">
                          {result.redFlags.map((f, i) => (
                            <li key={i} className="text-sm text-red-400/80 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-amber-400/50" />
                    </div>
                    <p className="text-white/40 font-medium mb-1">No analysis yet</p>
                    <p className="text-white/25 text-sm">Paste a job description and click Analyze</p>
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
