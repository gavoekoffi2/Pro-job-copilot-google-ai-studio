'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileEdit, Palette, Eye, Download, RotateCcw, Sparkles,
  ChevronLeft, ChevronRight, Monitor, Printer, Save, Check,
  Globe, Camera, Loader2, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { CVForm } from '@/components/cv/CVForm';
import { TemplateSidebar } from '@/components/cv/TemplateGallery';
import { TEMPLATE_COMPONENTS } from '@/components/cv/templates';
import { getCVData, saveCVData } from '@/lib/cv-storage';
import { SAMPLE_CV, DEFAULT_CV, CV_TEMPLATES, type CVData } from '@/types/cv';
import { translateCVContent } from '@/lib/gemini';
import Link from 'next/link';

type Tab = 'edit' | 'templates' | 'preview';

// ─── Live Preview ─────────────────────────────────────────────
function LivePreview({ cv, scale = 0.75 }: { cv: CVData; scale?: number }) {
  const TemplateComp = TEMPLATE_COMPONENTS[cv.templateId] ?? TEMPLATE_COMPONENTS['vega-purple'];
  return (
    <div
      className="origin-top-left"
      style={{ transform: `scale(${scale})`, width: 794, height: 1123 }}
    >
      <TemplateComp cv={cv} />
    </div>
  );
}

// ─── Print View ───────────────────────────────────────────────
function PrintModal({ cv, onClose }: { cv: CVData; onClose: () => void }) {
  const TemplateComp = TEMPLATE_COMPONENTS[cv.templateId] ?? TEMPLATE_COMPONENTS['vega-purple'];
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { toast.error('Popup bloquée — autorisez les popups'); return; }
    win.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>CV</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; }
        @page { margin: 0; size: A4; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} icon={<Printer className="w-4 h-4" />} size="md">
              Imprimer / Sauvegarder PDF
            </Button>
            <p className="text-white/50 text-sm hidden sm:block">Ctrl+P pour sauvegarder en PDF</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-sm px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 transition-all">
            Fermer
          </button>
        </div>

        {/* CV Preview at full scale */}
        <div className="bg-white shadow-2xl overflow-hidden rounded-lg" ref={printRef}>
          <TemplateComp cv={cv} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Translate Modal ──────────────────────────────────────────
const TRANSLATE_LANGS = [
  { code: 'English',    label: 'English 🇬🇧', flag: '🇬🇧' },
  { code: 'French',     label: 'Français 🇫🇷', flag: '🇫🇷' },
  { code: 'Spanish',    label: 'Español 🇪🇸', flag: '🇪🇸' },
  { code: 'German',     label: 'Deutsch 🇩🇪', flag: '🇩🇪' },
  { code: 'Portuguese', label: 'Português 🇵🇹', flag: '🇵🇹' },
  { code: 'Arabic',     label: 'العربية 🇸🇦', flag: '🇸🇦' },
];

function TranslateModal({ cv, onTranslated, onClose }: {
  cv: CVData;
  onTranslated: (newCv: CVData) => void;
  onClose: () => void;
}) {
  const [targetLang, setTargetLang] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const translated = await translateCVContent(cv, targetLang);
      onTranslated(translated);
      toast.success(`CV traduit en ${targetLang} !`);
      onClose();
    } catch (e) {
      toast.error('Traduction échouée — réessaie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="font-bold text-white">Traduire le CV</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Tout le contenu sera traduit en conservant votre mise en page et template.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {TRANSLATE_LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setTargetLang(l.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                targetLang === l.code
                  ? 'bg-blue-500/20 border-blue-500/40 text-white'
                  : 'bg-white/4 border-white/8 text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleTranslate}
          loading={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          className="w-full"
          size="md"
        >
          {loading ? 'Traduction en cours…' : `Traduire en ${targetLang}`}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CVBuilderPage() {
  const [cv, setCv] = useState<CVData>(DEFAULT_CV);
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const [showPrint, setShowPrint] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const stored = getCVData();
    setCv(stored);
    setLoaded(true);
  }, []);

  // Auto-save debounced
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveCVData(cv);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, [cv, loaded]);

  const handleLoadSample = () => {
    setCv(SAMPLE_CV);
    toast.success('CV exemple chargé — à vous de le personnaliser !');
  };

  const handleReset = () => {
    if (confirm('Réinitialiser tout le CV ? Cette action est irréversible.')) {
      setCv(DEFAULT_CV);
      toast.success('CV réinitialisé');
    }
  };

  const TemplateComp = TEMPLATE_COMPONENTS[cv.templateId] ?? TEMPLATE_COMPONENTS['vega-purple'];
  const previewScale = 0.56;

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'edit', label: 'Éditer', icon: FileEdit },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'preview', label: 'Aperçu', icon: Eye },
  ];

  if (!loaded) return null;

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-white/8 bg-[#08080f]/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between gap-4 sticky top-16 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FileEdit className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h1 className="text-base font-black text-white leading-none">
                CV <GradientText variant="primary">Builder</GradientText>
              </h1>
              <p className="text-[11px] text-white/40 mt-0.5">
                {cv.firstName ? `${cv.firstName} ${cv.lastName}` : 'Nouveau CV'} · {cv.templateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-green-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sauvegardé
                </motion.div>
              )}
            </AnimatePresence>

            <Link href="/cv-import" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Importer photo</span>
            </Link>
            <button onClick={() => setShowTranslate(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
              <Globe className="w-3.5 h-3.5 inline mr-1" />
              <span className="hidden sm:inline">Traduire</span>
            </button>
            <button onClick={handleLoadSample} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Exemple
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Reset
            </button>
            <Button
              onClick={() => setShowPrint(true)}
              icon={<Download className="w-4 h-4" />}
              size="sm"
            >
              PDF
            </Button>
          </div>
        </div>

        {/* Tab bar (mobile) */}
        <div className="flex lg:hidden border-b border-white/8 bg-[#08080f]/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-purple-300 border-purple-500'
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Form + Templates (desktop always visible, mobile tab-based) ── */}
          <div className={`
            w-full lg:w-[380px] xl:w-[420px] shrink-0 flex-col overflow-y-auto
            border-r border-white/8 bg-[#08080f]
            ${activeTab !== 'edit' && activeTab !== 'templates' ? 'hidden lg:flex' : 'flex'}
          `}>
            {/* Desktop sub-tabs */}
            <div className="hidden lg:flex gap-1 p-3 border-b border-white/8">
              {[{ id: 'edit' as Tab, label: 'Contenu', icon: FileEdit }, { id: 'templates' as Tab, label: 'Design', icon: Palette }].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                    activeTab === t.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-white/50 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'edit' && (
                  <motion.div key="edit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <CVForm cv={cv} onChange={setCv} />
                  </motion.div>
                )}
                {activeTab === 'templates' && (
                  <motion.div key="templates" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <div className="mb-4">
                      <h2 className="font-bold text-white text-sm mb-1">Choisissez votre design</h2>
                      <p className="text-xs text-white/40">12 templates premium — cliquez pour appliquer instantanément</p>
                    </div>
                    <TemplateSidebar
                      selectedId={cv.templateId}
                      onSelect={(id) => { setCv(prev => ({ ...prev, templateId: id })); toast.success('Template appliqué !'); }}
                    />
                  </motion.div>
                )}
                {activeTab === 'preview' && (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 lg:hidden">
                    <p className="text-xs text-white/50">Aperçu en temps réel</p>
                    <div className="bg-white shadow-xl rounded overflow-hidden" style={{ width: 794 * 0.38, height: 1123 * 0.38 }}>
                      <div style={{ transform: 'scale(0.38)', transformOrigin: 'top left', width: 794, height: 1123 }}>
                        <TemplateComp cv={cv} />
                      </div>
                    </div>
                    <Button onClick={() => setShowPrint(true)} icon={<Download className="w-4 h-4" />} className="w-full">
                      Télécharger en PDF
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Live Preview (desktop) ── */}
          <div className="hidden lg:flex flex-1 flex-col bg-[#04040a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/6">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Monitor className="w-3.5 h-3.5" />
                Aperçu en temps réel · A4
              </div>
              <button
                onClick={() => setShowPrint(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 transition-all border border-purple-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                Plein écran / PDF
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-start justify-center p-8">
              <div
                className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded"
                style={{ width: 794 * previewScale, height: 1123 * previewScale, overflow: 'hidden', flexShrink: 0 }}
              >
                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: 794, height: 1123 }}>
                  <TemplateComp cv={cv} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <AnimatePresence>
        {showPrint && <PrintModal cv={cv} onClose={() => setShowPrint(false)} />}
      </AnimatePresence>

      {/* Translate Modal */}
      <AnimatePresence>
        {showTranslate && (
          <TranslateModal
            cv={cv}
            onTranslated={(newCv) => setCv(newCv)}
            onClose={() => setShowTranslate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
