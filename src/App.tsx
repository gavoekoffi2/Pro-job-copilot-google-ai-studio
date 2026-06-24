import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AppView, type CVData, type TemplateId } from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Spinner } from './components/ui/ui';
import { exampleCV } from './lib/sampleData';
import { DEFAULT_TEMPLATE } from './data/templates';

// Vues lourdes chargées à la demande (la landing reste instantanée).
const CVBuilder = lazy(() =>
  import('./components/builder/CVBuilder').then((m) => ({ default: m.CVBuilder })),
);
const AnalyzeView = lazy(() =>
  import('./components/flows/AnalyzeView').then((m) => ({ default: m.AnalyzeView })),
);
const UpdateCVView = lazy(() =>
  import('./components/flows/UpdateCVView').then((m) => ({ default: m.UpdateCVView })),
);
const TranslateView = lazy(() =>
  import('./components/flows/TranslateView').then((m) => ({ default: m.TranslateView })),
);
const TailorView = lazy(() =>
  import('./components/flows/TailorView').then((m) => ({ default: m.TailorView })),
);

function ViewLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center pt-16">
      <Spinner className="h-8 w-8 text-brand-500" />
    </div>
  );
}

function AppShell() {
  const { locale } = useLanguage();
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [cvData, setCvData] = useState<CVData>(() => exampleCV());
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [accent, setAccent] = useState('#10b981');

  // Remonter en haut à chaque changement de vue.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const openInBuilder = useCallback((cv: CVData) => {
    setCvData(cv);
    setView(AppView.BUILDER);
  }, []);

  const pickTemplate = useCallback((id: TemplateId) => {
    setTemplateId(id);
    setView(AppView.BUILDER);
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar view={view} setView={setView} />

      <main>
        {view === AppView.HOME ? (
          <LandingPage setView={setView} onPickTemplate={pickTemplate} />
        ) : (
          <Suspense fallback={<ViewLoader />}>
            {view === AppView.BUILDER && (
              <CVBuilder
                data={cvData}
                setData={setCvData}
                templateId={templateId}
                setTemplateId={setTemplateId}
                accent={accent}
                setAccent={setAccent}
                locale={locale}
              />
            )}
            {view === AppView.UPDATE && (
              <UpdateCVView
                data={cvData}
                templateId={templateId}
                setTemplateId={setTemplateId}
                accent={accent}
                setAccent={setAccent}
                locale={locale}
                onOpenInBuilder={openInBuilder}
              />
            )}
            {view === AppView.ANALYZE && (
              <AnalyzeView
                data={cvData}
                templateId={templateId}
                accent={accent}
                locale={locale}
                onOpenInBuilder={openInBuilder}
              />
            )}
            {view === AppView.TRANSLATE && (
              <TranslateView
                data={cvData}
                templateId={templateId}
                accent={accent}
                locale={locale}
                onOpenInBuilder={openInBuilder}
              />
            )}
            {view === AppView.TAILOR && (
              <TailorView
                data={cvData}
                templateId={templateId}
                accent={accent}
                locale={locale}
                onOpenInBuilder={openInBuilder}
              />
            )}
          </Suspense>
        )}
      </main>

      {view === AppView.HOME && <Footer setView={setView} />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
