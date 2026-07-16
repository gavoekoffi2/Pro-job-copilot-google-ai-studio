import type { CVData, Locale, TemplateId } from '../types';
import type { CheckoutUser } from './payment';

const ACCOUNT_USER_KEY = 'pro_job_copilot_account_user';
export const ACCOUNT_USER_CHANGED_EVENT = 'jobtask-account-user-changed';

/** Longueur minimale exigée pour un NOUVEAU mot de passe (inscription / reset). */
export const MIN_PASSWORD_LENGTH = 8;

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

const NETWORK_ERROR_MESSAGE =
  'Connexion au serveur impossible. Vérifiez votre connexion internet puis réessayez.';

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Erreur serveur.');
  }
  return data;
}

async function postAccount(body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
  return parseApiResponse(response);
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
  const savedUser = {
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    phone: user.phone.trim(),
    role: user.role,
    plan: user.plan,
    active: user.active,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
    isUnlimited: user.isUnlimited,
    canDownloadPdf: user.canDownloadPdf,
    sessionToken: user.sessionToken,
  };
  localStorage.setItem(ACCOUNT_USER_KEY, JSON.stringify(savedUser));
  window.dispatchEvent(new CustomEvent(ACCOUNT_USER_CHANGED_EVENT, { detail: savedUser }));
}

export function clearAccountUser() {
  localStorage.removeItem(ACCOUNT_USER_KEY);
  window.dispatchEvent(new CustomEvent(ACCOUNT_USER_CHANGED_EVENT, { detail: null }));
}

export async function registerAccount(user: CheckoutUser): Promise<AccountPayload> {
  const data = (await postAccount({ action: 'register', user })) as AccountPayload;
  if (data.user) saveAccountUser(data.user);
  return data;
}

export async function loginAccount(user: Pick<CheckoutUser, 'email' | 'password'>): Promise<AccountPayload> {
  const data = (await postAccount({ action: 'login', user })) as AccountPayload;
  if (data.user) saveAccountUser(data.user);
  return data;
}

export async function validateAccountSession(user: CheckoutUser): Promise<AccountPayload> {
  return (await postAccount({ action: 'list', user })) as AccountPayload;
}

export async function listAccountCvs(user: CheckoutUser): Promise<AccountPayload> {
  return (await postAccount({ action: 'list', user })) as AccountPayload;
}

export async function getAccountCv(user: CheckoutUser, id: string): Promise<{ user: CheckoutUser; cv: SavedCvRecord }> {
  return (await postAccount({ action: 'get', user, id })) as { user: CheckoutUser; cv: SavedCvRecord };
}

export async function saveAccountCv(payload: SaveCvPayload): Promise<{ cv: SavedCvRecord; account: AccountPayload }> {
  const data = (await postAccount({ action: 'save', ...payload })) as { cv: SavedCvRecord; account: AccountPayload };
  if (data.account?.user) saveAccountUser(data.account.user);
  return data;
}
