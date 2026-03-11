<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# ProJob Copilot

### AI-Powered Job Search Assistant Built with Google Gemini

The smartest way to land your dream job. Create optimized resumes, generate tailored cover letters, practice interviews with AI coaching, and track all your applications in one place.

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Powered by Gemini](https://img.shields.io/badge/Google-Gemini_AI-blue?style=flat-square&logo=google)](https://aistudio.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## Features

- **AI Resume Builder** — Create ATS-optimized resumes with AI scoring and improvement suggestions
- **Cover Letter Generator** — Generate personalized, compelling cover letters tailored to each job
- **Interview Prep Coach** — Practice with AI-generated questions and get real-time feedback on your answers
- **Job Application Tracker** — Track all applications with status pipeline, filters, and grid/list views
- **Profile Management** — Manage your experience, education, and skills in one place
- **Skill Gap Analysis** — Identify missing skills and get learning recommendations
- **Beautiful UI** — Modern, responsive design with smooth animations powered by Framer Motion

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| AI | Google Gemini API |
| State | Zustand (with persistence) |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/gavoekoffi2/Pro-job-copilot-google-ai-studio.git
cd Pro-job-copilot-google-ai-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GOOGLE_GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/ai/          # Gemini AI API routes
│   ├── auth/            # Login & Register pages
│   ├── dashboard/       # All dashboard pages
│   │   ├── resume/      # AI Resume Builder
│   │   ├── cover-letter/# Cover Letter Generator
│   │   ├── interview/   # Interview Prep Coach
│   │   ├── jobs/        # Job Application Tracker
│   │   └── profile/     # Profile Management
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/          # Sidebar, Navbar, DashboardLayout
│   └── ui/              # Reusable UI components
├── lib/
│   ├── gemini.ts        # Google Gemini AI integration
│   ├── store.ts         # Zustand state management
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with Google Gemini AI</p>
  <a href="https://aistudio.google.com/apps">Start building with AI Studio</a>
</div>
