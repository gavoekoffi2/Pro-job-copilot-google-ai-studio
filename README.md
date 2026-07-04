<div align="center">

# 🚀 JobTask AI

### Votre carrière, propulsée par l'IA — le copilote des talents africains

Créez, analysez, traduisez et adaptez un CV professionnel qui décroche des entretiens, en quelques minutes.

[![React](https://img.shields.io/badge/React-19-149eca)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Gemini%202.5%20Flash-8e75ff)](https://openrouter.ai/)

</div>

---

## ✨ Fonctionnalités

| | Fonctionnalité | Description |
|---|---|---|
| 📝 | **Création guidée** | Remplissez un formulaire intuitif, choisissez un modèle premium et obtenez un CV professionnel instantanément, avec aperçu en temps réel. |
| 🎨 | **12 modèles premium** | Des designs élégants et variés (moderne, professionnel, créatif, minimaliste, élégant), couleur d'accent personnalisable. |
| 🔍 | **Analyse intelligente** | L'IA évalue votre CV (score ATS sur 100), identifie forces, faiblesses, mots-clés manquants et suggestions concrètes. |
| 🪄 | **Modifications par langage naturel** | Demandez « Ajoute une expérience de stagiaire marketing en 2023 » : l'IA intègre la modification au bon endroit, avec une mise en forme soignée. |
| 🌍 | **Traduction professionnelle** | Traduisez votre CV en anglais (ou 7 langues), avec un vocabulaire métier adapté et la mise en page préservée. |
| 🎯 | **Adaptation aux offres** | Optimisez votre CV pour une offre précise et passez les filtres ATS sans effort. |
| 📄 | **Import & OCR** | Importez un CV existant (PDF / image / texte) : l'IA le structure automatiquement. |
| ⬇️ | **Export PDF impeccable** | Téléchargez un PDF haute qualité, parfaitement mis en page, en un clic. |
| 🇫🇷 | **Français par défaut** | Toute la plateforme est en français, avec bascule vers l'anglais en un clic. |

## 🛠️ Stack technique

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** (système de design premium sur mesure)
- **Framer Motion** (animations et motion design)
- **OpenRouter** via fonction Netlify sécurisée (`/.netlify/functions/ai`) pour les fonctionnalités IA
- **jsPDF** + **html2canvas** (export PDF, chargés à la demande)
- **lucide-react** (icônes)

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ et npm
- Une clé API OpenRouter configurée côté Netlify (`OPENROUTER_API_KEY`)

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la clé API
cp .env.example .env.local
# puis éditez .env.local si vous testez les fonctions Netlify localement

# 3. Lancer en développement
npm run dev
```

L'application est disponible sur http://localhost:3000.

### Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (`dist/`) |
| `npm run preview` | Prévisualiser le build |
| `npm run typecheck` | Vérification TypeScript |

## 📁 Structure du projet

```
src/
├── components/
│   ├── builder/        # Constructeur de CV (formulaire, aperçu, export)
│   ├── cv/
│   │   ├── templates/  # Les 12 modèles premium
│   │   ├── CVRenderer  # Dispatcher de templates
│   │   └── cvParts     # Briques de rendu partagées
│   ├── flows/          # Analyser, Traduire, Adapter
│   ├── ui/             # Boutons, logo, sélecteur de langue…
│   ├── LandingPage     # Page d'accueil premium
│   └── Navbar / Footer
├── i18n/               # Internationalisation (FR par défaut + EN)
├── lib/                # Utilitaires, images, export PDF, données d'exemple
├── services/           # geminiService — toute la logique IA
├── data/               # Catalogue des templates
└── types.ts            # Modèle de données
```

## 🌐 Déploiement

Le projet génère des fichiers statiques (`npm run build` → `dist/`) déployables sur
Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.

> ✅ La clé IA n’est pas exposée au navigateur : les appels passent par la fonction Netlify
> `/.netlify/functions/ai`, qui lit `OPENROUTER_API_KEY` côté serveur.

## 🖼️ Crédits

- Photographies : [Pexels](https://www.pexels.com) (licence gratuite) — talents africains.
- Conçu avec passion pour l'Afrique. 💛

---

<div align="center">
<sub>Propulsé par OpenRouter · IA serveur sécurisée</sub>
</div>
