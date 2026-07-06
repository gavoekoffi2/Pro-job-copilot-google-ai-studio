import type { CVData, Locale, TemplateId } from '../types';

export interface CheckoutUser {
  name: string;
  email: string;
  phone: string;
  role?: 'user' | 'admin' | 'super_admin';
  plan?: 'free' | 'pro' | 'unlimited';
  active?: boolean;
  subscriptionExpiresAt?: number | null;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isUnlimited?: boolean;
  canDownloadPdf?: boolean;
  /** Mot de passe saisi uniquement au moment de créer/connecter le compte. */
  password?: string;
  /** Jeton de session renvoyé par le serveur après connexion. */
  sessionToken?: string;
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
const VALID_TEMPLATE_IDS = new Set([
  'sahel', 'dakar', 'executive', 'lagos', 'minimal', 'kigali', 'abidjan', 'horizon', 'eclat',
  'classic', 'tech', 'nairobi', 'zurich', 'accra', 'casablanca', 'capetown', 'montreal',
  'savane', 'lome', 'kpalime', 'maritime',
]);

function safeTemplateId(templateId: unknown): TemplateId {
  return typeof templateId === 'string' && VALID_TEMPLATE_IDS.has(templateId) ? (templateId as TemplateId) : 'lome';
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

export async function verifyGeniusPayPayment(reference: string, providerStatus?: string | null): Promise<{
  reference: string;
  status: string;
  paid: boolean;
  amount?: number;
  currency?: string;
  paymentMethod?: string | null;
}> {
  const params = new URLSearchParams({ reference });
  if (providerStatus) params.set('provider_status', providerStatus);
  const response = await fetch(`/.netlify/functions/geniuspay-payment-status?${params.toString()}`);
  return parseApiResponse(response);
}

export async function recoverCheckoutCv(reference: string): Promise<PendingCheckout> {
  const response = await fetch(`/.netlify/functions/checkout-cv?reference=${encodeURIComponent(reference)}`);
  const data = await parseApiResponse(response);
  const cv = data.cv || {};
  const personalInfo = cv.personalInfo || {};
  return {
    reference: data.reference || reference,
    checkoutUrl: '',
    user: data.user || { name: '', email: '', phone: '' },
    cv: {
      personalInfo: {
        fullName: personalInfo.fullName || data.user?.name || 'CV',
        title: personalInfo.title || '',
        email: personalInfo.email || data.user?.email || '',
        phone: personalInfo.phone || data.user?.phone || '',
        address: personalInfo.address || personalInfo.location || '',
        website: personalInfo.website || '',
        linkedin: personalInfo.linkedin || '',
        summary: personalInfo.summary || cv.summary || '',
        photo: personalInfo.photo,
        showPhoto: personalInfo.showPhoto ?? false,
      },
      experiences: Array.isArray(cv.experiences) ? cv.experiences : [],
      education: Array.isArray(cv.education) ? cv.education : [],
      skills: Array.isArray(cv.skills) ? cv.skills : [],
      languages: Array.isArray(cv.languages) ? cv.languages : [],
      certifications: Array.isArray(cv.certifications) ? cv.certifications : [],
      interests: Array.isArray(cv.interests) ? cv.interests : [],
    },
    templateId: safeTemplateId(data.templateId),
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

export function publicCheckoutUser(user: CheckoutUser): CheckoutUser {
  return {
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
}

export function saveCheckoutUser(user: CheckoutUser) {
  localStorage.setItem(CHECKOUT_USER_KEY, JSON.stringify(publicCheckoutUser(user)));
}

export function savePendingCheckout(checkout: PendingCheckout) {
  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
}

export function loadPendingCheckout(): PendingCheckout | null {
  try {
    const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    const checkout = JSON.parse(raw) as PendingCheckout;
    if (!checkout?.reference || !checkout?.cv?.personalInfo) return null;
    return {
      ...checkout,
      templateId: safeTemplateId(checkout.templateId),
      accent: checkout.accent || '#10b981',
      locale: checkout.locale || 'fr',
      cv: {
        ...checkout.cv,
        personalInfo: {
          fullName: checkout.cv.personalInfo.fullName || checkout.user?.name || 'CV',
          title: checkout.cv.personalInfo.title || '',
          email: checkout.cv.personalInfo.email || checkout.user?.email || '',
          phone: checkout.cv.personalInfo.phone || checkout.user?.phone || '',
          address: checkout.cv.personalInfo.address || '',
          website: checkout.cv.personalInfo.website || '',
          linkedin: checkout.cv.personalInfo.linkedin || '',
          summary: checkout.cv.personalInfo.summary || '',
          photo: checkout.cv.personalInfo.photo,
          showPhoto: checkout.cv.personalInfo.showPhoto ?? false,
        },
        experiences: Array.isArray(checkout.cv.experiences) ? checkout.cv.experiences : [],
        education: Array.isArray(checkout.cv.education) ? checkout.cv.education : [],
        skills: Array.isArray(checkout.cv.skills) ? checkout.cv.skills : [],
        languages: Array.isArray(checkout.cv.languages) ? checkout.cv.languages : [],
        certifications: Array.isArray(checkout.cv.certifications) ? checkout.cv.certifications : [],
        interests: Array.isArray(checkout.cv.interests) ? checkout.cv.interests : [],
      },
    };
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}
