import { CVData } from '@/types/cv';
import { fullName, dateRange, PhotoCircle, LevelDots, PAGE_W, PAGE_H } from './shared';

const DARK = '#0f172a';
const ACCENT = '#f97316';
const SIDEBAR_W = 210;

export function NexusDark({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', background: '#fff', fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: SIDEBAR_W, background: DARK, color: '#e2e8f0', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: 22, flexShrink: 0 }}>
        {/* Photo */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: 3, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #fb923c)` }}>
            <PhotoCircle photo={cv.photo} name={name} size={72} accentColor={ACCENT} />
          </div>
        </div>

        {/* Name */}
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{cv.firstName || 'Prénom'}</div>
          <div style={{ fontSize: 14, fontWeight: 300, color: '#94a3b8' }}>{cv.lastName || 'Nom'}</div>
          {cv.title && (
            <div style={{ marginTop: 6, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: ACCENT }}>{cv.title}</div>
          )}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

        {/* Contact */}
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Contact</div>
          {[
            cv.email, cv.phone, cv.location, cv.linkedin, cv.website,
          ].filter(Boolean).map((val, i) => (
            <div key={i} style={{ fontSize: 9, color: '#94a3b8', marginBottom: 5, lineHeight: 1.4, wordBreak: 'break-all' as const }}>{val}</div>
          ))}
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Compétences</div>
            {cv.skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8.5, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>{sg.category}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {sg.items.map(s => (
                    <span key={s} style={{ fontSize: 8, padding: '1.5px 6px', border: `1px solid rgba(249,115,22,0.4)`, borderRadius: 3, color: '#cbd5e1' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Langues</div>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 9.5, color: '#e2e8f0', marginBottom: 3 }}>{l.language}</div>
                <LevelDots level={l.level} color={ACCENT} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {cv.summary && (
          <div style={{ padding: '14px 16px', background: '#fafafa', borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 6px 6px 0' }}>
            <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.7, color: '#374151' }}>{cv.summary}</p>
          </div>
        )}

        {cv.experience.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: DARK }}></div>
              <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: DARK }}>Expérience</div>
            </div>
            {cv.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: `2px solid #e5e7eb` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: DARK }}>{exp.position}</div>
                  <div style={{ fontSize: 9, background: `${ACCENT}15`, color: ACCENT, fontWeight: 600, padding: '2px 7px', borderRadius: 3, whiteSpace: 'nowrap' as const }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', marginBottom: 4 }}>{exp.company}{exp.location && ` — ${exp.location}`}</div>
                {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                    <span style={{ color: ACCENT, flexShrink: 0 }}>›</span>
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
              <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, transparent, ${ACCENT})` }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: DARK }}>Formation</div>
            </div>
            {cv.education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{edu.institution}{edu.gpa && ` · ${edu.gpa}`}</div>
                </div>
                <div style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
              </div>
            ))}
          </div>
        )}

        {cv.certifications.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: DARK, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 3, marginBottom: 8 }}>Certifications</div>
            {cv.certifications.map(c => (
              <div key={c.id} style={{ fontSize: 9.5, color: '#374151', marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{c.name}</span> · {c.issuer} · <span style={{ color: '#64748b' }}>{c.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
