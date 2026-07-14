import {
  Bullets,
  ContactItem,
  dateRange,
  levelToDots,
  levelToPercent,
  LevelDots,
  ProfilePhoto,
  sectionLabels,
  SkillBar,
  type TemplateProps,
} from '../cvParts';

/* =========================== ATLAS — luxe éditorial international =========================== */
export function AtlasTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="relative min-h-[1123px] w-[794px] overflow-hidden bg-[#f7f4ed] font-sans text-[13px] leading-relaxed text-[#34312d]">
      <div className="absolute inset-y-0 left-0 w-3" style={{ background: accent }} />
      <div className="absolute right-[-76px] top-[-92px] h-64 w-64 rounded-full border-[34px] opacity-[0.07]" style={{ borderColor: accent }} />
      <header className="relative px-14 pb-8 pt-12">
        <div className="flex items-end justify-between gap-8 border-b border-stone-300 pb-8">
          <div className="max-w-[525px]">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.38em]" style={{ color: accent }}>Professional dossier · 01</p>
            <h1 className="text-[52px] font-bold leading-[0.9] tracking-[-0.035em] text-stone-950" style={{ fontFamily: serif }}>{p.fullName || 'Votre Nom'}</h1>
            <p className="mt-4 text-[17px] font-semibold tracking-wide text-stone-600">{p.title}</p>
          </div>
          <ProfilePhoto src={p.photo} name={p.fullName} size={108} rounded="rounded-[8px]" accent={accent} className="shadow-[10px_10px_0_rgba(0,0,0,0.06)] grayscale-[15%]" />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-medium text-stone-500">
          <ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} /><ContactItem type="website" value={p.website} />
        </div>
      </header>
      <div className="grid grid-cols-[1.7fr_0.82fr] gap-9 px-14 pb-12">
        <main className="space-y-7">
          {p.summary && <AtlasSection number="02" title={L.profile} accent={accent}><p className="border-l-2 pl-4 text-[13.5px] text-stone-600" style={{ borderColor: accent }}>{p.summary}</p></AtlasSection>}
          {data.experiences.length > 0 && <AtlasSection number="03" title={L.experience} accent={accent}><div className="space-y-5">{data.experiences.map((e) => <article key={e.id} className="grid grid-cols-[92px_1fr] gap-4"><div className="pt-0.5 text-[10.5px] font-black uppercase tracking-wide" style={{ color: accent }}>{dateRange(e, locale)}</div><div className="relative border-l border-stone-300 pl-5 before:absolute before:-left-[4px] before:top-1.5 before:h-[7px] before:w-[7px] before:rounded-full" style={{ '--tw-shadow-color': accent } as React.CSSProperties}><span className="absolute -left-[4px] top-1.5 h-[7px] w-[7px] rounded-full" style={{ background: accent }} /><h3 className="text-[15px] font-bold text-stone-950" style={{ fontFamily: serif }}>{e.title}</h3><p className="text-[12.5px] font-bold text-stone-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12px] text-stone-600" markerColor={accent} /></div></article>)}</div></AtlasSection>}
          {data.education.length > 0 && <AtlasSection number="04" title={L.education} accent={accent}><div className="grid grid-cols-2 gap-3">{data.education.map((ed) => <div key={ed.id} className="border-t border-stone-300 pt-3"><p className="text-[12px] font-black" style={{ color: accent }}>{ed.year}</p><h3 className="mt-0.5 font-bold text-stone-900">{ed.degree}</h3><p className="text-[11.5px] text-stone-500">{ed.school}</p></div>)}</div></AtlasSection>}
        </main>
        <aside className="space-y-6 border-l border-stone-300 pl-7">
          {data.skills.length > 0 && <AtlasSide title={L.skills} accent={accent}><div className="space-y-3">{data.skills.map((s) => <div key={s.id}><div className="mb-1.5 flex justify-between text-[11.5px] font-bold"><span>{s.name}</span><span className="text-[10px] font-medium text-stone-400">{s.level}</span></div><SkillBar percent={levelToPercent(s.level)} accent={accent} /></div>)}</div></AtlasSide>}
          {data.languages.length > 0 && <AtlasSide title={L.languages} accent={accent}><div className="space-y-2">{data.languages.map((l) => <div key={l.id} className="flex items-center justify-between border-b border-stone-200 pb-1.5"><span className="font-bold text-stone-800">{l.name}</span><span className="text-[11px] text-stone-500">{l.level}</span></div>)}</div></AtlasSide>}
          {data.certifications.length > 0 && <AtlasSide title={L.certifications} accent={accent}><div className="space-y-2.5">{data.certifications.map((c) => <div key={c.id}><p className="text-[11.5px] font-bold text-stone-800">{c.name}</p><p className="text-[10.5px] text-stone-500">{c.issuer}{c.year ? ` · ${c.year}` : ''}</p></div>)}</div></AtlasSide>}
          {data.interests.length > 0 && <AtlasSide title={L.interests} accent={accent}><p className="text-[11.5px] text-stone-600">{data.interests.join(' / ')}</p></AtlasSide>}
        </aside>
      </div>
    </div>
  );
}
function AtlasSection({ number, title, accent, children }: { number: string; title: string; accent: string; children: React.ReactNode }) { return <section><div className="mb-3 flex items-center gap-3"><span className="text-[9px] font-black" style={{ color: accent }}>{number}</span><h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-stone-950">{title}</h2><span className="h-px flex-1 bg-stone-300" /></div>{children}</section>; }
function AtlasSide({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: accent }}>{title}</h2>{children}</section>; }

/* =========================== VOLTA — studio créatif contemporain =========================== */
export function VoltaTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="grid min-h-[1123px] w-[794px] grid-cols-[248px_1fr] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      <aside className="relative overflow-hidden bg-[#101826] px-7 py-9 text-white">
        <div className="absolute -left-16 top-0 h-48 w-48 rounded-full opacity-25 blur-[1px]" style={{ background: accent }} />
        <div className="absolute bottom-[-70px] right-[-90px] h-64 w-64 rounded-full border-[42px] border-white/[0.035]" />
        <div className="relative">
          <div className="relative inline-block"><ProfilePhoto src={p.photo} name={p.fullName} size={134} rounded="rounded-[34px]" accent={accent} className="ring-4 ring-white/10 shadow-2xl" /><span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-2xl border-4 border-[#101826] text-sm font-black text-white" style={{ background: accent }}>V</span></div>
          <p className="mt-7 text-[9px] font-black uppercase tracking-[0.34em] text-white/40">Contact studio</p>
          <div className="mt-3 space-y-2 text-[11px] text-white/75"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} /><ContactItem type="website" value={p.website} /></div>
          {data.skills.length > 0 && <VoltaSide title={L.skills}><div className="space-y-3">{data.skills.map((s) => <div key={s.id}><div className="mb-1 flex justify-between text-[11.5px]"><span className="font-semibold">{s.name}</span><span className="text-white/35">{s.level}</span></div><SkillBar percent={levelToPercent(s.level)} accent={accent} track="rgba(255,255,255,0.10)" /></div>)}</div></VoltaSide>}
          {data.languages.length > 0 && <VoltaSide title={L.languages}><div className="space-y-1.5">{data.languages.map((l) => <div key={l.id} className="flex justify-between text-[11.5px]"><span>{l.name}</span><span className="text-white/40">{l.level}</span></div>)}</div></VoltaSide>}
          {data.interests.length > 0 && <VoltaSide title={L.interests}><div className="flex flex-wrap gap-1.5">{data.interests.map((it) => <span key={it} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-white/65">{it}</span>)}</div></VoltaSide>}
        </div>
      </aside>
      <main className="relative px-9 py-9">
        <div className="absolute right-0 top-0 h-28 w-28" style={{ background: `linear-gradient(135deg, transparent 50%, ${accent}16 50%)` }} />
        <header className="relative border-b-2 border-slate-900 pb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: accent }}>Creative leadership</p>
          <h1 className="mt-3 max-w-[440px] font-display text-[48px] font-black leading-[0.88] tracking-[-0.05em] text-slate-950">{p.fullName || 'Votre Nom'}</h1>
          <p className="mt-4 text-[18px] font-bold text-slate-500">{p.title}</p>
        </header>
        {p.summary && <section className="my-6 rounded-[22px] border border-slate-100 bg-slate-50 p-5"><p className="text-[13px] font-medium leading-6 text-slate-600">{p.summary}</p></section>}
        {data.experiences.length > 0 && <VoltaMain title={L.experience} accent={accent}><div className="space-y-4">{data.experiences.map((e, index) => <article key={e.id} className="relative rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.055)]"><span className="absolute -left-2 top-4 grid h-7 w-7 place-items-center rounded-lg text-[10px] font-black text-white" style={{ background: accent }}>{String(index + 1).padStart(2, '0')}</span><div className="ml-3 flex items-start justify-between gap-3"><div><h3 className="text-[15px] font-black text-slate-950">{e.title}</h3><p className="font-bold text-slate-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p></div><span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: `${accent}14`, color: accent }}>{dateRange(e, locale)}</span></div><Bullets text={e.description} className="ml-3 mt-2 text-[12px]" markerColor={accent} /></article>)}</div></VoltaMain>}
        {data.education.length > 0 && <VoltaMain title={L.education} accent={accent}><div className="grid grid-cols-2 gap-3">{data.education.map((ed) => <article key={ed.id} className="rounded-2xl bg-slate-50 p-3.5"><p className="text-[10px] font-black" style={{ color: accent }}>{ed.year}</p><h3 className="mt-1 text-[12px] font-black text-slate-900">{ed.degree}</h3><p className="text-[11px] text-slate-500">{ed.school}</p></article>)}</div></VoltaMain>}
        {data.certifications.length > 0 && <VoltaMain title={L.certifications} accent={accent}><div className="flex flex-wrap gap-2">{data.certifications.map((c) => <span key={c.id} className="rounded-full border border-slate-200 px-3 py-1 text-[10.5px] font-bold text-slate-600">{c.name} · {c.year}</span>)}</div></VoltaMain>}
      </main>
    </div>
  );
}
function VoltaSide({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-7 border-t border-white/10 pt-5"><h2 className="mb-3 text-[9.5px] font-black uppercase tracking-[0.28em] text-white/40">{title}</h2>{children}</section>; }
function VoltaMain({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) { return <section className="mt-6"><h2 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950"><span className="h-3 w-3 rounded-[4px]" style={{ background: accent }} />{title}</h2>{children}</section>; }

/* =========================== AURORA — direction premium moderne =========================== */
export function AuroraTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  return (
    <div className="min-h-[1123px] w-[794px] bg-[#f3f6fb] font-sans text-[13px] leading-relaxed text-slate-700">
      <header className="relative overflow-hidden bg-[#0b1324] px-10 py-8 text-white">
        <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: accent }} />
        <div className="absolute bottom-0 left-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        <div className="relative flex items-center gap-7">
          <ProfilePhoto src={p.photo} name={p.fullName} size={116} rounded="rounded-[28px]" accent={accent} className="border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)]" />
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.36em] text-white/40"><span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />Executive edition</div><h1 className="mt-3 font-display text-[44px] font-black leading-none tracking-[-0.035em]">{p.fullName || 'Votre Nom'}</h1><p className="mt-3 text-[17px] font-semibold text-white/65">{p.title}</p><div className="mt-4 flex flex-wrap gap-2 text-[10.5px] text-white/65"><ContactItem type="email" value={p.email} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1" /><ContactItem type="phone" value={p.phone} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1" /><ContactItem type="address" value={p.address} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1" /><ContactItem type="linkedin" value={p.linkedin} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1" /></div></div>
        </div>
      </header>
      <div className="grid grid-cols-[1.58fr_0.82fr] gap-5 p-6">
        <main className="space-y-4">
          {p.summary && <AuroraPanel title={L.profile} accent={accent}><p className="text-[13px] leading-[1.75] text-slate-600">{p.summary}</p></AuroraPanel>}
          {data.experiences.length > 0 && <AuroraPanel title={L.experience} accent={accent}><div className="space-y-5">{data.experiences.map((e) => <article key={e.id} className="relative pl-5"><span className="absolute left-0 top-1 h-full w-px bg-slate-200" /><span className="absolute -left-[3px] top-1 h-[7px] w-[7px] rounded-full ring-4 ring-white" style={{ background: accent }} /><div className="flex items-baseline justify-between gap-3"><h3 className="text-[14.5px] font-black text-slate-950">{e.title}</h3><span className="shrink-0 text-[10.5px] font-bold" style={{ color: accent }}>{dateRange(e, locale)}</span></div><p className="font-bold text-slate-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12px]" markerColor={accent} /></article>)}</div></AuroraPanel>}
          {data.education.length > 0 && <AuroraPanel title={L.education} accent={accent}><div className="grid grid-cols-2 gap-3">{data.education.map((ed) => <div key={ed.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="text-[10px] font-black" style={{ color: accent }}>{ed.year}</div><h3 className="mt-1 text-[12px] font-bold text-slate-900">{ed.degree}</h3><p className="text-[11px] text-slate-500">{ed.school}</p></div>)}</div></AuroraPanel>}
        </main>
        <aside className="space-y-4">
          {data.skills.length > 0 && <AuroraPanel title={L.skills} accent={accent}><div className="space-y-3">{data.skills.map((s) => <div key={s.id}><div className="mb-1.5 flex justify-between text-[11.5px] font-bold"><span>{s.name}</span><span className="text-[10px] text-slate-400">{s.level}</span></div><SkillBar percent={levelToPercent(s.level)} accent={accent} /></div>)}</div></AuroraPanel>}
          {data.languages.length > 0 && <AuroraPanel title={L.languages} accent={accent}><div className="space-y-2">{data.languages.map((l) => <div key={l.id} className="flex justify-between rounded-lg bg-slate-50 px-2.5 py-2 text-[11.5px]"><span className="font-bold">{l.name}</span><span className="text-slate-500">{l.level}</span></div>)}</div></AuroraPanel>}
          {data.certifications.length > 0 && <AuroraPanel title={L.certifications} accent={accent}><div className="space-y-2.5">{data.certifications.map((c) => <div key={c.id} className="border-b border-slate-100 pb-2"><p className="text-[11.5px] font-bold text-slate-800">{c.name}</p><p className="text-[10.5px] text-slate-400">{c.issuer} · {c.year}</p></div>)}</div></AuroraPanel>}
          {data.interests.length > 0 && <AuroraPanel title={L.interests} accent={accent}><p className="text-[11px] text-slate-500">{data.interests.join(' · ')}</p></AuroraPanel>}
        </aside>
      </div>
    </div>
  );
}
function AuroraPanel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) { return <section className="rounded-[20px] border border-white bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.055)]"><h2 className="mb-3 flex items-center justify-between text-[10.5px] font-black uppercase tracking-[0.22em] text-slate-950"><span>{title}</span><span className="h-[5px] w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} /></h2>{children}</section>; }

/* =========================== HÉRITAGE — cabinet exécutif intemporel =========================== */
export function HeritageTemplate({ data, accent, locale }: TemplateProps) {
  const L = sectionLabels(locale);
  const { personalInfo: p } = data;
  const serif = 'Georgia, "Times New Roman", serif';
  return (
    <div className="min-h-[1123px] w-[794px] bg-[#fffdf8] px-12 py-9 text-[13px] leading-relaxed text-[#393834]">
      <header className="relative border-y border-stone-300 py-6 text-center">
        <span className="absolute left-1/2 top-[-8px] h-4 w-16 -translate-x-1/2 bg-[#fffdf8] px-3"><span className="block h-full w-full" style={{ background: accent }} /></span>
        <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-stone-400">Curriculum vitae · Executive collection</p>
        <h1 className="mt-4 text-[45px] font-normal uppercase leading-none tracking-[0.09em] text-stone-950" style={{ fontFamily: serif }}>{p.fullName || 'Votre Nom'}</h1>
        <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.26em]" style={{ color: accent }}>{p.title}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10.5px] text-stone-500"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} /><ContactItem type="website" value={p.website} /></div>
      </header>
      {p.summary && <div className="mx-auto my-5 max-w-[625px] text-center"><p className="text-[13.5px] italic leading-6 text-stone-600" style={{ fontFamily: serif }}>“{p.summary}”</p></div>}
      <div className="grid grid-cols-[1.65fr_0.78fr] gap-9 border-t border-stone-200 pt-6">
        <main className="space-y-5">
          {data.experiences.length > 0 && <HeritageSection title={L.experience} accent={accent} serif={serif}><div className="space-y-5">{data.experiences.map((e) => <article key={e.id}><div className="flex items-baseline justify-between gap-3"><h3 className="text-[16px] font-bold text-stone-950" style={{ fontFamily: serif }}>{e.title}</h3><span className="text-[10.5px] font-bold uppercase tracking-wide text-stone-400">{dateRange(e, locale)}</span></div><p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-2 text-[12px] text-stone-600" markerColor={accent} /></article>)}</div></HeritageSection>}
          {data.education.length > 0 && <HeritageSection title={L.education} accent={accent} serif={serif}><div className="space-y-3">{data.education.map((ed) => <div key={ed.id} className="grid grid-cols-[1fr_56px] gap-3 border-b border-stone-200 pb-2"><div><h3 className="font-bold text-stone-900">{ed.degree}</h3><p className="text-[11.5px] text-stone-500">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div><span className="text-right text-[11px] font-bold" style={{ color: accent }}>{ed.year}</span></div>)}</div></HeritageSection>}
        </main>
        <aside className="space-y-5 border-l border-stone-300 pl-7">
          {data.skills.length > 0 && <HeritageSection title={L.skills} accent={accent} serif={serif}><div className="space-y-2.5">{data.skills.map((s) => <div key={s.id}><div className="mb-1 flex justify-between text-[11.5px] font-bold"><span>{s.name}</span><span className="text-[9.5px] font-normal text-stone-400">{s.level}</span></div><LevelDots count={levelToDots(s.level)} accent={accent} empty="rgba(120,113,108,0.13)" /></div>)}</div></HeritageSection>}
          {data.languages.length > 0 && <HeritageSection title={L.languages} accent={accent} serif={serif}><div className="space-y-1.5">{data.languages.map((l) => <div key={l.id} className="flex justify-between text-[11.5px]"><span className="font-bold">{l.name}</span><span className="italic text-stone-500" style={{ fontFamily: serif }}>{l.level}</span></div>)}</div></HeritageSection>}
          {data.certifications.length > 0 && <HeritageSection title={L.certifications} accent={accent} serif={serif}><div className="space-y-2">{data.certifications.map((c) => <div key={c.id}><p className="text-[11.5px] font-bold text-stone-800">{c.name}</p><p className="text-[10px] text-stone-500">{c.issuer} · {c.year}</p></div>)}</div></HeritageSection>}
          {data.interests.length > 0 && <HeritageSection title={L.interests} accent={accent} serif={serif}><p className="text-[11px] italic text-stone-500" style={{ fontFamily: serif }}>{data.interests.join(' • ')}</p></HeritageSection>}
        </aside>
      </div>
    </div>
  );
}
function HeritageSection({ title, accent, serif, children }: { title: string; accent: string; serif: string; children: React.ReactNode }) { return <section><h2 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-950" style={{ fontFamily: serif }}><span className="h-px w-5" style={{ background: accent }} />{title}</h2>{children}</section>; }
