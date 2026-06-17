import { useState } from 'react';
import { Languages, ArrowRight } from 'lucide-react';
import type { CVData, Locale, TargetLanguage, TemplateId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { translateCV } from '../../services/geminiService';
import { Button } from '../ui/ui';
import { ToolShell } from './ToolShell';
import { CVImporter } from './CVImporter';
import { CVResultPanel } from './CVResultPanel';
import { cn } from '../../lib/utils';

const TARGETS: TargetLanguage[] = [
  { code: 'en', labelFr: 'Anglais', labelEn: 'English', flag: '🇬🇧' },
  { code: 'fr', labelFr: 'Français', labelEn: 'French', flag: '🇫🇷' },
  { code: 'es', labelFr: 'Espagnol', labelEn: 'Spanish', flag: '🇪🇸' },
  { code: 'de', labelFr: 'Allemand', labelEn: 'German', flag: '🇩🇪' },
  { code: 'pt', labelFr: 'Portugais', labelEn: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', labelFr: 'Italien', labelEn: 'Italian', flag: '🇮🇹' },
  { code: 'ar', labelFr: 'Arabe', labelEn: 'Arabic', flag: '🇸🇦' },
];

export function TranslateView({
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
  const { t } = useLanguage();
  const [cv, setCv] = useState<CVData | null>(null);
  const [target, setTarget] = useState<TargetLanguage>(TARGETS[0]);
  const [translated, setTranslated] = useState<CVData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onTranslate = async () => {
    if (!cv) return;
    setError(null);
    setBusy(true);
    try {
      const label = locale === 'fr' ? target.labelFr : target.labelEn;
      setTranslated(await translateCV(cv, label));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell icon={<Languages className="h-7 w-7" />} title={t.translate.title} subtitle={t.translate.subtitle}>
      {!cv ? (
        <CVImporter onReady={setCv} currentData={data} />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-100 bg-white p-5">
            <p className="mb-3 text-sm font-bold text-ink-700">{t.translate.targetLabel}</p>
            <div className="flex flex-wrap gap-2">
              {TARGETS.map((lg) => (
                <button
                  key={lg.code}
                  onClick={() => setTarget(lg)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors',
                    target.code === lg.code
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-ink-200 text-ink-600 hover:border-ink-300',
                  )}
                >
                  <span className="text-base">{lg.flag}</span>
                  {locale === 'fr' ? lg.labelFr : lg.labelEn}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button
                size="lg"
                loading={busy}
                icon={<Languages className="h-5 w-5" />}
                iconRight={<ArrowRight className="h-4 w-4" />}
                onClick={onTranslate}
              >
                {t.translate.translateBtn}
              </Button>
              <p className="text-xs text-ink-400">{t.translate.keepLayout}</p>
            </div>
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>

          {translated && (
            <div>
              <p className="mb-2 text-sm font-bold text-ink-500">{t.translate.resultLabel}</p>
              <CVResultPanel
                cv={translated}
                templateId={templateId}
                accent={accent}
                locale={locale}
                onOpenInBuilder={() => onOpenInBuilder(translated)}
              />
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
