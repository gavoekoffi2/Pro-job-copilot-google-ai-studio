import { useState } from 'react';
import { Target, Sparkles } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { tailorCVToJob } from '../../services/geminiService';
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
