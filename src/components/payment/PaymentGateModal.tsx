import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, LockKeyhole, LogIn, UserPlus, X } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { Button } from '../ui/ui';
import {
  createGeniusPayCheckout,
  loadCheckoutUser,
  saveCheckoutUser,
  savePendingCheckout,
  clearPendingCheckout,
  verifyGeniusPayPayment,
  publicCheckoutUser,
  type CheckoutUser,
} from '../../lib/payment';
import { loginAccount, registerAccount, saveAccountCv, saveAccountUser } from '../../lib/account';
import { loadPublicSettings } from '../../lib/admin';

type AuthMode = 'login' | 'register';

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
  const [mode, setMode] = useState<AuthMode>('register');
  const [user, setUser] = useState<CheckoutUser>({ name: '', email: '', phone: '', password: '' });
  const [reference, setReference] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [busy, setBusy] = useState<null | 'auth' | 'create' | 'verify' | 'download'>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [price, setPrice] = useState(500);

  useEffect(() => {
    if (!open) return;
    const saved = loadCheckoutUser();
    if (saved) {
      setUser({ ...saved, password: '' });
      setMode('login');
    } else {
      const info = cv.personalInfo;
      setUser((current) => ({
        ...current,
        name: current.name || info.fullName || '',
        email: current.email || info.email || '',
        phone: current.phone || info.phone || '',
      }));
      setMode('register');
    }
    setReference('');
    setCheckoutUrl('');
    setStatus(null);
    setError(null);
    void loadPublicSettings()
      .then((settings) => setPrice(settings.cvDownloadPriceXof || 500))
      .catch(() => setPrice(500));
  }, [open, cv.personalInfo]);

  const authReady = useMemo(() => {
    return Boolean(user.email.trim() && (user.password?.length || 0) >= 6);
  }, [user.email, user.password]);

  if (!open) return null;

  const updateUser = (patch: Partial<CheckoutUser>) => setUser((u) => ({ ...u, ...patch }));

  const authenticatedPayment = async () => {
    setError(null);
    setBusy('auth');
    try {
      const account = mode === 'login'
        ? await loginAccount({ email: user.email, password: user.password })
        : await registerAccount(user);
      const accountUser = account.user || user;
      saveCheckoutUser(accountUser);
      saveAccountUser(accountUser);
      setUser({ ...accountUser, password: '' });

      if (accountUser.canDownloadPdf || accountUser.isUnlimited || accountUser.isSuperAdmin) {
        setBusy('download');
        await saveAccountCv({ user: accountUser, cv, templateId, accent, locale, paid: true });
        await onPaid();
        clearPendingCheckout();
        onClose();
        return;
      }

      setBusy('create');
      await saveAccountCv({ user: accountUser, cv, templateId, accent, locale, paid: false });
      const checkout = await createGeniusPayCheckout({ user: publicCheckoutUser(accountUser), cv, templateId, accent, locale });
      setReference(checkout.reference);
      setCheckoutUrl(checkout.checkoutUrl);
      setStatus(checkout.status);
      savePendingCheckout({
        reference: checkout.reference,
        checkoutUrl: checkout.checkoutUrl,
        user: accountUser,
        cv,
        templateId,
        accent,
        locale,
        createdAt: Date.now(),
      });
      window.location.assign(checkout.checkoutUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Impossible de continuer.');
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
      await saveAccountCv({ user, cv, templateId, accent, locale, paid: true, reference });
      await onPaid();
      clearPendingCheckout();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Impossible de vérifier le paiement.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950/70 px-4 py-6 backdrop-blur-sm no-print">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink-950/30">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-ink-950 to-ink-800 px-6 py-5 text-white">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-200">
              <LockKeyhole className="h-3.5 w-3.5" /> Compte requis avant le paiement
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold">Télécharger votre CV en PDF</h2>
            <p className="mt-1 text-sm text-ink-200">
              Connectez-vous ou inscrivez-vous d’abord. Ensuite, vous passez au paiement et le CV est conservé dans votre espace.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-3 sm:grid-cols-3">
            {['1. Compte', '2. Paiement', '3. PDF'].map((step, index) => (
              <div key={step} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-ink-700 shadow-sm">
                <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">{index + 1}</span>
                {step.replace(/^\d\.\s/, '')}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition ${mode === 'login' ? 'bg-ink-950 text-white shadow-lg' : 'text-ink-600 hover:bg-ink-100'}`}
              >
                <LogIn className="h-4 w-4" /> Se connecter
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition ${mode === 'register' ? 'bg-brand-600 text-white shadow-lg' : 'text-ink-600 hover:bg-ink-100'}`}
              >
                <UserPlus className="h-4 w-4" /> S’inscrire
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-display text-lg font-extrabold text-ink-950">
                {mode === 'login' ? 'Connexion à votre compte' : 'Création de votre compte'}
              </h3>
              <p className="mt-1 text-sm text-ink-600">
                {mode === 'login'
                  ? 'Entrez votre email et mot de passe pour reprendre le paiement du PDF.'
                  : 'Entrez votre email et choisissez un mot de passe. Le nom et le téléphone peuvent être complétés ensuite.'}
              </p>
            </div>

            <form
              className="mt-4 grid gap-3 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (authReady && !busy && !reference) void authenticatedPayment();
              }}
            >
              {mode === 'register' && (
                <>
                  <Field label="Nom complet (facultatif)" value={user.name} onChange={(v) => updateUser({ name: v })} />
                  <Field label="Téléphone (facultatif)" value={user.phone} onChange={(v) => updateUser({ phone: v })} placeholder="+228..." />
                </>
              )}
              <div className={mode === 'login' ? 'sm:col-span-2' : ''}>
                <Field label="Email" type="email" value={user.email} onChange={(v) => updateUser({ email: v })} placeholder="client@email.com" />
              </div>
              <div className={mode === 'login' ? 'sm:col-span-2' : ''}>
                <Field label="Mot de passe" type="password" value={user.password || ''} onChange={(v) => updateUser({ password: v })} placeholder="Minimum 6 caractères" />
              </div>
              {!reference && (
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    className="w-full text-base"
                    icon={mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    loading={busy === 'auth' || busy === 'create' || busy === 'download'}
                    disabled={!authReady}
                  >
                    {mode === 'login' ? 'Se connecter' : 'S’inscrire'}
                  </Button>
                  <p className="mt-2 text-center text-xs font-semibold text-ink-500">
                    Après ce bouton, vous passez au paiement sécurisé du PDF.
                  </p>
                </div>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink-950">Prix du téléchargement PDF</p>
                <p className="text-xs text-ink-500">Après connexion/inscription, vous serez redirigé vers GeniusPay.</p>
              </div>
              <p className="font-display text-3xl font-extrabold text-ink-950">{price.toLocaleString('fr-FR')} FCFA</p>
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
            {reference && (
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
