import { useState } from 'react';
import { Target, Sparkles, Mail, Copy, Check, Download } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { generateCoverLetter, tailorCVToJob } from '../../services/geminiService';
import { Button } from '../ui/ui';
import { ToolShell } from './ToolShell';
import { CVImporter } from './CVImporter';
import { CVResultPanel } from './CVResultPanel';

export function TailorView({
  data,
  templateId,
  accent,
  locale,
  onOpenInBuilder,
}: {
  data: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  onOpenInBuilder: (cv: CVData) => void;
}) {
  const t = useT();
  const [cv, setCv] = useState<CVData | null>(null);
  const [job, setJob] = useState('');
  const [tailored, setTailored] = useState<CVData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [letterBusy, setLetterBusy] = useState(false);
  const [letterError, setLetterError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onTailor = async () => {
    if (!cv || !job.trim()) return;
    setError(null);
    setBusy(true);
    try {
      setTailored(await tailorCVToJob(JSON.stringify(cv), job.trim()));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  const onGenerateLetter = async () => {
    if (!cv || !job.trim()) return;
    setLetterError(null);
    setLetterBusy(true);
    try {
      setCoverLetter(await generateCoverLetter(tailored || cv, job.trim()));
    } catch (e: any) {
      setLetterError(e?.message ?? t.common.errorGeneric);
    } finally {
      setLetterBusy(false);
    }
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setLetterError(t.common.errorGeneric);
    }
  };

  const downloadLetter = () => {
    const name = (tailored || cv)?.personalInfo.fullName?.trim() || 'candidat';
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lettre-motivation-${name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell icon={<Target className="h-7 w-7" />} title={t.tailor.title} subtitle={t.tailor.subtitle}>
      {!cv ? (
        <CVImporter onReady={setCv} currentData={data} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-ink-700">{t.tailor.jobLabel}</label>
              <textarea
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder={t.tailor.jobPlaceholder}
                rows={12}
                className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                className="mt-3 w-full"
                size="lg"
                loading={busy}
                disabled={!job.trim()}
                icon={<Sparkles className="h-5 w-5" />}
                onClick={onTailor}
              >
                {t.tailor.tailorBtn}
              </Button>
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-ink-950">{t.tailor.coverLetterTitle}</h3>
                  <p className="text-sm text-ink-600">{t.tailor.coverLetterDesc}</p>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                variant="dark"
                loading={letterBusy}
                disabled={!job.trim()}
                icon={<Sparkles className="h-4 w-4" />}
                onClick={onGenerateLetter}
              >
                {t.tailor.coverLetterBtn}
              </Button>
              {letterError && <p className="mt-2 text-xs text-rose-600">{letterError}</p>}

              {coverLetter && (
                <div className="mt-4">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={14}
                    className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" icon={copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} onClick={copyLetter}>
                      {copied ? t.tailor.coverLetterCopied : t.tailor.coverLetterCopy}
                    </Button>
                    <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={downloadLetter}>
                      {t.tailor.coverLetterDownload}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {tailored ? (
            <CVResultPanel
              cv={tailored}
              templateId={templateId}
              accent={accent}
              locale={locale}
              onOpenInBuilder={() => onOpenInBuilder(tailored)}
            />
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-ink-200 bg-white/50 p-10 text-center text-ink-400">
              <div>
                <Target className="mx-auto h-10 w-10 text-ink-300" />
                <p className="mt-3 text-sm">{t.tailor.subtitle}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
