import { CVData } from '@/types/cv';
import { fullName, dateRange, PhotoSquare, LevelDots, PAGE_W, PAGE_H } from './shared';

const NAVY = '#0d2137';
const GOLD = '#c9a84c';

export function PrestigePhoto({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: 'Georgia, serif', background: '#fff', fontSize: 11 }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Photo */}
        <div style={{ border: `3px solid ${GOLD}`, borderRadius: 6 }}>
          <PhotoSquare photo={cv.photo} name={name} size={90} accentColor={GOLD} />
        </div>
        {/* Name block */}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 400, color: '#fff', letterSpacing: '0.04em', fontFamily: 'Georgia, serif' }}>{name}</h1>
          {cv.title && (
            <div style={{ marginTop: 6, fontSize: 11, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{cv.title}</div>
          )}
          {/* Gold separator */}
          <div style={{ width: 50, height: 2, background: GOLD, margin: '10px 0' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 18px', fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>
            {[cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '24px 30px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <div style={{ padding: '12px 16px', background: '#f8f7f2', borderLeft: `4px solid ${GOLD}` }}>
              <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.75, color: '#374151', fontStyle: 'italic' }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: NAVY }}>Expérience Professionnelle</span>
                <div style={{ flex: 1, height: 1, background: GOLD }} />
              </div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{exp.position}</div>
                    <div style={{ fontSize: 9.5, color: GOLD, fontStyle: 'italic', flexShrink: 0 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: 10, fontStyle: 'italic', color: '#374151', marginBottom: 5 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                      <span style={{ color: GOLD }}>◆</span>
                      <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: NAVY }}>Formation</span>
                <div style={{ flex: 1, height: 1, background: GOLD }} />
              </div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                    <div style={{ fontSize: 10, fontStyle: 'italic', color: '#374151' }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: 9.5, color: '#9ca3af' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ width: 180, background: '#f8f7f2', borderLeft: `1px solid #e5e2d6`, padding: '24px 14px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: NAVY, marginBottom: 6, paddingBottom: 3, borderBottom: `1px solid ${GOLD}40` }}>{sg.category}</div>
              {sg.items.map(s => (
                <div key={s} style={{ fontSize: 9.5, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: GOLD, fontSize: 8 }}>◆</span>{s}
                </div>
              ))}
            </div>
          ))}

          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: NAVY, marginBottom: 8, paddingBottom: 3, borderBottom: `1px solid ${GOLD}40` }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{l.language}</div>
                  <LevelDots level={l.level} color={GOLD} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
