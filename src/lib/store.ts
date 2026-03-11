import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  Resume,
  CoverLetter,
  JobApplication,
  InterviewSession,
} from '@/types';
import { generateId } from './utils';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  resumes: Resume[];
  coverLetters: CoverLetter[];
  applications: JobApplication[];
  interviewSessions: InterviewSession[];

  // Auth actions
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Resume actions
  addResume: (resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => Resume;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;

  // Cover letter actions
  addCoverLetter: (letter: Omit<CoverLetter, 'id' | 'createdAt' | 'updatedAt'>) => CoverLetter;
  updateCoverLetter: (id: string, data: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;

  // Application actions
  addApplication: (app: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => JobApplication;
  updateApplication: (id: string, data: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;

  // Interview actions
  addInterviewSession: (session: Omit<InterviewSession, 'id' | 'createdAt'>) => InterviewSession;
  updateInterviewSession: (id: string, data: Partial<InterviewSession>) => void;
  deleteInterviewSession: (id: string) => void;
}

const demoUser: User = {
  id: 'demo-user',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  title: 'Full Stack Developer',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  bio: 'Passionate developer with 5+ years of experience building web applications.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      current: true,
      description: 'Led frontend development for the main product.',
      achievements: [
        'Improved page load time by 40%',
        'Mentored 3 junior developers',
        'Implemented design system used across 5 products',
      ],
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      description: 'Built and maintained multiple web applications.',
      achievements: [
        'Developed REST API serving 1M+ requests/day',
        'Reduced infrastructure costs by 30%',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      current: false,
      gpa: '3.7',
    },
  ],
  createdAt: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      resumes: [],
      coverLetters: [],
      applications: [],
      interviewSessions: [],

      login: (email: string, _password: string) => {
        const user = { ...demoUser, email };
        set({ user, isAuthenticated: true });
        return true;
      },

      register: (name: string, email: string, _password: string) => {
        const user: User = {
          ...demoUser,
          id: generateId(),
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },

      addResume: (resume) => {
        const newResume: Resume = {
          ...resume,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ resumes: [...state.resumes, newResume] }));
        return newResume;
      },

      updateResume: (id, data) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        }));
      },

      addCoverLetter: (letter) => {
        const newLetter: CoverLetter = {
          ...letter,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          coverLetters: [...state.coverLetters, newLetter],
        }));
        return newLetter;
      },

      updateCoverLetter: (id, data) => {
        set((state) => ({
          coverLetters: state.coverLetters.map((l) =>
            l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
          ),
        }));
      },

      deleteCoverLetter: (id) => {
        set((state) => ({
          coverLetters: state.coverLetters.filter((l) => l.id !== id),
        }));
      },

      addApplication: (app) => {
        const newApp: JobApplication = {
          ...app,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          applications: [...state.applications, newApp],
        }));
        return newApp;
      },

      updateApplication: (id, data) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((a) => a.id !== id),
        }));
      },

      addInterviewSession: (session) => {
        const newSession: InterviewSession = {
          ...session,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          interviewSessions: [...state.interviewSessions, newSession],
        }));
        return newSession;
      },

      updateInterviewSession: (id, data) => {
        set((state) => ({
          interviewSessions: state.interviewSessions.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      deleteInterviewSession: (id) => {
        set((state) => ({
          interviewSessions: state.interviewSessions.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: 'pro-job-copilot-storage',
    }
  )
);
