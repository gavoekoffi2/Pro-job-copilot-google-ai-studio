import { CVData } from '@/types/cv';
import { fullName, dateRange, PAGE_W, PAGE_H } from './shared';

export function BlancMinimal({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  const hr = <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />;
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: '#fff', padding: '52px 64px', boxSizing: 'border-box' as const, fontSize: 11, color: '#1a1a1a' }}>
      {/* Name */}
      <div style={{ marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: '#111' }}>{name}</h1>
        {cv.title && <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, letterSpacing: '0.02em' }}>{cv.title}</div>}
      </div>

      {/* Contact inline */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 20px', fontSize: 9.5, color: '#6b7280', marginBottom: 4 }}>
        {[cv.email, cv.phone, cv.location, cv.linkedin, cv.website].filter(Boolean).map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>

      {hr}

      {cv.summary && (
        <>
          <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.8, color: '#4b5563', maxWidth: 580 }}>{cv.summary}</p>
          {hr}
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: 14 }}>Expérience</div>
          {cv.experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < cv.experience.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{exp.position}</div>
                <div style={{ fontSize: 9.5, color: '#9ca3af' }}>{dateRange(exp.startDate, exp.endDate, exp.current)}</div>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 5 }}>{exp.company}{exp.location && ` — ${exp.location}`}</div>
              {exp.description && <p style={{ margin: '0 0 4px', fontSize: 10, lineHeight: 1.65, color: '#4b5563' }}>{exp.description}</p>}
              {exp.achievements.map((a, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                  <span style={{ color: '#d1d5db', flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.6 }}>{a}</span>
                </div>
              ))}
            </div>
          ))}
          {hr}
        </>
      )}

      {/* Education + Skills side by side */}
      <div style={{ display: 'flex', gap: 40 }}>
        {cv.education.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: 12 }}>Formation</div>
            {cv.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>{edu.institution}</div>
                <div style={{ fontSize: 9.5, color: '#9ca3af' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18, flex: 1 }}>
          {cv.skills.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: 10 }}>Compétences</div>
              {cv.skills.map(sg => (
                <div key={sg.id} style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 9.5, color: '#374151', fontWeight: 600 }}>{sg.category} · </span>
                  <span style={{ fontSize: 9.5, color: '#6b7280' }}>{sg.items.join(' · ')}</span>
                </div>
              ))}
            </div>
          )}
          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: 10 }}>Langues</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ fontSize: 10, color: '#4b5563', marginBottom: 3 }}>{l.language} — <span style={{ color: '#9ca3af' }}>{l.level}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
