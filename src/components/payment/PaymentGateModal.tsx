import { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, ExternalLink, LockKeyhole, UserRound, X } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { Button } from '../ui/ui';
import {
  createGeniusPayCheckout,
  loadCheckoutUser,
  saveCheckoutUser,
  verifyGeniusPayPayment,
  type CheckoutUser,
} from '../../lib/payment';

export function PaymentGateModal({
  open,
  cv,
  templateId,
  accent,
  locale,
  onClose,
  onPaid,
}: {
  open: boolean;
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  onClose: () => void;
  onPaid: () => Promise<void> | void;
}) {
  const [user, setUser] = useState<CheckoutUser>({ name: '', email: '', phone: '' });
  const [reference, setReference] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [busy, setBusy] = useState<null | 'create' | 'verify' | 'download'>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const saved = loadCheckoutUser();
    if (saved) setUser(saved);
  }, [open]);

  if (!open) return null;

  const updateUser = (patch: Partial<CheckoutUser>) => setUser((u) => ({ ...u, ...patch }));

  const startPayment = async () => {
    setError(null);
    setBusy('create');
    try {
      saveCheckoutUser(user);
      const checkout = await createGeniusPayCheckout({ user, cv, templateId, accent, locale });
      setReference(checkout.reference);
      setCheckoutUrl(checkout.checkoutUrl);
      setStatus(checkout.status);
      window.open(checkout.checkoutUrl, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      setError(e?.message || 'Impossible de lancer le paiement.');
    } finally {
      setBusy(null);
    }
  };

  const verifyPayment = async () => {
    if (!reference) return;
    setError(null);
    setBusy('verify');
    try {
      const result = await verifyGeniusPayPayment(reference);
      setStatus(result.status);
      if (!result.paid) {
        setError(`Paiement non confirmé pour le moment. Statut actuel : ${result.status || 'pending'}.`);
        return;
      }
      setBusy('download');
      await onPaid();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Impossible de vérifier le paiement.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950/70 px-4 py-6 backdrop-blur-sm no-print">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink-950/30">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-ink-950 to-ink-800 px-6 py-5 text-white">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-200">
              <LockKeyhole className="h-3.5 w-3.5" /> Paiement sécurisé GeniusPay
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold">Téléchargement du CV</h2>
            <p className="mt-1 text-sm text-ink-200">
              Créez/connectez votre compte, payez 500 FCFA, puis votre CV est sauvegardé et téléchargé.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-ink-950">Compte utilisateur</h3>
                <p className="text-sm text-ink-600">
                  L’utilisateur travaille gratuitement. Le compte est demandé seulement au téléchargement pour retrouver son CV plus tard.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Nom complet" value={user.name} onChange={(v) => updateUser({ name: v })} />
              <Field label="Téléphone" value={user.phone} onChange={(v) => updateUser({ phone: v })} placeholder="+228..." />
              <div className="sm:col-span-2">
                <Field label="Email" type="email" value={user.email} onChange={(v) => updateUser({ email: v })} placeholder="client@email.com" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink-950">Prix du téléchargement</p>
                <p className="text-xs text-ink-500">Paiement unique pour débloquer ce CV en PDF.</p>
              </div>
              <p className="font-display text-3xl font-extrabold text-ink-950">500 FCFA</p>
            </div>
          </div>

          {reference && (
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-700">
              <p><strong>Référence :</strong> {reference}</p>
              <p><strong>Statut :</strong> {status || 'pending'}</p>
              {checkoutUrl && (
                <a className="mt-2 inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-900" href={checkoutUrl} target="_blank" rel="noreferrer">
                  Rouvrir la page de paiement <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}

          <div className="flex flex-col gap-2 sm:flex-row">
            {!reference ? (
              <Button
                className="w-full"
                icon={<CreditCard className="h-4 w-4" />}
                loading={busy === 'create'}
                disabled={!user.name.trim() || !user.email.trim() || !user.phone.trim()}
                onClick={startPayment}
              >
                Créer le compte et payer 500 FCFA
              </Button>
            ) : (
              <Button
                className="w-full"
                icon={<CheckCircle2 className="h-4 w-4" />}
                loading={busy === 'verify' || busy === 'download'}
                onClick={verifyPayment}
              >
                J’ai payé, vérifier et télécharger
              </Button>
            )}
            <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>Continuer à modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </label>
  );
}
