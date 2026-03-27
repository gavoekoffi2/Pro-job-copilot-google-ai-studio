export type Lang = 'fr' | 'en';

const t: Record<Lang, Record<string, string>> = {
  fr: {
    // ── Navigation ──────────────────────────────────────────────
    'nav.dashboard':    'Tableau de bord',
    'nav.resume':       'CV & Analyse',
    'nav.coverLetter':  'Lettre motivation',
    'nav.jobAnalyzer':  'Analyser offre',
    'nav.interview':    'Entretien',
    'nav.linkedin':     'LinkedIn',
    'nav.salary':       'Négociation salaire',
    'nav.tracker':      'Suivi candidatures',
    'nav.cvBuilder':    'Créateur de CV',
    'nav.outreach':     'Emails pro',
    'nav.skillsGap':    'Compétences',
    'nav.compare':      'Comparer offres',
    'nav.cvImport':     'Importer CV photo',
    'nav.getStarted':   'Commencer',

    // ── Common ──────────────────────────────────────────────────
    'common.generate':   'Générer',
    'common.analyze':    'Analyser',
    'common.copy':       'Copier',
    'common.download':   'Télécharger',
    'common.save':       'Enregistrer',
    'common.reset':      'Réinitialiser',
    'common.loading':    'Chargement…',
    'common.error':      'Une erreur est survenue',
    'common.translate':  'Traduire',
    'common.import':     'Importer',
    'common.preview':    'Aperçu',
    'common.print':      'Imprimer / PDF',
    'common.close':      'Fermer',
    'common.back':       'Retour',
    'common.next':       'Suivant',
    'common.optional':   'optionnel',
    'common.required':   'requis',
    'common.new':        'Nouveau',

    // ── Landing Hero ────────────────────────────────────────────
    'landing.badge':       'Propulsé par Google Gemini AI',
    'landing.title1':      'Votre Copilote',
    'landing.title2':      'Carrière IA',
    'landing.subtitle':    "Rejoignez des milliers de candidats qui décrochent des emplois 3× plus vite grâce à notre suite d'outils IA — CV, lettres, entretiens, négociation salariale.",
    'landing.cta1':        'Commencer gratuitement',
    'landing.cta2':        'Analyser mon CV',
    'landing.trust1':      'Sans inscription',
    'landing.trust2':      'Propulsé par Gemini AI',
    'landing.trust3':      'Données privées',
    'landing.trust4':      '100% Gratuit',

    // ── Landing Features ─────────────────────────────────────────
    'landing.features.title':    'Tout ce dont vous avez besoin',
    'landing.features.subtitle': "Une suite complète d'outils IA pour chaque étape de votre recherche d'emploi.",

    // ── Landing Stats ───────────────────────────────────────────
    'landing.stats.resumes':     'CV analysés',
    'landing.stats.interview':   "Taux d'entretiens",
    'landing.stats.letters':     'Lettres générées',
    'landing.stats.rating':      'Satisfaction',
    'landing.stats.countries':   'Pays couverts',

    // ── Landing Testimonials ─────────────────────────────────────
    'landing.testimonials.title':    'Ils ont décroché leur emploi de rêve',
    'landing.testimonials.subtitle': 'Des milliers de professionnels font confiance à ProJob Copilot.',

    // ── CV Builder ──────────────────────────────────────────────
    'cv.translateBtn':   'Traduire le CV',
    'cv.importBtn':      'Importer depuis photo',
    'cv.saveStatus':     'Enregistré',
    'cv.loadSample':     'CV exemple',
    'cv.printBtn':       'Télécharger PDF',

    // ── CV Import ───────────────────────────────────────────────
    'import.title':         'Importer un CV depuis une photo',
    'import.subtitle':      "Prenez en photo votre CV ou importez une image — l'IA extrait toutes les informations automatiquement.",
    'import.dropzone':      'Glissez une photo de CV ici',
    'import.dropzoneOr':    'ou cliquez pour parcourir',
    'import.formats':       'Formats : JPG, PNG, WEBP — max 10 Mo',
    'import.analyze':       "Analyser avec l'IA",
    'import.analyzing':     'Analyse en cours…',
    'import.keepDesign':    'Conserver ma mise en forme',
    'import.chooseTemplate':'Choisir un nouveau design',
    'import.loadBuilder':   'Charger dans le Créateur',
    'import.success':       'CV extrait avec succès !',

    // ── CV Translate ─────────────────────────────────────────────
    'translate.title':      'Traduire le CV',
    'translate.subtitle':   'Toutes les informations sont traduites en conservant votre mise en page.',
    'translate.target':     'Traduire en',
    'translate.start':      'Lancer la traduction',
    'translate.progress':   'Traduction en cours…',
    'translate.success':    'CV traduit avec succès !',
    'translate.langs.fr':   'Français',
    'translate.langs.en':   'Anglais',
    'translate.langs.es':   'Espagnol',
    'translate.langs.de':   'Allemand',
    'translate.langs.pt':   'Portugais',
    'translate.langs.ar':   'Arabe',
    'translate.langs.zh':   'Chinois (simplifié)',
  },

  en: {
    // ── Navigation ──────────────────────────────────────────────
    'nav.dashboard':    'Dashboard',
    'nav.resume':       'Resume',
    'nav.coverLetter':  'Cover Letter',
    'nav.jobAnalyzer':  'Job Analyzer',
    'nav.interview':    'Interview',
    'nav.linkedin':     'LinkedIn',
    'nav.salary':       'Salary',
    'nav.tracker':      'Tracker',
    'nav.cvBuilder':    'CV Builder',
    'nav.outreach':     'Emails',
    'nav.skillsGap':    'Skills Gap',
    'nav.compare':      'Compare Offers',
    'nav.cvImport':     'Import CV Photo',
    'nav.getStarted':   'Get Started',

    // ── Common ──────────────────────────────────────────────────
    'common.generate':   'Generate',
    'common.analyze':    'Analyze',
    'common.copy':       'Copy',
    'common.download':   'Download',
    'common.save':       'Save',
    'common.reset':      'Reset',
    'common.loading':    'Loading…',
    'common.error':      'An error occurred',
    'common.translate':  'Translate',
    'common.import':     'Import',
    'common.preview':    'Preview',
    'common.print':      'Print / PDF',
    'common.close':      'Close',
    'common.back':       'Back',
    'common.next':       'Next',
    'common.optional':   'optional',
    'common.required':   'required',
    'common.new':        'New',

    // ── Landing Hero ────────────────────────────────────────────
    'landing.badge':       'Powered by Google Gemini AI',
    'landing.title1':      'Your AI-Powered',
    'landing.title2':      'Career Copilot',
    'landing.subtitle':    'Join thousands of job seekers who land roles 3× faster with our AI suite — resumes, cover letters, interviews, salary negotiation.',
    'landing.cta1':        'Start for Free',
    'landing.cta2':        'Analyze My Resume',
    'landing.trust1':      'No signup required',
    'landing.trust2':      'Powered by Gemini AI',
    'landing.trust3':      'Privacy-first',
    'landing.trust4':      '100% Free',

    // ── Landing Features ─────────────────────────────────────────
    'landing.features.title':    'Everything you need',
    'landing.features.subtitle': 'A complete AI toolkit for every step of your job search.',

    // ── Landing Stats ───────────────────────────────────────────
    'landing.stats.resumes':     'Resumes Analyzed',
    'landing.stats.interview':   'Interview Rate Increase',
    'landing.stats.letters':     'Cover Letters Generated',
    'landing.stats.rating':      'User Satisfaction',
    'landing.stats.countries':   'Countries',

    // ── Landing Testimonials ─────────────────────────────────────
    'landing.testimonials.title':    'They landed their dream job',
    'landing.testimonials.subtitle': 'Thousands of professionals trust ProJob Copilot.',

    // ── CV Builder ──────────────────────────────────────────────
    'cv.translateBtn':   'Translate CV',
    'cv.importBtn':      'Import from Photo',
    'cv.saveStatus':     'Saved',
    'cv.loadSample':     'Sample CV',
    'cv.printBtn':       'Download PDF',

    // ── CV Import ───────────────────────────────────────────────
    'import.title':         'Import a CV from a Photo',
    'import.subtitle':      'Take a photo of your CV or upload an image — AI extracts all information automatically.',
    'import.dropzone':      'Drop a CV photo here',
    'import.dropzoneOr':    'or click to browse',
    'import.formats':       'Formats: JPG, PNG, WEBP — max 10 MB',
    'import.analyze':       'Analyze with AI',
    'import.analyzing':     'Analyzing…',
    'import.keepDesign':    'Keep my current layout',
    'import.chooseTemplate':'Choose a new design',
    'import.loadBuilder':   'Load in Builder',
    'import.success':       'CV extracted successfully!',

    // ── CV Translate ─────────────────────────────────────────────
    'translate.title':      'Translate CV',
    'translate.subtitle':   'All content is translated while preserving your layout.',
    'translate.target':     'Translate to',
    'translate.start':      'Start Translation',
    'translate.progress':   'Translating…',
    'translate.success':    'CV translated successfully!',
    'translate.langs.fr':   'French',
    'translate.langs.en':   'English',
    'translate.langs.es':   'Spanish',
    'translate.langs.de':   'German',
    'translate.langs.pt':   'Portuguese',
    'translate.langs.ar':   'Arabic',
    'translate.langs.zh':   'Chinese (Simplified)',
  },
};

export function getTranslations(lang: Lang) {
  return (key: string): string => t[lang][key] ?? t['en'][key] ?? key;
}

export default t;
