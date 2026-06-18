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

/* =========================== CAPE TOWN — Moderne sidebar dégradée =========================== */
export function CapetownTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="flex min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <aside
        className="flex w-[260px] shrink-0 flex-col gap-6 px-7 py-9 text-white"
        style={{ background: `linear-gradient(170deg, ${accent}, ${accent}cc 55%, ${accent}99)` }}
      >
        <div className="flex flex-col items-center text-center">
          <ProfilePhoto src={p.photo} name={p.fullName} size={120} rounded="rounded-2xl" accent="rgba(255,255,255,0.22)" className="ring-4 ring-white/30" />
          <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight">{p.fullName || 'Votre Nom'}</h1>
          <p className="mt-1 text-[12.5px] font-medium text-white/85">{p.title}</p>
        </div>
        <CtSide title={L.contact}>
          <div className="space-y-2 text-[11.5px] text-white/90">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </CtSide>
        {data.skills.length > 0 && (
          <CtSide title={L.skills}>
            <div className="space-y-2.5">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="mb-1 text-[12px] text-white/90">{s.name}</p>
                  <SkillBar percent={levelToPercent(s.level)} accent="#ffffff" track="rgba(255,255,255,0.25)" />
                </div>
              ))}
            </div>
          </CtSide>
        )}
        {data.languages.length > 0 && (
          <CtSide title={L.languages}>
            <ul className="space-y-1.5 text-[12px]">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between text-white/90"><span>{l.name}</span><span className="text-white/60">{l.level}</span></li>
              ))}
            </ul>
          </CtSide>
        )}
        {data.interests.length > 0 && (
          <CtSide title={L.interests}><p className="text-[12px] text-white/80">{data.interests.join(' · ')}</p></CtSide>
        )}
      </aside>

      <main className="flex-1 space-y-7 px-9 py-9">
        {p.summary && <CtMain title={L.profile} accent={accent}><p>{p.summary}</p></CtMain>}
        {data.experiences.length > 0 && (
          <CtMain title={L.experience} accent={accent}>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <div key={e.id} className="rounded-xl border border-ink-100 p-3.5 shadow-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                    <span className="shrink-0 text-xs font-semibold" style={{ color: accent }}>{dateRange(e, locale)}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                  <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                </div>
              ))}
            </div>
          </CtMain>
        )}
        {data.education.length > 0 && (
          <CtMain title={L.education} accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between gap-3">
                  <div><h3 className="font-semibold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-600">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div>
                  <span className="shrink-0 text-xs font-semibold" style={{ color: accent }}>{ed.year}</span>
                </div>
              ))}
            </div>
          </CtMain>
        )}
        {data.certifications.length > 0 && (
          <CtMain title={L.certifications} accent={accent}>
            <ul className="space-y-1.5 text-[12.5px]">
              {data.certifications.map((c) => (
                <li key={c.id} className="flex justify-between"><span className="font-medium text-slate-800">{c.name}</span><span className="text-slate-500">{c.year}</span></li>
              ))}
            </ul>
          </CtMain>
        )}
      </main>
    </div>
  );
}

function CtSide({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 border-b border-white/20 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
      {children}
    </section>
  );
}
function CtMain({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 inline-flex items-center gap-2 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
        <span className="grid h-6 w-6 place-items-center rounded-lg text-white" style={{ background: accent }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== MONTRÉAL — Professionnel équilibré =========================== */
export function MontrealTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-12 py-11 font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="flex flex-wrap items-end justify-between gap-3 pb-4">
        <div>
          <h1 className="font-display text-[40px] font-extrabold leading-none tracking-tight text-slate-900">{p.fullName || 'Votre Nom'}</h1>
          <p className="mt-2 text-lg font-semibold" style={{ color: accent }}>{p.title}</p>
        </div>
        <div className="space-y-1 text-right text-[11.5px] text-slate-500">
          <ContactItem type="email" value={p.email} className="justify-end" />
          <ContactItem type="phone" value={p.phone} className="justify-end" />
          <ContactItem type="address" value={p.address} className="justify-end" />
          <ContactItem type="linkedin" value={p.linkedin} className="justify-end" />
        </div>
      </header>
      <div className="h-1 w-full rounded-full" style={{ background: accent }} />

      {p.summary && <p className="mt-6 text-[13.5px] text-slate-700">{p.summary}</p>}

      <div className="mt-6 grid grid-cols-3 gap-9">
        <div className="col-span-2 space-y-6">
          {data.experiences.length > 0 && (
            <MtlSection title={L.experience} accent={accent}>
              <div className="space-y-4">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                      <span className="shrink-0 text-xs font-medium text-slate-500">{dateRange(e, locale)}</span>
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </MtlSection>
          )}
          {data.education.length > 0 && (
            <MtlSection title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div><h3 className="font-semibold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-600">{ed.school}</p></div>
                    <span className="shrink-0 text-xs text-slate-500">{ed.year}</span>
                  </div>
                ))}
              </div>
            </MtlSection>
          )}
        </div>
        <aside className="space-y-6">
          {data.skills.length > 0 && (
            <MtlSection title={L.skills} accent={accent}>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-700">{s.name}</span>
                    <LevelDots count={levelToDots(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </MtlSection>
          )}
          {data.languages.length > 0 && (
            <MtlSection title={L.languages} accent={accent}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700"><span>{l.name}</span><span className="text-slate-500">{l.level}</span></li>
                ))}
              </ul>
            </MtlSection>
          )}
          {data.certifications.length > 0 && (
            <MtlSection title={L.certifications} accent={accent}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}><p className="font-medium text-slate-800">{c.name}</p><p className="text-slate-500">{c.year}</p></li>
                ))}
              </ul>
            </MtlSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function MtlSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-[12px] font-extrabold uppercase tracking-[0.16em]" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  );
}

/* =========================== SAVANE — Élégant chaleureux =========================== */
export function SavaneTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="flex items-center gap-6 px-12 py-9" style={{ background: `${accent}12` }}>
        <ProfilePhoto src={p.photo} name={p.fullName} size={104} accent={accent} className="ring-4 ring-white" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900" style={{ fontFamily: serif }}>{p.fullName || 'Votre Nom'}</h1>
          <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>{p.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-slate-500">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-12 py-9">
        <main className="col-span-2 space-y-6">
          {p.summary && <SvSection title={L.profile} accent={accent} serif={serif}><p className="italic text-slate-600">{p.summary}</p></SvSection>}
          {data.experiences.length > 0 && (
            <SvSection title={L.experience} accent={accent} serif={serif}>
              <div className="space-y-4">
                {data.experiences.map((e) => (
                  <div key={e.id} className="border-l-2 pl-4" style={{ borderColor: `${accent}33` }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: serif }}>{e.title}</h3>
                      <span className="shrink-0 text-xs font-medium text-slate-500">{dateRange(e, locale)}</span>
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </SvSection>
          )}
          {data.education.length > 0 && (
            <SvSection title={L.education} accent={accent} serif={serif}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div><h3 className="font-semibold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-600">{ed.school}</p></div>
                    <span className="shrink-0 text-xs text-slate-500">{ed.year}</span>
                  </div>
                ))}
              </div>
            </SvSection>
          )}
        </main>
        <aside className="space-y-6 rounded-2xl p-5" style={{ background: `${accent}0c` }}>
          {data.skills.length > 0 && (
            <SvSection title={L.skills} accent={accent} serif={serif}>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="mb-1 text-[12px] font-medium text-slate-700">{s.name}</p>
                    <SkillBar percent={levelToPercent(s.level)} accent={accent} track="rgba(0,0,0,0.06)" />
                  </div>
                ))}
              </div>
            </SvSection>
          )}
          {data.languages.length > 0 && (
            <SvSection title={L.languages} accent={accent} serif={serif}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700"><span>{l.name}</span><span className="text-slate-500">{l.level}</span></li>
                ))}
              </ul>
            </SvSection>
          )}
          {data.certifications.length > 0 && (
            <SvSection title={L.certifications} accent={accent} serif={serif}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}><p className="font-medium text-slate-800">{c.name}</p><p className="text-slate-500">{c.year}</p></li>
                ))}
              </ul>
            </SvSection>
          )}
          {data.interests.length > 0 && (
            <SvSection title={L.interests} accent={accent} serif={serif}>
              <p className="text-[12px] text-slate-600">{data.interests.join(' · ')}</p>
            </SvSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function SvSection({ title, accent, serif, children }: { title: string; accent: string; serif: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-900" style={{ fontFamily: serif }}>
        <span style={{ color: accent }}>◆</span> {title}
      </h2>
      {children}
    </section>
  );
}
