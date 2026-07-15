import type { CVData, Locale, TemplateId } from '../types';
import type { CheckoutUser } from './payment';

const ACCOUNT_USER_KEY = 'pro_job_copilot_account_user';
export const ACCOUNT_USER_CHANGED_EVENT = 'jobtask-account-user-changed';
const PRIVATE_ADMIN_ACCESS_KEY = 'pro_job_copilot_private_admin_access';
const LOCAL_ACCOUNT_STORE_KEY = 'pro_job_copilot_local_accounts';

export const DEFAULT_PRIVATE_ADMIN_ACCESS = {
  name: 'Administrateur JobTask',
  email: 'c1domefa@gmail.com',
  phone: '-',
  password: 'gavoekoffi',
};

export function loadPrivateAdminAccess() {
  try {
    const raw = localStorage.getItem(PRIVATE_ADMIN_ACCESS_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      name: String(saved.name || DEFAULT_PRIVATE_ADMIN_ACCESS.name),
      email: String(saved.email || DEFAULT_PRIVATE_ADMIN_ACCESS.email).trim().toLowerCase(),
      phone: String(saved.phone || DEFAULT_PRIVATE_ADMIN_ACCESS.phone),
      password: String(saved.password || DEFAULT_PRIVATE_ADMIN_ACCESS.password),
    };
  } catch {
    return DEFAULT_PRIVATE_ADMIN_ACCESS;
  }
}

export function savePrivateAdminAccess(access: Partial<typeof DEFAULT_PRIVATE_ADMIN_ACCESS>) {
  const current = loadPrivateAdminAccess();
  const next = {
    name: String(access.name || current.name || DEFAULT_PRIVATE_ADMIN_ACCESS.name),
    email: String(access.email || current.email || DEFAULT_PRIVATE_ADMIN_ACCESS.email).trim().toLowerCase(),
    phone: String(access.phone || current.phone || DEFAULT_PRIVATE_ADMIN_ACCESS.phone),
    password: String(access.password || current.password || DEFAULT_PRIVATE_ADMIN_ACCESS.password),
  };
  localStorage.setItem(PRIVATE_ADMIN_ACCESS_KEY, JSON.stringify(next));
  return next;
}

export function privateAdminUser(access = loadPrivateAdminAccess()): CheckoutUser {
  return {
    name: access.name,
    email: access.email,
    phone: access.phone,
    role: 'super_admin',
    plan: 'unlimited',
    active: true,
    isAdmin: true,
    isSuperAdmin: true,
    isUnlimited: true,
    canDownloadPdf: true,
    sessionToken: 'private-device-access',
  };
}

export function isPrivateAdminCredentials(user: Pick<CheckoutUser, 'email' | 'password'>) {
  const email = String(user.email || '').trim().toLowerCase();
  const password = String(user.password || '');
  const savedAccess = loadPrivateAdminAccess();
  return (
    (email === DEFAULT_PRIVATE_ADMIN_ACCESS.email && password === DEFAULT_PRIVATE_ADMIN_ACCESS.password) ||
    (email === savedAccess.email && password === savedAccess.password)
  );
}

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

type LocalAccount = {
  user: CheckoutUser;
  password: string;
  cvs: SavedCvRecord[];
  createdAt: number;
  updatedAt: number;
};

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Erreur serveur.');
  }
  return data;
}

function readLocalAccounts(): Record<string, LocalAccount> {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNT_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalAccounts(accounts: Record<string, LocalAccount>) {
  localStorage.setItem(LOCAL_ACCOUNT_STORE_KEY, JSON.stringify(accounts));
}

function localSessionUser(user: CheckoutUser): CheckoutUser {
  const email = String(user.email || '').trim().toLowerCase();
  const role = user.role || 'user';
  const plan = user.plan || 'free';
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = isSuperAdmin || role === 'admin';
  const isUnlimited = isSuperAdmin || plan === 'unlimited';
  return {
    ...user,
    name: String(user.name || email.split('@')[0] || 'Utilisateur').trim(),
    email,
    phone: String(user.phone || '-').trim(),
    role,
    plan,
    active: user.active !== false,
    isAdmin,
    isSuperAdmin,
    isUnlimited,
    canDownloadPdf: Boolean(user.canDownloadPdf || isUnlimited || plan === 'pro'),
    sessionToken: user.sessionToken || 'local-device-session',
  };
}

function localAccountPayload(account: LocalAccount): AccountPayload {
  return {
    user: account.user,
    cvs: account.cvs.map(({ cv: _cv, ...summary }) => summary),
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

function localRegisterAccount(user: CheckoutUser): AccountPayload {
  const email = String(user.email || '').trim().toLowerCase();
  const password = String(user.password || '');
  if (!email || password.length < 6 || !String(user.name || '').trim()) {
    throw new Error('Nom, email et mot de passe obligatoires pour créer le compte.');
  }
  const accounts = readLocalAccounts();
  const existing = accounts[email];
  if (existing && existing.password !== password) throw new Error('Mot de passe incorrect pour ce compte.');
  const now = Date.now();
  const account: LocalAccount = existing || {
    user: localSessionUser({ ...user, email, password }),
    password,
    cvs: [],
    createdAt: now,
    updatedAt: now,
  };
  account.user = localSessionUser({ ...account.user, ...user, email, password });
  account.password = password;
  account.updatedAt = now;
  accounts[email] = account;
  writeLocalAccounts(accounts);
  saveAccountUser(account.user);
  return localAccountPayload(account);
}

function localLoginAccount(user: Pick<CheckoutUser, 'email' | 'password'>): AccountPayload {
  const email = String(user.email || '').trim().toLowerCase();
  const password = String(user.password || '');
  if (isPrivateAdminCredentials({ email, password })) {
    const admin = privateAdminUser(loadPrivateAdminAccess());
    saveAccountUser(admin);
    return { user: admin, cvs: [], createdAt: Date.now(), updatedAt: Date.now() };
  }
  const account = readLocalAccounts()[email];
  if (!account || account.password !== password) {
    throw new Error('Compte introuvable ou mot de passe incorrect. Cliquez sur inscription si c’est votre première utilisation.');
  }
  account.user = localSessionUser(account.user);
  saveAccountUser(account.user);
  return localAccountPayload(account);
}

function localListAccountCvs(user: CheckoutUser): AccountPayload {
  const account = readLocalAccounts()[String(user.email || '').trim().toLowerCase()];
  if (!account) return { user: localSessionUser(user), cvs: [] };
  account.user = localSessionUser({ ...account.user, ...user });
  return localAccountPayload(account);
}

function localGetAccountCv(user: CheckoutUser, id: string): { user: CheckoutUser; cv: SavedCvRecord } {
  const account = readLocalAccounts()[String(user.email || '').trim().toLowerCase()];
  const cv = account?.cvs.find((item) => item.id === id);
  if (!account || !cv) throw new Error('CV introuvable sur cet appareil.');
  return { user: localSessionUser(account.user), cv };
}

function localSaveAccountCv(payload: SaveCvPayload): { cv: SavedCvRecord; account: AccountPayload } {
  const email = String(payload.user.email || '').trim().toLowerCase();
  const accounts = readLocalAccounts();
  const now = Date.now();
  const account: LocalAccount = accounts[email] || {
    user: localSessionUser(payload.user),
    password: String(payload.user.password || 'local-device-session'),
    cvs: [],
    createdAt: now,
    updatedAt: now,
  };
  const id = payload.cvId || `cv_${now}_${Math.random().toString(36).slice(2, 10)}`;
  const existingIndex = account.cvs.findIndex((item) => item.id === id);
  const existing = existingIndex >= 0 ? account.cvs[existingIndex] : null;
  const record: SavedCvRecord = {
    id,
    title: String(payload.cv.personalInfo?.fullName || payload.cv.personalInfo?.title || 'CV sans nom').trim(),
    subtitle: String(payload.cv.personalInfo?.title || '').trim(),
    cv: payload.cv,
    templateId: payload.templateId,
    accent: payload.accent,
    locale: payload.locale,
    paid: Boolean(payload.paid || existing?.paid),
    reference: payload.reference || existing?.reference || '',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  if (existingIndex >= 0) account.cvs[existingIndex] = record;
  else account.cvs.unshift(record);
  account.user = localSessionUser({ ...account.user, ...payload.user });
  account.updatedAt = now;
  accounts[email] = account;
  writeLocalAccounts(accounts);
  saveAccountUser(account.user);
  return { cv: record, account: localAccountPayload(account) };
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
  try {
    const response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', user }),
    });
    const data = await parseApiResponse(response) as AccountPayload;
    if (data.user) saveAccountUser(data.user);
    return data;
  } catch {
    return localRegisterAccount(user);
  }
}

export async function loginAccount(user: Pick<CheckoutUser, 'email' | 'password'>): Promise<AccountPayload> {
  try {
    const response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', user }),
    });
    const data = await parseApiResponse(response) as AccountPayload;
    if (data.user) saveAccountUser(data.user);
    return data;
  } catch {
    return localLoginAccount(user);
  }
}

export async function validateAccountSession(user: CheckoutUser): Promise<AccountPayload> {
  const response = await fetch('/.netlify/functions/account-cvs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'list', user }),
  });
  return parseApiResponse(response) as Promise<AccountPayload>;
}

export async function listAccountCvs(user: CheckoutUser): Promise<AccountPayload> {
  try {
    const response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', user }),
    });
    return parseApiResponse(response) as Promise<AccountPayload>;
  } catch {
    return localListAccountCvs(user);
  }
}

export async function getAccountCv(user: CheckoutUser, id: string): Promise<{ user: CheckoutUser; cv: SavedCvRecord }> {
  try {
    const response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', user, id }),
    });
    return parseApiResponse(response) as Promise<{ user: CheckoutUser; cv: SavedCvRecord }>;
  } catch {
    return localGetAccountCv(user, id);
  }
}

export async function saveAccountCv(payload: SaveCvPayload): Promise<{ cv: SavedCvRecord; account: AccountPayload }> {
  try {
    const response = await fetch('/.netlify/functions/account-cvs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', ...payload }),
    });
    const data = await parseApiResponse(response) as { cv: SavedCvRecord; account: AccountPayload };
    if (data.account?.user) saveAccountUser(data.account.user);
    return data;
  } catch {
    return localSaveAccountCv(payload);
  }
}
