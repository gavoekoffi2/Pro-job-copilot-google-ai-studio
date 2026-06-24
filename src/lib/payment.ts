import type { CVData, Locale, TemplateId } from '../types';

export interface CheckoutUser {
  name: string;
  email: string;
  phone: string;
}

export interface CreateCheckoutPayload {
  user: CheckoutUser;
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
}

export interface CheckoutResult {
  reference: string;
  cvId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  status: string;
}

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Erreur serveur.');
  }
  return data;
}

export async function createGeniusPayCheckout(payload: CreateCheckoutPayload): Promise<CheckoutResult> {
  const response = await fetch('/.netlify/functions/geniuspay-create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApiResponse(response) as Promise<CheckoutResult>;
}

export async function verifyGeniusPayPayment(reference: string): Promise<{
  reference: string;
  status: string;
  paid: boolean;
  amount?: number;
  currency?: string;
  paymentMethod?: string | null;
}> {
  const response = await fetch(
    `/.netlify/functions/geniuspay-payment-status?reference=${encodeURIComponent(reference)}`,
  );
  return parseApiResponse(response);
}

export function loadCheckoutUser(): CheckoutUser | null {
  try {
    const raw = localStorage.getItem('pro_job_copilot_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user?.name || !user?.email || !user?.phone) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveCheckoutUser(user: CheckoutUser) {
  localStorage.setItem('pro_job_copilot_user', JSON.stringify(user));
}
