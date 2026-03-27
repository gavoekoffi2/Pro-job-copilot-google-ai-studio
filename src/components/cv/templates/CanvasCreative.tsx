import { CVData } from '@/types/cv';
import { fullName, dateRange, PhotoCircle, PAGE_W, PAGE_H } from './shared';

const TEAL = '#059669';
const LIGHT = '#ecfdf5';

export function CanvasCreative({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', fontSize: 11, display: 'flex', flexDirection: 'column' as const }}>
      {/* Colorful top bar */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${TEAL}, #34d399, #06b6d4)` }} />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left sidebar */}
        <div style={{ width: 215, background: LIGHT, padding: '28px 18px', display: 'flex', flexDirection: 'column' as const, gap: 22, flexShrink: 0 }}>
          {/* Photo + name */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${TEAL}, #34d399)`, padding: 3, borderRadius: '50%' }}>
                <PhotoCircle photo={cv.photo} name={name} size={72} accentColor={TEAL} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#065f46', lineHeight: 1.1 }}>{cv.firstName || 'Prénom'}</div>
            <div style={{ fontSize: 16, fontWeight: 400, color: '#374151', lineHeight: 1.1, marginBottom: 6 }}>{cv.lastName || 'Nom'}</div>
            {cv.title && <div style={{ background: TEAL, color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 9, fontWeight: 600, display: 'inline-block' }}>{cv.title}</div>}
          </div>

          <div style={{ height: 2, background: `linear-gradient(90deg, ${TEAL}, transparent)` }} />

          {/* Contact */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 8 }}>Contact</div>
            {[cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontSize: 9.5, color: '#374151', marginBottom: 5, wordBreak: 'break-all' as const }}>{v}</div>
            ))}
          </div>

          {/* Skills with custom bars */}
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 7 }}>{sg.category}</div>
              {sg.items.map((s, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 9.5, color: '#374151' }}>{s}</span>
                  </div>
                  <div style={{ height: 4, background: '#d1fae5', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${65 + (i % 4) * 9}%`, background: `linear-gradient(90deg, ${TEAL}, #34d399)`, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 8 }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9.5, color: '#374151', fontWeight: 500 }}>{l.language}</span>
                  <span style={{ fontSize: 8.5, background: `${TEAL}20`, color: TEAL, padding: '1px 6px', borderRadius: 999 }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '28px 26px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${TEAL}, transparent)` }} />
                Profil
              </div>
              <p style={{ margin: 0, fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 10, paddingBottom: 4, borderBottom: `2px solid ${LIGHT}` }}>Expérience</div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 10, borderLeft: `3px solid ${LIGHT}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#065f46' }}>{exp.position}</div>
                    <div style={{ fontSize: 9, background: `${TEAL}15`, color: TEAL, fontWeight: 600, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: TEAL, marginBottom: 4 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <span style={{ color: TEAL, flexShrink: 0, fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 10, paddingBottom: 4, borderBottom: `2px solid ${LIGHT}` }}>Formation</div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                    <div style={{ fontSize: 10, color: TEAL }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}

          {cv.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 8 }}>Certifications</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {cv.certifications.map(c => (
                  <div key={c.id} style={{ padding: '5px 10px', background: LIGHT, borderRadius: 6, border: `1px solid #a7f3d0` }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#065f46' }}>{c.name}</div>
                    <div style={{ fontSize: 8.5, color: '#6b7280' }}>{c.issuer} · {c.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
