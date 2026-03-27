import { CVData } from '@/types/cv';
import { fullName, dateRange, PhotoCircle, SkillBar, PAGE_W, PAGE_H } from './shared';

const RED = '#dc2626';
const DARK = '#111827';

export function HorizonBold({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', fontSize: 11 }}>
      {/* Bold header */}
      <div style={{ background: DARK, padding: '0', overflow: 'hidden', position: 'relative' as const }}>
        <div style={{ position: 'absolute' as const, top: 0, right: 0, width: 200, height: '100%', background: RED, clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />

        <div style={{ padding: '30px 36px', display: 'flex', alignItems: 'center', gap: 22, position: 'relative' as const, zIndex: 1 }}>
          <div style={{ border: `3px solid rgba(255,255,255,0.3)`, borderRadius: '50%' }}>
            <PhotoCircle photo={cv.photo} name={name} size={80} accentColor={RED} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{cv.firstName || 'Prénom'}</h1>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: RED, letterSpacing: '-0.03em', lineHeight: 1 }}>{cv.lastName || 'Nom'}</h1>
            {cv.title && <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{cv.title}</div>}
          </div>
          <div style={{ textAlign: 'right' as const, zIndex: 2 }}>
            {[cv.email, cv.phone, cv.location].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{v}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Red accent bar */}
      <div style={{ height: 4, background: RED }} />

      {/* Content */}
      <div style={{ display: 'flex' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '22px 28px 22px 36px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <p style={{ margin: 0, fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{cv.summary}</p>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 20, height: 20, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>E</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '-0.01em', color: DARK, textTransform: 'uppercase' as const }}>Expérience</div>
                <div style={{ flex: 1, height: 2, background: RED }} />
              </div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{exp.position}</div>
                    <div style={{ fontSize: 9, background: RED, color: '#fff', padding: '2px 8px', borderRadius: 3, flexShrink: 0, fontWeight: 600 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: 10, color: RED, fontWeight: 700, marginBottom: 4 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <div style={{ width: 6, height: 6, background: RED, borderRadius: 1, flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>F</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '-0.01em', color: DARK, textTransform: 'uppercase' as const }}>Formation</div>
                <div style={{ flex: 1, height: 2, background: '#e5e7eb' }} />
              </div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 180, borderLeft: `3px solid #f3f4f6`, padding: '22px 14px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: DARK, marginBottom: 6, paddingBottom: 4, borderBottom: `2px solid ${RED}` }}>{sg.category}</div>
              <SkillBar items={sg.items} color={RED} />
            </div>
          ))}
          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: DARK, marginBottom: 6, paddingBottom: 4, borderBottom: `2px solid ${RED}` }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9.5, color: DARK, fontWeight: 600 }}>{l.language}</span>
                  <span style={{ fontSize: 8.5, color: RED, fontWeight: 700 }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
