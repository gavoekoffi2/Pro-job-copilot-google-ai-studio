import type { CheckoutUser } from './payment';

export type DownloadGate = 'authenticate' | 'choose' | 'admin-download';

export const FREE_WATERMARK = {
  text: 'APERÇU — JOBTASK AI',
  fontSize: 42,
  rows: 8,
  opacity: 0.32,
  rotation: -28,
} as const;

export function isAuthenticatedAccount(user: CheckoutUser | null | undefined): boolean {
  return Boolean(user?.email?.trim() && user?.sessionToken?.trim());
}

export function isDownloadAdministrator(user: CheckoutUser | null | undefined): boolean {
  if (!user || !isAuthenticatedAccount(user)) return false;
  return Boolean(
    user.role === 'admin' ||
    user.role === 'super_admin' ||
    user.isAdmin ||
    user.isSuperAdmin,
  );
}

export function downloadGateFor(user: CheckoutUser | null | undefined): DownloadGate {
  if (!isAuthenticatedAccount(user)) return 'authenticate';
  if (isDownloadAdministrator(user)) return 'admin-download';
  return 'choose';
}

export function shouldShowMyCvs(user: CheckoutUser | null | undefined): boolean {
  return isAuthenticatedAccount(user);
}
