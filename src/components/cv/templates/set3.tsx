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

/* =========================== ÉCLAT — Élégant dégradé =========================== */
export function EclatTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <header
        className="relative flex flex-col items-center px-12 pb-12 pt-14 text-center text-white"
        style={{ background: `radial-gradient(120% 120% at 50% 0%, ${accent} 0%, #0b1220 90%)` }}
      >
        <ProfilePhoto
          src={p.photo}
          name={p.fullName}
          size={120}
          accent="rgba(255,255,255,0.2)"
          className="ring-4 ring-white/30"
        />
        <h1 className="mt-4 text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {p.fullName || 'Votre Nom'}
        </h1>
        <p className="mt-1 text-sm font-medium uppercase tracking-[0.3em] text-white/85">{p.title}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11.5px] text-white/80">
          <ContactItem type="email" value={p.email} />
          <ContactItem type="phone" value={p.phone} />
          <ContactItem type="address" value={p.address} />
          <ContactItem type="linkedin" value={p.linkedin} />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-12 py-8">
        <main className="col-span-2 space-y-6">
          {p.summary && (
            <ESection title={L.profile} accent={accent}>
              <p className="italic text-slate-600">{p.summary}</p>
            </ESection>
          )}
          {data.experiences.length > 0 && (
            <ESection title={L.experience} accent={accent}>
              <div className="space-y-5">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                        {e.title}
                      </h3>
                      <span className="shrink-0 text-xs font-medium text-slate-400">{dateRange(e, locale)}</span>
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: accent }}>
                      {e.company}
                      {e.location ? ` · ${e.location}` : ''}
                    </p>
                    <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                  </div>
                ))}
              </div>
            </ESection>
          )}
          {data.education.length > 0 && (
            <ESection title={L.education} accent={accent}>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                      <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{ed.year}</span>
                  </div>
                ))}
              </div>
            </ESection>
          )}
        </main>

        <aside className="space-y-6">
          {data.skills.length > 0 && (
            <ESection title={L.skills} accent={accent}>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="mb-1 text-[12px] font-medium text-slate-700">{s.name}</p>
                    <SkillBar percent={levelToPercent(s.level)} accent={accent} />
                  </div>
                ))}
              </div>
            </ESection>
          )}
          {data.languages.length > 0 && (
            <ESection title={L.languages} accent={accent}>
              <ul className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-slate-700">
                    <span>{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </li>
                ))}
              </ul>
            </ESection>
          )}
          {data.certifications.length > 0 && (
            <ESection title={L.certifications} accent={accent}>
              <ul className="space-y-2 text-[12px]">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-slate-500">{c.issuer} · {c.year}</p>
                  </li>
                ))}
              </ul>
            </ESection>
          )}
          {data.interests.length > 0 && (
            <ESection title={L.interests} accent={accent}>
              <p className="text-[12px] text-slate-600">{data.interests.join(' · ')}</p>
            </ESection>
          )}
        </aside>
      </div>
    </div>
  );
}

function ESection({
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
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
        <span className="mt-1 block h-px w-10" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}

/* =========================== CLASSIQUE — ATS-friendly =========================== */
export function ClassicTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-14 py-12 font-sans text-[13px] leading-relaxed text-slate-800">
      <header className="mb-5 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900">
          {p.fullName || 'Votre Nom'}
        </h1>
        <p className="mt-1 text-base font-semibold text-slate-700">{p.title}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[12px] text-slate-600">
          {[p.email, p.phone, p.address, p.linkedin, p.website].filter(Boolean).join('  |  ')}
        </div>
      </header>

      <div className="space-y-5">
        {p.summary && (
          <CSection title={L.profile} accent={accent}>
            <p>{p.summary}</p>
          </CSection>
        )}
        {data.experiences.length > 0 && (
          <CSection title={L.experience} accent={accent}>
            <div className="space-y-3.5">
              {data.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-slate-900">
                      {e.title} — {e.company}
                    </h3>
                    <span className="text-[12px] font-medium text-slate-600">{dateRange(e, locale)}</span>
                  </div>
                  {e.location && <p className="text-[12px] italic text-slate-500">{e.location}</p>}
                  <Bullets text={e.description} className="mt-1 text-[12.5px]" markerColor="#475569" />
                </div>
              ))}
            </div>
          </CSection>
        )}
        {data.education.length > 0 && (
          <CSection title={L.education} accent={accent}>
            <div className="space-y-2">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between">
                  <span>
                    <strong className="text-slate-900">{ed.degree}</strong> — {ed.school}
                  </span>
                  <span className="text-[12px] text-slate-600">{ed.year}</span>
                </div>
              ))}
            </div>
          </CSection>
        )}
        {data.skills.length > 0 && (
          <CSection title={L.skills} accent={accent}>
            <p className="text-[12.5px]">{data.skills.map((s) => s.name).join(' · ')}</p>
          </CSection>
        )}
        <div className="grid grid-cols-2 gap-8">
          {data.languages.length > 0 && (
            <CSection title={L.languages} accent={accent}>
              <p className="text-[12.5px]">
                {data.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
              </p>
            </CSection>
          )}
          {data.certifications.length > 0 && (
            <CSection title={L.certifications} accent={accent}>
              <ul className="list-inside list-disc text-[12.5px]">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    {c.name} ({c.year})
                  </li>
                ))}
              </ul>
            </CSection>
          )}
        </div>
      </div>
    </div>
  );
}

function CSection({
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
        className="mb-1.5 border-b-2 pb-0.5 text-[12px] font-bold uppercase tracking-[0.12em] text-slate-900"
        style={{ borderColor: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* =========================== TECH — Moderne produit =========================== */
export function TechTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const mono = '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace';
  return (
    <div className="flex min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <aside className="w-[250px] shrink-0 space-y-6 border-r border-slate-100 bg-slate-50 px-7 py-9">
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-slate-900">
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="mt-1 text-[13px] font-semibold" style={{ color: accent }}>
            {p.title}
          </p>
        </div>
        <section>
          <TechHead title={L.contact} accent={accent} mono={mono} />
          <div className="space-y-2 text-[11.5px] text-slate-600">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </section>
        {data.skills.length > 0 && (
          <section>
            <TechHead title={L.skills} accent={accent} mono={mono} />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="rounded border px-1.5 py-0.5 text-[11px]"
                  style={{ borderColor: `${accent}40`, color: accent, fontFamily: mono }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <TechHead title={L.languages} accent={accent} mono={mono} />
            <ul className="space-y-1.5 text-[12px]">
              {data.languages.map((l) => (
                <li key={l.id} className="flex items-center justify-between">
                  <span className="text-slate-700">{l.name}</span>
                  <LevelDots count={3} accent={accent} total={3} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {data.certifications.length > 0 && (
          <section>
            <TechHead title={L.certifications} accent={accent} mono={mono} />
            <ul className="space-y-2 text-[11.5px]">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  <p className="font-medium text-slate-800">{c.name}</p>
                  <p className="text-slate-500">{c.year}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <main className="flex-1 space-y-7 px-9 py-9">
        {p.summary && (
          <section>
            <TechHead title={L.profile} accent={accent} mono={mono} large />
            <p>{p.summary}</p>
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <TechHead title={L.experience} accent={accent} mono={mono} large />
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-bold text-slate-900">{e.title}</h3>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400" style={{ fontFamily: mono }}>
                      {dateRange(e, locale)}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: accent }}>
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
            <TechHead title={L.education} accent={accent} mono={mono} large />
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400" style={{ fontFamily: mono }}>
                    {ed.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function TechHead({
  title,
  accent,
  mono,
  large,
}: {
  title: string;
  accent: string;
  mono: string;
  large?: boolean;
}) {
  return (
    <h2
      className={`mb-2.5 font-semibold lowercase ${large ? 'text-[13px]' : 'text-[11px]'} text-slate-900`}
      style={{ fontFamily: mono }}
    >
      <span style={{ color: accent }}>{'// '}</span>
      {title}
    </h2>
  );
}

/* =========================== NAIROBI — Élégant deux colonnes =========================== */
export function NairobiTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="flex min-h-[1123px] w-[794px] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <aside
        className="flex w-[260px] shrink-0 flex-col gap-7 px-8 py-10 text-white"
        style={{ background: `linear-gradient(180deg, ${accent}, #1c1917)` }}
      >
        <div className="flex flex-col items-center text-center">
          <ProfilePhoto
            src={p.photo}
            name={p.fullName}
            size={128}
            accent="rgba(255,255,255,0.2)"
            className="ring-4 ring-white/25"
          />
          <h1 className="mt-4 text-2xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {p.fullName || 'Votre Nom'}
          </h1>
          <p className="mt-1 text-[12.5px] uppercase tracking-[0.2em] text-white/80">{p.title}</p>
        </div>
        <NSection title={L.contact}>
          <div className="space-y-2 text-[11.5px] text-white/85">
            <ContactItem type="email" value={p.email} />
            <ContactItem type="phone" value={p.phone} />
            <ContactItem type="address" value={p.address} />
            <ContactItem type="linkedin" value={p.linkedin} />
            <ContactItem type="website" value={p.website} />
          </div>
        </NSection>
        {data.skills.length > 0 && (
          <NSection title={L.skills}>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-[12px] text-white/90">{s.name}</span>
                  <LevelDots count={levelToDots(s.level)} accent="#ffffff" empty="rgba(255,255,255,0.25)" />
                </div>
              ))}
            </div>
          </NSection>
        )}
        {data.languages.length > 0 && (
          <NSection title={L.languages}>
            <ul className="space-y-1.5 text-[12px]">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between text-white/85">
                  <span>{l.name}</span>
                  <span className="text-white/60">{l.level}</span>
                </li>
              ))}
            </ul>
          </NSection>
        )}
        {data.interests.length > 0 && (
          <NSection title={L.interests}>
            <p className="text-[12px] text-white/80">{data.interests.join(' · ')}</p>
          </NSection>
        )}
      </aside>

      <main className="flex-1 space-y-7 px-9 py-10">
        {p.summary && (
          <NMain title={L.profile} accent={accent}>
            <p className="italic text-slate-600">{p.summary}</p>
          </NMain>
        )}
        {data.experiences.length > 0 && (
          <NMain title={L.experience} accent={accent}>
            <div className="space-y-5">
              {data.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                      {e.title}
                    </h3>
                    <span className="shrink-0 text-xs font-medium text-slate-400">{dateRange(e, locale)}</span>
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: accent }}>
                    {e.company}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
                  <Bullets text={e.description} className="mt-1.5 text-[12.5px]" markerColor={accent} />
                </div>
              ))}
            </div>
          </NMain>
        )}
        {data.education.length > 0 && (
          <NMain title={L.education} accent={accent}>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{ed.degree}</h3>
                    <p className="text-[12.5px] text-slate-600">{ed.school}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{ed.year}</span>
                </div>
              ))}
            </div>
          </NMain>
        )}
        {data.certifications.length > 0 && (
          <NMain title={L.certifications} accent={accent}>
            <ul className="space-y-1.5 text-[12.5px]">
              {data.certifications.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-500">{c.year}</span>
                </li>
              ))}
            </ul>
          </NMain>
        )}
      </main>
    </div>
  );
}

function NSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 border-b border-white/15 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
        {title}
      </h2>
      {children}
    </section>
  );
}

function NMain({
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
        className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-slate-900"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
        <span className="mt-1 block h-px w-12" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}
