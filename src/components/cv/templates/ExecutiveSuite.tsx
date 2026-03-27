import { CVData } from '@/types/cv';
import { fullName, dateRange, PAGE_W, PAGE_H } from './shared';

const ACCENT = '#1a1a2e';
const LINE = '#d1d5db';

export function ExecutiveSuite({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: 'Georgia, "Times New Roman", serif', background: '#fff', padding: '40px 56px', boxSizing: 'border-box' as const, fontSize: 11 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' as const, marginBottom: 24, paddingBottom: 20, borderBottom: `3px double ${ACCENT}` }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '0.04em', color: ACCENT, textTransform: 'uppercase' as const, fontFamily: 'Georgia, serif' }}>{name}</h1>
        {cv.title && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, fontStyle: 'italic' }}>{cv.title}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px', marginTop: 10, fontSize: 9.5, color: '#374151' }}>
          {cv.email && <span>✉ {cv.email}</span>}
          {cv.phone && <span>✆ {cv.phone}</span>}
          {cv.location && <span>⊙ {cv.location}</span>}
          {cv.linkedin && <span>in {cv.linkedin}</span>}
          {cv.website && <span>⊕ {cv.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: ACCENT, borderBottom: `1px solid ${LINE}`, paddingBottom: 4, marginBottom: 8 }}>Profil</h2>
          <p style={{ fontSize: 10.5, lineHeight: 1.7, color: '#374151', textAlign: 'justify' as const, margin: 0 }}>{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: ACCENT, borderBottom: `1px solid ${LINE}`, paddingBottom: 4, marginBottom: 10 }}>Expérience Professionnelle</h2>
          {cv.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT }}>{exp.position}</div>
                <div style={{ fontSize: 9.5, color: '#6b7280', fontStyle: 'italic' }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
              </div>
              <div style={{ fontSize: 10.5, color: '#374151', fontStyle: 'italic', marginBottom: 4 }}>{exp.company}{exp.location && `, ${exp.location}`}</div>
              {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {exp.achievements.map((a, i) => <li key={i} style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.55, marginBottom: 2 }}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cv.education.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: ACCENT, borderBottom: `1px solid ${LINE}`, paddingBottom: 4, marginBottom: 10 }}>Formation</h2>
          {cv.education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>{edu.degree}{edu.field && ` en ${edu.field}`}</div>
                <div style={{ fontSize: 10, fontStyle: 'italic', color: '#374151' }}>{edu.institution}{edu.gpa && ` — Mention : ${edu.gpa}`}</div>
              </div>
              <div style={{ fontSize: 9.5, color: '#6b7280' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Two-col bottom */}
      <div style={{ display: 'flex', gap: 30 }}>
        {/* Skills */}
        {cv.skills.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: ACCENT, borderBottom: `1px solid ${LINE}`, paddingBottom: 4, marginBottom: 8 }}>Compétences</h2>
            {cv.skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#374151' }}>{sg.category} : </span>
                <span style={{ fontSize: 9.5, color: '#4b5563' }}>{sg.items.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
        {/* Languages */}
        {cv.languages.length > 0 && (
          <div style={{ minWidth: 150 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: ACCENT, borderBottom: `1px solid ${LINE}`, paddingBottom: 4, marginBottom: 8 }}>Langues</h2>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 9.5, color: '#374151', marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{l.language}</span> — {l.level}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
