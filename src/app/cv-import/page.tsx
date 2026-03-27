'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  CheckCircle2,
  ChevronLeft,
  Layout,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FileCheck,
  ArrowRight,
  X,
  ImageIcon,
  Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';
import { extractCVFromImage } from '@/lib/gemini';
import { saveCVData } from '@/lib/cv-storage';
import { CV_TEMPLATES, DEFAULT_CV, type CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Step indicator ───────────────────────────────────────────
const STEPS = ['Upload', 'Review', 'Done'] as const;
type Step = 0 | 1 | 2;

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-300 ${
              i < current
                ? 'bg-violet-500 text-white'
                : i === current
                ? 'bg-violet-600/80 text-white ring-2 ring-violet-400/50'
                : 'bg-white/8 text-white/30 border border-white/10'
            }`}
          >
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <span
            className={`text-xs font-medium hidden sm:inline ${
              i === current ? 'text-violet-300' : i < current ? 'text-white/60' : 'text-white/25'
            }`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-px mx-1 transition-colors duration-300 ${
                i < current ? 'bg-violet-500' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Template color swatch card ───────────────────────────────
function TemplateMini({
  id,
  name,
  category,
  accentColor,
  selected,
  onClick,
}: {
  id: string;
  name: string;
  category: string;
  accentColor: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
        selected
          ? 'border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.5)]'
          : 'border-white/10 hover:border-white/25'
      }`}
    >
      {/* Swatch preview */}
      <div
        className="h-16 w-full relative"
        style={{ background: `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor}44 100%)` }}
      >
        {/* Fake CV lines */}
        <div className="absolute inset-3 space-y-1.5">
          <div className="h-1.5 w-12 rounded-full bg-white/60" />
          <div className="h-1 w-8 rounded-full bg-white/35" />
          <div className="flex gap-1 mt-2">
            <div className="h-1 w-3 rounded-full bg-white/25" />
            <div className="h-1 w-5 rounded-full bg-white/25" />
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-4 rounded-full bg-white/20" />
            <div className="h-1 w-3 rounded-full bg-white/20" />
          </div>
        </div>
        {selected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      {/* Label */}
      <div className="px-2.5 py-2 bg-white/4">
        <p className="text-[11px] font-semibold text-white truncate">{name}</p>
        <span className="text-[9px] text-white/40 uppercase tracking-wide">{category}</span>
      </div>
    </motion.button>
  );
}

// ─── Extracted data preview ───────────────────────────────────
function ExtractedPreview({ data }: { data: Partial<CVData> }) {
  const { t } = useLanguage();
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
  const expCount = data.experience?.length ?? 0;
  const eduCount = data.education?.length ?? 0;
  const skillGroups = data.skills?.length ?? 0;
  const hasLangs = (data.languages?.length ?? 0) > 0;
  const hasCerts = (data.certifications?.length ?? 0) > 0;

  const checks = [
    { label: fullName || 'Nom', found: Boolean(fullName), icon: User },
    { label: data.title || 'Titre', found: Boolean(data.title), icon: Briefcase },
    {
      label:
        expCount > 0
          ? `${expCount} expérience${expCount > 1 ? 's' : ''}`
          : 'Expériences',
      found: expCount > 0,
      icon: Briefcase,
    },
    {
      label:
        eduCount > 0
          ? `${eduCount} formation${eduCount > 1 ? 's' : ''}`
          : 'Formation',
      found: eduCount > 0,
      icon: GraduationCap,
    },
    {
      label:
        skillGroups > 0
          ? `${skillGroups} groupe${skillGroups > 1 ? 's' : ''} de compétences`
          : 'Compétences',
      found: skillGroups > 0,
      icon: Code2,
    },
    { label: 'Langues', found: hasLangs, icon: FileCheck },
    { label: 'Certifications', found: hasCerts, icon: FileCheck },
  ];

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">Données extraites</h3>
          {fullName && (
            <p className="text-white/50 text-xs mt-0.5">
              {fullName}
              {data.title ? ` · ${data.title}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {checks.map(({ label, found, icon: Icon }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              found
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-white/4 text-white/25 border border-white/6'
            }`}
          >
            {found ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            ) : (
              <X className="w-3.5 h-3.5 shrink-0 text-white/20" />
            )}
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function CVImportPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Step
  const [step, setStep] = useState<Step>(0);

  // Step 1 state
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Step 2 state
  const [extractedData, setExtractedData] = useState<Partial<CVData> | null>(null);
  const [layoutChoice, setLayoutChoice] = useState<'keep' | 'choose'>('keep');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('apex-corporate');
  const [loadingBuilder, setLoadingBuilder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format non supporté — utilisez JPG, PNG ou WEBP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux — max 10 Mo');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── Analyze ────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // strip data:image/xxx;base64,
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const mimeType = selectedFile.type as 'image/jpeg' | 'image/png' | 'image/webp';
      const data = await extractCVFromImage(base64, mimeType);
      setExtractedData(data);
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'analyser l'image — vérifiez votre clé API Gemini");
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Load in builder ────────────────────────────────────────
  const handleLoadInBuilder = async () => {
    if (!extractedData) return;
    setLoadingBuilder(true);
    try {
      const templateId =
        layoutChoice === 'keep' ? 'apex-corporate' : selectedTemplateId;

      saveCVData({
        ...DEFAULT_CV,
        ...extractedData,
        templateId,
      } as CVData);

      toast.success(t('import.success'));
      router.push('/cv-builder');
    } catch (err) {
      console.error(err);
      toast.error(t('common.error'));
      setLoadingBuilder(false);
    }
  };

  // ── Layout choice card ─────────────────────────────────────
  const ChoiceCard = ({
    value,
    icon: Icon,
    title,
    subtitle,
    children,
  }: {
    value: 'keep' | 'choose';
    icon: React.ElementType;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
  }) => {
    const active = layoutChoice === value;
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        onClick={() => setLayoutChoice(value)}
        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 ${
          active
            ? 'border-violet-500 bg-violet-500/8 shadow-[0_0_24px_rgba(139,92,246,0.2)]'
            : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              active ? 'bg-violet-500/30' : 'bg-white/8'
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${active ? 'text-violet-300' : 'text-white/50'}`} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-white/70'}`}>
              {title}
            </p>
            <p className="text-xs text-white/35">{subtitle}</p>
          </div>
          {active && (
            <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        {children}
      </motion.div>
    );
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ background: '#08080f' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-white/6 bg-[#08080f]/90 backdrop-blur-xl px-6 py-3 flex items-center gap-3">
          <Link
            href="/cv-builder"
            className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Créateur de CV</span>
          </Link>
          <span className="text-white/15">/</span>
          <span className="text-sm text-violet-300 font-medium">Importer depuis photo</span>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/25 mb-4">
              <Camera className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              <GradientText>{t('import.title')}</GradientText>
            </h1>
            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              {t('import.subtitle')}
            </p>
          </motion.div>

          {/* Step indicator */}
          <StepDots current={step} />

          {/* ── STEP 0: Upload ── */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
              >
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left: dropzone */}
                  <div className="space-y-4">
                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center py-16 px-8 text-center
                        ${
                          dragOver
                            ? 'border-violet-400 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.25)]'
                            : selectedFile
                            ? 'border-violet-500/40 bg-violet-500/5 hover:border-violet-400/60'
                            : 'border-white/15 bg-white/2 hover:border-white/30 hover:bg-white/4'
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleInputChange}
                      />

                      <AnimatePresence mode="wait">
                        {dragOver ? (
                          <motion.div
                            key="drag"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/30 flex items-center justify-center">
                              <Upload className="w-7 h-7 text-violet-300" />
                            </div>
                            <p className="text-violet-300 font-semibold">Relâchez pour importer</p>
                          </motion.div>
                        ) : selectedFile ? (
                          <motion.div
                            key="selected"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                              <FileCheck className="w-6 h-6 text-emerald-400" />
                            </div>
                            <p className="text-white font-semibold text-sm truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-white/35 text-xs">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                            </p>
                            <p className="text-white/30 text-xs mt-1">Cliquez pour changer</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-white/6 flex items-center justify-center">
                              <ImageIcon className="w-7 h-7 text-white/30" />
                            </div>
                            <div>
                              <p className="text-white/60 font-medium text-sm">
                                {t('import.dropzone')}
                              </p>
                              <p className="text-white/25 text-xs mt-0.5">{t('import.dropzoneOr')}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Format info */}
                    <p className="text-center text-xs text-white/25">{t('import.formats')}</p>

                    {/* Analyze button */}
                    <Button
                      size="lg"
                      onClick={handleAnalyze}
                      disabled={!selectedFile || analyzing}
                      loading={analyzing}
                      icon={analyzing ? undefined : <Sparkles className="w-4 h-4" />}
                      className="w-full"
                    >
                      {analyzing ? t('import.analyzing') : t('import.analyze')}
                    </Button>

                    {/* Loading skeleton while analyzing */}
                    <AnimatePresence>
                      {analyzing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="glass rounded-2xl p-5">
                            <AILoadingSkeleton />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right: image preview */}
                  <AnimatePresence>
                    {previewUrl ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="glass rounded-2xl p-4 flex items-center justify-center min-h-[300px] relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={previewUrl}
                          alt="Aperçu du CV"
                          className="max-w-full max-h-[480px] object-contain rounded-xl"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-2xl flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                          <Camera className="w-8 h-8 text-white/15" />
                        </div>
                        <p className="text-white/20 text-sm">L'aperçu de votre image apparaîtra ici</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: Review & Choose Template ── */}
            {step === 1 && extractedData && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Extracted data summary + image side by side */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <ExtractedPreview data={extractedData} />

                  {/* Thumbnail */}
                  {previewUrl && (
                    <div className="glass rounded-2xl p-4 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="CV importé"
                        className="max-w-full max-h-[220px] object-contain rounded-xl opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* Layout choice */}
                <div>
                  <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-violet-400" />
                    Choisir la mise en forme
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Option A: keep layout */}
                    <ChoiceCard
                      value="keep"
                      icon={Layout}
                      title={t('import.keepDesign')}
                      subtitle="Template Apex Corporate — classique & professionnel"
                    />

                    {/* Option B: choose template */}
                    <ChoiceCard
                      value="choose"
                      icon={Sparkles}
                      title={t('import.chooseTemplate')}
                      subtitle="Sélectionnez parmi 12 designs exclusifs"
                    />
                  </div>
                </div>

                {/* Template gallery (only when "choose" is selected) */}
                <AnimatePresence>
                  {layoutChoice === 'choose' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-strong rounded-2xl p-5">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                          {CV_TEMPLATES.length} templates disponibles
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-72 overflow-y-auto pr-1">
                          {CV_TEMPLATES.map((tpl) => (
                            <TemplateMini
                              key={tpl.id}
                              id={tpl.id}
                              name={tpl.name}
                              category={tpl.category}
                              accentColor={tpl.accentColor}
                              selected={selectedTemplateId === tpl.id}
                              onClick={() => setSelectedTemplateId(tpl.id)}
                            />
                          ))}
                        </div>
                        {selectedTemplateId && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-violet-300/70 mt-3"
                          >
                            Template sélectionné :{' '}
                            <span className="text-violet-300 font-semibold">
                              {CV_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name}
                            </span>
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    icon={<ChevronLeft className="w-4 h-4" />}
                    onClick={() => setStep(0)}
                  >
                    Retour
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleLoadInBuilder}
                    loading={loadingBuilder}
                    disabled={loadingBuilder || (layoutChoice === 'choose' && !selectedTemplateId)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="flex-1 sm:flex-initial"
                  >
                    {t('import.loadBuilder')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
