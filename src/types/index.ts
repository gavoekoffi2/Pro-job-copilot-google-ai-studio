// ─── Resume Analysis ────────────────────────────────────────
export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missingKeywords: string[];
  sectionScores: {
    summary: number;
    experience: number;
    education: number;
    skills: number;
    formatting: number;
  };
}

// ─── Job Description Analysis ───────────────────────────────
export interface JobAnalysis {
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceLevel: string;
  estimatedSalaryRange: string;
  redFlags: string[];
  cultureHints: string[];
  matchScore?: number;
  missingFromResume?: string[];
  summary: string;
}

// ─── Interview Coaching ─────────────────────────────────────
export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  tip: string;
}

export interface AnswerFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  overallFeedback: string;
}

// ─── LinkedIn Optimization ──────────────────────────────────
export interface LinkedInSections {
  headline: string;
  about: string;
  experience: string;
  skills: string;
}

export interface LinkedInOptimization {
  overallScore: number;
  headline: { improved: string; explanation: string; score: number };
  about: { improved: string; explanation: string; score: number };
  experience: { improved: string; explanation: string; score: number };
  skills: { improved: string; explanation: string; score: number };
  generalTips: string[];
}

// ─── Salary Insights ────────────────────────────────────────
export interface SalaryInsights {
  marketRange: { min: number; median: number; max: number };
  currency: string;
  negotiationScript: string;
  talkingPoints: string[];
  emailTemplate: string;
  tips: string[];
}

// ─── Application Tracker ─────────────────────────────────────
export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateAdded: string;
  dateUpdated: string;
  link?: string;
  notes?: string;
  salary?: string;
  location?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────
export interface DashboardStats {
  resumesAnalyzed: number;
  coverLettersGenerated: number;
  interviewsCompleted: number;
  applicationsTracked: number;
  lastActivity: string;
}

// ─── Activity Log ─────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  type: 'resume' | 'cover-letter' | 'interview' | 'linkedin' | 'salary' | 'job-analysis' | 'tracker';
  description: string;
  timestamp: string;
}

// ─── Cover Letter ─────────────────────────────────────────────
export type CoverLetterTone = 'professional' | 'enthusiastic' | 'concise';

// ─── Interview Session ────────────────────────────────────────
export interface InterviewSession {
  questions: InterviewQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  feedbacks: Record<string, AnswerFeedback>;
  totalScore: number;
  completed: boolean;
}

// ─── Outreach Email ───────────────────────────────────────────
export type OutreachEmailType = 'cold-email' | 'linkedin-connect' | 'follow-up' | 'thank-you' | 'referral';

export interface OutreachContext {
  type: OutreachEmailType;
  yourName: string;
  yourBackground: string;
  recipientName: string;
  companyName: string;
  jobTitle: string;
  specificInsight: string;
  interviewDate: string;
  referrerName: string;
  tone: 'professional' | 'friendly' | 'concise';
}

export interface OutreachEmail {
  subject: string;
  body: string;
}

// ─── Job Offer Comparison ─────────────────────────────────────
export interface JobOffer {
  id: string;
  company: string;
  role: string;
  baseSalary: number;
  bonus: number;
  equity: string;
  location: string;
  remote: 'fully-remote' | 'hybrid' | 'on-site';
  benefits: string;
  notes: string;
}

export interface OfferAnalysis {
  financialScore: number;
  growthScore: number;
  workLifeScore: number;
  overallScore: number;
  pros: string[];
  cons: string[];
  fiveYearComp: number;
}

export interface OfferComparison {
  winner: string;
  analyses: Record<string, OfferAnalysis>;
  recommendation: string;
  questionsToAsk: Record<string, string[]>;
}

// ─── Skills Gap Analysis ──────────────────────────────────────
export interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  learningPath: string;
  timeEstimate: string;
  resources: string[];
}

export interface SkillsGapAnalysis {
  readinessScore: number;
  matchingSkills: string[];
  criticalGaps: SkillGap[];
  thirtyDayPlan: string[];
  sixtyDayPlan: string[];
  ninetyDayPlan: string[];
  summary: string;
}
