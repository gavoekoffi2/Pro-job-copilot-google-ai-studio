import type { CVData } from '@/types/cv';

export type { CVData };

// ─── Helpers ────────────────────────────────────────────────
export function fullName(cv: CVData) {
  return `${cv.firstName || 'Prénom'} ${cv.lastName || 'Nom'}`.trim();
}

export function formatDate(d?: string): string {
  if (!d) return '';
  if (d.length === 4) return d; // year only
  try {
    return new Date(d + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  } catch { return d; }
}

export function dateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Présent' : formatDate(end);
  return `${s} – ${e}`;
}

// ─── Photo placeholder ───────────────────────────────────────
export function PhotoCircle({ photo, name, size = 80, accentColor = '#7c3aed' }: {
  photo?: string; name: string; size?: number; accentColor?: string;
}) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}22` }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}80)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials || '??'}
    </div>
  );
}

export function PhotoSquare({ photo, name, size = 90, accentColor = '#7c3aed' }: {
  photo?: string; name: string; size?: number; accentColor?: string;
}) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size, borderRadius: 6, objectFit: 'cover' }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: `linear-gradient(135deg, ${accentColor}60, ${accentColor}cc)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 700, color: '#fff',
    }}>
      {initials || '??'}
    </div>
  );
}

// ─── Skill bar ───────────────────────────────────────────────
export function SkillBar({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {items.map(skill => (
        <span key={skill} style={{
          padding: '2px 8px', borderRadius: 999, fontSize: 9,
          background: `${color}18`, color: color, fontWeight: 600,
          border: `1px solid ${color}30`,
        }}>{skill}</span>
      ))}
    </div>
  );
}

// ─── Dot skills ─────────────────────────────────────────────
export function DotSkills({ items, color = '#7c3aed' }: { items: string[]; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map(skill => (
        <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#374151' }}>{skill}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Level dots ──────────────────────────────────────────────
const LEVEL_MAP: Record<string, number> = {
  Native: 5, Fluent: 4, Advanced: 3, Intermediate: 2, Basic: 1,
};
export function LevelDots({ level, color = '#7c3aed' }: { level: string; color?: string }) {
  const filled = LEVEL_MAP[level] ?? 3;
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= filled ? color : `${color}25`,
        }} />
      ))}
    </div>
  );
}

// ─── Section title variants ──────────────────────────────────
export function SectionTitle({ children, color, style }: {
  children: React.ReactNode; color?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
      textTransform: 'uppercase' as const, color: color ?? '#111',
      borderBottom: `2px solid ${color ?? '#111'}`, paddingBottom: 4,
      marginBottom: 8, ...style,
    }}>{children}</div>
  );
}

// ─── Page wrapper (A4 ratio for preview) ────────────────────
export const PAGE_W = 794;
export const PAGE_H = 1123;
