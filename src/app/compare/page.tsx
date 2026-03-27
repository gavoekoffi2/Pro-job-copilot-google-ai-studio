'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Plus, X, Sparkles, AlertCircle, Trophy, TrendingUp,
  DollarSign, Zap, HelpCircle, ChevronDown, ChevronUp, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { compareJobOffers } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { JobOffer, OfferComparison } from '@/types';

const CARD_COLORS = [
  { borderTop: 'border-t-blue-500',  glow: 'ring-blue-500/30',  tag: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { borderTop: 'border-t-green-500', glow: 'ring-green-500/30', tag: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { borderTop: 'border-t-amber-500', glow: 'ring-amber-500/30', tag: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];
const SCORE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];

function emptyOffer(): JobOffer {
  return { id: Math.random().toString(36).slice(2), company: '', role: '', baseSalary: 0, bonus: 0, equity: '', location: '', remote: 'hybrid', benefits: '', notes: '' };
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/50">{label}</span>
        <span className="font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100,score)}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}

function OfferCard({ offer, index, onChange, onDelete, isWinner }: {
  offer: JobOffer; index: number;
  onChange: (id: string, key: keyof JobOffer, value: string | number) => void;
  onDelete: (id: string) => void; isWinner: boolean;
}) {
  const c = CARD_COLORS[index];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}
      className={`glass rounded-2xl overflow-hidden border-t-2 ${c.borderTop} ${isWinner ? `ring-2 ${c.glow}` : ''} relative`}>
      {isWinner && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold z-10 whitespace-nowrap">
          <Trophy className="w-3 h-3" />Best Offer
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <input value={offer.company} onChange={e => onChange(offer.id, 'company', e.target.value)} placeholder="Company name" className="input-glass flex-1 px-3 py-2 text-sm font-bold placeholder:font-normal" />
          <button onClick={() => onDelete(offer.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <input value={offer.role} onChange={e => onChange(offer.id, 'role', e.target.value)} placeholder="Role title" className="input-glass w-full px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-white/40 mb-1">Base Salary ($/yr)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
              <input type="number" value={offer.baseSalary || ''} onChange={e => onChange(offer.id, 'baseSalary', parseInt(e.target.value) || 0)} placeholder="120000" className="input-glass w-full pl-7 pr-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1">Bonus %</label>
            <input type="number" min="0" max="100" value={offer.bonus || ''} onChange={e => onChange(offer.id, 'bonus', parseInt(e.target.value) || 0)} placeholder="10" className="input-glass w-full px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-white/40 mb-1">Equity / RSUs</label>
          <input value={offer.equity} onChange={e => onChange(offer.id, 'equity', e.target.value)} placeholder="10,000 RSUs over 4 years" className="input-glass w-full px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-white/40 mb-1">Location</label>
            <input value={offer.location} onChange={e => onChange(offer.id, 'location', e.target.value)} placeholder="San Francisco" className="input-glass w-full px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1">Work Style</label>
            <select value={offer.remote} onChange={e => onChange(offer.id, 'remote', e.target.value)} className="input-glass w-full px-3 py-2 text-sm">
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
              <option value="fully-remote">Remote</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-white/40 mb-1">Benefits highlights</label>
          <input value={offer.benefits} onChange={e => onChange(offer.id, 'benefits', e.target.value)} placeholder="Health, 401k, unlimited PTO..." className="input-glass w-full px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-[10px] text-white/40 mb-1">Notes</label>
          <textarea value={offer.notes} onChange={e => onChange(offer.id, 'notes', e.target.value)} placeholder="Culture, growth potential, gut feeling..." rows={2} className="input-glass w-full px-3 py-2 text-sm resize-none" />
        </div>
        {offer.baseSalary > 0 && (
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${c.tag}`}>
            <span className="text-xs font-medium">Est. total comp</span>
            <span className="text-sm font-black">${Math.round(offer.baseSalary * (1 + offer.bonus / 100)).toLocaleString()}/yr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AnalysisSection({ result, offers }: { result: OfferComparison; offers: JobOffer[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-6">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-0.5">AI Recommendation</p>
            <h2 className="text-xl font-black text-white">Best overall: <span className="text-amber-300">{result.winner}</span></h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, i) => {
          const analysis = result.analyses[offer.company];
          if (!analysis) return null;
          const color = SCORE_COLORS[i];
          const isWinner = offer.company === result.winner;
          return (
            <div key={offer.id} className={`glass rounded-xl p-5 ${isWinner ? 'ring-2 ring-amber-500/40' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">{offer.company}</h3>
                {isWinner && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Winner</span>}
              </div>
              <div className="space-y-2.5 mb-4">
                <ScoreBar label="Financial" score={analysis.financialScore} color={color} />
                <ScoreBar label="Career Growth" score={analysis.growthScore} color={color} />
                <ScoreBar label="Work-Life" score={analysis.workLifeScore} color={color} />
                <ScoreBar label="Overall" score={analysis.overallScore} color={color} />
              </div>
              <div className="pt-3 border-t border-white/8 mb-3">
                <p className="text-xs text-white/50 mb-1">5-Year Total Comp</p>
                <p className="text-lg font-black" style={{ color }}>${analysis.fiveYearComp.toLocaleString()}</p>
              </div>
              {analysis.pros.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wider mb-1">Pros</p>
                  {analysis.pros.map((p, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-white/60 mb-1"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{p}</div>
                  ))}
                </div>
              )}
              {analysis.cons.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">Cons</p>
                  {analysis.cons.map((c, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-white/60 mb-1"><X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{c}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass rounded-xl p-5 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-white text-sm">Full AI Analysis</h3>
        </div>
        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{result.recommendation}</p>
      </div>

      {Object.keys(result.questionsToAsk).length > 0 && (
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Questions to Ask Before Deciding</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(result.questionsToAsk).map(([company, questions]) => (
              <div key={company} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === company ? null : company)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-sm font-semibold text-white">{company}</span>
                  {expanded === company ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </button>
                <AnimatePresence>
                  {expanded === company && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <ul className="px-4 pb-4 space-y-2 border-t border-white/6 pt-3">
                        {questions.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>{q}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ComparePage() {
  const [offers, setOffers] = useState<JobOffer[]>([emptyOffer(), emptyOffer()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfferComparison | null>(null);
  const [error, setError] = useState('');

  const addOffer = () => { if (offers.length >= 3) return; setOffers(p => [...p, emptyOffer()]); setResult(null); };
  const deleteOffer = (id: string) => { if (offers.length <= 1) return; setOffers(p => p.filter(o => o.id !== id)); setResult(null); };
  const updateOffer = (id: string, key: keyof JobOffer, value: string | number) => {
    setOffers(p => p.map(o => o.id === id ? { ...o, [key]: value } : o));
    setResult(null);
  };

  const canCompare = offers.length >= 2 && offers.every(o => o.company && o.role && o.baseSalary > 0);

  const handleCompare = async () => {
    if (!canCompare) { toast.error('Fill in Company, Role and Salary for all offers'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const comparison = await compareJobOffers(offers);
      setResult(comparison);
      addActivity('salary', `Compared ${offers.length} job offers (${offers.map(o => o.company).join(', ')})`);
      toast.success('Analysis complete!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Comparison failed. Please try again.';
      setError(msg); toast.error('Comparison failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Job Offer <GradientText variant="primary">Comparator</GradientText></h1>
                <p className="text-white/50 text-sm">Side-by-side AI analysis with 5-year financial projections</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <AnimatePresence>
              {offers.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} index={i} onChange={updateOffer} onDelete={deleteOffer} isWinner={result?.winner === offer.company} />
              ))}
            </AnimatePresence>
            {offers.length < 3 && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={addOffer}
                className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-3 p-8 text-white/40 hover:text-white/70 transition-all group min-h-[200px]">
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Add {offers.length === 2 ? 'Third' : 'Second'} Offer</span>
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-2">
            <Button onClick={handleCompare} loading={loading} icon={<Sparkles className="w-4 h-4" />} size="lg" className="min-w-[220px]">
              {loading ? 'Analyzing with Gemini AI...' : 'Compare Offers with AI'}
            </Button>
            {!canCompare && !loading && (
              <p className="text-xs text-white/30">Fill in Company, Role & Salary for all offers to compare</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 mt-4">
              <AILoadingSkeleton />
            </motion.div>
          )}

          {result && !loading && <AnalysisSection result={result} offers={offers} />}

          {!result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 glass rounded-xl p-4 border border-amber-500/10">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-1">Pro tip</p>
                  <p className="text-xs text-white/50">Add your gut feelings and culture notes — the AI considers qualitative factors alongside the financials for a more nuanced recommendation.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
