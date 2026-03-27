'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { GradientText } from '@/components/ui/GradientText';
import { getInterviewQuestions, evaluateInterviewAnswer } from '@/lib/gemini';
import { incrementStat, addActivity } from '@/lib/storage';
import type { InterviewQuestion, AnswerFeedback } from '@/types';

const levelOptions = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Principal'];
const companyTypes = ['Startup', 'Scale-up', 'Enterprise', 'FAANG', 'Consulting', 'Agency'];
const SESSION_KEY = 'pjc_interview_session';

const typeBadgeVariant = {
  behavioral: 'primary' as const,
  technical: 'accent' as const,
  situational: 'warning' as const,
};

export default function InterviewCoachPage() {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('Mid-level');
  const [companyType, setCompanyType] = useState('Startup');
  const [setupLoading, setSetupLoading] = useState(false);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, AnswerFeedback>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'practice' | 'results'>('setup');

  // ── Restore session on mount ────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const { questions: q, answers: a, feedbacks: f, currentIdx: idx, phase: p, role: r, level: l, companyType: c } = JSON.parse(saved);
        if (q?.length && p !== 'setup') {
          setQuestions(q); setAnswers(a ?? {}); setFeedbacks(f ?? {});
          setCurrentIdx(idx ?? 0); setPhase(p); setRole(r ?? ''); setLevel(l ?? 'Mid-level'); setCompanyType(c ?? 'Startup');
          toast.success('Session précédente restaurée', { duration: 2500 });
        }
      }
    } catch { /* ignore corrupted session */ }
  }, []);

  // ── Persist session on change ───────────────────────────────
  useEffect(() => {
    if (phase === 'setup') {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ questions, answers, feedbacks, currentIdx, phase, role, level, companyType }));
    } catch { /* storage full */ }
  }, [questions, answers, feedbacks, currentIdx, phase, role, level, companyType]);

  const currentQ = questions[currentIdx];
  const currentAnswer = answers[currentQ?.id ?? ''] ?? '';
  const currentFeedback = feedbacks[currentQ?.id ?? ''];

  const totalScore = Object.values(feedbacks).length > 0
    ? Math.round(Object.values(feedbacks).reduce((sum, f) => sum + f.score, 0) / Object.values(feedbacks).length)
    : 0;

  const handleStart = async () => {
    if (!role.trim()) { toast.error("Entrez le poste pour lequel vous passez l'entretien"); return; }
    setSetupLoading(true);
    try {
      const qs = await getInterviewQuestions(role, level, companyType);
      setQuestions(qs);
      setCurrentIdx(0);
      setAnswers({});
      setFeedbacks({});
      setPhase('practice');
      addActivity('interview', `Started interview practice for ${role} (${level})`);
    } catch {
      toast.error('Génération des questions échouée — réessayez');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!currentAnswer.trim()) { toast.error('Rédigez votre réponse avant de la faire évaluer'); return; }
    setEvaluating(true);
    try {
      const feedback = await evaluateInterviewAnswer(currentQ.question, currentAnswer, role);
      setFeedbacks(prev => ({ ...prev, [currentQ.id]: feedback }));
    } catch {
      toast.error('Évaluation échouée — réessayez');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      incrementStat('interviewsCompleted');
      setPhase('results');
    }
  };

  const handleReset = () => {
    localStorage.removeItem(SESSION_KEY);
    setPhase('setup');
    setQuestions([]);
    setAnswers({});
    setFeedbacks({});
    setCurrentIdx(0);
  };

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Interview <GradientText variant="primary">Coach</GradientText>
                </h1>
                <p className="text-white/50 text-sm">AI-powered interview practice with real-time feedback</p>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Setup */}
            {phase === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="glass rounded-xl p-8 max-w-xl mx-auto">
                  <h2 className="font-bold text-white text-lg mb-6 text-center">Configure Your Practice Session</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Role you're interviewing for *</label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g. Senior React Developer, Product Manager"
                        className="input-glass w-full px-4 py-3 text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleStart()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Experience Level</label>
                      <div className="flex flex-wrap gap-2">
                        {levelOptions.map(l => (
                          <button
                            key={l} onClick={() => setLevel(l)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                              level === l ? 'bg-purple-500/25 border-purple-500/40 text-white' : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8'
                            }`}
                          >{l}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Company Type</label>
                      <div className="flex flex-wrap gap-2">
                        {companyTypes.map(c => (
                          <button
                            key={c} onClick={() => setCompanyType(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                              companyType === c ? 'bg-pink-500/25 border-pink-500/40 text-white' : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8'
                            }`}
                          >{c}</button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleStart} loading={setupLoading} icon={<Sparkles className="w-4 h-4" />} className="w-full" size="lg">
                      {setupLoading ? 'Generating Questions...' : 'Start Practice Session (10 Questions)'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Practice */}
            {phase === 'practice' && currentQ && (
              <motion.div key="practice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Progress */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-white/50 shrink-0 tabular-nums">
                    {currentIdx + 1} / {questions.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Question + answer */}
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant={typeBadgeVariant[currentQ.type]}>{currentQ.type}</Badge>
                        <span className="text-xs text-white/40">Question {currentIdx + 1}</span>
                      </div>
                      <p className="text-white font-semibold text-base leading-relaxed mb-4">{currentQ.question}</p>
                      <div className="p-3 rounded-lg bg-purple-500/8 border border-purple-500/20">
                        <p className="text-xs text-purple-300 font-medium mb-1">Tip</p>
                        <p className="text-xs text-white/60 leading-relaxed">{currentQ.tip}</p>
                      </div>
                    </div>
                    <div className="glass rounded-xl p-5">
                      <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Your Answer</label>
                      <textarea
                        value={currentAnswer}
                        onChange={e => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                        placeholder="Type your answer here... Use the STAR method for behavioral questions: Situation, Task, Action, Result."
                        className="input-glass w-full h-40 p-3 text-sm resize-none"
                        spellCheck
                      />
                      <div className="mt-3 flex gap-2">
                        <Button onClick={handleEvaluate} loading={evaluating} variant="secondary" icon={<Sparkles className="w-4 h-4 text-purple-400" />} className="flex-1">
                          {evaluating ? 'Evaluating...' : 'Get AI Feedback'}
                        </Button>
                        <Button onClick={handleNext} variant="ghost" icon={currentIdx === questions.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />} iconPosition="right">
                          {currentIdx === questions.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="glass rounded-xl p-6 min-h-[300px]">
                    {evaluating ? (
                      <AILoadingSkeleton />
                    ) : currentFeedback ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <ScoreRing score={currentFeedback.score} size={80} showPercent={false} />
                          <div>
                            <div className="text-2xl font-black text-white">{currentFeedback.score}/100</div>
                            <p className="text-sm text-white/60">{currentFeedback.overallFeedback}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                          </h3>
                          <ul className="space-y-1">
                            {currentFeedback.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-white/70 flex gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Improve
                          </h3>
                          <ul className="space-y-1">
                            {currentFeedback.improvements.map((s, i) => (
                              <li key={i} className="text-sm text-white/70 flex gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/8 border border-purple-500/20">
                          <p className="text-xs font-medium text-purple-300 mb-1">Sample Strong Answer</p>
                          <p className="text-xs text-white/60 leading-relaxed">{currentFeedback.sampleAnswer}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                        <MessageSquare className="w-10 h-10 text-white/15 mb-3" />
                        <p className="text-sm text-white/30">Write your answer and click<br/>Get AI Feedback</p>
                      </div>
                    )}
                  </div>
                </div>

                {currentIdx > 0 && (
                  <button onClick={() => setCurrentIdx(prev => prev - 1)} className="mt-4 flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Previous question
                  </button>
                )}
              </motion.div>
            )}

            {/* Results */}
            {phase === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="glass rounded-2xl p-10 max-w-lg mx-auto">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                    <ScoreRing score={totalScore} size={140} label="Overall Score" className="mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white mb-2">Session Complete!</h2>
                  <p className="text-white/50 mb-2">You answered {Object.keys(feedbacks).length} of {questions.length} questions</p>
                  <p className="text-white/60 text-sm mb-8">
                    {totalScore >= 80 ? 'Excellent! You\'re well-prepared.' : totalScore >= 60 ? 'Good progress — keep practicing!' : 'Keep practicing to improve your score.'}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {questions.map((q, i) => {
                      const fb = feedbacks[q.id];
                      return (
                        <div key={q.id} className={`p-3 rounded-xl border text-xs ${fb ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-white/4 border-white/8 text-white/40'}`}>
                          Q{i + 1}: {fb ? `${fb.score}/100` : 'Skipped'}
                        </div>
                      );
                    })}
                  </div>
                  <Button onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />} variant="secondary" className="w-full">
                    Practice Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
