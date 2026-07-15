import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  type LucideIcon,
} from 'lucide-react';
import type { Experience, Locale, SkillLevel } from '../../types';
import { initials } from '../../lib/utils';

/** Props communes à tous les templates. */
export interface TemplateProps {
  data: import('../../types').CVData;
  accent: string;
  locale: Locale;
  /** Multiplicateur typographique choisi par l'utilisateur (0,9 à 1,15). */
  fontScale?: number;
}

/** Niveau de compétence -> pourcentage pour les barres/points. */
export function levelToPercent(level: SkillLevel): number {
  switch (level) {
    case 'Débutant':
      return 40;
    case 'Intermédiaire':
      return 62;
    case 'Avancé':
      return 82;
    case 'Expert':
      return 100;
    default:
      return 0;
  }
}

export function levelToDots(level: SkillLevel): number {
  switch (level) {
    case 'Débutant':
      return 2;
    case 'Intermédiaire':
      return 3;
    case 'Avancé':
      return 4;
    case 'Expert':
      return 5;
    default:
      return 0;
  }
}

/** Affiche une plage de dates ("2022 — Présent"). */
export function dateRange(exp: Experience, locale: Locale): string {
  const present = locale === 'fr' ? 'Présent' : 'Present';
  const end = exp.current ? present : exp.endDate;
  if (exp.startDate && end) return `${exp.startDate} — ${end}`;
  return exp.startDate || end || '';
}

/** Transforme une description multi-lignes en liste à puces. */
export function Bullets({
  text,
  className = '',
  markerColor,
}: {
  text: string;
  className?: string;
  markerColor?: string;
}) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  if (lines.length === 1) {
    return <p className={className}>{lines[0]}</p>;
  }
  return (
    <ul className={`space-y-1 ${className}`}>
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2">
          <span
            className="mt-[0.45em] inline-block h-1 w-1 shrink-0 rounded-full"
            style={{ background: markerColor ?? 'currentColor' }}
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

const ICONS: Record<string, LucideIcon> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  website: Globe,
  linkedin: Linkedin,
};

/** Élément de contact avec icône. */
export function ContactItem({
  type,
  value,
  className = '',
  iconClassName = '',
}: {
  type: keyof typeof ICONS;
  value: string;
  className?: string;
  iconClassName?: string;
}) {
  if (!value) return null;
  const Icon = ICONS[type];
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClassName}`} />
      <span className="break-all">{value}</span>
    </span>
  );
}

/** Photo de profil avec repli sur les initiales. */
export function ProfilePhoto({
  src,
  name,
  size = 96,
  rounded = 'rounded-full',
  accent,
  className = '',
}: {
  src?: string;
  name: string;
  size?: number;
  rounded?: string;
  accent: string;
  className?: string;
}) {
  if (src === '__HIDE_PHOTO__') return null;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${rounded} object-cover ${className}`}
        style={{ width: size, height: size }}
        crossOrigin="anonymous"
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center font-semibold text-white ${rounded} ${className}`}
      style={{
        width: size,
        height: size,
        background: accent,
        fontSize: size * 0.36,
      }}
    >
      {initials(name) || '··'}
    </div>
  );
}

/** Barre de progression premium d'une compétence. Sans niveau renseigné,
 * la piste reste visible mais aucun niveau n'est inventé. */
export function SkillBar({
  percent,
  accent,
  track = 'rgba(15,23,42,0.10)',
}: {
  percent: number;
  accent: string;
  track?: string;
}) {
  const safePercent = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="relative h-[7px] w-full overflow-hidden rounded-full ring-1 ring-black/[0.04]"
      style={{ background: track }}
    >
      {safePercent > 0 ? (
        <div
          className="relative h-full rounded-full"
          style={{
            width: `${safePercent}%`,
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
            boxShadow: `0 0 10px ${accent}42`,
          }}
        >
          <span className="absolute inset-x-1 top-[1px] h-px rounded-full bg-white/35" />
        </div>
      ) : (
        <div
          className="h-full w-full opacity-45"
          style={{
            background: `repeating-linear-gradient(90deg, ${accent}55 0 16px, transparent 16px 21px)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 flex justify-evenly opacity-25">
        {[1, 2, 3].map((tick) => (
          <span key={tick} className="h-full w-px bg-white" />
        ))}
      </div>
    </div>
  );
}

/** Segments de niveau premium. Les segments vides restent visibles. */
export function LevelDots({
  count,
  accent,
  total = 5,
  empty = 'rgba(15,23,42,0.12)',
}: {
  count: number;
  accent: string;
  total?: number;
  empty?: string;
}) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`${count}/${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-[5px] w-[13px] rounded-full ring-1 ring-black/[0.03]"
          style={{
            background: i < count ? `linear-gradient(90deg, ${accent}bb, ${accent})` : empty,
            boxShadow: i < count ? `0 1px 4px ${accent}30` : undefined,
          }}
        />
      ))}
    </span>
  );
}

/** Libellés de sections selon la langue. */
export function sectionLabels(locale: Locale) {
  if (locale === 'en') {
    return {
      profile: 'Profile',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      certifications: 'Certifications',
      interests: 'Interests',
      contact: 'Contact',
    };
  }
  return {
    profile: 'Profil',
    experience: 'Expériences',
    education: 'Formations',
    skills: 'Compétences',
    languages: 'Langues',
    certifications: 'Certifications',
    interests: "Centres d'intérêt",
    contact: 'Contact',
  };
}
