import type { JobApplication, DashboardStats, ActivityItem, ApplicationStatus } from '@/types';

const KEYS = {
  APPLICATIONS: 'pjc_applications',
  STATS: 'pjc_stats',
  ACTIVITY: 'pjc_activity',
} as const;

// ─── Safe localStorage wrapper ───────────────────────────────
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

// ─── Applications CRUD ───────────────────────────────────────
export function getApplications(): JobApplication[] {
  return getItem<JobApplication[]>(KEYS.APPLICATIONS, []);
}

export function saveApplication(app: JobApplication): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === app.id);
  if (idx >= 0) {
    apps[idx] = app;
  } else {
    apps.unshift(app);
  }
  setItem(KEYS.APPLICATIONS, apps);
  incrementStat('applicationsTracked');
  addActivity('tracker', `Added ${app.role} at ${app.company} to tracker`);
}

export function updateApplication(id: string, updates: Partial<JobApplication>): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx >= 0) {
    apps[idx] = { ...apps[idx], ...updates, dateUpdated: new Date().toISOString() };
    setItem(KEYS.APPLICATIONS, apps);
  }
}

export function deleteApplication(id: string): void {
  const apps = getApplications().filter((a) => a.id !== id);
  setItem(KEYS.APPLICATIONS, apps);
}

export function updateApplicationStatus(id: string, status: ApplicationStatus): void {
  updateApplication(id, { status });
}

// ─── Stats ────────────────────────────────────────────────────
const defaultStats: DashboardStats = {
  resumesAnalyzed: 0,
  coverLettersGenerated: 0,
  interviewsCompleted: 0,
  applicationsTracked: 0,
  lastActivity: new Date().toISOString(),
};

export function getStats(): DashboardStats {
  return getItem<DashboardStats>(KEYS.STATS, defaultStats);
}

export function incrementStat(key: keyof Omit<DashboardStats, 'lastActivity'>): void {
  const stats = getStats();
  stats[key] = (stats[key] as number) + 1;
  stats.lastActivity = new Date().toISOString();
  setItem(KEYS.STATS, stats);
}

// ─── Activity Log ─────────────────────────────────────────────
export function getActivity(): ActivityItem[] {
  return getItem<ActivityItem[]>(KEYS.ACTIVITY, []);
}

export function addActivity(
  type: ActivityItem['type'],
  description: string
): void {
  const activities = getActivity();
  const newActivity: ActivityItem = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    description,
    timestamp: new Date().toISOString(),
  };
  activities.unshift(newActivity);
  // Keep only last 50 activities
  setItem(KEYS.ACTIVITY, activities.slice(0, 50));
}

// ─── Helpers ──────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
