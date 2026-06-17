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

/* =========================== MINIMAL — Minimaliste =========================== */
export function MinimalTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-16 py-16 font-sans text-[13px] leading-relaxed text-slate-600">
      <header className="mb-10">
        <h1 className="font-display text-[42px] font-light leading-none tracking-tight text-slate-900">
          {p.fullName || 'Votre Nom'}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px w-10" style={{ background: accent }} />
          <p className="text-sm font-medium uppercase tracking-[0.25em]" style={{ color: accent }}>
            {p.title}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-slate-500">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
          <ContactItem type="website" value={p.website} />
        </div>
      </header>

      {p.summary && <p className="mb-9 text-[13.5px] leading-relaxed text-slate-700">{p.summary}</p>}

      <div className="space-y-9">
        {data.experiences.length > 0 && (
          <MinSection title={L.experience}>
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id} className="grid grid-cols-[110px_1fr] gap-4">
                  <span className="pt-0.5 text-[11.5px] font-medium text-slate-400">
                    {dateRange(e, locale)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {e.title}{' '}
                      <span className="font-normal text-slate-400">· {e.company}</span>
                    </h3>
                    <Bullets text={e.description} className="mt-1 text-[12.5px]" markerColor={accent} />
                  </div>
                </div>
              ))}
            </div>
          </MinSection>
        )}
        {data.education.length > 0 && (
          <MinSection title={L.education}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="grid grid-cols-[110px_1fr] gap-4">
                  <span className="text-[11.5px] font-medium text-slate-400">{ed.year}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-500">{ed.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </MinSection>
        )}
        <div className="grid grid-cols-2 gap-10">
          {data.skills.length > 0 && (
            <MinSection title={L.skills}>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-slate-700">
                {data.skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </MinSection>
          )}
          {data.languages.length > 0 && (
            <MinSection title={L.languages}>
              <ul className="space-y-1 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700">
                    <span>{l.name}</span>
                    <span className="text-slate-400">{l.level}</span>
                  </li>
                ))}
              </ul>
            </MinSection>
          )}
        </div>
        {data.certifications.length > 0 && (
          <MinSection title={L.certifications}>
            <ul className="space-y-1 text-[12.5px] text-slate-700">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  {c.name} <span className="text-slate-400">· {c.issuer} · {c.year}</span>
                </li>
              ))}
            </ul>
          </MinSection>
        )}
      </div>
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== KIGALI — Sidebar droite =========================== */
export function KigaliTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="flex min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <main className="flex-1 space-y-7 px-10 py-10">
        <header>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>
            {p.title}
          </p>
        </header>
        {p.summary && (
          <KSection title={L.profile} accent={accent}>
            <p>{p.summary}</p>
          </KSection>
        )}
        {data.experiences.length > 0 && (
          <KSection title={L.experience} accent={accent}>
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id} className="relative border-l-2 pl-4" style={{ borderColor: `${accent}33` }}>
                  <span
                    className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full"
                    style={{ background: accent }}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">{dateRange(e, locale)}</span>
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: accent }}>
                    {e.company}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
                  <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                </div>
              ))}
            </div>
          </KSection>
        )}
        {data.education.length > 0 && (
          <KSection title={L.education} accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">{ed.year}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-600">
                    {ed.school}
                    {ed.location ? ` · ${ed.location}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </KSection>
        )}
      </main>

      <aside
        className="flex w-[250px] shrink-0 flex-col gap-6 px-7 py-10"
        style={{ background: `${accent}0f` }}
      >
        <div className="flex justify-center">
          <ProfilePhoto src={p.photo} name={p.fullName} size={132} accent={accent} className="ring-4 ring-white" />
        </div>
        <KSection title={L.contact} accent={accent}>
          <div className="space-y-2 text-[11.5px] text-slate-600">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </KSection>
        {data.skills.length > 0 && (
          <KSection title={L.skills} accent={accent}>
            <div className="space-y-2.5">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="mb-1 text-[12px] font-medium text-slate-700">{s.name}</p>
                  <SkillBar percent={levelToPercent(s.level)} accent={accent} track="rgba(0,0,0,0.06)" />
                </div>
              ))}
            </div>
          </KSection>
        )}
        {data.languages.length > 0 && (
          <KSection title={L.languages} accent={accent}>
            <ul className="space-y-1.5 text-[12px]">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between text-slate-700">
                  <span>{l.name}</span>
                  <span className="text-slate-500">{l.level}</span>
                </li>
              ))}
            </ul>
          </KSection>
        )}
        {data.certifications.length > 0 && (
          <KSection title={L.certifications} accent={accent}>
            <ul className="space-y-2 text-[11.5px]">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  <p className="font-medium text-slate-800">{c.name}</p>
                  <p className="text-slate-500">{c.year}</p>
                </li>
              ))}
            </ul>
          </KSection>
        )}
      </aside>
    </div>
  );
}

function KSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== ABIDJAN — Frise chronologique =========================== */
export function AbidjanTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-12 py-11 font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="mb-8 flex items-center gap-6 border-b border-slate-100 pb-6">
        <ProfilePhoto src={p.photo} name={p.fullName} size={96} rounded="rounded-2xl" accent={accent} />
        <div className="flex-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="text-lg font-semibold" style={{ color: accent }}>
            {p.title}
          </p>
        </div>
        <div className="space-y-1 text-right text-[11.5px] text-slate-500">
          <ContactItem type="email" value={p.email} className="justify-end" />
          <ContactItem type="phone" value={p.phone} className="justify-end" />
          <ContactItem type="address" value={p.address} className="justify-end" />
          <ContactItem type="linkedin" value={p.linkedin} className="justify-end" />
        </div>
      </header>

      {p.summary && <p className="mb-7 text-[13.5px] text-slate-700">{p.summary}</p>}

      <div className="grid grid-cols-3 gap-9">
        <div className="col-span-2">
          {data.experiences.length > 0 && (
            <section className="mb-7">
              <ASection title={L.experience} accent={accent} />
              <div className="relative space-y-6 pl-6">
                <span
                  className="absolute bottom-2 left-[7px] top-2 w-[2px]"
                  style={{ background: `${accent}26` }}
                />
                {data.experiences.map((e) => (
                  <div key={e.id} className="relative">
                    <span
                      className="absolute -left-[22px] top-1 h-3.5 w-3.5 rounded-full border-[3px] border-white"
                      style={{ background: accent, boxShadow: `0 0 0 2px ${accent}` }}
                    />
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                      <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>
                        {dateRange(e, locale)}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-slate-600">
                      {e.company}
                      {e.location ? ` · ${e.location}` : ''}
                    </p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.education.length > 0 && (
            <section>
              <ASection title={L.education} accent={accent} />
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                      <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>
                      {ed.year}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {data.skills.length > 0 && (
            <section>
              <ASection title={L.skills} accent={accent} />
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-700">{s.name}</span>
                    <LevelDots count={levelToDots(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section>
              <ASection title={L.languages} accent={accent} />
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700">
                    <span>{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {data.certifications.length > 0 && (
            <section>
              <ASection title={L.certifications} accent={accent} />
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-slate-500">{c.year}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {data.interests.length > 0 && (
            <section>
              <ASection title={L.interests} accent={accent} />
              <p className="text-[12px] text-slate-600">{data.interests.join(' · ')}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function ASection({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-3 inline-flex items-center gap-2 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
      <span className="h-4 w-1.5 rounded-full" style={{ background: accent }} />
      {title}
    </h2>
  );
}

/* =========================== HORIZON — Bandeau dégradé =========================== */
export function HorizonTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header
        className="px-12 py-11 text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, #0f172a)` }}
      >
        <h1 className="font-display text-5xl font-extrabold tracking-tight">
          {p.fullName || 'Votre Nom'}
        </h1>
        <p className="mt-2 text-xl font-light text-white/90">{p.title}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/80">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
          <ContactItem type="website" value={p.website} />
        </div>
      </header>

      <div className="px-12 py-9">
        {p.summary && (
          <p className="mb-7 border-l-4 pl-4 text-[13.5px] italic text-slate-600" style={{ borderColor: accent }}>
            {p.summary}
          </p>
        )}
        {data.experiences.length > 0 && (
          <HSection title={L.experience} accent={accent}>
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id} className="rounded-xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                      style={{ background: accent }}
                    >
                      {dateRange(e, locale)}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-500">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
                  <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                </div>
              ))}
            </div>
          </HSection>
        )}

        <div className="mt-7 grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <HSection title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                    <p className="text-[11.5px] text-slate-400">{ed.year}</p>
                  </div>
                ))}
              </div>
            </HSection>
          )}
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <HSection title={L.skills} accent={accent}>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-md px-2 py-1 text-[11.5px] font-medium"
                      style={{ background: `${accent}14`, color: accent }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </HSection>
            )}
            {data.languages.length > 0 && (
              <HSection title={L.languages} accent={accent}>
                <ul className="space-y-1 text-[12.5px]">
                  {data.languages.map((l) => (
                    <li key={l.id} className="flex justify-between text-slate-700">
                      <span>{l.name}</span>
                      <span className="text-slate-400">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </HSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
        {title}
        <span className="mt-1 block h-0.5 w-8 rounded-full" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}
