import {
  Bullets,
  ContactItem,
  dateRange,
  levelToPercent,
  levelToDots,
  LevelDots,
  ProfilePhoto,
  SkillBar,
  sectionLabels,
  type TemplateProps,
} from '../cvParts';
import { initials } from '../../../lib/utils';

/* =========================== ZURICH — Suisse / typographique =========================== */
export function ZurichTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[150px_1fr] gap-6 border-t border-ink-900/10 py-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-14 py-14 font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="pb-6">
        <h1 className="font-display text-[56px] font-extrabold leading-[0.95] tracking-tight text-slate-900">
          {p.fullName || 'Votre Nom'}
        </h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-semibold" style={{ color: accent }}>{p.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-slate-500">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
          </div>
        </div>
      </header>

      {p.summary && <Row label={L.profile}><p>{p.summary}</p></Row>}

      {data.experiences.length > 0 && (
        <Row label={L.experience}>
          <div className="space-y-4">
            {data.experiences.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                  <span className="shrink-0 text-xs font-medium text-slate-500">{dateRange(e, locale)}</span>
                </div>
                <p className="text-[13px] font-semibold text-slate-500">
                  {e.company}{e.location ? ` · ${e.location}` : ''}
                </p>
                <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
              </div>
            ))}
          </div>
        </Row>
      )}

      {data.education.length > 0 && (
        <Row label={L.education}>
          <div className="space-y-2.5">
            {data.education.map((ed) => (
              <div key={ed.id} className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                  <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{ed.year}</span>
              </div>
            ))}
          </div>
        </Row>
      )}

      {data.skills.length > 0 && (
        <Row label={L.skills}>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-slate-700">
            {data.skills.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5" style={{ background: accent }} />
                {s.name}
              </span>
            ))}
          </div>
        </Row>
      )}

      {(data.languages.length > 0 || data.certifications.length > 0) && (
        <Row label={data.languages.length ? L.languages : L.certifications}>
          <div className="grid grid-cols-2 gap-6">
            {data.languages.length > 0 && (
              <ul className="space-y-1 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700">
                    <span>{l.name}</span>
                    <span className="text-slate-400">{l.level}</span>
                  </li>
                ))}
              </ul>
            )}
            {data.certifications.length > 0 && (
              <ul className="space-y-1 text-[12.5px] text-slate-700">
                {data.certifications.map((c) => (
                  <li key={c.id}>{c.name} <span className="text-slate-400">· {c.year}</span></li>
                ))}
              </ul>
            )}
          </div>
        </Row>
      )}
    </div>
  );
}

/* =========================== ACCRA — Créatif bi-ton =========================== */
export function AccraTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="flex">
        <div className="flex w-[42%] flex-col items-center justify-center gap-3 px-8 py-9 text-center text-white" style={{ background: accent }}>
          <ProfilePhoto src={p.photo} name={p.fullName} size={110} accent="rgba(255,255,255,0.2)" className="ring-4 ring-white/30" />
          <h1 className="font-display text-3xl font-extrabold leading-tight">{p.fullName || 'Votre Nom'}</h1>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 bg-slate-900 px-8 py-9 text-white">
          <p className="font-display text-2xl font-bold" style={{ color: 'white' }}>{p.title}</p>
          <div className="space-y-1.5 text-[12px] text-slate-300">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-12 py-9">
        <main className="col-span-2 space-y-6">
          {p.summary && <AccraSection title={L.profile} accent={accent}><p>{p.summary}</p></AccraSection>}
          {data.experiences.length > 0 && (
            <AccraSection title={L.experience} accent={accent}>
              <div className="space-y-5">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                      <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>{dateRange(e, locale)}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-slate-600">{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </AccraSection>
          )}
          {data.education.length > 0 && (
            <AccraSection title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div><h3 className="font-semibold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-600">{ed.school}</p></div>
                    <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>{ed.year}</span>
                  </div>
                ))}
              </div>
            </AccraSection>
          )}
        </main>
        <aside className="space-y-6">
          {data.skills.length > 0 && (
            <AccraSection title={L.skills} accent={accent}>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-700">{s.name}</span>
                    <LevelDots count={levelToDots(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </AccraSection>
          )}
          {data.languages.length > 0 && (
            <AccraSection title={L.languages} accent={accent}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between"><span className="font-medium text-slate-700">{l.name}</span><span className="text-slate-500">{l.level}</span></li>
                ))}
              </ul>
            </AccraSection>
          )}
          {data.certifications.length > 0 && (
            <AccraSection title={L.certifications} accent={accent}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}><p className="font-medium text-slate-800">{c.name}</p><p className="text-slate-500">{c.year}</p></li>
                ))}
              </ul>
            </AccraSection>
          )}
          {data.interests.length > 0 && (
            <AccraSection title={L.interests} accent={accent}>
              <p className="text-[12px] text-slate-600">{data.interests.join(' · ')}</p>
            </AccraSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function AccraSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 inline-flex items-center gap-2 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
        <span className="h-2.5 w-2.5" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== CASABLANCA — Élégant monogramme =========================== */
export function CasablancaTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-14 py-12 text-[13px] leading-relaxed text-slate-700">
      <header className="flex flex-col items-center text-center">
        {p.photo ? (
          <ProfilePhoto src={p.photo} name={p.fullName} size={96} accent={accent} className="ring-2" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full border-2 text-2xl font-bold" style={{ borderColor: accent, color: accent, fontFamily: serif }}>
            {initials(p.fullName) || '··'}
          </div>
        )}
        <h1 className="mt-4 text-4xl font-bold tracking-wide text-slate-900" style={{ fontFamily: serif }}>
          {p.fullName || 'Votre Nom'}
        </h1>
        <div className="my-2 flex items-center gap-3">
          <span className="h-px w-10" style={{ background: accent }} />
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>{p.title}</p>
          <span className="h-px w-10" style={{ background: accent }} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11.5px] text-slate-500">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
        </div>
      </header>

      {p.summary && <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] italic text-slate-600">{p.summary}</p>}

      <div className="mt-8 grid grid-cols-3 gap-9">
        <main className="col-span-2 space-y-6">
          {data.experiences.length > 0 && (
            <CasaSection title={L.experience} accent={accent} serif={serif}>
              <div className="space-y-4">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: serif }}>{e.title}</h3>
                      <span className="shrink-0 text-xs text-slate-400">{dateRange(e, locale)}</span>
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: accent }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </CasaSection>
          )}
          {data.education.length > 0 && (
            <CasaSection title={L.education} accent={accent} serif={serif}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div><h3 className="font-semibold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-600">{ed.school}</p></div>
                    <span className="shrink-0 text-xs text-slate-400">{ed.year}</span>
                  </div>
                ))}
              </div>
            </CasaSection>
          )}
        </main>
        <aside className="space-y-6">
          {data.skills.length > 0 && (
            <CasaSection title={L.skills} accent={accent} serif={serif}>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="mb-1 text-[12px] font-medium text-slate-700">{s.name}</p>
                    <SkillBar percent={levelToPercent(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </CasaSection>
          )}
          {data.languages.length > 0 && (
            <CasaSection title={L.languages} accent={accent} serif={serif}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700"><span>{l.name}</span><span className="text-slate-500">{l.level}</span></li>
                ))}
              </ul>
            </CasaSection>
          )}
          {data.certifications.length > 0 && (
            <CasaSection title={L.certifications} accent={accent} serif={serif}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}><p className="font-medium text-slate-800">{c.name}</p><p className="text-slate-500">{c.issuer} · {c.year}</p></li>
                ))}
              </ul>
            </CasaSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function CasaSection({ title, accent, serif, children }: { title: string; accent: string; serif: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900" style={{ fontFamily: serif }}>
        {title}
        <span className="mt-1 block h-px w-full" style={{ background: `${accent}40` }} />
      </h2>
      {children}
    </section>
  );
}
