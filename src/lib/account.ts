import type { CVData, Locale, TemplateId } from '../types';
import type { CheckoutUser } from './payment';

const ACCOUNT_USER_KEY = 'pro_job_copilot_account_user';

export interface SavedCvSummary {
  id: string;
  title: string;
  subtitle?: string;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  paid?: boolean;
  reference?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SavedCvRecord extends SavedCvSummary {
  cv: CVData;
}

export interface AccountPayload {
  user: CheckoutUser | null;
  cvs: SavedCvSummary[];
  createdAt?: number;
  updatedAt?: number;
}

export interface SaveCvPayload {
  user: CheckoutUser;
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  cvId?: string;
  paid?: boolean;
  reference?: string;
}

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Erreur serveur.');
  }
  return data;
}

export function loadAccountUser(): CheckoutUser | null {
  try {
    const raw = localStorage.getItem(ACCOUNT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user?.name || !user?.email || !user?.phone) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveAccountUser(user: CheckoutUser) {
  localStorage.setItem(ACCOUNT_USER_KEY, JSON.stringify({
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    phone: user.phone.trim(),
    sessionToken: user.sessionToken,
  }));
}

export function clearAccountUser() {
  localStorage.removeItem(ACCOUNT_USER_KEY);
}

export async function registerAccount(user: CheckoutUser): Promise<AccountPayload> {
  const response = await fetch('/.netlify/functions/account-cvs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', user }),
  });
  const data = await parseApiResponse(response) as AccountPayload;
  if (data.user) saveAccountUser(data.user);
  return data;
}

export async function listAccountCvs(user: CheckoutUser): Promise<AccountPayload> {
  const response = await fetch('/.netlify/functions/account-cvs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'list', user }),
  });
  return parseApiResponse(response) as Promise<AccountPayload>;
}

export async function getAccountCv(user: CheckoutUser, id: string): Promise<{ user: CheckoutUser; cv: SavedCvRecord }> {
  const response = await fetch('/.netlify/functions/account-cvs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'get', user, id }),
  });
  return parseApiResponse(response) as Promise<{ user: CheckoutUser; cv: SavedCvRecord }>;
}

export async function saveAccountCv(payload: SaveCvPayload): Promise<{ cv: SavedCvRecord; account: AccountPayload }> {
  const response = await fetch('/.netlify/functions/account-cvs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'save', ...payload }),
  });
  const data = await parseApiResponse(response) as { cv: SavedCvRecord; account: AccountPayload };
  if (data.account?.user) saveAccountUser(data.account.user);
  return data;
}
