import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Crown, Download, Lock, Plus, RefreshCw, Save, ShieldCheck, Trash2, Users, WalletCards } from 'lucide-react';
import { Button } from '../ui/ui';
import { clearAccountUser, loadAccountUser, privateAdminUser, registerAccount, saveAccountUser, savePrivateAdminAccess } from '../../lib/account';
import type { CheckoutUser } from '../../lib/payment';
import {
  deleteAdminUser,
  loadAdminDashboard,
  saveAdminUser,
  updateAdminProfile,
  updateCvPrice,
  type AdminDashboardPayload,
  type AdminProfileInput,
  type AdminUserSummary,
  type SaveUserInput,
} from '../../lib/admin';

const emptyUser: SaveUserInput = {
  name: '',
  email: '',
  phone: '',
  role: 'user',
  plan: 'free',
  durationDays: 30,
  permanent: false,
  active: true,
  initialPassword: '',
};

const emptyDashboard: AdminDashboardPayload = {
  settings: { cvDownloadPriceXof: 500, currency: 'XOF' },
  stats: { totalUsers: 0, activeUsers: 0, blockedUsers: 0, admins: 0, superAdmins: 1, unlimitedUsers: 1, proUsers: 0, freeUsers: 0, totalCvs: 0, paidCvs: 0 },
  users: [],
};

export function AdminDashboard() {
  const [admin, setAdmin] = useState<CheckoutUser>(() => loadAccountUser() || { name: 'Claude GAVOE Koffi', email: 'admin@jobtaskai.com', phone: '+228****0000' });
  const [adminProfile, setAdminProfile] = useState<AdminProfileInput>(() => {
    const saved = loadAccountUser();
    return { name: saved?.name || 'Claude GAVOE Koffi', email: saved?.email || '', phone: saved?.phone || '', newPassword: '' };
  });
  const [connected, setConnected] = useState(() => Boolean(loadAccountUser()?.isSuperAdmin));
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [form, setForm] = useState<SaveUserInput>(emptyUser);
  const [price, setPrice] = useState(500);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const users = dashboard?.users || [];
  const stats = dashboard?.stats;

  const sortedUsers = useMemo(() => users.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)), [users]);

  const applyDashboard = (payload: AdminDashboardPayload) => {
    setDashboard(payload);
    setPrice(payload.settings?.cvDownloadPriceXof || 500);
  };

  const syncAdminProfile = (user: CheckoutUser) => {
    setAdminProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '', newPassword: '' });
  };

  const connect = async () => {
    setBusy('login');
    setError(null);
    setMessage('');
    try {
      const account = await registerAccount(admin);
      const user = account.user || admin;
      if (!user.isSuperAdmin) throw new Error('Ce compte n’est pas super administrateur.');
      saveAccountUser(user);
      setAdmin(user);
      syncAdminProfile(user);
      setConnected(true);
      applyDashboard(await loadAdminDashboard(user));
      setMessage('Super administrateur connecté.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion admin impossible.');
    } finally {
      setBusy(null);
    }
  };

  const refresh = async (sourceAdmin = admin) => {
    setBusy('refresh');
    setError(null);
    try {
      applyDashboard(await loadAdminDashboard(sourceAdmin));
    } catch (err) {
      applyDashboard(emptyDashboard);
      setMessage('Espace privé ouvert.');
    } finally {
      setBusy(null);
    }
  };

  const savePrice = async () => {
    setBusy('price');
    setError(null);
    try {
      applyDashboard(await updateCvPrice(admin, price));
      setMessage(`Prix du téléchargement CV mis à jour : ${price.toLocaleString('fr-FR')} FCFA.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de modifier le prix.');
    } finally {
      setBusy(null);
    }
  };

  const saveAdminProfile = async () => {
    setBusy('adminProfile');
    setError(null);
    setMessage('');
    try {
      const result = await updateAdminProfile(admin, adminProfile);
      saveAccountUser(result.user);
      setAdmin(result.user);
      syncAdminProfile(result.user);
      applyDashboard(result.dashboard);
      setMessage('Vos accès administrateur ont été mis à jour.');
    } catch (err) {
      const reason = err instanceof Error ? err.message : '';
      if (reason === 'Erreur serveur.' || reason.includes('Failed to fetch') || admin.sessionToken === 'private-device-access') {
        const access = savePrivateAdminAccess({
          name: adminProfile.name,
          email: adminProfile.email,
          phone: adminProfile.phone,
          password: adminProfile.newPassword || undefined,
        });
        const privateUser = privateAdminUser(access);
        saveAccountUser(privateUser);
        setAdmin(privateUser);
        syncAdminProfile(privateUser);
        setMessage('Vos accès administrateur ont été mis à jour sur cet appareil.');
        return;
      }
      setError(reason || 'Impossible de modifier vos accès admin.');
    } finally {
      setBusy(null);
    }
  };

  const editUser = (entry: AdminUserSummary) => {
    setForm({
      name: entry.user.name,
      email: entry.user.email,
      phone: entry.user.phone,
      role: entry.user.role || 'user',
      plan: entry.user.plan || 'free',
      durationDays: 30,
      permanent: entry.user.plan === 'unlimited' || !entry.user.subscriptionExpiresAt,
      active: entry.user.active !== false,
      initialPassword: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveUser = async () => {
    setBusy('user');
    setError(null);
    try {
      applyDashboard(await saveAdminUser(admin, form));
      setMessage(`${form.email} mis à jour.`);
      setForm(emptyUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de sauvegarder cet utilisateur.');
    } finally {
      setBusy(null);
    }
  };

  const removeUser = async (email: string) => {
    if (!window.confirm(`Supprimer définitivement le compte ${email} ?`)) return;
    setBusy(`delete:${email}`);
    setError(null);
    try {
      applyDashboard(await deleteAdminUser(admin, email));
      setMessage(`${email} supprimé.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.');
    } finally {
      setBusy(null);
    }
  };

  const disconnect = () => {
    clearAccountUser();
    setConnected(false);
    setDashboard(null);
    setMessage('Session admin déconnectée sur cet appareil.');
  };

  useEffect(() => {
    const saved = loadAccountUser();
    if (saved?.isSuperAdmin) {
      setAdmin(saved);
      syncAdminProfile(saved);
      setConnected(true);
      void refresh(saved);
    }
    // chargement initial uniquement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-950 p-6 text-white sm:p-8">
        <div className="aurora-bg" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-100">
              <Crown className="h-3.5 w-3.5" /> Super administration JobTask AI
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Tableau de bord global</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-200 sm:text-base">
              Gérez les utilisateurs, les abonnements, les accès illimités et le prix du téléchargement PDF.
            </p>
          </div>
          {connected && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => refresh()} icon={<RefreshCw className="h-4 w-4" />} loading={busy === 'refresh'}>Actualiser</Button>
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={disconnect} icon={<Lock className="h-4 w-4" />}>Déconnecter</Button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {message && <p className="mt-5 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">{message}</p>}

      {!connected ? (
        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink-950">Connexion super administrateur</h2>
          <p className="mt-1 text-sm text-ink-500">Connectez votre compte illimité pour ouvrir le tableau de bord.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Nom" value={admin.name} onChange={(value) => setAdmin({ ...admin, name: value })} />
            <Field label="Téléphone" value={admin.phone} onChange={(value) => setAdmin({ ...admin, phone: value })} placeholder="+228..." />
            <Field label="Email admin" type="email" value={admin.email} onChange={(value) => setAdmin({ ...admin, email: value })} />
            <Field label="Mot de passe" type="password" value={admin.password || ''} onChange={(value) => setAdmin({ ...admin, password: value })} placeholder="Mot de passe super admin" />
          </div>
          <Button className="mt-5" icon={<ShieldCheck className="h-4 w-4" />} loading={busy === 'login'} disabled={!admin.email || !admin.password || !admin.name || !admin.phone} onClick={connect}>
            Se connecter au tableau de bord
          </Button>
        </div>
      ) : (
        <>
          {stats && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={<Users className="h-5 w-5" />} label="Utilisateurs" value={stats.totalUsers} />
              <Stat icon={<Crown className="h-5 w-5" />} label="Accès illimités" value={stats.unlimitedUsers} />
              <Stat icon={<Download className="h-5 w-5" />} label="CV sauvegardés" value={stats.totalCvs} />
              <Stat icon={<WalletCards className="h-5 w-5" />} label="CV payés" value={stats.paidCvs} />
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-gold-200 bg-gold-50 p-5 shadow-soft">
                <h2 className="font-display text-xl font-bold text-ink-950">Mes accès admin</h2>
                <p className="mt-1 text-sm text-ink-600">Modifiez votre nom, email, téléphone ou mot de passe administrateur à tout moment.</p>
                <div className="mt-4 space-y-3">
                  <Field label="Nom admin" value={adminProfile.name} onChange={(value) => setAdminProfile({ ...adminProfile, name: value })} />
                  <Field label="Email admin" type="email" value={adminProfile.email} onChange={(value) => setAdminProfile({ ...adminProfile, email: value })} />
                  <Field label="Téléphone admin" value={adminProfile.phone} onChange={(value) => setAdminProfile({ ...adminProfile, phone: value })} />
                  <Field label="Nouveau mot de passe" type="password" value={adminProfile.newPassword || ''} onChange={(value) => setAdminProfile({ ...adminProfile, newPassword: value })} placeholder="Laisser vide pour garder l’actuel" />
                </div>
                <Button className="mt-5 w-full" icon={<ShieldCheck className="h-4 w-4" />} loading={busy === 'adminProfile'} disabled={!adminProfile.name || !adminProfile.email || !adminProfile.phone || Boolean(adminProfile.newPassword && adminProfile.newPassword.length < 6)} onClick={saveAdminProfile}>
                  Sauvegarder mes accès admin
                </Button>
              </div>

              <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
                <h2 className="font-display text-xl font-bold text-ink-950">Prix du téléchargement CV</h2>
                <p className="mt-1 text-sm text-ink-500">Ce montant est utilisé sur GeniusPay et dans le paywall client.</p>
                <div className="mt-4 flex gap-2">
                  <input type="number" min={100} value={price} onChange={(event) => setPrice(Number(event.target.value))} className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-bold text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  <Button icon={<Save className="h-4 w-4" />} loading={busy === 'price'} onClick={savePrice}>Sauver</Button>
                </div>
              </div>

              <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
                <h2 className="font-display text-xl font-bold text-ink-950">Utilisateur / abonnement</h2>
                <p className="mt-1 text-sm text-ink-500">Ajoutez un utilisateur, attribuez un abonnement ou un accès illimité.</p>
                <div className="mt-4 space-y-3">
                  <Field label="Nom" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
                  <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
                  <Field label="Téléphone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
                  <Field label="Mot de passe initial (nouveau compte)" type="password" value={form.initialPassword || ''} onChange={(value) => setForm({ ...form, initialPassword: value })} placeholder="Optionnel" />
                  <Select label="Rôle" value={form.role} onChange={(value) => setForm({ ...form, role: value as SaveUserInput['role'], plan: value === 'super_admin' ? 'unlimited' : form.plan, permanent: value === 'super_admin' ? true : form.permanent })} options={[['user', 'Utilisateur'], ['admin', 'Admin'], ['super_admin', 'Super admin']]} />
                  <Select label="Abonnement" value={form.plan} onChange={(value) => setForm({ ...form, plan: value as SaveUserInput['plan'], permanent: value === 'unlimited' ? true : form.permanent })} options={[['free', 'Gratuit'], ['pro', 'Pro / Payant'], ['unlimited', 'Illimité']]} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Durée jours" type="number" value={String(form.durationDays || '')} onChange={(value) => setForm({ ...form, durationDays: Number(value) })} />
                    <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-3 text-sm font-semibold text-ink-700">
                      <input type="checkbox" checked={Boolean(form.permanent)} onChange={(event) => setForm({ ...form, permanent: event.target.checked })} /> Permanent
                    </label>
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-3 text-sm font-semibold text-ink-700">
                    <input type="checkbox" checked={form.active !== false} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Compte actif
                  </label>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button className="flex-1" icon={<Plus className="h-4 w-4" />} loading={busy === 'user'} disabled={!form.email || !form.name} onClick={saveUser}>Enregistrer</Button>
                  <Button variant="outline" onClick={() => setForm(emptyUser)}>Vider</Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink-950">Tous les utilisateurs connectés</h2>
                  <p className="text-sm text-ink-500">Rôle, abonnement, statut, CV et activité.</p>
                </div>
                <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-600">{sortedUsers.length} comptes</span>
              </div>
              <div className="mt-5 space-y-3">
                {sortedUsers.map((entry) => (
                  <article key={entry.user.email} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink-950">{entry.user.name || entry.user.email}</h3>
                        <p className="text-sm text-ink-500">{entry.user.email} · {entry.user.phone || 'Téléphone non renseigné'}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
                          <Badge tone={entry.user.active === false ? 'danger' : 'success'}>{entry.user.active === false ? 'Bloqué' : 'Actif'}</Badge>
                          <Badge tone={entry.user.isSuperAdmin ? 'gold' : 'neutral'}>{entry.user.role || 'user'}</Badge>
                          <Badge tone={entry.user.isUnlimited ? 'success' : 'neutral'}>{entry.user.plan || 'free'}</Badge>
                          {entry.user.subscriptionExpiresAt && <Badge tone="neutral">Expire {new Date(entry.user.subscriptionExpiresAt).toLocaleDateString('fr-FR')}</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-ink-700">{entry.cvCount} CV · {entry.paidCvCount} payés</span>
                        <Button size="sm" variant="outline" onClick={() => editUser(entry)}>Modifier</Button>
                        <Button size="sm" variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" loading={busy === `delete:${entry.user.email}`} disabled={entry.user.email === admin.email} onClick={() => removeUser(entry.user.email)} icon={<Trash2 className="h-4 w-4" />}>Supprimer</Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
        {options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-ink-500">{label}</p>
          <p className="font-display text-3xl font-bold text-ink-950">{value.toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'danger' | 'gold' }) {
  const colors = {
    neutral: 'bg-ink-100 text-ink-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-rose-50 text-rose-700',
    gold: 'bg-gold-100 text-gold-800',
  };
  return <span className={`rounded-full px-2.5 py-1 ${colors[tone]}`}>{children}</span>;
}
