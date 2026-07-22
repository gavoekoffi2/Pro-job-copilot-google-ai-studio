import { useState } from 'react';
import { Check, Copy, Download, FileText, Mail, RotateCcw, Sparkles, UserRound } from 'lucide-react';
import type { CVData } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { generateCoverLetter } from '../../services/geminiService';
import { Button } from '../ui/ui';
import { ToolShell } from './ToolShell';
import { CVImporter } from './CVImporter';

export function CoverLetterView({ data }: { data: CVData }) {
  const t = useT();
  const [cv, setCv] = useState<CVData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!cv || !jobDescription.trim()) return;
    setError(null);
    setBusy(true);
    try {
      setCoverLetter(await generateCoverLetter(cv, jobDescription.trim()));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(t.common.errorGeneric);
    }
  };

  const downloadLetter = () => {
    if (!coverLetter) return;
    const candidate = cv?.personalInfo.fullName.trim() || 'candidat';
    const safeName = candidate
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lettre-motivation-${safeName || 'candidat'}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const changeCv = () => {
    setCv(null);
    setCoverLetter('');
    setError(null);
  };

  return (
    <ToolShell icon={<Mail className="h-7 w-7" />} title={t.coverLetter.title} subtitle={t.coverLetter.subtitle}>
      {!cv ? (
        <div>
          <div className="mb-5 rounded-2xl border border-brand-100 bg-brand-50/70 p-5">
            <p className="font-display text-lg font-bold text-ink-950">{t.coverLetter.importTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{t.coverLetter.importHelp}</p>
          </div>
          <CVImporter onReady={setCv} currentData={data} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.coverLetter.selectedCv}</p>
                    <p className="truncate font-bold text-ink-900">{cv.personalInfo.fullName || t.coverLetter.unnamedCandidate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<RotateCcw className="h-4 w-4" />} onClick={changeCv}>
                  {t.coverLetter.changeCv}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-700">
                <FileText className="h-4 w-4 text-brand-600" />
                {t.coverLetter.jobLabel}
              </label>
              <p className="mb-3 text-xs leading-relaxed text-ink-500">{t.coverLetter.jobHelp}</p>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder={t.coverLetter.jobPlaceholder}
                rows={14}
                className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                className="mt-3 w-full"
                size="lg"
                loading={busy}
                disabled={!jobDescription.trim()}
                icon={<Sparkles className="h-5 w-5" />}
                onClick={generate}
              >
                {t.coverLetter.generateButton}
              </Button>
              {error && <p className="mt-2 text-sm text-rose-600" role="alert">{error}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-ink-950">{t.coverLetter.resultTitle}</h2>
                <p className="mt-1 text-sm text-ink-500">{t.coverLetter.resultHelp}</p>
              </div>
              {coverLetter && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" icon={copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} onClick={copyLetter}>
                    {copied ? t.coverLetter.copied : t.coverLetter.copy}
                  </Button>
                  <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={downloadLetter}>
                    {t.coverLetter.download}
                  </Button>
                </div>
              )}
            </div>

            {coverLetter ? (
              <textarea
                aria-label={t.coverLetter.resultTitle}
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                rows={25}
                className="mt-5 w-full resize-y rounded-xl border border-ink-200 bg-ink-50/40 px-4 py-4 text-sm leading-7 text-ink-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            ) : (
              <div className="mt-5 grid min-h-[420px] place-items-center rounded-2xl border-2 border-dashed border-ink-100 bg-ink-50/60 p-8 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <Mail className="h-7 w-7" />
                  </span>
                  <p className="mt-4 font-bold text-ink-800">{t.coverLetter.emptyTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{t.coverLetter.emptyHelp}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </ToolShell>
  );
}
