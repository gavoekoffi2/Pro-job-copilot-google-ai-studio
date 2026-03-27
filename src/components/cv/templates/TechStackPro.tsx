import { CVData } from '@/types/cv';
import { fullName, dateRange, PAGE_W, PAGE_H } from './shared';

const TEAL = '#0891b2';
const TEAL_DARK = '#164e63';

export function TechStackPro({ cv }: { cv: CVData }) {
  const name = fullName(cv);
  return (
    <div style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: "'Courier New', 'Lucida Console', monospace", background: '#0f172a', color: '#e2e8f0', fontSize: 10 }}>
      {/* Terminal header */}
      <div style={{ background: '#1e293b', padding: '18px 36px', borderBottom: `1px solid #334155` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ marginLeft: 10, fontSize: 9, color: '#475569' }}>resume.json</span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>{'{ '}</span>
          <span style={{ color: TEAL }}>"name"</span>
          <span style={{ color: '#e2e8f0' }}>: </span>
          <span style={{ color: '#a3e635' }}>"{name}"</span>
          <span style={{ color: '#64748b' }}>,</span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>{'  '}</span>
          <span style={{ color: TEAL }}>"role"</span>
          <span style={{ color: '#e2e8f0' }}>: </span>
          <span style={{ color: '#f472b6' }}>"{cv.title || 'Developer'}"</span>
          <span style={{ color: '#64748b' }}>,</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
          {[cv.email, cv.phone, cv.location, cv.github || cv.linkedin].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: 9, color: '#64748b' }}>// {v}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '20px 28px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.summary && (
            <div>
              <div style={{ color: TEAL, fontSize: 9, marginBottom: 6 }}>/** <span style={{ color: '#94a3b8' }}>About</span> */</div>
              <p style={{ margin: 0, fontSize: 10, lineHeight: 1.7, color: '#cbd5e1' }}>{cv.summary}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <div style={{ color: TEAL, fontSize: 10, fontWeight: 700, marginBottom: 10 }}>{'>'} <span style={{ color: '#e2e8f0' }}>experience</span><span style={{ color: '#64748b' }}>.forEach(job {'=> {'})</span></div>
              {cv.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 14, borderLeft: `2px solid #334155` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#a3e635' }}>{exp.position}</div>
                    <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>[{dateRange(exp.startDate, exp.endDate, exp.current)}]</div>
                  </div>
                  <div style={{ fontSize: 10, color: TEAL, marginBottom: 4 }}>@{exp.company}{exp.location && ` // ${exp.location}`}</div>
                  {exp.description && <p style={{ margin: '0 0 4px', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <span style={{ color: '#64748b', flexShrink: 0 }}>//</span>
                      <span style={{ fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <div style={{ color: TEAL, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>{'>'} <span style={{ color: '#e2e8f0' }}>education</span></div>
              {cv.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 8, paddingLeft: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>{edu.degree}{edu.field && ` — ${edu.field}`}</div>
                  <div style={{ fontSize: 9.5, color: TEAL }}>{edu.institution}</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ width: 210, background: '#1e293b', borderLeft: `1px solid #334155`, padding: '20px 14px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
          {cv.skills.length > 0 && cv.skills.map(sg => (
            <div key={sg.id}>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 6 }}>// {sg.category}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {sg.items.map(s => (
                  <span key={s} style={{ fontSize: 8.5, padding: '2px 8px', background: `${TEAL}20`, border: `1px solid ${TEAL}40`, borderRadius: 3, color: TEAL, fontFamily: 'monospace' }}>{s}</span>
                ))}
              </div>
            </div>
          ))}

          {cv.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 6 }}>// languages</div>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ fontSize: 9.5, color: '#94a3b8', marginBottom: 4 }}>
                  <span style={{ color: '#e2e8f0' }}>{l.language}</span>: <span style={{ color: '#a3e635' }}>'{l.level}'</span>
                </div>
              ))}
            </div>
          )}

          {cv.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 6 }}>// certifications</div>
              {cv.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 6, padding: '5px 8px', background: '#0f172a', borderRadius: 3, border: `1px solid #334155` }}>
                  <div style={{ fontSize: 9, color: '#a3e635' }}>{c.name}</div>
                  <div style={{ fontSize: 8.5, color: '#475569' }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
