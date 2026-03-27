'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(lang === 'fr' ? 'Veuillez entrer votre prénom.' : 'Please enter your name.');
      return;
    }
    if (!email.includes('@')) {
      setError(lang === 'fr' ? 'Email invalide.' : 'Invalid email.');
      return;
    }
    if (password.length < 6) {
      setError(lang === 'fr' ? 'Le mot de passe doit faire au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  const perks = lang === 'fr'
    ? ['13 outils IA gratuits', 'Sans carte bancaire', 'Données 100% privées', 'Disponible immédiatement']
    : ['13 free AI tools', 'No credit card', '100% private data', 'Available instantly'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#08080f]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              Pro<span className="gradient-text-primary">Job</span> Copilot
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-8 border border-white/10"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white mb-1">
              {lang === 'fr' ? 'Créer mon compte' : 'Create my account'}
            </h1>
            <p className="text-white/50 text-sm">
              {lang === 'fr' ? 'Gratuit, sans engagement.' : 'Free, no commitment.'}
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                {lang === 'fr' ? 'Prénom' : 'First name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'fr' ? 'Votre prénom' : 'Your first name'}
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                  autoComplete="given-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                {lang === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={lang === 'fr' ? 'Min. 6 caractères' : 'Min. 6 characters'}
                  className="input-glass w-full pl-10 pr-10 py-3 text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {lang === 'fr' ? 'Créer mon compte' : 'Create my account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            {lang === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              {lang === 'fr' ? 'Se connecter' : 'Log in'}
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-xs text-white/25 mt-6">
          {lang === 'fr'
            ? 'Vos données sont stockées localement sur votre appareil.'
            : 'Your data is stored locally on your device.'}
        </p>
      </div>
    </div>
  );
}
