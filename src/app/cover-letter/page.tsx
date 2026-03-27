'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { AIStreamOutput } from '@/components/features/AIStreamOutput';
import { generateCoverLetter } from '@/lib/gemini';
import { incrementStat, addActivity } from '@/lib/storage';
import type { CoverLetterTone } from '@/types';

const tones: { value: CoverLetterTone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional',  desc: 'Formal business tone' },
  { value: 'enthusiastic', label: 'Enthusiastic',  desc: 'Warm & passionate' },
  { value: 'concise',      label: 'Concise',        desc: 'Short & direct (≤300w)' },
];

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState<CoverLetterTone>('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please fill in both resume and job description');
      return;
    }
    if (!company.trim() || !role.trim()) {
      toast.error('Please enter company name and role title');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const letter = await generateCoverLetter(resumeText, jobDescription, company, role, tone);
      setResult(letter);
      incrementStat('coverLettersGenerated');
      addActivity('cover-letter', `Generated cover letter for ${role} at ${company}`);
      toast.success('Cover letter generated!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Generation failed. Please try again.';
      setError(msg);
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Cover Letter <GradientText variant="primary">Generator</GradientText>
                </h1>
                <p className="text-white/50 text-sm">AI-crafted personalized cover letters in seconds</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Inputs */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              {/* Company + Role */}
              <div className="glass rounded-xl p-5">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Job Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Company *</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Google, Stripe..."
                      className="input-glass w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Role Title *</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Software Engineer"
                      className="input-glass w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Tone selector */}
              <div className="glass rounded-xl p-5">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Tone</h2>
                <div className="grid grid-cols-3 gap-2">
                  {tones.map(({ value, label, desc }) => (
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

              {/* Resume */}
              <div className="glass rounded-xl p-5">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Your Resume *
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="input-glass w-full h-36 p-3 text-sm resize-none font-mono"
                  spellCheck={false}
                />
              </div>

              {/* Job Description */}
              <div className="glass rounded-xl p-5">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="input-glass w-full h-36 p-3 text-sm resize-none"
                  spellCheck={false}
                />
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
                {loading ? 'Generating with Gemini AI...' : 'Generate Cover Letter'}
              </Button>
            </motion.div>

            {/* Right — Output */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <AIStreamOutput
                content={result}
                isLoading={loading}
                title="Your Cover Letter"
                allowCopy
                allowDownload
                downloadFilename={`cover-letter-${company || 'company'}.txt`}
                preformatted
                className="h-full min-h-[600px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
