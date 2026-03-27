import type { CVData } from '@/types/cv';
import { DEFAULT_CV } from '@/types/cv';

const KEY = 'pjc_cv_data';

export function getCVData(): CVData {
  if (typeof window === 'undefined') return DEFAULT_CV;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_CV, ...JSON.parse(raw) } : DEFAULT_CV;
  } catch {
    return DEFAULT_CV;
  }
}

export function saveCVData(data: CVData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* storage full */ }
}

export function clearCVData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
