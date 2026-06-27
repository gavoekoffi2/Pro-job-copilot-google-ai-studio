import { useRef, useState } from 'react';
import { FileUp, FileText, Sparkles, UserCheck } from 'lucide-react';
import type { CVData } from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { fileToDataUrl, stripDataUrlPrefix } from '../../lib/utils';
import { parseCVFromFile, parseCVFromText, hasApiKey } from '../../services/geminiService';
import { Button } from '../ui/ui';

/**
 * Récupère un CVData : import de fichier (PDF/image), collage de texte,
 * ou réutilisation du CV courant. Appelle `onReady` avec le CV structuré.
 */
export function CVImporter({
  onReady,
  currentData,
}: {
  onReady: (cv: CVData) => void;
  currentData: CVData;
}) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCurrent = currentData.personalInfo.fullName.trim().length > 0;

  const run = async (fn: () => Promise<CVData>) => {
    setError(null);
    setBusy(true);
    try {
      onReady(await fn());
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    await run(async () => {
      const url = await fileToDataUrl(file);
      const { mimeType, data } = stripDataUrlPrefix(url);
      return parseCVFromFile(data, mimeType, file.name);
    });
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Upload */}
      <div className="rounded-3xl border border-ink-100 bg-white p-6">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/60 px-6 py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50 disabled:opacity-60"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
            {busy ? <Sparkles className="h-6 w-6 animate-pulse" /> : <FileUp className="h-6 w-6" />}
          </span>
          <span className="font-display text-lg font-bold text-ink-900">{t.analyze.dropTitle}</span>
          <span className="text-sm text-ink-500">{t.analyze.dropHint}</span>
        </button>

        {hasCurrent && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            icon={<UserCheck className="h-4 w-4" />}
            disabled={busy}
            onClick={() => onReady(currentData)}
          >
            {t.common.useCurrentCV}
          </Button>
        )}
      </div>

      {/* Texte */}
      <div className="rounded-3xl border border-ink-100 bg-white p-6">
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-700">
          <FileText className="h-4 w-4 text-brand-600" />
          {t.analyze.pasteLabel}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.analyze.pastePlaceholder}
          rows={9}
          className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <Button
          className="mt-3 w-full"
          loading={busy}
          disabled={!text.trim()}
          icon={<Sparkles className="h-4 w-4" />}
          onClick={() => run(() => parseCVFromText(text))}
        >
          {t.common.next}
        </Button>
        {!hasApiKey && <p className="mt-2 text-xs text-amber-600">{t.common.errorNoApiKey}</p>}
        {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
