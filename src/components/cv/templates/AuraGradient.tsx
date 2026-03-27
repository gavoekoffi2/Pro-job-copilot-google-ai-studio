import { CVData } from '@/types/cv';
import { fullName, dateRange, PhotoCircle, SkillBar, PAGE_W, PAGE_H } from './shared';

const A1 = '#6366f1';
const A2 = '#8b5cf6';
const A3 = '#06b6d4';

export function AuraGradient({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', fontSize: 11 }}>
      {/* Gradient Header */}
      <div style={{ background: `linear-gradient(135deg, ${A1} 0%, ${A2} 50%, ${A3} 100%)`, padding: '28px 36px', color: '#fff', position: 'relative' as const, overflow: 'hidden' }}>
        {/* Background circles */}
        <div style={{ position: 'absolute' as const, top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute' as const, bottom: -20, left: '40%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' as const, zIndex: 1 }}>
          {/* Photo */}
          <div style={{ border: '3px solid rgba(255,255,255,0.5)', borderRadius: '50%' }}>
            <PhotoCircle photo={cv.photo} name={name} size={76} accentColor="#fff" />
          </div>
          {/* Name & title */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{name}</div>
            {cv.title && <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>{cv.title}</div>}
          </div>
          {/* Contact pills */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4, textAlign: 'right' as const }}>
            {[cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).map((val, i) => (
              <div key={i} style={{ fontSize: 9, background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>{val}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, background: `linear-gradient(90deg, ${A1}, ${A3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>À propos</div>
              <p style={{ margin: 0, fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, background: `linear-gradient(90deg, ${A1}, ${A2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10, borderBottom: '2px solid #e5e7eb', paddingBottom: 4 }}>Expérience</div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}>{exp.position}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: A1 }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                    </div>
                    <div style={{ fontSize: 9, color: '#fff', background: `linear-gradient(90deg, ${A1}, ${A2})`, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  {exp.description && <p style={{ margin: '4px 0', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <span style={{ background: `linear-gradient(90deg,${A1},${A3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0, fontWeight: 700 }}>▸</span>
                      <span style={{ fontSize: 9.5, color: '#4b5563', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, background: `linear-gradient(90deg, ${A2}, ${A3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, borderBottom: '2px solid #e5e7eb', paddingBottom: 4 }}>Formation</div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}{edu.field && ` – ${edu.field}`}</div>
                    <div style={{ fontSize: 10, color: A1 }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: 190, borderLeft: '1px solid #f3f4f6', padding: '24px 16px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: A1, marginBottom: 6 }}>{sg.category}</div>
              <SkillBar items={sg.items} color={A1} />
            </div>
          ))}

          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: A1, marginBottom: 6 }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9.5, color: '#374151' }}>{l.language}</span>
                  <span style={{ fontSize: 8.5, color: A2, fontWeight: 600 }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {cv.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: A1, marginBottom: 6 }}>Certifications</div>
              {cv.certifications.map(c => (
                <div key={c.id} style={{ padding: '5px 8px', background: `${A1}10`, borderRadius: 5, marginBottom: 5, borderLeft: `3px solid ${A1}` }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#374151' }}>{c.name}</div>
                  <div style={{ fontSize: 8.5, color: '#6b7280' }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
