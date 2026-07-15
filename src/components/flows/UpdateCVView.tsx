import { useState, type ReactNode } from 'react';
import { CheckCircle2, FileUp, LayoutTemplate, RefreshCw, Wand2 } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { applyModifications } from '../../services/geminiService';
import { Button } from '../ui/ui';
import { ToolShell } from './ToolShell';
import { CVImporter } from './CVImporter';
import { CVResultPanel } from './CVResultPanel';
import { DesignPanel } from '../builder/DesignPanel';

export function UpdateCVView({
  data,
  templateId,
  setTemplateId,
  accent,
  setAccent,
  locale,
  onOpenInBuilder,
}: {
  data: CVData;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  accent: string;
  setAccent: (color: string) => void;
  locale: Locale;
  onOpenInBuilder: (cv: CVData) => void;
}) {
  const t = useT();
  const [cv, setCv] = useState<CVData | null>(null);
  const [instruction, setInstruction] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fontScale = cv?.formatting?.fontScale ?? 1;
  const setFontScale = (scale: number) => setCv((current) => current ? {
    ...current,
    formatting: { ...current.formatting, fontScale: scale },
  } : current);

  const onReady = (parsed: CVData) => {
    setCv(parsed);
    setDone(false);
    setError(null);
  };

  const onUpdate = async () => {
    if (!cv || !instruction.trim()) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const updated = await applyModifications(cv, instruction.trim());
      setCv(updated);
      setInstruction('');
      setDone(true);
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell icon={<RefreshCw className="h-7 w-7" />} title={t.update.title} subtitle={t.update.subtitle}>
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <StepCard index="1" icon={<FileUp className="h-5 w-5" />} title={t.update.stepImportTitle} text={t.update.stepImportText} active={!cv} />
        <StepCard index="2" icon={<Wand2 className="h-5 w-5" />} title={t.update.stepInstructionTitle} text={t.update.stepInstructionText} active={Boolean(cv) && !done} />
        <StepCard index="3" icon={<LayoutTemplate className="h-5 w-5" />} title={t.update.stepTemplateTitle} text={t.update.stepTemplateText} active={Boolean(cv)} />
      </div>

      {!cv ? (
        <CVImporter onReady={onReady} currentData={data} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,440px)_1fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
                <Wand2 className="h-5 w-5 text-brand-600" />
                {t.update.instructionTitle}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{t.update.instructionHelp}</p>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={t.update.instructionPlaceholder}
                rows={5}
                className="mt-4 w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                className="mt-3 w-full"
                icon={<Wand2 className="h-4 w-4" />}
                loading={busy}
                disabled={!instruction.trim()}
                onClick={onUpdate}
              >
                {t.update.applyUpdate}
              </Button>
              {done && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {t.update.updateDone}
                </p>
              )}
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
                <LayoutTemplate className="h-5 w-5 text-brand-600" />
                {t.update.templateChoiceTitle}
              </h3>
              <DesignPanel
                templateId={templateId}
                setTemplateId={setTemplateId}
                accent={accent}
                setAccent={setAccent}
                data={cv}
                locale={locale}
                fontScale={fontScale}
                setFontScale={setFontScale}
              />
            </div>
          </div>

          <CVResultPanel
            cv={cv}
            templateId={templateId}
            accent={accent}
            locale={locale}
            fontScale={fontScale}
            onOpenInBuilder={() => onOpenInBuilder(cv)}
          />
        </div>
      )}
    </ToolShell>
  );
}

function StepCard({
  index,
  icon,
  title,
  text,
  active,
}: {
  index: string;
  icon: ReactNode;
  title: string;
  text: string;
  active: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-brand-200 bg-white shadow-sm' : 'border-ink-100 bg-white/70'}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
          {index}
        </span>
        <div>
          <p className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
            <span className={active ? 'text-brand-600' : 'text-ink-400'}>{icon}</span>
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">{text}</p>
        </div>
      </div>
    </div>
  );
}
