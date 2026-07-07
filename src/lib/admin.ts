import type { CheckoutUser } from './payment';

export interface AdminUserSummary {
  user: CheckoutUser & {
    effectivePlan?: string;
    expired?: boolean;
  };
  cvCount: number;
  paidCvCount: number;
  createdAt?: number;
  updatedAt?: number;
  lastLoginAt?: number | null;
}

export interface AdminSettings {
  cvDownloadPriceXof: number;
  currency: 'XOF';
  updatedAt?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  admins: number;
  superAdmins: number;
  unlimitedUsers: number;
  proUsers: number;
  freeUsers: number;
  totalCvs: number;
  paidCvs: number;
}

export interface AdminDashboardPayload {
  admin?: AdminUserSummary;
  settings: AdminSettings;
  stats: AdminStats;
  users: AdminUserSummary[];
}

export interface SaveUserInput {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'super_admin';
  plan: 'free' | 'pro' | 'unlimited';
  durationDays?: number;
  permanent?: boolean;
  active?: boolean;
  initialPassword?: string;
}

export interface AdminProfileInput {
  name: string;
  email: string;
  phone: string;
  newPassword?: string;
}

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'Erreur serveur.');
  return data;
}

export async function adminRequest<T = AdminDashboardPayload>(admin: CheckoutUser, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch('/.netlify/functions/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ admin, ...payload }),
  });
  return parseApiResponse(response) as Promise<T>;
}

export async function loadAdminDashboard(admin: CheckoutUser) {
  return adminRequest<AdminDashboardPayload>(admin, { action: 'dashboard' });
}

export async function updateCvPrice(admin: CheckoutUser, cvDownloadPriceXof: number) {
  return adminRequest<AdminDashboardPayload>(admin, { action: 'settings', cvDownloadPriceXof });
}

export async function saveAdminUser(admin: CheckoutUser, target: SaveUserInput) {
  return adminRequest<AdminDashboardPayload>(admin, { action: 'saveUser', target });
}

export async function updateAdminProfile(admin: CheckoutUser, profile: AdminProfileInput) {
  return adminRequest<{ user: CheckoutUser; dashboard: AdminDashboardPayload }>(admin, { action: 'updateAdminProfile', profile });
}

export async function deleteAdminUser(admin: CheckoutUser, email: string) {
  return adminRequest<AdminDashboardPayload>(admin, { action: 'deleteUser', email });
}

export async function loadPublicSettings(): Promise<AdminSettings> {
  const response = await fetch('/.netlify/functions/app-settings');
  return parseApiResponse(response) as Promise<AdminSettings>;
}
