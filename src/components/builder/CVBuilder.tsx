import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Award,
  Briefcase,
  Check,
  ChevronDown,
  Download,
  FileText,
  Save,
  GraduationCap,
  Heart,
  Info,
  Languages as LangIcon,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Upload,
  User,
  Wand2,
  Wrench,
} from 'lucide-react';
import type {
  CVData,
  Certification,
  Education,
  Experience,
  Language,
  Locale,
  Skill,
  SkillLevel,
  TemplateId,
} from '../../types';
import { useT } from '../../i18n/LanguageContext';
import { cn, uid, fileToDataUrl, fileToUploadPayload } from '../../lib/utils';
import { cvIsReady, emptyCV, isExampleCV } from '../../lib/sampleData';
import { exportElementToPdf, cvFileName } from '../../lib/pdf';
import { exportCvToWord } from '../../lib/word';
import {
  applyModifications,
  optimizeCVContent,
  parseCVFromFile,
  hasApiKey,
} from '../../services/geminiService';
import { Button } from '../ui/ui';
import { AddButton, Collapse, ItemCard, Label, TextArea, TextField } from './fields';
import { DesignPanel } from './DesignPanel';
import { PreviewPane } from './PreviewPane';
import { TEMPLATE_MAP } from '../../data/templates';
import { PaymentGateModal } from '../payment/PaymentGateModal';
import { loadAccountUser, saveAccountCv, type SavedCvRecord } from '../../lib/account';
import type { CheckoutUser } from '../../lib/payment';

const LEVELS: Exclude<SkillLevel, ''>[] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

interface BuilderProps {
  data: CVData;
  setData: (d: CVData) => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  accent: string;
  setAccent: (c: string) => void;
  locale: Locale;
  accountUser: CheckoutUser | null;
  currentCvId?: string;
  onAccountUserChange: (user: CheckoutUser | null) => void;
  onSavedToAccount: (record: SavedCvRecord) => void;
}

export function CVBuilder({
  data,
  setData,
  templateId,
  setTemplateId,
  accent,
  setAccent,
  locale,
  accountUser,
  currentCvId,
  onAccountUserChange,
  onSavedToAccount,
}: BuilderProps) {
  const t = useT();
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'content' | 'design'>('content');
  const fontScale = data.formatting?.fontScale ?? 1;
  const setFontScale = (scale: number) => setData({
    ...data,
    formatting: { ...data.formatting, fontScale: scale },
  });
  const [aiInput, setAiInput] = useState('');
  const [busy, setBusy] = useState<null | 'apply' | 'optimize' | 'import' | 'pdf' | 'word' | 'save'>(null);
  const [error, setError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const speechRef = useRef<BrowserSpeechRecognition | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  /* L'aperçu démarre sur un exemple : tant qu'il n'est pas personnalisé, on le
     signale comme démonstration et on garde l'export en retrait. */
  const showingExample = isExampleCV(data);
  const ready = cvIsReady(data);

  // Fermer le menu d'export au clic extérieur ou avec Échap.
  useEffect(() => {
    if (!exportOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExportOpen(false);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [exportOpen]);

  const resetToBlank = () => {
    setError(null);
    setExportOpen(false);
    setData(emptyCV());
  };

  /* ----------------------------- mutations ----------------------------- */
  const setPersonal = (patch: Partial<CVData['personalInfo']>) =>
    setData({ ...data, personalInfo: { ...data.personalInfo, ...patch } });

  const updateList = <K extends keyof CVData>(key: K, value: CVData[K]) =>
    setData({ ...data, [key]: value });

  /* ------------------------------- actions ------------------------------ */
  const onPhoto = async (file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setPersonal({ photo: url });
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    setError(null);
    setBusy('import');
    try {
      const { mimeType, data: b64 } = await fileToUploadPayload(file);
      const parsed = await parseCVFromFile(b64, mimeType, file.name);
      // Conserver la photo et le choix d'affichage déjà chargés le cas échéant.
      setData({
        ...parsed,
        personalInfo: {
          ...parsed.personalInfo,
          photo: data.personalInfo.photo,
          showPhoto: data.personalInfo.showPhoto ?? true,
        },
      });
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const onOptimize = async () => {
    setError(null);
    setBusy('optimize');
    try {
      setData(await optimizeCVContent(data));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const onApply = async () => {
    if (!aiInput.trim()) return;
    setError(null);
    setBusy('apply');
    try {
      setData(await applyModifications(data, aiInput.trim()));
      setAiInput('');
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const onVoiceInput = () => {
    setError(null);
    if (listening) {
      speechRef.current?.stop();
      setListening(false);
      return;
    }

    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError(t.builder.ai.voiceUnsupported);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();
      if (transcript) {
        setAiInput((current) => `${current}${current.trim() ? ' ' : ''}${transcript}`);
      }
    };
    recognition.onerror = () => {
      setError(t.builder.ai.voiceError);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    speechRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const saveCurrentCv = async (paid = false) => {
    const user = accountUser || loadAccountUser();
    if (!user) {
      setError('Créez/connectez votre compte dans “Mes CV”, ou lancez le téléchargement : le compte sera créé automatiquement.');
      return null;
    }
    setError(null);
    setBusy('save');
    try {
      const result = await saveAccountCv({
        user,
        cv: data,
        templateId,
        accent,
        locale,
        cvId: currentCvId,
        paid,
      });
      onAccountUserChange(user);
      onSavedToAccount(result.cv);
      return result.cv;
    } catch (e: any) {
      setError(e?.message ?? 'Impossible de sauvegarder ce CV.');
      return null;
    } finally {
      setBusy(null);
    }
  };

  const onDownload = async () => {
    if (!previewRef.current) return;
    setPaywallOpen(true);
  };

  const onDownloadWord = async () => {
    setError(null);
    setBusy('word');
    try {
      await exportCvToWord(data, locale);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’exporter ce CV en Word.');
    } finally {
      setBusy(null);
    }
  };

  const onPaidDownload = async () => {
    if (!previewRef.current) return;
    setBusy('pdf');
    try {
      await exportElementToPdf(previewRef.current, cvFileName(data.personalInfo.fullName));
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const onWatermarkedDownload = async () => {
    if (!previewRef.current) return;
    setBusy('pdf');
    try {
      await exportElementToPdf(
        previewRef.current,
        cvFileName(data.personalInfo.fullName),
        { watermark: true },
      );
    } catch (e: any) {
      setError(e?.message ?? t.common.errorGeneric);
      throw e;
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-ink-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink-950 sm:text-[1.9rem]">
            {t.builder.title}
          </h1>
          <p className="mt-1 text-[15px] text-ink-500">{t.builder.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            icon={<Save className="h-4 w-4" />}
            loading={busy === 'save'}
            disabled={!ready}
            title={ready ? undefined : 'Personnalisez votre CV pour l’enregistrer.'}
            onClick={() => saveCurrentCv(false)}
          >
            {locale === 'fr' ? 'Enregistrer' : 'Save'}
          </Button>

          {/* Action principale unique : Télécharger ▾ (PDF / Word) */}
          <div ref={exportRef} className="relative">
            <Button
              variant="dark"
              icon={<Download className="h-4 w-4" />}
              iconRight={
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', exportOpen && 'rotate-180')}
                />
              }
              loading={busy === 'pdf' || busy === 'word'}
              disabled={!ready}
              title={ready ? undefined : 'Terminez votre CV pour le télécharger.'}
              onClick={() => setExportOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
            >
              {locale === 'fr' ? 'Télécharger' : 'Download'}
            </Button>
            {exportOpen && ready && (
              <div
                role="menu"
                className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-ink-100 bg-white p-1 shadow-lg shadow-ink-900/10"
              >
                <ExportMenuItem
                  icon={<Download className="h-4 w-4" />}
                  title="PDF"
                  hint={locale === 'fr' ? 'Idéal pour postuler' : 'Best for applying'}
                  onClick={() => {
                    setExportOpen(false);
                    onDownload();
                  }}
                />
                <ExportMenuItem
                  icon={<FileText className="h-4 w-4" />}
                  title="Word (.docx)"
                  hint={locale === 'fr' ? 'Modifiable dans Word' : 'Editable in Word'}
                  onClick={() => {
                    setExportOpen(false);
                    onDownloadWord();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bandeau d'état : guide l'utilisateur au lieu d'afficher des actions prématurées. */}
      {showingExample ? (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gold-200 bg-gold-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <p className="text-sm text-ink-700">
              <span className="font-semibold text-ink-900">
                {locale === 'fr' ? 'Ceci est un exemple.' : 'This is a sample.'}
              </span>{' '}
              {locale === 'fr'
                ? 'Il montre le rendu final. Importez votre CV ou repartez de zéro, puis le téléchargement s’activera.'
                : 'It shows the final result. Import your CV or start fresh, and download will unlock.'}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" icon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
              {locale === 'fr' ? 'Importer mon CV' : 'Import my CV'}
            </Button>
            <Button size="sm" variant="primary" icon={<RotateCcw className="h-4 w-4" />} onClick={resetToBlank}>
              {locale === 'fr' ? 'Repartir de zéro' : 'Start fresh'}
            </Button>
          </div>
        </div>
      ) : ready ? (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
          <Check className="h-3.5 w-3.5" />
          {locale === 'fr' ? 'CV prêt — téléchargement activé' : 'CV ready — download enabled'}
        </div>
      ) : (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-600">
          <Info className="h-3.5 w-3.5" />
          {locale === 'fr'
            ? 'Ajoutez votre nom et au moins une section pour activer le téléchargement.'
            : 'Add your name and at least one section to enable download.'}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_1fr]">
        {/* ----------------------------- ÉDITEUR ----------------------------- */}
        <div className="space-y-4">
          {/* Import + assistant IA */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy === 'import'}
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-ink-300 bg-ink-50/60 px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50 disabled:opacity-60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                {busy === 'import' ? (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </span>
              <span>
                <span className="block text-sm font-bold text-ink-900">
                  {busy === 'import' ? t.common.analyzing : t.builder.importCta}
                </span>
                <span className="block text-xs text-ink-500">{t.builder.importHint}</span>
              </span>
            </button>

            <div className="mt-3">
              <Label>{t.builder.ai.askLabel}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onApply()}
                  placeholder={t.builder.ai.askPlaceholder}
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <Button
                  variant={listening ? 'dark' : 'outline'}
                  icon={listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  onClick={onVoiceInput}
                  className="shrink-0"
                >
                  {listening ? t.builder.ai.voiceStop : t.builder.ai.voiceStart}
                </Button>
                <Button
                  icon={<Wand2 className="h-4 w-4" />}
                  loading={busy === 'apply'}
                  onClick={onApply}
                  className="shrink-0"
                >
                  {t.common.apply}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-2.5 w-full"
              icon={<Sparkles className="h-4 w-4 text-gold-500" />}
              loading={busy === 'optimize'}
              onClick={onOptimize}
            >
              {t.builder.ai.improveAll}
            </Button>

            {!hasApiKey && (
              <p className="mt-2 text-xs text-amber-600">{t.common.errorNoApiKey}</p>
            )}
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>

          {/* Onglets */}
          <div className="inline-flex w-full rounded-xl bg-ink-100 p-1">
            {(['content', 'design'] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${
                  tab === tb ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800'
                }`}
              >
                {tb === 'content' ? t.builder.tabs.content : t.builder.tabs.design}
              </button>
            ))}
          </div>

          {tab === 'design' ? (
            <DesignPanel
              templateId={templateId}
              setTemplateId={setTemplateId}
              accent={accent}
              setAccent={setAccent}
              data={data}
              locale={locale}
              fontScale={fontScale}
              setFontScale={setFontScale}
            />
          ) : (
            <div className="space-y-3">
              {/* Infos personnelles */}
              <Collapse title={t.builder.sections.personal} icon={<User className="h-4 w-4" />} defaultOpen>
                <div className="flex items-center gap-3">
                  <PhotoButton
                    photo={data.personalInfo.photo}
                    onPick={() => photoRef.current?.click()}
                    onRemove={() => setPersonal({ photo: undefined })}
                    addLabel={t.builder.fields.addPhoto}
                    removeLabel={t.builder.fields.removePhoto}
                  />
                  <label className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs font-semibold text-ink-600">
                    <input
                      type="checkbox"
                      checked={data.personalInfo.showPhoto !== false}
                      onChange={(e) => setPersonal({ showPhoto: e.target.checked })}
                      className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                    />
                    {t.builder.fields.showPhoto}
                  </label>
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPhoto(e.target.files?.[0])}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField label={t.builder.fields.fullName} value={data.personalInfo.fullName} onChange={(v) => setPersonal({ fullName: v })} />
                  <TextField label={t.builder.fields.jobTitle} value={data.personalInfo.title} onChange={(v) => setPersonal({ title: v })} />
                  <TextField label={t.builder.fields.email} value={data.personalInfo.email} onChange={(v) => setPersonal({ email: v })} />
                  <TextField label={t.builder.fields.phone} value={data.personalInfo.phone} onChange={(v) => setPersonal({ phone: v })} />
                  <TextField label={t.builder.fields.address} value={data.personalInfo.address} onChange={(v) => setPersonal({ address: v })} />
                  <TextField label={t.builder.fields.linkedin} value={data.personalInfo.linkedin} onChange={(v) => setPersonal({ linkedin: v })} />
                  <TextField label={t.builder.fields.website} value={data.personalInfo.website} onChange={(v) => setPersonal({ website: v })} />
                </div>
              </Collapse>

              {/* Résumé */}
              <Collapse title={t.builder.sections.summary} icon={<Sparkles className="h-4 w-4" />} defaultOpen>
                <TextArea value={data.personalInfo.summary} onChange={(v) => setPersonal({ summary: v })} rows={4} placeholder="…" />
              </Collapse>

              {/* Expériences */}
              <Collapse title={t.builder.sections.experience} icon={<Briefcase className="h-4 w-4" />} defaultOpen>
                <div className="space-y-3">
                  {data.experiences.map((exp) => (
                    <ItemCard key={exp.id} onRemove={() => updateList('experiences', data.experiences.filter((x) => x.id !== exp.id))}>
                      <ExperienceForm
                        exp={exp}
                        t={t}
                        onChange={(patch) =>
                          updateList(
                            'experiences',
                            data.experiences.map((x) => (x.id === exp.id ? { ...x, ...patch } : x)),
                          )
                        }
                      />
                    </ItemCard>
                  ))}
                  <AddButton
                    label={t.builder.addExperience}
                    onClick={() =>
                      updateList('experiences', [
                        ...data.experiences,
                        { id: uid('exp'), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' } as Experience,
                      ])
                    }
                  />
                </div>
              </Collapse>

              {/* Formations */}
              <Collapse title={t.builder.sections.education} icon={<GraduationCap className="h-4 w-4" />}>
                <div className="space-y-3">
                  {data.education.map((ed) => (
                    <ItemCard key={ed.id} onRemove={() => updateList('education', data.education.filter((x) => x.id !== ed.id))}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextField label={t.builder.fields.degree} value={ed.degree} onChange={(v) => updateList('education', data.education.map((x) => (x.id === ed.id ? { ...x, degree: v } : x)))} />
                        <TextField label={t.builder.fields.school} value={ed.school} onChange={(v) => updateList('education', data.education.map((x) => (x.id === ed.id ? { ...x, school: v } : x)))} />
                        <TextField label={t.builder.fields.location} value={ed.location} onChange={(v) => updateList('education', data.education.map((x) => (x.id === ed.id ? { ...x, location: v } : x)))} />
                        <TextField label={t.builder.fields.year} value={ed.year} onChange={(v) => updateList('education', data.education.map((x) => (x.id === ed.id ? { ...x, year: v } : x)))} />
                      </div>
                    </ItemCard>
                  ))}
                  <AddButton
                    label={t.builder.addEducation}
                    onClick={() => updateList('education', [...data.education, { id: uid('edu'), degree: '', school: '', location: '', year: '', description: '' } as Education])}
                  />
                </div>
              </Collapse>

              {/* Compétences */}
              <Collapse title={t.builder.sections.skills} icon={<Wrench className="h-4 w-4" />}>
                <div className="space-y-2.5">
                  {data.skills.map((sk) => (
                    <div key={sk.id} className="flex items-center gap-2">
                      <input
                        value={sk.name}
                        onChange={(e) => updateList('skills', data.skills.map((x) => (x.id === sk.id ? { ...x, name: e.target.value } : x)))}
                        placeholder={t.builder.fields.skillName}
                        className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <select
                        value={sk.level}
                        onChange={(e) => updateList('skills', data.skills.map((x) => (x.id === sk.id ? { ...x, level: e.target.value as SkillLevel } : x)))}
                        className="shrink-0 rounded-lg border border-ink-200 bg-white px-2 py-2 text-sm focus:border-brand-500 focus:outline-none"
                      >
                        <option value="">Non précisé / Not specified</option>
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {t.levels[l]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => updateList('skills', data.skills.filter((x) => x.id !== sk.id))}
                        className="shrink-0 px-1 text-ink-400 hover:text-rose-600"
                        aria-label="x"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <AddButton
                    label={t.builder.addSkill}
                    onClick={() => updateList('skills', [...data.skills, { id: uid('sk'), name: '', level: 'Intermédiaire' } as Skill])}
                  />
                </div>
              </Collapse>

              {/* Langues */}
              <Collapse title={t.builder.sections.languages} icon={<LangIcon className="h-4 w-4" />}>
                <div className="space-y-2.5">
                  {data.languages.map((lg) => (
                    <div key={lg.id} className="flex items-center gap-2">
                      <input
                        value={lg.name}
                        onChange={(e) => updateList('languages', data.languages.map((x) => (x.id === lg.id ? { ...x, name: e.target.value } : x)))}
                        placeholder={t.builder.fields.languageName}
                        className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <input
                        value={lg.level}
                        onChange={(e) => updateList('languages', data.languages.map((x) => (x.id === lg.id ? { ...x, level: e.target.value } : x)))}
                        placeholder={t.builder.fields.level}
                        className="w-32 shrink-0 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <button onClick={() => updateList('languages', data.languages.filter((x) => x.id !== lg.id))} className="shrink-0 px-1 text-ink-400 hover:text-rose-600">✕</button>
                    </div>
                  ))}
                  <AddButton
                    label={t.builder.addLanguage}
                    onClick={() => updateList('languages', [...data.languages, { id: uid('lg'), name: '', level: '' } as Language])}
                  />
                </div>
              </Collapse>

              {/* Certifications */}
              <Collapse title={t.builder.sections.certifications} icon={<Award className="h-4 w-4" />}>
                <div className="space-y-3">
                  {data.certifications.map((c) => (
                    <ItemCard key={c.id} onRemove={() => updateList('certifications', data.certifications.filter((x) => x.id !== c.id))}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <TextField label={t.builder.fields.certName} value={c.name} onChange={(v) => updateList('certifications', data.certifications.map((x) => (x.id === c.id ? { ...x, name: v } : x)))} />
                        </div>
                        <TextField label={t.builder.fields.year} value={c.year} onChange={(v) => updateList('certifications', data.certifications.map((x) => (x.id === c.id ? { ...x, year: v } : x)))} />
                        <div className="sm:col-span-3">
                          <TextField label={t.builder.fields.issuer} value={c.issuer} onChange={(v) => updateList('certifications', data.certifications.map((x) => (x.id === c.id ? { ...x, issuer: v } : x)))} />
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                  <AddButton
                    label={t.builder.addCertification}
                    onClick={() => updateList('certifications', [...data.certifications, { id: uid('cert'), name: '', issuer: '', year: '' } as Certification])}
                  />
                </div>
              </Collapse>

              {/* Centres d'intérêt */}
              <Collapse title={t.builder.sections.interests} icon={<Heart className="h-4 w-4" />}>
                <TextArea
                  value={data.interests.join(', ')}
                  onChange={(v) => updateList('interests', v.split(',').map((s) => s.trim()).filter(Boolean))}
                  rows={2}
                  placeholder={t.builder.fields.interest + '…'}
                />
              </Collapse>
            </div>
          )}
        </div>

        {/* ----------------------------- APERÇU ----------------------------- */}
        <div>
          <div className="sticky top-20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                {t.builder.preview}
              </span>
              <div className="flex items-center gap-2">
                {showingExample && (
                  <span className="rounded-full border border-gold-300 bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700">
                    {locale === 'fr' ? 'Exemple' : 'Sample'}
                  </span>
                )}
                <span className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-semibold text-ink-600">
                  {TEMPLATE_MAP[templateId].name}
                </span>
              </div>
            </div>
            <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-2xl border border-ink-100 bg-ink-50 p-4 sm:p-6">
              <PreviewPane ref={previewRef} data={data} templateId={templateId} accent={accent} locale={locale} fontScale={fontScale} />
            </div>
          </div>
        </div>
      </div>
      </div>
      <PaymentGateModal
        open={paywallOpen}
        cv={data}
        templateId={templateId}
        accent={accent}
        locale={locale}
        onClose={() => setPaywallOpen(false)}
        onPaid={onPaidDownload}
        onWatermarked={onWatermarkedDownload}
      />
    </>
  );
}

/* ----------------------------- sous-composants ----------------------------- */

function ExportMenuItem({
  icon,
  title,
  hint,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-ink-50"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-700">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink-900">{title}</span>
        <span className="block text-xs text-ink-500">{hint}</span>
      </span>
    </button>
  );
}

function PhotoButton({
  photo,
  onPick,
  onRemove,
  addLabel,
  removeLabel,
}: {
  photo?: string;
  onPick: () => void;
  onRemove: () => void;
  addLabel: string;
  removeLabel: string;
}) {
  if (photo) {
    return (
      <div className="flex items-center gap-3">
        <img src={photo} alt="" className="h-16 w-16 rounded-xl object-cover ring-1 ring-ink-200" />
        <button onClick={onRemove} className="text-xs font-semibold text-rose-600 hover:underline">
          {removeLabel}
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onPick}
      className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink-300 text-[10px] font-semibold text-ink-400 hover:border-brand-400 hover:text-brand-600"
    >
      <User className="h-5 w-5" />
      {addLabel}
    </button>
  );
}

function ExperienceForm({
  exp,
  t,
  onChange,
}: {
  exp: Experience;
  t: any;
  onChange: (patch: Partial<Experience>) => void;
}) {
  return (
    <div className="space-y-3 pr-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label={t.builder.fields.role} value={exp.title} onChange={(v) => onChange({ title: v })} />
        <TextField label={t.builder.fields.company} value={exp.company} onChange={(v) => onChange({ company: v })} />
        <TextField label={t.builder.fields.location} value={exp.location} onChange={(v) => onChange({ location: v })} />
        <div className="grid grid-cols-2 gap-2">
          <TextField label={t.builder.fields.startDate} value={exp.startDate} onChange={(v) => onChange({ startDate: v })} />
          <TextField label={t.builder.fields.endDate} value={exp.current ? '' : exp.endDate} onChange={(v) => onChange({ endDate: v })} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-medium text-ink-600">
        <input type="checkbox" checked={exp.current} onChange={(e) => onChange({ current: e.target.checked })} className="rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
        {t.builder.fields.current}
      </label>
      <TextArea label={t.builder.fields.description} value={exp.description} onChange={(v) => onChange({ description: v })} rows={3} />
    </div>
  );
}
