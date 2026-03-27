'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { GradientText } from '@/components/ui/GradientText';
import { optimizeLinkedIn } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { LinkedInOptimization } from '@/types';

type Section = 'headline' | 'about' | 'experience' | 'skills';

const sectionConfig: { key: Section; label: string; placeholder: string; rows: number }[] = [
  { key: 'headline',   label: 'Headline',          placeholder: 'e.g. Software Engineer | Building scalable products | Open to opportunities', rows: 2 },
  { key: 'about',      label: 'About / Summary',   placeholder: 'Your current About section text...', rows: 5 },
  { key: 'experience', label: 'Latest Experience', placeholder: 'Company, role, and bullet points from your most recent position...', rows: 5 },
  { key: 'skills',     label: 'Skills',            placeholder: 'e.g. TypeScript, React, Node.js, AWS, Leadership, Communication...', rows: 3 },
];

function SectionResult({ section, result }: { section: Section; result: LinkedInOptimization }) {
  const data = result[section];
  const [showing, setShowing] = useState<'improved' | 'explanation'>('improved');

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white capitalize">{section}</span>
          <ScoreRing score={data.score} size={40} strokeWidth={4} showPercent={false} />
          <span className="text-sm font-bold" style={{ color: data.score >= 80 ? '#22c55e' : data.score >= 60 ? '#f59e0b' : '#ef4444' }}>
            {data.score}/100
          </span>
        </div>
        <div className="flex gap-1">
          {(['improved', 'explanation'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setShowing(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${showing === tab ? 'bg-purple-500/25 text-purple-300' : 'text-white/40 hover:text-white/70'}`}
            >
              {tab === 'improved' ? 'Improved' : 'Why'}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={showing}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-3 rounded-lg bg-white/4 text-sm text-white/75 leading-relaxed whitespace-pre-wrap"
        >
          {data[showing]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LinkedInPage() {
  const [sections, setSections] = useState({ headline: '', about: '', experience: '', skills: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInOptimization | null>(null);
  const [error, setError] = useState('');

  const updateSection = (key: Section, val: string) =>
    setSections(prev => ({ ...prev, [key]: val }));

  const handleOptimize = async () => {
    const filled = Object.values(sections).filter(v => v.trim());
    if (filled.length < 2) {
      toast.error('Remplissez au moins 2 sections de votre profil');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const opt = await optimizeLinkedIn(sections);
      setResult(opt);
      addActivity('linkedin', 'Optimized LinkedIn profile sections');
      toast.success('Profil LinkedIn optimisé !');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Optimisation échouée.';
      setError(msg);
      toast.error('Optimisation échouée — réessayez');
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
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  LinkedIn <GradientText variant="primary">Optimizer</GradientText>
                </h1>
                <p className="text-white/50 text-sm">Transform your profile into a recruiter magnet</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              {sectionConfig.map(({ key, label, placeholder, rows }) => (
                <div key={key} className="glass rounded-xl p-5">
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">{label}</label>
                  <textarea
                    value={sections[key]}
                    onChange={e => updateSection(key, e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className="input-glass w-full p-3 text-sm resize-none"
                    spellCheck
                  />
                </div>
              ))}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                </div>
              )}
              <Button onClick={handleOptimize} loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full" size="lg">
                {loading ? 'Optimizing with Gemini AI...' : 'Optimize My LinkedIn'}
              </Button>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass rounded-xl p-6 min-h-[400px]">
                {loading ? (
                  <AILoadingSkeleton />
                ) : result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {/* Overall score */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/4">
                      <ScoreRing score={result.overallScore} size={90} label="Overall" />
                      <div>
                        <p className="font-bold text-white">Profile Score</p>
                        <p className="text-sm text-white/50">
                          {result.overallScore >= 80 ? 'Excellent profile!' : result.overallScore >= 60 ? 'Good, room to improve' : 'Needs significant work'}
                        </p>
                      </div>
                    </div>

                    {/* Section results */}
                    {(['headline', 'about', 'experience', 'skills'] as Section[]).map(sec => (
                      result[sec] && <SectionResult key={sec} section={sec} result={result} />
                    ))}

                    {/* General tips */}
                    {result.generalTips?.length > 0 && (
                      <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
                        <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Pro Tips
                        </h3>
                        <ul className="space-y-1.5">
                          {result.generalTips.map((tip, i) => (
                            <li key={i} className="text-sm text-white/65 flex items-start gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />{tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
                      <Linkedin className="w-8 h-8 text-cyan-400/50" />
                    </div>
                    <p className="text-white/40 font-medium mb-1">No optimization yet</p>
                    <p className="text-white/25 text-sm">Fill in your profile sections and optimize</p>
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
