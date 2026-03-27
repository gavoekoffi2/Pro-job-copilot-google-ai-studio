import { CVData } from '@/types/cv';
import { fullName, dateRange, SkillBar, SectionTitle, PAGE_W, PAGE_H } from './shared';

const ACCENT = '#1e3a5f';
const LIGHT = '#e8eef4';
const SIDEBAR_W = 230;

export function ApexCorporate({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', background: '#fff', fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: SIDEBAR_W, background: ACCENT, color: '#fff', padding: '32px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Name */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{cv.firstName || 'Prénom'}</div>
          <div style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.1, opacity: 0.85 }}>{cv.lastName || 'Nom'}</div>
          <div style={{ marginTop: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#93b8e0', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8 }}>
            {cv.title || 'Titre professionnel'}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#93b8e0', marginBottom: 8 }}>Contact</div>
          {[
            cv.email && { icon: '✉', val: cv.email },
            cv.phone && { icon: '☎', val: cv.phone },
            cv.location && { icon: '⊙', val: cv.location },
            cv.linkedin && { icon: 'in', val: cv.linkedin },
            cv.website && { icon: '⊕', val: cv.website },
          ].filter(Boolean).map((item: any, i) => (
            <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
              <span style={{ fontSize: 9, opacity: 0.6, minWidth: 12, paddingTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 9.5, lineHeight: 1.4, wordBreak: 'break-all' as const, opacity: 0.9 }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#93b8e0', marginBottom: 8 }}>Compétences</div>
            {cv.skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#c5d8ee', marginBottom: 4 }}>{sg.category}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {sg.items.map(s => (
                    <span key={s} style={{ fontSize: 8.5, padding: '2px 6px', background: 'rgba(255,255,255,0.12)', borderRadius: 3, color: '#deeaf5' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#93b8e0', marginBottom: 8 }}>Langues</div>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 9.5 }}>{l.language}</span>
                <span style={{ fontSize: 8.5, color: '#93b8e0' }}>{l.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#93b8e0', marginBottom: 8 }}>Certifications</div>
            {cv.certifications.map(c => (
              <div key={c.id} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9.5, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 8.5, color: '#93b8e0' }}>{c.issuer} · {c.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Summary */}
        {cv.summary && (
          <div>
            <SectionTitle color={ACCENT}>Profil professionnel</SectionTitle>
            <p style={{ fontSize: 10.5, lineHeight: 1.65, color: '#374151', margin: 0 }}>{cv.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div>
            <SectionTitle color={ACCENT}>Expérience professionnelle</SectionTitle>
            {cv.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 10, borderLeft: `3px solid ${LIGHT}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}>{exp.position}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: ACCENT }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#6b7280', textAlign: 'right' as const, whiteSpace: 'nowrap' as const, flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </div>
                </div>
                {exp.description && <p style={{ fontSize: 10, color: '#4b5563', margin: '4px 0 4px', lineHeight: 1.55 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ margin: '4px 0 0', paddingLeft: 14 }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5, marginBottom: 2 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div>
            <SectionTitle color={ACCENT}>Formation</SectionTitle>
            {cv.education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{edu.degree} {edu.field && `– ${edu.field}`}</div>
                  <div style={{ fontSize: 10, color: ACCENT, fontWeight: 500 }}>{edu.institution}</div>
                  {edu.gpa && <div style={{ fontSize: 9, color: '#6b7280' }}>Mention : {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 9, color: '#6b7280', whiteSpace: 'nowrap' as const }}>
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div>
            <SectionTitle color={ACCENT}>Projets</SectionTitle>
            {cv.projects.map(p => (
              <div key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{p.name}</div>
                <div style={{ fontSize: 9.5, color: '#6b7280', marginBottom: 3 }}>{p.technologies}</div>
                <p style={{ fontSize: 10, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
