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

/* =========================== SAHEL — Moderne =========================== */
export function SahelTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="flex min-h-[1123px] w-[794px] flex-col bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header
        className="flex items-center gap-6 px-12 py-10 text-white"
        style={{ background: `linear-gradient(120deg, ${accent}, ${accent}cc)` }}
      >
        <ProfilePhoto
          src={p.photo}
          name={p.fullName}
          size={104}
          accent="rgba(255,255,255,0.25)"
          className="ring-4 ring-white/30"
        />
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="mt-1 text-lg font-medium text-white/90">{p.title}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/85">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-3 gap-8 px-12 py-9">
        <main className="col-span-2 space-y-7">
          {p.summary && (
            <Section title={L.profile} accent={accent}>
              <p>{p.summary}</p>
            </Section>
          )}
          {data.experiences.length > 0 && (
            <Section title={L.experience} accent={accent}>
              <div className="space-y-5">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[15px] font-bold text-slate-900">
                        {e.title}
                      </h3>
                      <span className="shrink-0 text-xs font-medium" style={{ color: accent }}>
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
            </Section>
          )}
          {data.education.length > 0 && (
            <Section title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                      <span className="shrink-0 text-xs font-medium" style={{ color: accent }}>
                        {ed.year}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate-600">
                      {ed.school}
                      {ed.location ? ` · ${ed.location}` : ''}
                    </p>
                    {ed.description && (
                      <p className="text-[12px] text-slate-500">{ed.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>

        <aside className="space-y-7">
          {data.skills.length > 0 && (
            <Section title={L.skills} accent={accent}>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="mb-1 flex justify-between text-[12px] font-medium text-slate-700">
                      <span>{s.name}</span>
                    </div>
                    <SkillBar percent={levelToPercent(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </Section>
          )}
          {data.languages.length > 0 && (
            <Section title={L.languages} accent={accent}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-700">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {data.certifications.length > 0 && (
            <Section title={L.certifications} accent={accent}>
              <ul className="space-y-2 text-[12.5px]">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-slate-500">
                      {c.issuer}
                      {c.year ? ` · ${c.year}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {data.interests.length > 0 && (
            <Section title={L.interests} accent={accent}>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.map((it, i) => (
                  <span
                    key={i}
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                    style={{ background: `${accent}1a`, color: accent }}
                  >
                    {it}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({
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
        className="mb-2.5 font-display text-[11px] font-extrabold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== DAKAR — Sidebar sombre =========================== */
export function DakarTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="flex min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      {/* Sidebar */}
      <aside className="flex w-[270px] shrink-0 flex-col gap-7 bg-slate-900 px-7 py-9 text-slate-300">
        <div className="flex flex-col items-center text-center">
          <ProfilePhoto
            src={p.photo}
            name={p.fullName}
            size={120}
            accent={accent}
            className="ring-4"
          />
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-white">
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="mt-1 text-[12.5px] font-medium" style={{ color: accent }}>
            {p.title}
          </p>
        </div>

        <SideSection title={L.contact} accent={accent}>
          <div className="space-y-2 text-[11.5px]">
            <ContactItem type="email" value={p.email} className="text-slate-300" />
            <ContactItem type="phone" value={p.phone} className="text-slate-300" />
            <ContactItem type="address" value={p.address} className="text-slate-300" />
            <ContactItem type="linkedin" value={p.linkedin} className="text-slate-300" />
            <ContactItem type="website" value={p.website} className="text-slate-300" />
          </div>
        </SideSection>

        {data.skills.length > 0 && (
          <SideSection title={L.skills} accent={accent}>
            <div className="space-y-2.5">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="mb-1 text-[12px] text-slate-200">{s.name}</p>
                  <SkillBar
                    percent={levelToPercent(s.level)}
                    accent={accent}
                    track="rgba(255,255,255,0.12)"
                  />
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {data.languages.length > 0 && (
          <SideSection title={L.languages} accent={accent}>
            <ul className="space-y-1.5 text-[12px]">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span className="text-slate-200">{l.name}</span>
                  <span className="text-slate-400">{l.level}</span>
                </li>
              ))}
            </ul>
          </SideSection>
        )}

        {data.interests.length > 0 && (
          <SideSection title={L.interests} accent={accent}>
            <p className="text-[12px] text-slate-300">{data.interests.join(' · ')}</p>
          </SideSection>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 space-y-7 px-9 py-9">
        {p.summary && (
          <MainSection title={L.profile} accent={accent}>
            <p>{p.summary}</p>
          </MainSection>
        )}
        {data.experiences.length > 0 && (
          <MainSection title={L.experience} accent={accent}>
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-bold text-slate-900">
                      {e.title}
                    </h3>
                    <span className="shrink-0 text-xs font-semibold" style={{ color: accent }}>
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
          </MainSection>
        )}
        {data.education.length > 0 && (
          <MainSection title={L.education} accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-600">
                      {ed.school}
                      {ed.location ? ` · ${ed.location}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold" style={{ color: accent }}>
                    {ed.year}
                  </span>
                </div>
              ))}
            </div>
          </MainSection>
        )}
        {data.certifications.length > 0 && (
          <MainSection title={L.certifications} accent={accent}>
            <ul className="space-y-1.5 text-[12.5px]">
              {data.certifications.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-500">{c.year}</span>
                </li>
              ))}
            </ul>
          </MainSection>
        )}
      </main>
    </div>
  );
}

function SideSection({
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
      <h2 className="mb-2.5 border-b border-white/10 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </h2>
      <div style={{ '--a': accent } as React.CSSProperties}>{children}</div>
    </section>
  );
}

function MainSection({
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
      <h2 className="mb-2.5 flex items-center gap-2 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-900">
        <span className="inline-block h-3 w-1 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== EXECUTIVE — Corporate sérif =========================== */
export function ExecutiveTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-14 py-12 text-[13px] leading-relaxed text-slate-700">
      <header className="border-b-2 pb-5 text-center" style={{ borderColor: accent }}>
        <h1
          className="text-4xl font-bold uppercase tracking-[0.12em] text-slate-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {p.fullName || 'Votre Nom'}
        </h1>
        <p
          className="mt-2 text-sm font-semibold uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          {p.title}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11.5px] text-slate-600">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
        </div>
      </header>

      <div className="mt-7 space-y-6">
        {p.summary && (
          <ExecSection title={L.profile} accent={accent}>
            <p className="italic text-slate-600">{p.summary}</p>
          </ExecSection>
        )}
        {data.experiences.length > 0 && (
          <ExecSection title={L.experience} accent={accent}>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                      {e.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">{dateRange(e, locale)}</span>
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: accent }}>
                    {e.company}
                    {e.location ? `, ${e.location}` : ''}
                  </p>
                  <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                </div>
              ))}
            </div>
          </ExecSection>
        )}
        <div className="grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <ExecSection title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                    <p className="text-[11.5px] text-slate-500">{ed.year}</p>
                  </div>
                ))}
              </div>
            </ExecSection>
          )}
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <ExecSection title={L.skills} accent={accent}>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <span
                      key={s.id}
                      className="border px-2 py-0.5 text-[11.5px] text-slate-700"
                      style={{ borderColor: `${accent}55` }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </ExecSection>
            )}
            {data.languages.length > 0 && (
              <ExecSection title={L.languages} accent={accent}>
                <ul className="space-y-1 text-[12.5px]">
                  {data.languages.map((l) => (
                    <li key={l.id} className="flex justify-between">
                      <span>{l.name}</span>
                      <span className="text-slate-500">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </ExecSection>
            )}
          </div>
        </div>
        {data.certifications.length > 0 && (
          <ExecSection title={L.certifications} accent={accent}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-[12.5px]">
              {data.certifications.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-500">{c.year}</span>
                </li>
              ))}
            </ul>
          </ExecSection>
        )}
      </div>
    </div>
  );
}

function ExecSection({
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
        className="mb-2 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-900"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <span style={{ color: accent }}>—</span> {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== LAGOS — Créatif audacieux =========================== */
export function LagosTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="relative overflow-hidden px-12 pb-10 pt-12 text-white" style={{ background: accent }}>
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div className="relative flex items-center gap-6">
          <ProfilePhoto
            src={p.photo}
            name={p.fullName}
            size={108}
            rounded="rounded-2xl"
            accent="rgba(255,255,255,0.25)"
            className="ring-4 ring-white/25"
          />
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight">
              {p.fullName || 'Votre Nom'}
            </h1>
            <p className="mt-2 text-xl font-medium text-white/90">{p.title}</p>
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/90">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
          <ContactItem type="website" value={p.website} />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-12 py-9">
        <main className="col-span-2 space-y-6">
          {p.summary && (
            <LagosSection title={L.profile} accent={accent}>
              <p>{p.summary}</p>
            </LagosSection>
          )}
          {data.experiences.length > 0 && (
            <LagosSection title={L.experience} accent={accent}>
              <div className="space-y-5">
                {data.experiences.map((e) => (
                  <div key={e.id} className="relative pl-4">
                    <span
                      className="absolute left-0 top-1.5 h-[calc(100%-0.2rem)] w-[3px] rounded-full"
                      style={{ background: `${accent}40` }}
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
            </LagosSection>
          )}
          {data.education.length > 0 && (
            <LagosSection title={L.education} accent={accent}>
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
            </LagosSection>
          )}
        </main>

        <aside className="space-y-6 rounded-2xl bg-slate-50 p-5">
          {data.skills.length > 0 && (
            <LagosSection title={L.skills} accent={accent}>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-700">{s.name}</span>
                    <LevelDots count={levelToDots(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </LagosSection>
          )}
          {data.languages.length > 0 && (
            <LagosSection title={L.languages} accent={accent}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-700">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </li>
                ))}
              </ul>
            </LagosSection>
          )}
          {data.certifications.length > 0 && (
            <LagosSection title={L.certifications} accent={accent}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-slate-500">{c.issuer} · {c.year}</p>
                  </li>
                ))}
              </ul>
            </LagosSection>
          )}
          {data.interests.length > 0 && (
            <LagosSection title={L.interests} accent={accent}>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.map((it, i) => (
                  <span
                    key={i}
                    className="rounded-md px-2 py-1 text-[11px] font-medium text-white"
                    style={{ background: accent }}
                  >
                    {it}
                  </span>
                ))}
              </div>
            </LagosSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function LagosSection({
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
      <h2 className="mb-2.5 font-display text-[13px] font-extrabold text-slate-900">
        {title}
        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}
