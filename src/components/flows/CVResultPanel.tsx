import { useRef, useState } from 'react';
import { Download, PencilRuler } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { exportElementToPdf, cvFileName } from '../../lib/pdf';
import { Button } from '../ui/ui';
import { PreviewPane } from '../builder/PreviewPane';

/** Aperçu d'un CV résultat + actions (ouvrir dans le créateur, télécharger PDF). */
export function CVResultPanel({
  cv,
  templateId,
  accent,
  locale,
  onOpenInBuilder,
}: {
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  onOpenInBuilder: () => void;
}) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      await exportElementToPdf(ref.current, cvFileName(cv.personalInfo.fullName));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Button icon={<PencilRuler className="h-4 w-4" />} onClick={onOpenInBuilder}>
          {t.analyze.openInBuilder}
        </Button>
        <Button variant="dark" icon={<Download className="h-4 w-4" />} loading={busy} onClick={download}>
          {t.common.downloadPdf}
        </Button>
      </div>
      <div className="max-h-[calc(100vh-12rem)] overflow-auto rounded-2xl bg-ink-100/50 p-4 sm:p-6">
        <PreviewPane ref={ref} data={cv} templateId={templateId} accent={accent} locale={locale} />
      </div>
    </div>
  );
}
