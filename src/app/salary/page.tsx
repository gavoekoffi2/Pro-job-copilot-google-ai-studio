'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Sparkles, AlertCircle, Copy, Check, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { GradientText } from '@/components/ui/GradientText';
import { getSalaryInsights } from '@/lib/gemini';
import { addActivity } from '@/lib/storage';
import type { SalaryInsights } from '@/types';

const companySizes = ['Startup (<50)', 'SMB (50-500)', 'Mid-market (500-5K)', 'Enterprise (5K+)', 'FAANG/Big Tech'];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all">
      {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" />Copy</>}
    </button>
  );
}

function SalaryBar({ market }: { market: SalaryInsights['marketRange'] }) {
  const fmt = (n: number) => `$${Math.round(n / 1000)}K`;
  const pct = (val: number) => ((val - market.min) / (market.max - market.min)) * 100;

  return (
    <div className="py-4">
      <div className="relative h-6 mb-3">
        <div className="absolute inset-y-0 left-0 right-0 h-2 top-2 bg-white/8 rounded-full" />
        <motion.div
          className="absolute h-2 top-2 rounded-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', left: 0, right: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Median marker */}
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-purple-500 top-1 -translate-x-1/2 shadow-glow"
          initial={{ left: '50%', opacity: 0 }}
          animate={{ left: `${pct(market.median)}%`, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="text-white/50 text-xs mb-0.5">Minimum</div>
          <div className="font-bold text-white">{fmt(market.min)}</div>
        </div>
        <div className="text-center">
          <div className="text-purple-400 text-xs mb-0.5 font-semibold">Median ●</div>
          <div className="font-black text-white text-lg">{fmt(market.median)}</div>
        </div>
        <div className="text-center">
          <div className="text-white/50 text-xs mb-0.5">Maximum</div>
          <div className="font-bold text-white">{fmt(market.max)}</div>
        </div>
      </div>
    </div>
  );
}

export default function SalaryPage() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryInsights | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'script' | 'email' | 'tips'>('script');

  const handleAnalyze = async () => {
    if (!role.trim() || !location.trim() || !experience) {
      toast.error('Please fill in role, location, and experience');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const insights = await getSalaryInsights(
        role, location, parseInt(experience),
        currentOffer ? parseInt(currentOffer) : undefined,
        companySize || undefined
      );
      setResult(insights);
      addActivity('salary', `Salary insights for ${role} in ${location}`);
      toast.success('Salary insights ready!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to get insights.';
      setError(msg);
      toast.error('Failed to get salary insights');
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
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Salary <GradientText variant="primary">Negotiator</GradientText>
                </h1>
                <p className="text-white/50 text-sm">Know your market value and negotiate with confidence</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <div className="glass rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Job Title *</label>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Senior Software Engineer" className="input-glass w-full px-4 py-2.5 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Location *</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA" className="input-glass w-full px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Years Exp *</label>
                    <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="5" min={0} max={40} className="input-glass w-full px-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Current Offer <span className="text-white/30 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                    <input type="number" value={currentOffer} onChange={e => setCurrentOffer(e.target.value)} placeholder="120000" className="input-glass w-full pl-7 pr-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Company Size</label>
                  <div className="flex flex-wrap gap-2">
                    {companySizes.map(size => (
                      <button
                        key={size} onClick={() => setCompanySize(companySize === size ? '' : size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${companySize === size ? 'bg-emerald-500/25 border-emerald-500/40 text-white' : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8'}`}
                      >{size}</button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                </div>
              )}

              <Button onClick={handleAnalyze} loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full" size="lg">
                {loading ? 'Analyzing Market...' : 'Get Salary Insights'}
              </Button>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass rounded-xl p-6 min-h-[400px]">
                {loading ? (
                  <AILoadingSkeleton />
                ) : result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {/* Salary range bar */}
                    <div>
                      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Market Range ({result.currency})
                      </h3>
                      <SalaryBar market={result.marketRange} />
                    </div>

                    {/* Tabs */}
                    <div>
                      <div className="flex gap-1 p-1 bg-white/4 rounded-xl mb-4">
                        {(['script', 'email', 'tips'] as const).map(tab => (
                          <button
                            key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${activeTab === tab ? 'bg-purple-500/30 text-white' : 'text-white/40 hover:text-white/70'}`}
                          >{tab === 'script' ? 'Negotiation Script' : tab === 'email' ? 'Email Template' : 'Tips'}</button>
                        ))}
                      </div>

                      {activeTab === 'script' && (
                        <div className="p-4 rounded-xl bg-white/4 relative">
                          <CopyButton text={result.negotiationScript} />
                          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{result.negotiationScript}</p>
                        </div>
                      )}
                      {activeTab === 'email' && (
                        <div className="p-4 rounded-xl bg-white/4 relative">
                          <CopyButton text={result.emailTemplate} />
                          <pre className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap font-sans">{result.emailTemplate}</pre>
                        </div>
                      )}
                      {activeTab === 'tips' && (
                        <ul className="space-y-2">
                          {[...result.talkingPoints, ...result.tips].map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{tip}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <DollarSign className="w-8 h-8 text-emerald-400/50" />
                    </div>
                    <p className="text-white/40 font-medium mb-1">No insights yet</p>
                    <p className="text-white/25 text-sm">Fill in the form to get your salary insights</p>
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
