import { CVData } from '@/types/cv';
import { fullName, dateRange, PAGE_W, PAGE_H } from './shared';

const BLUE = '#2563eb';
const LIGHT_BLUE = '#eff6ff';

export function NordicClean({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', fontSize: 11 }}>
      {/* Header */}
      <div style={{ background: LIGHT_BLUE, borderBottom: `4px solid ${BLUE}`, padding: '28px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>{name}</h1>
            {cv.title && <div style={{ fontSize: 12, color: BLUE, marginTop: 4, fontWeight: 500 }}>{cv.title}</div>}
          </div>
          <div style={{ textAlign: 'right' as const, fontSize: 9.5, color: '#475569', display: 'flex', flexDirection: 'column' as const, gap: 3 }}>
            {cv.email && <span>{cv.email}</span>}
            {cv.phone && <span>{cv.phone}</span>}
            {cv.location && <span>{cv.location}</span>}
            {cv.linkedin && <span>{cv.linkedin}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <div style={{ borderLeft: `4px solid ${BLUE}`, paddingLeft: 12 }}>
              <p style={{ margin: 0, fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, background: BLUE, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>E</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>Expérience</div>
              </div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}>{exp.position}</div>
                    <div style={{ fontSize: 9, background: LIGHT_BLUE, color: BLUE, fontWeight: 600, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: BLUE, marginBottom: 4 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE, flexShrink: 0, marginTop: 4 }} />
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
                <div style={{ width: 28, height: 28, background: LIGHT_BLUE, border: `2px solid ${BLUE}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: BLUE, fontSize: 12, fontWeight: 700 }}>F</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>Formation</div>
              </div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                    <div style={{ fontSize: 10, color: BLUE }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 185, borderLeft: `1px solid ${LIGHT_BLUE}`, background: '#fafcff', padding: '24px 14px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: BLUE, marginBottom: 7 }}>{sg.category}</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                {sg.items.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
                    <span style={{ fontSize: 9.5, color: '#374151' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: BLUE, marginBottom: 7 }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>{l.language}</div>
                  <div style={{ fontSize: 8.5, color: '#6b7280' }}>{l.level}</div>
                </div>
              ))}
            </div>
          )}

          {cv.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: BLUE, marginBottom: 7 }}>Certifs</div>
              {cv.certifications.map(c => (
                <div key={c.id} style={{ fontSize: 9, color: '#374151', marginBottom: 5 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: '#9ca3af' }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
