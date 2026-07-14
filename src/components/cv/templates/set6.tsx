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

/* =========================== LOMÉ SIGNATURE — éditorial luxe =========================== */
export function LomeTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="min-h-[1123px] w-[794px] bg-[#fbfaf6] px-10 py-7 font-sans text-[12.5px] leading-relaxed text-stone-700">
      <header className="relative overflow-hidden rounded-[30px] bg-stone-950 px-9 py-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30" style={{ background: accent }} />
        <div className="absolute bottom-0 right-0 h-24 w-64 opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
        <div className="relative flex items-center gap-7">
          <ProfilePhoto src={p.photo} name={p.fullName} size={118} rounded="rounded-[26px]" accent={accent} className="ring-4 ring-white/15" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: `${accent}ff` }}>Signature professionnelle</p>
            <h1 className="mt-2 text-[43px] font-bold leading-none tracking-tight" style={{ fontFamily: serif }}>{p.fullName || 'Votre Nom'}</h1>
            <p className="mt-3 text-lg font-semibold text-white/85">{p.title}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-white/70">
              <ContactItem type="email" value={p.email} />
              <ContactItem type="phone" value={p.phone} />
              <ContactItem type="address" value={p.address} />
              <ContactItem type="linkedin" value={p.linkedin} />
              <ContactItem type="website" value={p.website} />
            </div>
          </div>
        </div>
      </header>
      <div className="mt-6 grid grid-cols-[1.55fr_0.85fr] gap-7">
        <main className="space-y-5">
          {p.summary && <LmBlock title={L.profile} accent={accent}><p className="text-[14px] text-stone-700">{p.summary}</p></LmBlock>}
          {data.experiences.length > 0 && <LmBlock title={L.experience} accent={accent}><div className="space-y-3">{data.experiences.map((e) => <div key={e.id} className="rounded-2xl bg-white p-3.5 shadow-[0_14px_34px_rgba(15,23,42,0.07)]"><div className="flex items-baseline justify-between gap-3"><h3 className="text-[15.5px] font-extrabold text-stone-950">{e.title}</h3><span className="shrink-0 text-xs font-bold" style={{ color: accent }}>{dateRange(e, locale)}</span></div><p className="text-[13px] font-bold text-stone-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12.5px]" markerColor={accent} /></div>)}</div></LmBlock>}
          {data.education.length > 0 && <LmBlock title={L.education} accent={accent}><div className="space-y-3">{data.education.map((ed) => <div key={ed.id} className="flex justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"><div><h3 className="font-bold text-stone-900">{ed.degree}</h3><p className="text-[12.5px] text-stone-500">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div><span className="text-xs font-bold" style={{ color: accent }}>{ed.year}</span></div>)}</div></LmBlock>}
        </main>
        <aside className="space-y-5 rounded-[26px] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          {data.skills.length > 0 && <LmBlock title={L.skills} accent={accent} compact><div className="space-y-3">{data.skills.map((s) => <div key={s.id}><div className="mb-1 flex justify-between text-[12px] font-bold"><span>{s.name}</span><span className="text-stone-400">{s.level}</span></div><SkillBar percent={levelToPercent(s.level)} accent={accent} track="rgba(0,0,0,0.07)" /></div>)}</div></LmBlock>}
          {data.languages.length > 0 && <LmBlock title={L.languages} accent={accent} compact><ul className="space-y-1.5 text-[12.5px]">{data.languages.map((l) => <li key={l.id} className="flex justify-between"><span className="font-semibold text-stone-800">{l.name}</span><span className="text-stone-500">{l.level}</span></li>)}</ul></LmBlock>}
          {data.certifications.length > 0 && <LmBlock title={L.certifications} accent={accent} compact><ul className="space-y-2 text-[12px]">{data.certifications.map((c) => <li key={c.id}><p className="font-bold text-stone-800">{c.name}</p><p className="text-stone-500">{c.issuer} · {c.year}</p></li>)}</ul></LmBlock>}
          {data.interests.length > 0 && <LmBlock title={L.interests} accent={accent} compact><p className="text-[12px] text-stone-600">{data.interests.join(' · ')}</p></LmBlock>}
        </aside>
      </div>
    </div>
  );
}

function LmBlock({ title, accent, compact, children }: { title: string; accent: string; compact?: boolean; children: React.ReactNode }) {
  return <section><h2 className={`${compact ? 'mb-2' : 'mb-3'} flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-stone-950`}><span className="h-2 w-7 rounded-full" style={{ background: accent }} />{title}</h2>{children}</section>;
}

/* =========================== KPALIMÉ STUDIO — graphique haut niveau =========================== */
export function KpalimeTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-white font-sans text-[12px] leading-[1.45] text-slate-700">
      <header className="grid grid-cols-[230px_1fr]">
        <div className="px-8 py-7 text-white" style={{ background: `linear-gradient(150deg, ${accent}, #0f172a)` }}>
          <ProfilePhoto src={p.photo} name={p.fullName} size={132} rounded="rounded-full" accent="rgba(255,255,255,0.18)" className="ring-8 ring-white/10" />
          <div className="mt-5 space-y-1.5 text-[11px] text-white/82"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} /></div>
        </div>
        <div className="relative overflow-hidden bg-slate-50 px-9 py-7">
          <div className="absolute right-8 top-8 h-24 w-24 rounded-[28px] opacity-10" style={{ background: accent }} />
          <p className="text-[11px] font-black uppercase tracking-[0.32em]" style={{ color: accent }}>Portfolio carrière</p>
          <h1 className="mt-3 max-w-[420px] font-display text-[46px] font-black leading-[0.95] tracking-[-0.04em] text-slate-950">{p.fullName || 'Votre Nom'}</h1>
          <p className="mt-4 text-xl font-bold text-slate-600">{p.title}</p>
          {p.summary && <p className="mt-4 max-w-[440px] rounded-2xl bg-white p-3.5 text-[12.5px] text-slate-600 shadow-sm">{p.summary}</p>}
        </div>
      </header>
      <div className="grid grid-cols-[230px_1fr]">
        <aside className="space-y-4 bg-slate-950 px-8 py-6 text-white">
          {data.skills.length > 0 && <KpSide title={L.skills}>{data.skills.map((s) => <div key={s.id} className="mb-2.5"><p className="mb-1 text-[12px] font-semibold">{s.name}</p><SkillBar percent={levelToPercent(s.level)} accent="#fff" track="rgba(255,255,255,0.16)" /></div>)}</KpSide>}
          {data.languages.length > 0 && <KpSide title={L.languages}><ul className="space-y-1.5 text-[12px]">{data.languages.map((l) => <li key={l.id} className="flex justify-between text-white/85"><span>{l.name}</span><span className="text-white/50">{l.level}</span></li>)}</ul></KpSide>}
          {data.interests.length > 0 && <KpSide title={L.interests}><p className="text-[12px] text-white/70">{data.interests.join(' · ')}</p></KpSide>}
        </aside>
        <main className="space-y-4 px-9 py-6">
          {data.experiences.length > 0 && <KpMain title={L.experience} accent={accent}>{data.experiences.map((e) => <div key={e.id} className="mb-3 grid grid-cols-[92px_1fr] gap-3"><div className="text-[10px] font-black uppercase" style={{ color: accent }}>{dateRange(e, locale)}</div><div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"><h3 className="text-[15px] font-black text-slate-950">{e.title}</h3><p className="font-bold text-slate-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12.5px]" markerColor={accent} /></div></div>)}</KpMain>}
          {data.education.length > 0 && <KpMain title={L.education} accent={accent}>{data.education.map((ed) => <div key={ed.id} className="mb-3 flex justify-between rounded-xl bg-slate-50 px-4 py-3"><div><h3 className="font-bold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-500">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div><span className="text-xs font-bold text-slate-400">{ed.year}</span></div>)}</KpMain>}
          {data.certifications.length > 0 && <KpMain title={L.certifications} accent={accent}><div className="grid grid-cols-2 gap-3">{data.certifications.map((c) => <div key={c.id} className="rounded-xl border border-slate-100 p-3"><p className="font-bold text-slate-800">{c.name}</p><p className="text-[12px] text-slate-500">{c.issuer} · {c.year}</p></div>)}</div></KpMain>}
        </main>
      </div>
    </div>
  );
}
function KpSide({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">{title}</h2>{children}</section>; }
function KpMain({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) { return <section><h2 className="mb-4 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-slate-950"><span className="h-6 w-1.5 rounded-full" style={{ background: accent }} />{title}</h2>{children}</section>; }

/* =========================== MARITIME EXECUTIVE — cabinet international =========================== */
export function MaritimeTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="min-h-[1123px] w-[794px] bg-[#f7f8fb] p-8 font-sans text-[13px] leading-relaxed text-slate-700">
      <div className="min-h-[1059px] rounded-[28px] bg-white p-9 shadow-[0_22px_70px_rgba(15,23,42,0.10)]">
        <header className="border-b border-slate-200 pb-7">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.34em]" style={{ color: accent }}>Executive profile</p>
              <h1 className="mt-3 text-[44px] font-bold leading-none tracking-tight text-slate-950" style={{ fontFamily: serif }}>{p.fullName || 'Votre Nom'}</h1>
              <p className="mt-3 text-lg font-semibold text-slate-600">{p.title}</p>
            </div>
            <div className="min-w-[210px] rounded-2xl p-4 text-[11.5px] text-white" style={{ background: accent }}><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} /></div>
          </div>
          {p.summary && <p className="mt-6 max-w-[620px] text-[14px] text-slate-600">{p.summary}</p>}
        </header>
        <div className="mt-7 grid grid-cols-[1.7fr_0.8fr] gap-9">
          <main className="space-y-7">
            {data.experiences.length > 0 && <MtSection title={L.experience} accent={accent} serif={serif}>{data.experiences.map((e) => <div key={e.id} className="mb-5"><div className="flex items-baseline justify-between gap-3"><h3 className="text-[16px] font-bold text-slate-950" style={{ fontFamily: serif }}>{e.title}</h3><span className="text-xs font-semibold text-slate-500">{dateRange(e, locale)}</span></div><p className="font-bold" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12.5px]" markerColor={accent} /></div>)}</MtSection>}
            {data.education.length > 0 && <MtSection title={L.education} accent={accent} serif={serif}>{data.education.map((ed) => <div key={ed.id} className="mb-3 flex justify-between gap-3"><div><h3 className="font-bold text-slate-900">{ed.degree}</h3><p className="text-[12.5px] text-slate-500">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div><span className="text-xs text-slate-400">{ed.year}</span></div>)}</MtSection>}
          </main>
          <aside className="space-y-6 border-l border-slate-200 pl-7">
            {data.skills.length > 0 && <MtSection title={L.skills} accent={accent} serif={serif}>{data.skills.map((s) => <div key={s.id} className="mb-2 flex items-center justify-between"><span className="text-[12px] font-semibold text-slate-700">{s.name}</span><LevelDots count={levelToDots(s.level)} accent={accent} /></div>)}</MtSection>}
            {data.languages.length > 0 && <MtSection title={L.languages} accent={accent} serif={serif}><ul className="space-y-1.5 text-[12.5px]">{data.languages.map((l) => <li key={l.id} className="flex justify-between"><span>{l.name}</span><span className="text-slate-500">{l.level}</span></li>)}</ul></MtSection>}
            {data.certifications.length > 0 && <MtSection title={L.certifications} accent={accent} serif={serif}><ul className="space-y-2 text-[12px]">{data.certifications.map((c) => <li key={c.id}><p className="font-bold text-slate-800">{c.name}</p><p className="text-slate-500">{c.issuer} · {c.year}</p></li>)}</ul></MtSection>}
          </aside>
        </div>
      </div>
    </div>
  );
}
function MtSection({ title, accent, serif, children }: { title: string; accent: string; serif: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-[12px] font-black uppercase tracking-[0.18em] text-slate-950" style={{ fontFamily: serif }}><span style={{ color: accent }}>—</span> {title}</h2>{children}</section>; }
