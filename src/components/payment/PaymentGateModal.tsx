import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { Button } from '../ui/ui';
import {
  clearPendingCheckout,
  createGeniusPayCheckout,
  publicCheckoutUser,
  saveCheckoutUser,
  savePendingCheckout,
  verifyGeniusPayPayment,
  type CheckoutUser,
} from '../../lib/payment';
import { loadAccountUser, loginAccount, registerAccount, saveAccountCv, saveAccountUser, validateAccountSession } from '../../lib/account';
import { loadPublicSettings } from '../../lib/admin';
import { downloadGateFor, isAuthenticatedAccount, isDownloadAdministrator } from '../../lib/downloadPolicy';

type AuthMode = 'login' | 'register';

export function PaymentGateModal({
  open,
  cv,
  templateId,
  accent,
  locale,
  onClose,
  onPaid,
  onWatermarked,
}: {
  open: boolean;
  cv: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
  onClose: () => void;
  onPaid: () => Promise<void> | void;
  onWatermarked: () => Promise<void> | void;
}) {
  const [mode, setMode] = useState<AuthMode>('register');
  const [user, setUser] = useState<CheckoutUser>({ name: '', email: '', phone: '', password: '' });
  const [reference, setReference] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [busy, setBusy] = useState<null | 'auth' | 'create' | 'verify' | 'download' | 'watermark'>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [price, setPrice] = useState(500);

  useEffect(() => {
    if (!open) return;
    const saved = loadAccountUser();
    if (saved && isAuthenticatedAccount(saved)) {
      setUser({ ...saved, password: '' });
      setMode('login');
    } else {
      const info = cv.personalInfo;
      setUser({
        name: info.fullName || '',
        email: info.email || '',
        phone: info.phone || '',
        password: '',
      });
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

  const authReady = useMemo(
    () => Boolean(user.email.trim() && (user.password?.length || 0) >= 6),
    [user.email, user.password],
  );
  const connected = isAuthenticatedAccount(user);
  const administrator = isDownloadAdministrator(user);

  if (!open) return null;

  const updateUser = (patch: Partial<CheckoutUser>) => setUser((current) => ({ ...current, ...patch }));

  const authenticate = async () => {
    setError(null);
    setBusy('auth');
    try {
      const account = mode === 'login'
        ? await loginAccount({ email: user.email, password: user.password })
        : await registerAccount(user);
      const accountUser = account.user;
      if (!accountUser || !isAuthenticatedAccount(accountUser)) {
        throw new Error('La connexion n’a pas pu être confirmée. Réessayez.');
      }
      saveCheckoutUser(accountUser);
      saveAccountUser(accountUser);
      setUser({ ...accountUser, password: '' });
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Impossible de vous connecter.');
    } finally {
      setBusy(null);
    }
  };

  const downloadWatermarked = async () => {
    if (downloadGateFor(user) === 'authenticate') return;
    setError(null);
    setBusy('watermark');
    try {
      await validateAccountSession(user);
      await saveAccountCv({ user, cv, templateId, accent, locale, paid: false });
      await onWatermarked();
      clearPendingCheckout();
      onClose();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Impossible de télécharger l’aperçu filigrané.');
    } finally {
      setBusy(null);
    }
  };

  const startCleanDownload = async () => {
    if (downloadGateFor(user) === 'authenticate') return;
    setError(null);

    if (administrator) {
      setBusy('download');
      try {
        await validateAccountSession(user);
        await saveAccountCv({ user, cv, templateId, accent, locale, paid: true });
        await onPaid();
        clearPendingCheckout();
        onClose();
      } catch (caught: unknown) {
        setError(caught instanceof Error ? caught.message : 'Impossible de télécharger ce CV.');
      } finally {
        setBusy(null);
      }
      return;
    }

    setBusy('create');
    try {
      await saveAccountCv({ user, cv, templateId, accent, locale, paid: false });
      const checkout = await createGeniusPayCheckout({
        user: publicCheckoutUser(user),
        cv,
        templateId,
        accent,
        locale,
      });
      setReference(checkout.reference);
      setCheckoutUrl(checkout.checkoutUrl);
      setStatus(checkout.status);
      savePendingCheckout({
        reference: checkout.reference,
        checkoutUrl: checkout.checkoutUrl,
        user,
        cv,
        templateId,
        accent,
        locale,
        createdAt: Date.now(),
      });
      window.location.assign(checkout.checkoutUrl);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’ouvrir le paiement.');
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
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Impossible de vérifier le paiement.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink-950/70 px-4 py-6 backdrop-blur-sm no-print">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink-950/30">
        <div className="flex items-start justify-between gap-4 bg-ink-950 px-6 py-5 text-white">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-200">
              <LockKeyhole className="h-3.5 w-3.5" /> Téléchargement sécurisé
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold">
              {connected ? 'Choisissez votre téléchargement' : 'Connectez-vous avant de télécharger'}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-200">
              {connected
                ? administrator
                  ? 'Votre accès administrateur permet le téléchargement sans filigrane et sans paiement.'
                  : 'Le PDF d’aperçu est gratuit avec un gros filigrane. Le PDF professionnel sans filigrane est payant.'
                : 'Le téléchargement n’est disponible qu’après connexion ou création d’un compte.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {!connected ? (
            <>
              <div className="grid gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-3 sm:grid-cols-3">
                {['Compte', 'Choix du PDF', 'Téléchargement'].map((step, index) => (
                  <div key={step} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-ink-700 shadow-sm">
                    <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${mode === 'login' ? 'bg-ink-950 text-white shadow-lg' : 'text-ink-600 hover:bg-ink-100'}`}
                  >
                    <LogIn className="h-4 w-4" /> Se connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${mode === 'register' ? 'bg-brand-600 text-white shadow-lg' : 'text-ink-600 hover:bg-ink-100'}`}
                  >
                    <UserPlus className="h-4 w-4" /> Créer un compte
                  </button>
                </div>

                <form
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (authReady && !busy) void authenticate();
                  }}
                >
                  {mode === 'register' && (
                    <>
                      <Field label="Nom complet (facultatif)" value={user.name} onChange={(value) => updateUser({ name: value })} />
                      <Field label="Téléphone (facultatif)" value={user.phone} onChange={(value) => updateUser({ phone: value })} placeholder="+228..." />
                    </>
                  )}
                  <div className={mode === 'login' ? 'sm:col-span-2' : ''}>
                    <Field label="Email" type="email" value={user.email} onChange={(value) => updateUser({ email: value })} placeholder="client@email.com" />
                  </div>
                  <div className={mode === 'login' ? 'sm:col-span-2' : ''}>
                    <Field label="Mot de passe" type="password" value={user.password || ''} onChange={(value) => updateUser({ password: value })} placeholder="Minimum 6 caractères" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      className="w-full text-base"
                      icon={mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      loading={busy === 'auth'}
                      disabled={!authReady}
                    >
                      {mode === 'login' ? 'Se connecter et continuer' : 'Créer mon compte et continuer'}
                    </Button>
                    <p className="mt-2 text-center text-xs font-semibold text-ink-500">
                      Après connexion, vous choisirez entre le PDF gratuit filigrané et le PDF payant sans filigrane.
                    </p>
                  </div>
                </form>
              </div>
            </>
          ) : administrator ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-700" />
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-950">Accès administrateur reconnu</h3>
                  <p className="mt-1 text-sm text-ink-600">Téléchargez immédiatement le PDF professionnel sans filigrane.</p>
                </div>
              </div>
              <Button
                className="mt-5 w-full"
                variant="dark"
                icon={<Download className="h-5 w-5" />}
                loading={busy === 'download'}
                onClick={startCleanDownload}
              >
                Télécharger le PDF sans filigrane
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <section className="flex flex-col rounded-2xl border-2 border-ink-200 bg-ink-50 p-5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-700 shadow-sm">
                  <Eye className="h-4 w-4" /> Aperçu gratuit
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink-950">PDF avec gros filigrane</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  Gratuit pour vérifier la présentation. Un grand filigrane « APERÇU — JOBTASK AI » couvre toutes les pages et rend ce fichier impropre à une candidature.
                </p>
                <p className="mt-4 font-display text-3xl font-bold text-ink-950">0 FCFA</p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  icon={<Download className="h-5 w-5" />}
                  loading={busy === 'watermark'}
                  onClick={downloadWatermarked}
                >
                  Télécharger avec filigrane
                </Button>
              </section>

              <section className="flex flex-col rounded-2xl border-2 border-gold-300 bg-gold-50/50 p-5 shadow-lg shadow-gold-200/30">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-950">
                  <CreditCard className="h-4 w-4" /> Version professionnelle
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink-950">PDF sans filigrane</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  Version propre, prête à envoyer aux recruteurs. Vous serez redirigé vers le paiement sécurisé GeniusPay avant le téléchargement.
                </p>
                <p className="mt-4 font-display text-3xl font-bold text-ink-950">{price.toLocaleString('fr-FR')} FCFA</p>
                <Button
                  className="mt-4 w-full"
                  variant="dark"
                  icon={<CreditCard className="h-5 w-5" />}
                  loading={busy === 'create' || busy === 'download'}
                  onClick={startCleanDownload}
                >
                  Payer et télécharger sans filigrane
                </Button>
              </section>
            </div>
          )}

          {reference && (
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-700">
              <p><strong>Référence :</strong> {reference}</p>
              <p><strong>Statut :</strong> {status || 'pending'}</p>
              {checkoutUrl && (
                <a className="mt-2 inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-900" href={checkoutUrl} target="_blank" rel="noreferrer">
                  Rouvrir la page de paiement <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Button
                className="mt-3 w-full"
                icon={<CheckCircle2 className="h-4 w-4" />}
                loading={busy === 'verify' || busy === 'download'}
                onClick={verifyPayment}
              >
                J’ai payé, vérifier et télécharger
              </Button>
            </div>
          )}

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}

          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>Continuer à modifier le CV</Button>
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </label>
  );
}
