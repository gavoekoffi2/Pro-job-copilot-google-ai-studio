import { useEffect, useState } from 'react';
import { Edit3, FileText, LogOut, RefreshCw, Save, UserRound } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { DEFAULT_TEMPLATE } from '../../data/templates';
import { Button } from '../ui/ui';
import type { CheckoutUser } from '../../lib/payment';
import {
  clearAccountUser,
  getAccountCv,
  listAccountCvs,
  loadAccountUser,
  loadPrivateAdminAccess,
  privateAdminUser,
  registerAccount,
  saveAccountUser,
  loginAccount,
  type SavedCvSummary,
} from '../../lib/account';

interface AccountViewProps {
  onOpenCv: (payload: {
    cvId: string;
    cv: CVData;
    templateId: TemplateId;
    accent: string;
    locale: Locale;
    user: CheckoutUser;
  }) => void;
  onUserChange: (user: CheckoutUser | null) => void;
  onPrivateAccess?: (user: CheckoutUser) => void;
}

export function AccountView({ onOpenCv, onUserChange, onPrivateAccess }: AccountViewProps) {
  const [user, setUser] = useState<CheckoutUser>(() => loadAccountUser() || { name: '', email: '', phone: '' });
  const [connected, setConnected] = useState(() => Boolean(loadAccountUser()));
  const [cvs, setCvs] = useState<SavedCvSummary[]>([]);
  const [busy, setBusy] = useState<null | 'account' | 'list' | string>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateUser = (patch: Partial<CheckoutUser>) => setUser((current) => ({ ...current, ...patch }));
  const accountMode = user.name.trim() || user.phone.trim() ? 'register' : 'login';
  const canSubmitAccount = Boolean(user.email.trim()) && (user.password?.length || 0) >= 6 && (accountMode === 'login' || Boolean(user.name.trim()));

  const loadCvs = async (accountUser = user) => {
    setError(null);
    setBusy('list');
    try {
      const account = await listAccountCvs(accountUser);
      setCvs(account.cvs || []);
      setMessage(account.cvs?.length ? 'CV chargés depuis votre compte.' : 'Compte prêt. Aucun CV sauvegardé pour le moment.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger vos CV.');
    } finally {
      setBusy(null);
    }
  };

  const connect = async () => {
    setError(null);
    setMessage('');
    setBusy('account');
    try {
      const canUseDirectLogin = !user.name.trim() && !user.phone.trim();
      const account = canUseDirectLogin ? await loginAccount({ email: user.email, password: user.password }) : await registerAccount(user);
      const connectedUser = account.user || user;
      saveAccountUser(connectedUser);
      setUser(connectedUser);
      setConnected(true);
      onUserChange(connectedUser);
      setCvs(account.cvs || []);
      if (connectedUser.isSuperAdmin && onPrivateAccess) {
        onPrivateAccess(connectedUser);
        return;
      }
      setMessage('Compte créé/connecté. Vos prochains CV seront sauvegardés ici.');
    } catch (err) {
      const privateAccess = loadPrivateAdminAccess();
      const privateEmail = user.email.trim().toLowerCase() === privateAccess.email;
      const privatePassword = user.password === privateAccess.password;
      if (!user.name.trim() && !user.phone.trim() && privateEmail && privatePassword && onPrivateAccess) {
        const privateUser = privateAdminUser(privateAccess);
        saveAccountUser(privateUser);
        setUser(privateUser);
        setConnected(true);
        onUserChange(privateUser);
        onPrivateAccess(privateUser);
        return;
      }
      setError(err instanceof Error ? err.message : 'Impossible de créer le compte.');
    } finally {
      setBusy(null);
    }
  };

  const disconnect = () => {
    clearAccountUser();
    setConnected(false);
    setCvs([]);
    onUserChange(null);
    setMessage('Compte déconnecté sur cet appareil.');
  };

  const openCv = async (summary: SavedCvSummary) => {
    if (!user.email) return;
    setError(null);
    setBusy(summary.id);
    try {
      const result = await getAccountCv(user, summary.id);
      onUserChange(result.user);
      onOpenCv({
        cvId: result.cv.id,
        cv: result.cv.cv,
        templateId: result.cv.templateId || DEFAULT_TEMPLATE,
        accent: result.cv.accent || '#10b981',
        locale: result.cv.locale || 'fr',
        user: result.user,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’ouvrir ce CV.');
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    const saved = loadAccountUser();
    if (saved) {
      onUserChange(saved);
      void loadCvs(saved);
    }
    // Intentionnel : chargement initial uniquement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 p-6 text-white shadow-2xl shadow-ink-950/25 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-100">
              <UserRound className="h-3.5 w-3.5" /> Espace personnel
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{connected ? 'Mes CV sauvegardés' : 'Connexion à votre espace'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-200 sm:text-base">
              {connected
                ? 'Vos CV restent sauvegardés ici. Vous pouvez les ouvrir, les corriger et les réexporter à tout moment.'
                : 'Connectez-vous si vous avez déjà un compte, ou créez votre compte au moment où vous sauvegardez ou téléchargez votre CV.'}
            </p>
          </div>
          {connected && (
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={disconnect} icon={<LogOut className="h-4 w-4" />}>
              Déconnecter
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]">
        <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
          <h2 className="font-display text-xl font-extrabold text-ink-950">{connected ? 'Compte connecté' : 'Connexion / inscription'}</h2>
          <p className="mt-1 text-sm text-ink-500">{connected ? 'Actualisez la liste pour récupérer vos dernières modifications.' : 'Email + mot de passe pour retrouver votre espace depuis n’importe quel appareil.'}</p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmitAccount && busy !== 'account') void connect();
            }}
          >
            <Field label="Nom complet" value={user.name} onChange={(value) => updateUser({ name: value })} />
            <Field label="Email" type="email" value={user.email} onChange={(value) => updateUser({ email: value })} placeholder="client@email.com" />
            <Field label="Mot de passe" type="password" value={user.password || ''} onChange={(value) => updateUser({ password: value })} placeholder="Minimum 6 caractères" />
            <Field label="Téléphone" value={user.phone} onChange={(value) => updateUser({ phone: value })} placeholder="+228..." />

            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
            {message && <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">{message}</p>}

            <Button
              type="submit"
              className="mt-2 w-full text-base"
              icon={<Save className="h-4 w-4" />}
              loading={busy === 'account'}
              disabled={!canSubmitAccount}
            >
              {accountMode === 'register' ? 'S’inscrire / créer mon compte' : 'Se connecter à mon compte'}
            </Button>
            <p className="text-xs font-medium text-ink-500">
              Pour se connecter : email + mot de passe. Pour s’inscrire : ajoutez votre nom complet.
            </p>
          </form>

          <div className="mt-3 flex flex-col gap-2">
            {connected && (
              <Button variant="outline" icon={<RefreshCw className="h-4 w-4" />} loading={busy === 'list'} onClick={() => loadCvs()}>
                Actualiser mes CV
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink-950">Bibliothèque CV</h2>
              <p className="text-sm text-ink-500">Ouvrez un CV, modifiez-le puis sauvegardez les changements.</p>
            </div>
            <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-600">{cvs.length} CV</span>
          </div>

          {!connected ? (
            <div className="mt-6 rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-ink-300" />
              <p className="mt-3 font-bold text-ink-900">Connectez le compte pour voir les CV sauvegardés.</p>
            </div>
          ) : cvs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-brand-500" />
              <p className="mt-3 font-bold text-ink-900">Aucun CV sauvegardé.</p>
              <p className="mt-1 text-sm text-ink-500">Après le premier téléchargement payé, le CV apparaîtra ici.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {cvs.map((cv) => (
                <article key={cv.id} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-ink-950">{cv.title}</h3>
                      <p className="text-sm text-ink-500">{cv.subtitle || 'CV professionnel'}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                      {cv.paid ? 'Payé' : 'Brouillon'}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-ink-400">Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</p>
                  <Button className="mt-4 w-full" icon={<Edit3 className="h-4 w-4" />} loading={busy === cv.id} onClick={() => openCv(cv)}>
                    Modifier ce CV
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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
