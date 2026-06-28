/* =========================================================================
   Internationalisation — Français par défaut, Anglais en option.
   FR est la source de vérité ; EN suit exactement la même structure.
   ========================================================================= */

export const fr = {
  common: {
    appName: 'Pro Job Copilot',
    start: 'Commencer',
    startFree: 'Commencer gratuitement',
    tryFree: 'Essayer gratuitement',
    back: 'Retour',
    next: 'Suivant',
    cancel: 'Annuler',
    save: 'Enregistrer',
    download: 'Télécharger',
    downloadPdf: 'Télécharger en PDF',
    loading: 'Chargement…',
    analyzing: 'Analyse en cours…',
    generating: 'Génération en cours…',
    translating: 'Traduction en cours…',
    optimizing: 'Optimisation en cours…',
    apply: 'Appliquer',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    or: 'ou',
    soon: 'Bientôt',
    new: 'Nouveau',
    premium: 'Premium',
    free: 'Gratuit',
    useCurrentCV: 'Utiliser mon CV actuel',
    poweredByAi: "Propulsé par l'IA",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    errorNoApiKey:
      "Configuration IA serveur manquante. Ajoutez OPENROUTER_API_KEY dans Netlify pour activer l'IA.",
  },

  nav: {
    home: 'Accueil',
    builder: 'Créer un CV',
    update: 'Mettre à jour un CV',
    analyze: 'Analyser',
    translate: 'Traduire',
    tailor: 'Adapter à une offre',
    features: 'Fonctionnalités',
    templates: 'Modèles',
    howItWorks: 'Comment ça marche',
  },

  hero: {
    badge: "Nº1 de l'IA carrière en Afrique",
    title1: 'Votre carrière,',
    title2: "propulsée par l'IA",
    subtitle:
      "Créez, analysez, traduisez et adaptez un CV qui décroche des entretiens. Un copilote intelligent, pensé pour les talents africains.",
    ctaPrimary: 'Créer mon CV gratuitement',
    ctaSecondary: 'Analyser mon CV',
    stat1: 'CV créés',
    stat2: 'Taux de rappel',
    stat3: 'Modèles premium',
    trustedBy: 'Ils font confiance à nos talents',
  },

  features: {
    eyebrow: 'Tout ce dont vous avez besoin',
    title: 'Un copilote complet pour votre CV',
    subtitle:
      "De la création à la candidature : l'IA vous accompagne à chaque étape.",
    builder: {
      title: 'Création guidée',
      desc: "Remplissez vos informations, choisissez un modèle premium et obtenez un CV professionnel en quelques minutes.",
    },
    analyze: {
      title: 'Analyse intelligente',
      desc: "L'IA évalue votre CV, détecte les points faibles et applique vos modifications en respectant la mise en page.",
    },
    translate: {
      title: 'Traduction professionnelle',
      desc: 'Traduisez votre CV en anglais ou dans la langue de votre choix, avec un vocabulaire métier adapté.',
    },
    tailor: {
      title: 'Adaptation aux offres',
      desc: 'Optimisez votre CV pour une offre précise et passez les filtres ATS sans effort.',
    },
    templates: {
      title: 'Modèles premium',
      desc: 'Des designs élégants et modernes, conçus par des experts, prêts à imprimer.',
    },
    pdf: {
      title: 'Export PDF impeccable',
      desc: 'Téléchargez un PDF haute qualité, parfaitement mis en page, en un clic.',
    },
  },

  templatesSection: {
    eyebrow: 'Modèles premium',
    title: 'Des designs qui inspirent confiance',
    subtitle:
      'Choisissez parmi notre collection de modèles professionnels, puis personnalisez les couleurs à votre image.',
    cta: 'Utiliser ce modèle',
    viewAll: 'Voir tous les modèles',
  },

  steps: {
    eyebrow: 'Simple et rapide',
    title: 'Votre CV professionnel en 3 étapes',
    step1Title: 'Saisissez vos informations',
    step1Desc:
      'Remplissez le formulaire guidé ou importez un CV existant (PDF, image ou texte).',
    step2Title: "Laissez l'IA sublimer",
    step2Desc:
      "L'IA améliore vos textes, corrige les fautes et structure vos expériences.",
    step3Title: 'Téléchargez et postulez',
    step3Desc:
      'Choisissez un modèle premium, exportez en PDF et décrochez l’entretien.',
  },

  testimonials: {
    eyebrow: 'Ils ont décroché le poste',
    title: 'Des résultats concrets',
  },

  ctaBand: {
    title: 'Prêt à décrocher votre prochain emploi ?',
    subtitle: "Rejoignez des milliers de talents qui font confiance à Pro Job Copilot.",
    button: 'Créer mon CV maintenant',
  },

  footer: {
    tagline: 'Le copilote IA des talents africains.',
    product: 'Produit',
    company: 'Entreprise',
    legal: 'Légal',
    rights: 'Tous droits réservés.',
    madeWith: 'Conçu avec passion pour l’Afrique',
  },

  builder: {
    title: 'Créateur de CV',
    subtitle: 'Remplissez, personnalisez, téléchargez.',
    importCta: 'Importer un CV existant',
    importHint: 'PDF, image ou texte — l’IA structure tout automatiquement.',
    tabs: {
      content: 'Contenu',
      design: 'Design',
    },
    sections: {
      personal: 'Informations personnelles',
      summary: 'Résumé professionnel',
      experience: 'Expériences',
      education: 'Formations',
      skills: 'Compétences',
      languages: 'Langues',
      certifications: 'Certifications',
      interests: "Centres d'intérêt",
    },
    fields: {
      fullName: 'Nom complet',
      jobTitle: 'Titre / Poste visé',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      website: 'Site web / Portfolio',
      linkedin: 'LinkedIn',
      photo: 'Photo',
      addPhoto: 'Ajouter une photo',
      removePhoto: 'Retirer',
      showPhoto: 'Afficher la photo sur le CV',
      company: 'Entreprise',
      role: 'Poste',
      location: 'Lieu',
      startDate: 'Début',
      endDate: 'Fin',
      current: 'En cours',
      description: 'Description',
      degree: 'Diplôme',
      school: 'Établissement',
      year: 'Année',
      skillName: 'Compétence',
      level: 'Niveau',
      languageName: 'Langue',
      certName: 'Certification',
      issuer: 'Organisme',
      interest: 'Intérêt',
    },
    ai: {
      improve: "Améliorer avec l'IA",
      improveSummary: 'Rédiger le résumé avec l’IA',
      improveAll: 'Tout optimiser avec l’IA',
      improveExp: 'Reformuler cette expérience',
      askLabel: 'Demander une modification à l’IA',
      askPlaceholder:
        'Ex : « Ajoute une expérience de responsable clientèle chez Togocom à Lomé en 2024 » ou « Rends mon résumé plus percutant »…',
      voiceStart: 'Parler',
      voiceStop: 'Arrêter',
      voiceUnsupported: 'La dictée vocale gratuite du navigateur n’est pas disponible sur cet appareil. Essayez Chrome ou Edge.',
      voiceError: 'Le micro n’a pas pu transcrire. Vérifiez l’autorisation du navigateur puis réessayez.',
      applied: "Modifications appliquées par l'IA",
    },
    design: {
      template: 'Modèle',
      accent: 'Couleur d’accent',
      font: 'Police',
    },
    preview: 'Aperçu',
    addExperience: 'Ajouter une expérience',
    addEducation: 'Ajouter une formation',
    addSkill: 'Ajouter une compétence',
    addLanguage: 'Ajouter une langue',
    addCertification: 'Ajouter une certification',
    emptyExp: 'Aucune expérience pour l’instant. Ajoutez-en une !',
  },

  analyze: {
    title: 'Analyse de CV par l’IA',
    subtitle:
      'Importez votre CV : l’IA l’évalue, propose des améliorations et applique vos modifications.',
    dropTitle: 'Déposez votre CV ici',
    dropHint: 'PDF, PNG, JPG ou collez le texte ci-dessous',
    pasteLabel: 'Ou collez le contenu de votre CV',
    pastePlaceholder: 'Collez ici le texte de votre CV…',
    analyzeBtn: 'Analyser mon CV',
    scoreLabel: 'Score global',
    strengths: 'Points forts',
    weaknesses: 'Points à améliorer',
    suggestions: 'Suggestions concrètes',
    keywords: 'Mots-clés recommandés (ATS)',
    refineTitle: 'Affiner avec l’IA',
    refineHint:
      'Décrivez les modifications souhaitées : l’IA met à jour le contenu et la mise en page.',
    refinePlaceholder:
      'Ex : « Ajoute mes 2 ans d’expérience en vente », « Mets en avant le leadership »…',
    openInBuilder: 'Ouvrir dans le créateur',
    reanalyze: 'Relancer l’analyse',
  },

  update: {
    title: 'Mettre à jour un CV importé',
    subtitle:
      'Importez un CV existant, écrivez ce que vous voulez ajouter ou corriger, puis laissez l’IA réinsérer la modification au bon endroit avec une rédaction professionnelle.',
    stepImportTitle: 'Importer le CV',
    stepImportText: 'PDF, image ou texte : l’IA lit le document et le transforme en CV structuré.',
    stepInstructionTitle: 'Décrire la mise à jour',
    stepInstructionText: 'Ajoutez une expérience, une formation, une compétence, un résumé ou une correction.',
    stepTemplateTitle: 'Choisir le design',
    stepTemplateText: 'Sélectionnez un template premium et une couleur, puis téléchargez le CV final.',
    instructionTitle: 'Quelle modification faut-il intégrer ?',
    instructionHelp:
      'L’IA analyse le CV importé, comprend la demande, place l’information dans la bonne section et reformule professionnellement sans casser la structure.',
    instructionPlaceholder:
      'Ex : Ajoute mon poste de Commercial B2B chez FINAB de janvier 2024 à aujourd’hui, avec prospection, suivi clients et négociation de contrats…',
    applyUpdate: 'Mettre à jour le CV avec l’IA',
    updateDone: 'CV mis à jour : la modification a été intégrée et le rendu est prêt.',
    templateChoiceTitle: 'Template du CV mis à jour',
  },

  translate: {
    title: 'Traduction de CV',
    subtitle:
      'Traduisez votre CV dans une autre langue avec un vocabulaire professionnel adapté.',
    sourceLabel: 'CV à traduire',
    targetLabel: 'Traduire vers',
    translateBtn: 'Traduire le CV',
    resultLabel: 'CV traduit',
    keepLayout: 'La mise en page et la structure sont conservées.',
    openInBuilder: 'Ouvrir dans le créateur',
  },

  tailor: {
    title: 'Adapter à une offre d’emploi',
    subtitle:
      'Collez une offre : l’IA réécrit votre CV pour maximiser vos chances et passer les filtres ATS.',
    cvLabel: 'Votre CV',
    jobLabel: 'Description de l’offre',
    jobPlaceholder: 'Collez ici l’intitulé et la description du poste…',
    tailorBtn: 'Adapter mon CV',
    openInBuilder: 'Ouvrir dans le créateur',
  },

  levels: {
    Débutant: 'Débutant',
    Intermédiaire: 'Intermédiaire',
    Avancé: 'Avancé',
    Expert: 'Expert',
  },
};

export const en: typeof fr = {
  common: {
    appName: 'Pro Job Copilot',
    start: 'Get started',
    startFree: 'Start for free',
    tryFree: 'Try for free',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    save: 'Save',
    download: 'Download',
    downloadPdf: 'Download as PDF',
    loading: 'Loading…',
    analyzing: 'Analyzing…',
    generating: 'Generating…',
    translating: 'Translating…',
    optimizing: 'Optimizing…',
    apply: 'Apply',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    or: 'or',
    soon: 'Soon',
    new: 'New',
    premium: 'Premium',
    free: 'Free',
    useCurrentCV: 'Use my current CV',
    poweredByAi: 'Powered by AI',
    errorGeneric: 'Something went wrong. Please try again.',
    errorNoApiKey: 'Missing server AI configuration. Set OPENROUTER_API_KEY in Netlify to enable AI.',
  },

  nav: {
    home: 'Home',
    builder: 'Build a CV',
    update: 'Update a CV',
    analyze: 'Analyze',
    translate: 'Translate',
    tailor: 'Tailor to a job',
    features: 'Features',
    templates: 'Templates',
    howItWorks: 'How it works',
  },

  hero: {
    badge: 'Africa’s #1 career AI',
    title1: 'Your career,',
    title2: 'powered by AI',
    subtitle:
      'Create, analyze, translate and tailor a resume that lands interviews. A smart copilot built for African talent.',
    ctaPrimary: 'Build my CV for free',
    ctaSecondary: 'Analyze my CV',
    stat1: 'CVs created',
    stat2: 'Callback rate',
    stat3: 'Premium templates',
    trustedBy: 'They trust our talent',
  },

  features: {
    eyebrow: 'Everything you need',
    title: 'A complete copilot for your resume',
    subtitle: 'From writing to applying — AI guides you every step of the way.',
    builder: {
      title: 'Guided builder',
      desc: 'Fill in your details, pick a premium template and get a professional CV in minutes.',
    },
    analyze: {
      title: 'Smart analysis',
      desc: 'AI scores your CV, spots weaknesses and applies your edits while keeping the layout.',
    },
    translate: {
      title: 'Professional translation',
      desc: 'Translate your CV into English or any language with the right industry wording.',
    },
    tailor: {
      title: 'Job tailoring',
      desc: 'Optimize your CV for a specific job and pass ATS filters effortlessly.',
    },
    templates: {
      title: 'Premium templates',
      desc: 'Elegant, modern, expert-crafted designs, ready to print.',
    },
    pdf: {
      title: 'Flawless PDF export',
      desc: 'Download a high-quality, perfectly laid-out PDF in one click.',
    },
  },

  templatesSection: {
    eyebrow: 'Premium templates',
    title: 'Designs that inspire confidence',
    subtitle:
      'Choose from our collection of professional templates, then customize the colors to match you.',
    cta: 'Use this template',
    viewAll: 'View all templates',
  },

  steps: {
    eyebrow: 'Simple and fast',
    title: 'Your professional CV in 3 steps',
    step1Title: 'Enter your details',
    step1Desc:
      'Fill the guided form or import an existing CV (PDF, image or text).',
    step2Title: 'Let AI elevate it',
    step2Desc: 'AI improves your wording, fixes mistakes and structures your experience.',
    step3Title: 'Download and apply',
    step3Desc: 'Pick a premium template, export to PDF and land the interview.',
  },

  testimonials: {
    eyebrow: 'They got the job',
    title: 'Real results',
  },

  ctaBand: {
    title: 'Ready to land your next job?',
    subtitle: 'Join thousands of talents who trust Pro Job Copilot.',
    button: 'Build my CV now',
  },

  footer: {
    tagline: 'The AI copilot for African talent.',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    rights: 'All rights reserved.',
    madeWith: 'Crafted with passion for Africa',
  },

  builder: {
    title: 'CV Builder',
    subtitle: 'Fill in, customize, download.',
    importCta: 'Import an existing CV',
    importHint: 'PDF, image or text — AI structures everything automatically.',
    tabs: {
      content: 'Content',
      design: 'Design',
    },
    sections: {
      personal: 'Personal information',
      summary: 'Professional summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      certifications: 'Certifications',
      interests: 'Interests',
    },
    fields: {
      fullName: 'Full name',
      jobTitle: 'Title / Target role',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      website: 'Website / Portfolio',
      linkedin: 'LinkedIn',
      photo: 'Photo',
      addPhoto: 'Add a photo',
      removePhoto: 'Remove',
      showPhoto: 'Show photo on CV',
      company: 'Company',
      role: 'Role',
      location: 'Location',
      startDate: 'Start',
      endDate: 'End',
      current: 'Current',
      description: 'Description',
      degree: 'Degree',
      school: 'School',
      year: 'Year',
      skillName: 'Skill',
      level: 'Level',
      languageName: 'Language',
      certName: 'Certification',
      issuer: 'Issuer',
      interest: 'Interest',
    },
    ai: {
      improve: 'Improve with AI',
      improveSummary: 'Write summary with AI',
      improveAll: 'Optimize everything with AI',
      improveExp: 'Rephrase this experience',
      askLabel: 'Ask AI for a change',
      askPlaceholder:
        'E.g. “Add a customer success role at Togocom in Lomé in 2024” or “Make my summary more impactful”…',
      voiceStart: 'Speak',
      voiceStop: 'Stop',
      voiceUnsupported: 'Free browser voice dictation is not available on this device. Try Chrome or Edge.',
      voiceError: 'The microphone could not transcribe. Check browser permission and try again.',
      applied: 'Changes applied by AI',
    },
    design: {
      template: 'Template',
      accent: 'Accent color',
      font: 'Font',
    },
    preview: 'Preview',
    addExperience: 'Add experience',
    addEducation: 'Add education',
    addSkill: 'Add skill',
    addLanguage: 'Add language',
    addCertification: 'Add certification',
    emptyExp: 'No experience yet. Add one!',
  },

  analyze: {
    title: 'AI CV Analysis',
    subtitle:
      'Import your CV: AI scores it, suggests improvements and applies your edits.',
    dropTitle: 'Drop your CV here',
    dropHint: 'PDF, PNG, JPG or paste the text below',
    pasteLabel: 'Or paste your CV content',
    pastePlaceholder: 'Paste your CV text here…',
    analyzeBtn: 'Analyze my CV',
    scoreLabel: 'Overall score',
    strengths: 'Strengths',
    weaknesses: 'Areas to improve',
    suggestions: 'Concrete suggestions',
    keywords: 'Recommended keywords (ATS)',
    refineTitle: 'Refine with AI',
    refineHint:
      'Describe the changes you want: AI updates the content and the layout.',
    refinePlaceholder:
      'E.g. “Add my 2 years of sales experience”, “Highlight leadership”…',
    openInBuilder: 'Open in builder',
    reanalyze: 'Re-run analysis',
  },

  update: {
    title: 'Update an imported CV',
    subtitle:
      'Import an existing CV, describe what you want to add or correct, and let AI insert the change in the right place with professional wording.',
    stepImportTitle: 'Import the CV',
    stepImportText: 'PDF, image or text: AI reads the document and turns it into structured CV data.',
    stepInstructionTitle: 'Describe the update',
    stepInstructionText: 'Add an experience, education item, skill, summary or correction.',
    stepTemplateTitle: 'Choose the design',
    stepTemplateText: 'Pick a premium template and color, then download the final CV.',
    instructionTitle: 'What change should be integrated?',
    instructionHelp:
      'AI analyzes the imported CV, understands the request, places the information in the right section and rewrites it professionally without breaking the structure.',
    instructionPlaceholder:
      'E.g. Add my B2B Sales role at FINAB from January 2024 to today, with prospecting, client follow-up and contract negotiation…',
    applyUpdate: 'Update CV with AI',
    updateDone: 'CV updated: the change has been integrated and the rendering is ready.',
    templateChoiceTitle: 'Template for the updated CV',
  },

  translate: {
    title: 'CV Translation',
    subtitle:
      'Translate your CV into another language with the right professional wording.',
    sourceLabel: 'CV to translate',
    targetLabel: 'Translate to',
    translateBtn: 'Translate CV',
    resultLabel: 'Translated CV',
    keepLayout: 'Layout and structure are preserved.',
    openInBuilder: 'Open in builder',
  },

  tailor: {
    title: 'Tailor to a job',
    subtitle:
      'Paste a job offer: AI rewrites your CV to maximize your chances and pass ATS filters.',
    cvLabel: 'Your CV',
    jobLabel: 'Job description',
    jobPlaceholder: 'Paste the job title and description here…',
    tailorBtn: 'Tailor my CV',
    openInBuilder: 'Open in builder',
  },

  levels: {
    Débutant: 'Beginner',
    Intermédiaire: 'Intermediate',
    Avancé: 'Advanced',
    Expert: 'Expert',
  },
};

export const dictionaries = { fr, en };
