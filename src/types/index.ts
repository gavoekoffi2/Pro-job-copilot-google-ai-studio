export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  bio?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Resume {
  id: string;
  title: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
  score?: number;
  suggestions?: string[];
}

export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  languages?: string[];
  projects?: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface CoverLetter {
  id: string;
  title: string;
  company: string;
  position: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  status: 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  salary?: string;
  url?: string;
  notes?: string;
  appliedDate?: string;
  deadline?: string;
  contactName?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company';
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAnswer?: string;
  userAnswer?: string;
  feedback?: string;
  score?: number;
}

export interface InterviewSession {
  id: string;
  company: string;
  position: string;
  type: 'behavioral' | 'technical' | 'mixed';
  questions: InterviewQuestion[];
  overallScore?: number;
  overallFeedback?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  responseRate: number;
  resumesCreated: number;
  coverLettersGenerated: number;
  interviewSessionsCompleted: number;
}

export type AIAction =
  | 'optimize-resume'
  | 'generate-cover-letter'
  | 'interview-prep'
  | 'job-match'
  | 'skill-gap'
  | 'salary-research';
