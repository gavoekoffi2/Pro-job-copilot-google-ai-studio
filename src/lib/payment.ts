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

export interface PendingCheckout {
  reference: string;
  checkoutUrl: string;
  user: CheckoutUser;
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  createdAt: number;
}

const CHECKOUT_USER_KEY = 'pro_job_copilot_user';
const PENDING_CHECKOUT_KEY = 'pro_job_copilot_pending_checkout';

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

export async function recoverCheckoutCv(reference: string): Promise<PendingCheckout> {
  const response = await fetch(`/.netlify/functions/checkout-cv?reference=${encodeURIComponent(reference)}`);
  const data = await parseApiResponse(response);
  return {
    reference: data.reference || reference,
    checkoutUrl: '',
    user: data.user || { name: '', email: '', phone: '' },
    cv: data.cv,
    templateId: data.templateId,
    accent: data.accent || '#10b981',
    locale: data.locale || 'fr',
    createdAt: data.createdAt || Date.now(),
  };
}

export function loadCheckoutUser(): CheckoutUser | null {
  try {
    const raw = localStorage.getItem(CHECKOUT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user?.name || !user?.email || !user?.phone) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveCheckoutUser(user: CheckoutUser) {
  localStorage.setItem(CHECKOUT_USER_KEY, JSON.stringify(user));
}

export function savePendingCheckout(checkout: PendingCheckout) {
  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
}

export function loadPendingCheckout(): PendingCheckout | null {
  try {
    const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    const checkout = JSON.parse(raw) as PendingCheckout;
    if (!checkout?.reference || !checkout?.cv?.personalInfo || !checkout?.templateId) return null;
    return checkout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}
