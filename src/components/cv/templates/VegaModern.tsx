import { CVData } from '@/types/cv';
import { fullName, dateRange, LevelDots, SectionTitle, PhotoCircle, PAGE_W, PAGE_H } from './shared';

const ACCENT = '#7c3aed';
const SIDEBAR_W = 220;

export function VegaModern({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', background: '#fff', fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: SIDEBAR_W, background: '#f5f3ff', borderRight: '2px solid #ede9fe', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
        {/* Photo + Name */}
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <PhotoCircle photo={cv.photo} name={name} size={80} accentColor={ACCENT} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1f1235', lineHeight: 1.15 }}>{cv.firstName || 'Prénom'}</div>
          <div style={{ fontSize: 16, fontWeight: 400, color: '#4b5563', lineHeight: 1.15, marginBottom: 6 }}>{cv.lastName || 'Nom'}</div>
          <div style={{ display: 'inline-block', background: ACCENT, color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 9, fontWeight: 600, letterSpacing: '0.06em' }}>
            {cv.title || 'Titre'}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#ddd6fe' }} />

        {/* Contact */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Contact</div>
          {[
            cv.email && { label: cv.email, icon: '✉' },
            cv.phone && { label: cv.phone, icon: '📞' },
            cv.location && { label: cv.location, icon: '📍' },
            cv.linkedin && { label: cv.linkedin, icon: 'in' },
          ].filter(Boolean).map((item: any, i) => (
            <div key={i} style={{ fontSize: 9.5, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <span style={{ color: ACCENT, minWidth: 12 }}>{item.icon}</span>
              <span style={{ wordBreak: 'break-all' as const }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Compétences</div>
            {cv.skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#6d28d9', marginBottom: 4 }}>{sg.category}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {sg.items.map(s => (
                    <span key={s} style={{ fontSize: 8.5, padding: '2px 7px', background: '#ede9fe', borderRadius: 999, color: '#5b21b6', fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Langues</div>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{l.language}</div>
                <LevelDots level={l.level} color={ACCENT} />
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 8 }}>Certifications</div>
            {cv.certifications.map(c => (
              <div key={c.id} style={{ marginBottom: 7, paddingLeft: 8, borderLeft: `2px solid ${ACCENT}` }}>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: '#374151' }}>{c.name}</div>
                <div style={{ fontSize: 8.5, color: '#6b7280' }}>{c.issuer} · {c.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Summary */}
        {cv.summary && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 4, height: 18, background: ACCENT, borderRadius: 2 }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#1f1235' }}>Profil</div>
            </div>
            <p style={{ fontSize: 10.5, lineHeight: 1.7, color: '#374151', margin: 0, paddingLeft: 12 }}>{cv.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 18, background: ACCENT, borderRadius: 2 }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#1f1235' }}>Expérience</div>
            </div>
            {cv.experience.map((exp, idx) => (
              <div key={exp.id} style={{ marginBottom: 16, position: 'relative' as const, paddingLeft: 12 }}>
                <div style={{ position: 'absolute' as const, left: 0, top: 4, width: 8, height: 8, borderRadius: '50%', border: `2px solid ${ACCENT}`, background: '#fff' }} />
                {idx < cv.experience.length - 1 && (
                  <div style={{ position: 'absolute' as const, left: 3, top: 14, bottom: -8, width: 2, background: '#ede9fe' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}>{exp.position}</div>
                  <div style={{ fontSize: 9, color: '#7c3aed', fontWeight: 600, whiteSpace: 'nowrap' as const, marginLeft: 8 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: ACCENT, marginBottom: 4 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && <p style={{ fontSize: 10, color: '#4b5563', margin: '0 0 4px', lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                    <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2, fontSize: 8 }}>▸</span>
                    <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 18, background: ACCENT, borderRadius: 2 }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#1f1235' }}>Formation</div>
            </div>
            {cv.education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingLeft: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 10, color: ACCENT }}>{edu.institution}</div>
                  {edu.gpa && <div style={{ fontSize: 9, color: '#6b7280' }}>Mention : {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 9, color: '#6b7280', flexShrink: 0 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 18, background: ACCENT, borderRadius: 2 }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#1f1235' }}>Projets</div>
            </div>
            {cv.projects.map(p => (
              <div key={p.id} style={{ marginBottom: 10, paddingLeft: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: ACCENT, marginBottom: 2 }}>{p.technologies}</div>
                <p style={{ fontSize: 10, color: '#4b5563', margin: 0 }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
