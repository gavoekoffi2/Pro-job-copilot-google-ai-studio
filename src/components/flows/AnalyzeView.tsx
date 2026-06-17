import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ScanSearch,
  Tags,
  Wand2,
} from 'lucide-react';
import type { AnalysisResult, CVData, Locale, TemplateId } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { analyzeCVContent, applyModifications } from '../../services/geminiService';
import { Button, Spinner } from '../ui/ui';
import { ToolShell } from './ToolShell';
import { CVImporter } from './CVImporter';
import { CVResultPanel } from './CVResultPanel';

export function AnalyzeView({
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
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [busy, setBusy] = useState<null | 'analyze' | 'refine'>(null);
  const [refine, setRefine] = useState('');
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (c: CVData) => {
    setError(null);
    setBusy('analyze');
    try {
      setAnalysis(await analyzeCVContent(JSON.stringify(c)));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const onReady = (c: CVData) => {
    setCv(c);
    runAnalysis(c);
  };

  const onRefine = async () => {
    if (!cv || !refine.trim()) return;
    setError(null);
    setBusy('refine');
    try {
      const updated = await applyModifications(cv, refine.trim());
      setCv(updated);
      setRefine('');
      await runAnalysis(updated);
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
      setBusy(null);
    }
  };

  return (
    <ToolShell icon={<ScanSearch className="h-7 w-7" />} title={t.analyze.title} subtitle={t.analyze.subtitle}>
      {!cv ? (
        <CVImporter onReady={onReady} currentData={data} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Diagnostic + affinage */}
          <div className="space-y-5">
            {busy === 'analyze' && !analysis ? (
              <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-6 text-ink-500">
                <Spinner /> {t.common.analyzing}
              </div>
            ) : analysis ? (
              <AnalysisCard analysis={analysis} t={t} loading={busy === 'analyze'} />
            ) : null}

            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
                <Wand2 className="h-5 w-5 text-brand-600" />
                {t.analyze.refineTitle}
              </h3>
              <p className="mt-1 text-sm text-ink-500">{t.analyze.refineHint}</p>
              <textarea
                value={refine}
                onChange={(e) => setRefine(e.target.value)}
                placeholder={t.analyze.refinePlaceholder}
                rows={3}
                className="mt-3 w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                className="mt-3 w-full"
                icon={<Wand2 className="h-4 w-4" />}
                loading={busy === 'refine'}
                disabled={!refine.trim()}
                onClick={onRefine}
              >
                {t.common.apply}
              </Button>
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            </div>
          </div>

          {/* Aperçu live du CV */}
          <CVResultPanel
            cv={cv}
            templateId={templateId}
            accent={accent}
            locale={locale}
            onOpenInBuilder={() => onOpenInBuilder(cv)}
          />
        </div>
      )}
    </ToolShell>
  );
}

function AnalysisCard({
  analysis,
  t,
  loading,
}: {
  analysis: AnalysisResult;
  t: any;
  loading: boolean;
}) {
  return (
    <div className={`space-y-5 rounded-2xl border border-ink-100 bg-white p-5 ${loading ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-5">
        <ScoreGauge value={analysis.score} />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{t.analyze.scoreLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">{analysis.summary}</p>
        </div>
      </div>

      <ListBlock icon={<CheckCircle2 className="h-4 w-4" />} color="text-brand-600" title={t.analyze.strengths} items={analysis.strengths} />
      <ListBlock icon={<AlertTriangle className="h-4 w-4" />} color="text-amber-600" title={t.analyze.weaknesses} items={analysis.weaknesses} />
      <ListBlock icon={<Lightbulb className="h-4 w-4" />} color="text-blue-600" title={t.analyze.suggestions} items={analysis.suggestions} />

      {analysis.keywords?.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-violet-600">
            <Tags className="h-4 w-4" /> {t.analyze.keywords}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.map((k, i) => (
              <span key={i} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListBlock({
  icon,
  color,
  title,
  items,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className={`mb-2 flex items-center gap-1.5 text-sm font-bold ${color}`}>
        {icon} {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-600">
            <span className={`mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-current ${color}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreGauge({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative grid h-24 w-24 shrink-0 place-items-center">
      <svg width="96" height="96" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#eef0f3" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.max(0, Math.min(100, value)) / 100) * c}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute font-display text-2xl font-extrabold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
