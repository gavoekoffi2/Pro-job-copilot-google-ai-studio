import { CVData } from '@/types/cv';
import { fullName, dateRange, PAGE_W, PAGE_H } from './shared';

const GOLD = '#b45309';
const GOLD_LIGHT = '#fef3c7';

export function DiamondElite({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', fontSize: 11 }}>
      {/* Top gold bar */}
      <div style={{ height: 8, background: `linear-gradient(90deg, #78350f, ${GOLD}, #d97706, ${GOLD}, #78350f)` }} />

      {/* Header */}
      <div style={{ padding: '28px 44px', borderBottom: `1px solid ${GOLD_LIGHT}`, background: '#fffbf0' }}>
        <div style={{ textAlign: 'center' as const }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1c1007' }}>{name}</h1>
          {cv.title && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '8px 0' }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: GOLD }} />
              <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: GOLD, fontWeight: 600 }}>{cv.title}</span>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: GOLD }} />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 20px', fontSize: 9.5, color: '#78716c', marginTop: 8 }}>
            {[cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex' }}>
        {/* Main — 65% */}
        <div style={{ flex: 1, padding: '24px 36px 24px 44px' }}>
          {cv.summary && (
            <div style={{ marginBottom: 18 }}>
              <GoldTitle>Profil Exécutif</GoldTitle>
              <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.75, color: '#374151', textAlign: 'justify' as const }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <GoldTitle>Parcours Professionnel</GoldTitle>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1c1007', letterSpacing: '0.02em' }}>{exp.position}</div>
                    <div style={{ fontSize: 9.5, color: GOLD, flexShrink: 0 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#78716c', marginBottom: 4, fontStyle: 'italic' }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                      <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>◈</span>
                      <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <GoldTitle>Formation</GoldTitle>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1c1007' }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                    <div style={{ fontSize: 10, color: '#78716c', fontStyle: 'italic' }}>{edu.institution}{edu.gpa && ` · ${edu.gpa}`}</div>
                  </div>
                  <div style={{ fontSize: 9.5, color: '#9ca3af' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ width: 188, borderLeft: `1px solid ${GOLD_LIGHT}`, background: '#fffbf0', padding: '24px 18px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 7, paddingBottom: 3, borderBottom: `1px solid ${GOLD_LIGHT}` }}>{sg.category}</div>
              {sg.items.map((s, i) => (
                <div key={i} style={{ fontSize: 9.5, color: '#374151', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: GOLD, fontSize: 7 }}>◆</span>{s}
                </div>
              ))}
            </div>
          ))}

          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 8, paddingBottom: 3, borderBottom: `1px solid ${GOLD_LIGHT}` }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 9.5, color: '#374151', fontWeight: 600 }}>{l.language}</span>
                  <span style={{ fontSize: 8.5, color: GOLD }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {cv.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 8, paddingBottom: 3, borderBottom: `1px solid ${GOLD_LIGHT}` }}>Certifications</div>
              {cv.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 600, color: '#1c1007' }}>{c.name}</div>
                  <div style={{ fontSize: 8.5, color: '#78716c' }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom gold bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, #78350f, ${GOLD}, #d97706)`, marginTop: 'auto' }} />
    </div>
  );
}

function GoldTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#78350f' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, #b45309, transparent)` }} />
    </div>
  );
}
