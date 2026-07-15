import type { ReactNode } from 'react';
import {
  Bullets,
  ContactItem,
  dateRange,
  levelToPercent,
  ProfilePhoto,
  sectionLabels,
  SkillBar,
  type TemplateProps,
} from '../cvParts';

const serif = 'Georgia, "Times New Roman", serif';

function ContactStack({ p, light = false }: { p: TemplateProps['data']['personalInfo']; light?: boolean }) {
  return <div className={`space-y-1.5 text-[10.5px] ${light ? 'text-white/75' : 'text-slate-600'}`}>
    <ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} />
    <ContactItem type="address" value={p.address} /><ContactItem type="linkedin" value={p.linkedin} />
    <ContactItem type="website" value={p.website} />
  </div>;
}

function Title({ children, accent, light = false, ribbon = false }: { children: ReactNode; accent: string; light?: boolean; ribbon?: boolean }) {
  if (ribbon) return <h2 className="mb-3 inline-flex min-w-[176px] items-center px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950" style={{ background: accent, clipPath: 'polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%, 6% 50%)' }}>{children}</h2>;
  return <h2 className={`mb-3 flex items-center gap-2 text-[10.5px] font-black uppercase tracking-[0.2em] ${light ? 'text-white' : 'text-slate-950'}`}><span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />{children}<span className={`h-px flex-1 ${light ? 'bg-white/20' : 'bg-slate-200'}`} /></h2>;
}

function ExperienceList({ data, locale, accent, cards = false }: { data: TemplateProps['data']; locale: TemplateProps['locale']; accent: string; cards?: boolean }) {
  return <div className="space-y-3">{data.experiences.map((e, i) => <article key={e.id} className={cards ? 'relative rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_10px_28px_rgba(15,23,42,.07)]' : 'relative pl-4'}>
    {!cards && <span className="absolute left-0 top-1 h-full w-px bg-slate-200" />}
    {!cards && <span className="absolute -left-[3px] top-1.5 h-[7px] w-[7px] rounded-full" style={{ background: accent }} />}
    {cards && <span className="absolute -left-2 top-3 grid h-7 w-7 place-items-center rounded-lg text-[9px] font-black text-white" style={{ background: accent }}>{String(i + 1).padStart(2, '0')}</span>}
    <div className={cards ? 'ml-2' : ''}><div className="flex items-baseline justify-between gap-3"><h3 className="text-[14px] font-black text-slate-950">{e.title}</h3><span className="shrink-0 text-[9.5px] font-black uppercase" style={{ color: accent }}>{dateRange(e, locale)}</span></div>
      <p className="text-[11.5px] font-bold text-slate-500">{e.company}{e.location ? ` · ${e.location}` : ''}</p><Bullets text={e.description} className="mt-1.5 text-[11.5px] leading-[1.55]" markerColor={accent} /></div>
  </article>)}</div>;
}

function EducationList({ data, accent, cards = false }: { data: TemplateProps['data']; accent: string; cards?: boolean }) {
  return <div className={cards ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'}>{data.education.map((ed) => <article key={ed.id} className={cards ? 'rounded-xl bg-slate-50 p-3' : 'grid grid-cols-[64px_1fr] gap-3 border-b border-slate-100 pb-2'}>
    <span className="text-[9.5px] font-black" style={{ color: accent }}>{ed.year}</span><div><h3 className="text-[12px] font-black text-slate-900">{ed.degree}</h3><p className="text-[10.5px] text-slate-500">{ed.school}{ed.location ? ` · ${ed.location}` : ''}</p></div>
  </article>)}</div>;
}

function SideContent({ data, accent, locale, light = false, dots = false }: { data: TemplateProps['data']; accent: string; locale: TemplateProps['locale']; light?: boolean; dots?: boolean }) {
  const L = sectionLabels(locale);
  const text = light ? 'text-white/80' : 'text-slate-700';
  return <div className={`space-y-5 ${text}`}>
    {data.skills.length > 0 && <section><h2 className={`mb-3 text-[9.5px] font-black uppercase tracking-[.22em] ${light ? 'text-white/45' : 'text-slate-950'}`}>{L.skills}</h2><div className="space-y-2.5">{data.skills.map((s) => <div key={s.id}><div className="mb-1 flex justify-between text-[10.5px] font-semibold"><span>{s.name}</span><span className={light ? 'text-white/35' : 'text-slate-400'}>{s.level}</span></div>{dots ? <div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n <= Math.ceil(levelToPercent(s.level) / 20) ? accent : (light ? 'rgba(255,255,255,.12)' : '#e2e8f0') }} />)}</div> : <SkillBar percent={levelToPercent(s.level)} accent={accent} track={light ? 'rgba(255,255,255,.12)' : '#e2e8f0'} />}</div>)}</div></section>}
    {data.languages.length > 0 && <section><h2 className={`mb-2.5 text-[9.5px] font-black uppercase tracking-[.22em] ${light ? 'text-white/45' : 'text-slate-950'}`}>{L.languages}</h2><div className="space-y-1.5">{data.languages.map(l => <div key={l.id} className="flex justify-between text-[10.5px]"><b>{l.name}</b><span className={light ? 'text-white/40' : 'text-slate-400'}>{l.level}</span></div>)}</div></section>}
    {data.certifications.length > 0 && <section><h2 className={`mb-2.5 text-[9.5px] font-black uppercase tracking-[.22em] ${light ? 'text-white/45' : 'text-slate-950'}`}>{L.certifications}</h2>{data.certifications.map(c => <div key={c.id} className="mb-2 text-[10.5px]"><b>{c.name}</b><p className={light ? 'text-white/40' : 'text-slate-400'}>{c.issuer} · {c.year}</p></div>)}</section>}
    {data.interests.length > 0 && <section><h2 className={`mb-2 text-[9.5px] font-black uppercase tracking-[.22em] ${light ? 'text-white/45' : 'text-slate-950'}`}>{L.interests}</h2><div className="flex flex-wrap gap-1.5">{data.interests.map(i => <span key={i} className={`rounded-full px-2 py-1 text-[9.5px] ${light ? 'bg-white/10' : 'bg-slate-100'}`}>{i}</span>)}</div></section>}
  </div>;
}

function MainContent({ data, locale, accent, style = 'timeline' }: { data: TemplateProps['data']; locale: TemplateProps['locale']; accent: string; style?: 'timeline' | 'cards' | 'ribbon' }) {
  const L = sectionLabels(locale);
  return <div className="space-y-5">
    {data.personalInfo.summary && <section><Title accent={accent} ribbon={style === 'ribbon'}>{L.profile}</Title><p className="text-[12px] leading-[1.65] text-slate-600">{data.personalInfo.summary}</p></section>}
    {data.experiences.length > 0 && <section><Title accent={accent} ribbon={style === 'ribbon'}>{L.experience}</Title><ExperienceList data={data} locale={locale} accent={accent} cards={style === 'cards'} /></section>}
    {data.education.length > 0 && <section><Title accent={accent} ribbon={style === 'ribbon'}>{L.education}</Title><EducationList data={data} accent={accent} cards={style === 'cards'} /></section>}
  </div>;
}

/* 01 — Ondes turquoise, inspiré du premier modèle */
export function RefWaveTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const aqua = accent || '#55d6c2';
  return <div className="relative grid min-h-[1123px] w-[794px] grid-cols-[252px_1fr] overflow-hidden bg-white font-sans text-slate-700">
    <aside className="relative z-10 bg-[#142f3b] px-7 pb-8 pt-7 text-white"><ProfilePhoto src={p.photo} name={p.fullName} size={142} rounded="rounded-full" accent={aqua} className="mx-auto ring-[9px] ring-white/10" /><div className="mt-6"><Title accent={aqua} light>Contact</Title><ContactStack p={p} light /></div><div className="mt-6"><SideContent locale={locale} data={data} accent={aqua} light dots /></div></aside>
    <main className="relative px-9 pb-9 pt-10"><div className="absolute -left-14 top-0 h-36 w-[620px] opacity-20" style={{ background: aqua, borderRadius: '0 0 55% 45%' }} /><header className="relative border-b-4 pb-6" style={{ borderColor: aqua }}><h1 className="text-[48px] font-black leading-[.9] tracking-[-.045em] text-[#142f3b]">{p.fullName || 'Votre Nom'}</h1><p className="mt-4 text-[17px] font-bold uppercase tracking-[.16em]" style={{ color: aqua }}>{p.title}</p></header><div className="mt-6"><MainContent data={data} locale={locale} accent={aqua} /></div></main>
  </div>;
}

/* 02 — Canard géométrique avec photo angulaire */
export function RefTealGeometryTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const teal = accent || '#145c60';
  return <div className="min-h-[1123px] w-[794px] bg-white font-sans text-slate-700"><header className="grid h-[210px] grid-cols-[510px_284px] overflow-hidden bg-[#103d43] text-white"><div className="px-10 py-9"><p className="text-[10px] font-bold uppercase tracking-[.32em] text-white/45">Curriculum vitae</p><h1 className="mt-3 text-[48px] font-black leading-none">{p.fullName || 'Votre Nom'}</h1><p className="mt-3 text-[17px] font-semibold text-white/70">{p.title}</p><div className="mt-5 flex flex-wrap gap-x-4 text-[10.5px] text-white/65"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="linkedin" value={p.linkedin} /></div></div><div className="relative min-h-[210px]" style={{ background: teal, clipPath: 'polygon(22% 0,100% 0,100% 100%,0 100%)' }}><div className="absolute right-7 top-6"><ProfilePhoto src={p.photo} name={p.fullName} size={150} rounded="rounded-[6px]" accent="#fff" className="shadow-2xl" /></div></div></header><div className="grid grid-cols-[252px_1fr]"><aside className="min-h-[913px] bg-[#103d43] px-7 py-7 text-white"><ContactStack p={p} light /><div className="mt-7"><SideContent locale={locale} data={data} accent="#75d9d6" light /></div></aside><main className="px-9 py-8"><MainContent data={data} locale={locale} accent={teal} style="cards" /></main></div></div>;
}

/* 03 — Navy orbital, jauges et élégance technique */
export function RefNavyOrbitTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const blue = accent || '#1686d9';
  return <div className="grid min-h-[1123px] w-[794px] grid-cols-[286px_1fr] bg-white font-sans text-slate-700"><aside className="bg-[#172432] px-8 py-8 text-white"><ProfilePhoto src={p.photo} name={p.fullName} size={144} rounded="rounded-full" accent={blue} className="mx-auto ring-[10px] ring-white/5" /><h1 className="mt-6 text-center text-[27px] font-black leading-tight">{p.fullName || 'Votre Nom'}</h1><p className="mt-2 text-center text-[11px] font-bold uppercase tracking-[.2em]" style={{ color: blue }}>{p.title}</p><div className="mt-6"><ContactStack p={p} light /></div><div className="mt-7"><SideContent locale={locale} data={data} accent={blue} light dots /></div></aside><main className="px-9 py-10"><div className="mb-7 flex items-center gap-3"><span className="h-11 w-2 rounded-full" style={{ background: blue }} /><div><p className="text-[10px] font-black uppercase tracking-[.3em]" style={{ color: blue }}>Professional profile</p><p className="text-[22px] font-bold text-slate-950">Expertise & parcours</p></div></div><MainContent data={data} locale={locale} accent={blue} /></main></div>;
}

/* 04 — Noir, blanc et or, photo organique */
export function RefGoldWaveTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const gold = accent || '#f2bd23';
  return <div className="min-h-[1123px] w-[794px] overflow-hidden bg-white font-sans text-slate-700"><header className="relative grid h-[236px] grid-cols-[300px_1fr] bg-[#101114] text-white"><div className="relative overflow-hidden"><div className="absolute -left-14 -top-20 h-80 w-80 rounded-full" style={{ background: gold }} /><div className="absolute left-9 top-24"><ProfilePhoto src={p.photo} name={p.fullName} size={155} rounded="rounded-[48%_52%_46%_54%]" accent="#fff" className="ring-8 ring-white/20" /></div></div><div className="px-8 py-12"><p className="text-[10px] font-black uppercase tracking-[.35em]" style={{ color: gold }}>Creative professional</p><h1 className="mt-4 text-[46px] font-black leading-[.92]">{p.fullName || 'Votre Nom'}</h1><p className="mt-4 text-[16px] font-semibold text-white/65">{p.title}</p></div></header><div className="grid grid-cols-[272px_1fr]"><aside className="min-h-[887px] bg-[#f6f6f4] px-7 py-8"><ContactStack p={p} /><div className="mt-7"><SideContent locale={locale} data={data} accent={gold} /></div></aside><main className="px-9 py-8"><MainContent data={data} locale={locale} accent={gold} style="ribbon" /></main></div></div>;
}

/* 05 — Vert bouteille et citron, titres découpés */
export function RefCitrusTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const lime = accent || '#d9ee3f'; const green = '#234d43';
  return <div className="min-h-[1123px] w-[794px] bg-[#fbfcf7] font-sans text-slate-700"><header className="relative flex h-[214px] items-center gap-8 overflow-hidden px-10"><div className="absolute inset-y-0 left-0 w-[270px]" style={{ background: green, clipPath: 'polygon(0 0,82% 0,100% 50%,82% 100%,0 100%)' }} /><ProfilePhoto src={p.photo} name={p.fullName} size={148} rounded="rounded-full" accent={lime} className="relative ring-[9px] ring-white/20" /><div className="relative ml-6"><p className="text-[10px] font-black uppercase tracking-[.32em]" style={{ color: green }}>Curriculum vitae</p><h1 className="mt-2 text-[47px] font-black leading-none text-slate-950">{p.fullName || 'Votre Nom'}</h1><p className="mt-3 text-[16px] font-bold" style={{ color: green }}>{p.title}</p></div></header><div className="grid grid-cols-[244px_1fr] gap-8 px-9 pb-9"><aside className="rounded-t-[30px] bg-[#234d43] px-6 py-7 text-white"><ContactStack p={p} light /><div className="mt-7"><SideContent locale={locale} data={data} accent={lime} light dots /></div></aside><main className="py-3"><MainContent data={data} locale={locale} accent={lime} style="ribbon" /></main></div></div>;
}

/* 06 — Bleu corporate, photo à anneaux */
export function RefBlueRingsTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const blue = accent || '#2476c7';
  return <div className="min-h-[1123px] w-[794px] bg-white font-sans text-slate-700"><header className="relative flex h-[226px] items-center bg-[#17324b] px-10 text-white"><div className="relative mr-9"><span className="absolute -inset-5 rounded-full border-[10px] border-white/8" /><span className="absolute -inset-2 rounded-full border-4" style={{ borderColor: blue }} /><ProfilePhoto src={p.photo} name={p.fullName} size={144} rounded="rounded-full" accent={blue} /></div><div><h1 className="text-[46px] font-black leading-none">{p.fullName || 'Votre Nom'}</h1><p className="mt-3 text-[16px] font-bold uppercase tracking-[.14em]" style={{ color: '#7fc4ff' }}>{p.title}</p><div className="mt-4 flex gap-x-4 text-[10.5px] text-white/60"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /></div></div></header><div className="grid grid-cols-[226px_1fr]"><aside className="min-h-[897px] bg-[#edf4fa] px-7 py-8"><ContactStack p={p} /><div className="mt-7"><SideContent locale={locale} data={data} accent={blue} dots /></div></aside><main className="px-9 py-8"><MainContent data={data} locale={locale} accent={blue} /></main></div></div>;
}

/* 07 — Rubans dorés, structure symétrique */
export function RefGoldenRibbonTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const gold = accent || '#e5ad28';
  return <div className="min-h-[1123px] w-[794px] bg-white font-sans text-slate-700"><header className="flex h-[236px] items-center gap-8 bg-[#efb426] px-10"><ProfilePhoto src={p.photo} name={p.fullName} size={154} rounded="rounded-full" accent="#1f2937" className="ring-[8px] ring-white/40" /><div><h1 className="text-[50px] font-black uppercase leading-[.9] tracking-[-.04em] text-slate-950">{p.fullName || 'Votre Nom'}</h1><p className="mt-4 text-[17px] font-bold uppercase tracking-[.18em] text-slate-700">{p.title}</p><div className="mt-4 flex flex-wrap gap-x-4 text-[10.5px] text-slate-700"><ContactItem type="email" value={p.email} /><ContactItem type="phone" value={p.phone} /><ContactItem type="address" value={p.address} /></div></div></header><div className="grid grid-cols-2 gap-8 px-9 py-8"><aside><SideContent locale={locale} data={data} accent={gold} dots /></aside><main><MainContent data={data} locale={locale} accent={gold} style="ribbon" /></main></div></div>;
}

/* 08 — Colonne navy sobre, contenu recruteur */
export function RefRecruiterTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const blue = accent || '#3d82bf';
  return <div className="grid min-h-[1123px] w-[794px] grid-cols-[246px_1fr] bg-white font-sans text-slate-700"><aside className="bg-[#243747] px-7 py-8 text-white"><ProfilePhoto src={p.photo} name={p.fullName} size={138} rounded="rounded-full" accent={blue} className="mx-auto ring-4 ring-white/10" /><div className="mt-6"><ContactStack p={p} light /></div><div className="mt-7"><SideContent locale={locale} data={data} accent={blue} light /></div></aside><main className="px-10 py-10"><header className="mb-7 border-b-2 border-slate-200 pb-6"><h1 className="text-[47px] font-light leading-none tracking-[-.04em] text-slate-950">{p.fullName || 'Votre Nom'}</h1><p className="mt-3 text-[15px] font-black uppercase tracking-[.18em]" style={{ color: blue }}>{p.title}</p></header><MainContent data={data} locale={locale} accent={blue} /></main></div>;
}

/* 09 — Angle bleu, photo intégrée et points de compétence */
export function RefAngularTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const blue = accent || '#2782c4';
  return <div className="min-h-[1123px] w-[794px] overflow-hidden bg-white font-sans text-slate-700"><header className="grid h-[225px] grid-cols-[272px_1fr]"><div className="relative bg-[#243545]" style={{ clipPath: 'polygon(0 0,100% 0,84% 100%,0 82%)' }}><div className="absolute left-8 top-7"><ProfilePhoto src={p.photo} name={p.fullName} size={145} rounded="rounded-[8px]" accent={blue} className="ring-4 ring-white/15" /></div></div><div className="px-7 py-10"><p className="text-[10px] font-black uppercase tracking-[.34em]" style={{ color: blue }}>Professional resume</p><h1 className="mt-3 text-[48px] font-black leading-[.9] text-slate-950">{p.fullName || 'Votre Nom'}</h1><p className="mt-4 text-[16px] font-semibold text-slate-500">{p.title}</p></div></header><div className="grid grid-cols-[246px_1fr]"><aside className="min-h-[898px] bg-[#243545] px-7 py-7 text-white"><ContactStack p={p} light /><div className="mt-7"><SideContent locale={locale} data={data} accent={blue} light dots /></div></aside><main className="px-9 py-7"><MainContent data={data} locale={locale} accent={blue} /></main></div></div>;
}

/* 10 — Canard premium, barres en points et certifications */
export function RefTealDotsTemplate({ data, accent, locale }: TemplateProps) {
  const p = data.personalInfo; const teal = accent || '#167b78';
  return <div className="grid min-h-[1123px] w-[794px] grid-cols-[258px_1fr] bg-white font-sans text-slate-700"><aside className="relative overflow-hidden bg-[#16484c] px-7 py-8 text-white"><div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-white/[.04]" /><ProfilePhoto src={p.photo} name={p.fullName} size={142} rounded="rounded-full" accent="#58c8c2" className="relative mx-auto ring-[8px] ring-white/10" /><div className="relative mt-6"><ContactStack p={p} light /></div><div className="relative mt-7"><SideContent locale={locale} data={data} accent="#58c8c2" light dots /></div></aside><main className="px-10 py-10"><header className="relative mb-7 pb-6"><span className="absolute -left-10 top-0 h-full w-2" style={{ background: teal }} /><p className="text-[10px] font-black uppercase tracking-[.35em]" style={{ color: teal }}>Career profile</p><h1 className="mt-3 text-[48px] font-black leading-[.9] tracking-[-.04em] text-slate-950">{p.fullName || 'Votre Nom'}</h1><p className="mt-4 text-[16px] font-bold text-slate-500">{p.title}</p></header><MainContent data={data} locale={locale} accent={teal} /></main></div>;
}
