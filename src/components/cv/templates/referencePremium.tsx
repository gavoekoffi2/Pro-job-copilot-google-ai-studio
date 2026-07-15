import type { ReactNode } from 'react';
import {
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { dateRange, levelToPercent, sectionLabels, type TemplateProps } from '../cvParts';

/**
 * Reproduction du modèle Harry Nelson fourni par l'utilisateur.
 * Les dix exports conservent la même composition et déclinent seulement sa direction chromatique.
 */
type Variant =
  | 'original'
  | 'teal'
  | 'royal'
  | 'gold'
  | 'forest'
  | 'sky'
  | 'burgundy'
  | 'slate'
  | 'violet'
  | 'graphite';

interface Palette {
  primary: string;
  secondary: string;
  sidebar: string;
  paper: string;
}

const PALETTES: Record<Variant, Palette> = {
  original: { primary: '#032a5f', secondary: '#84b9ce', sidebar: '#ebebeb', paper: '#ffffff' },
  teal: { primary: '#083f46', secondary: '#68b8b0', sidebar: '#eaf2f1', paper: '#ffffff' },
  royal: { primary: '#123c73', secondary: '#78a8dc', sidebar: '#edf1f7', paper: '#ffffff' },
  gold: { primary: '#24201b', secondary: '#c7a052', sidebar: '#f1eee8', paper: '#ffffff' },
  forest: { primary: '#173d34', secondary: '#83ad98', sidebar: '#ebf0ed', paper: '#ffffff' },
  sky: { primary: '#17476f', secondary: '#7cb9d5', sidebar: '#edf4f7', paper: '#ffffff' },
  burgundy: { primary: '#4b2031', secondary: '#c18a9e', sidebar: '#f3ecef', paper: '#ffffff' },
  slate: { primary: '#263543', secondary: '#91a9b8', sidebar: '#edf0f2', paper: '#ffffff' },
  violet: { primary: '#342457', secondary: '#9b8ac4', sidebar: '#f0edf5', paper: '#ffffff' },
  graphite: { primary: '#23282f', secondary: '#99a3ad', sidebar: '#eceeef', paper: '#ffffff' },
};

function mixHex(from: string, to: string, amount: number): string {
  const parse = (value: string) => {
    const hex = value.replace('#', '');
    const normalized = hex.length === 3 ? hex.split('').map((part) => `${part}${part}`).join('') : hex;
    return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
  };
  const start = parse(from);
  const end = parse(to);
  if ([...start, ...end].some(Number.isNaN)) return from;
  return `#${start.map((channel, index) => Math.round(channel + (end[index] - channel) * amount).toString(16).padStart(2, '0')).join('')}`;
}

function paletteFromAccent(base: Palette, accent?: string): Palette {
  if (!accent || !/^#[0-9a-f]{6}$/i.test(accent)) return base;
  return {
    primary: mixHex(accent, '#08111f', 0.58),
    secondary: accent,
    sidebar: mixHex(accent, '#ffffff', 0.91),
    paper: base.paper,
  };
}

type Experience = TemplateProps['data']['experiences'][number];

function splitLongExperience(item: Experience, characterLimit = 900): Experience[] {
  const description = item.description.trim();
  if (description.length <= characterLimit) return [item];
  const words = description.split(/\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > characterLimit && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.map((chunk, index) => ({ ...item, id: `${item.id}-part-${index + 1}`, description: chunk }));
}

function paginateExperiences(items: Experience[], firstPageBudget: number, nextPageBudget = 1900): Experience[][] {
  const normalized = items.flatMap((item) => splitLongExperience(item));
  if (normalized.length === 0) return [[]];
  const pages: Experience[][] = [[]];
  let pageIndex = 0;
  let used = 0;
  for (const item of normalized) {
    const weight = 150 + item.title.length + item.company.length + item.description.length;
    const budget = pageIndex === 0 ? firstPageBudget : nextPageBudget;
    if (pages[pageIndex].length > 0 && used + weight > budget) {
      pages.push([]);
      pageIndex += 1;
      used = 0;
    }
    pages[pageIndex].push(item);
    used += weight;
  }
  return pages;
}

const contactRows = [
  ['email', Mail],
  ['phone', Phone],
  ['address', MapPin],
  ['website', Globe],
  ['linkedin', Linkedin],
] as const;

function SectionBand({ children, palette }: { children: string; palette: Palette }) {
  return (
    <div
      className="relative h-[51px] w-[253px] rounded-[14px] border-2"
      style={{ background: palette.primary, borderColor: palette.secondary }}
    >
      <h2 className="flex h-full items-center justify-center px-4 text-center text-[1.25em] font-black uppercase tracking-[0.015em] text-white">
        {children}
      </h2>
      <span className="absolute -bottom-px left-[23px] h-px w-[209px]" style={{ background: palette.secondary }} />
    </div>
  );
}

function PortraitCutout({ src, name, palette }: { src?: string; name: string; palette: Palette }) {
  const hidden = src === '__HIDE_PHOTO__';
  return (
    <div
      data-design-motif="portrait-cutout"
      className="absolute left-[68px] top-[46px] z-30 h-[246px] w-[214px] overflow-hidden"
      style={{ clipPath: 'ellipse(47% 49% at 50% 49%)' }}
    >
      {!hidden && src ? (
        <img
          src={src}
          alt={name}
          crossOrigin="anonymous"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[3.375em] font-black text-white" style={{ background: palette.secondary }}>
          {name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('') || 'CV'}
        </div>
      )}
    </div>
  );
}

function ContactSection({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  const personal = data.personalInfo;
  const values: Record<(typeof contactRows)[number][0], string> = {
    email: personal.email,
    phone: personal.phone,
    address: personal.address,
    website: personal.website,
    linkedin: personal.linkedin,
  };
  return (
    <section className="absolute left-[50px] top-[365px] z-20 w-[245px]">
      <h2 className="mb-[25px] text-center text-[1.3125em] font-black uppercase" style={{ color: palette.primary }}>
        {labels.contact}
      </h2>
      <div className="space-y-[7px]">
        {contactRows.map(([key, Icon]) => {
          const value = values[key];
          if (!value) return null;
          return (
            <div key={key} className="grid min-h-[31px] grid-cols-[38px_1fr] items-center gap-[18px]">
              <span className="grid h-[31px] w-[31px] place-items-center rounded-full" style={{ background: palette.secondary }}>
                <Icon className="h-[15px] w-[15px]" style={{ color: palette.primary }} strokeWidth={2.25} />
              </span>
              <span className="break-words text-[0.6875em] font-medium leading-[1.22] text-[#555b64]">{value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SkillDots({ percent, palette }: { percent: number; palette: Palette }) {
  const count = Math.max(0, Math.min(6, Math.ceil(percent / (100 / 6))));
  return (
    <span className="flex items-center gap-[9px]" aria-label={`${count}/6`}>
      {Array.from({ length: 6 }).map((_, index) => (
        <span
          key={index}
          className="h-[8px] w-[8px] rounded-full"
          style={{ background: index < count ? palette.primary : '#c8cbd0' }}
        />
      ))}
    </span>
  );
}

function SkillsAndExtras({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  const visibleSkills = data.skills.slice(0, 6);
  return (
    <>
      {visibleSkills.length > 0 && (
        <section className="absolute left-[50px] top-[616px] z-20 w-[245px]" data-design-motif="segmented-skills">
          <h2 className="mb-[25px] text-center text-[1.3125em] font-black uppercase" style={{ color: palette.primary }}>
            {labels.skills}
          </h2>
          <div className="space-y-[10px]">
            {visibleSkills.map((skill) => (
              <div key={skill.id} className="grid grid-cols-[135px_1fr] items-center text-[0.6875em] font-semibold text-[#555b64]">
                <span className="truncate pr-2">{skill.name}</span>
                <SkillDots percent={levelToPercent(skill.level)} palette={palette} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="absolute left-[50px] top-[850px] z-20 w-[245px]">
        <h2 className="mb-[25px] text-center text-[1.3125em] font-black uppercase" style={{ color: palette.primary }}>
          {data.interests.length > 0 ? labels.interests : labels.languages}
        </h2>
        {data.interests.length > 0 ? (
          <div className="text-center text-[0.65625em] font-semibold leading-[1.55] text-[#555b64]">
            <p>{data.interests.join(' · ')}</p>
            {data.languages.length > 0 && (
              <p className="mt-2 text-[0.9048em] font-medium">
                {data.languages.slice(0, 4).map((language) => `${language.name} (${language.level})`).join(' · ')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5 text-[0.65625em] text-[#555b64]">
            {data.languages.slice(0, 4).map((language) => (
              <div key={language.id} className="flex justify-between gap-2"><b>{language.name}</b><span>{language.level}</span></div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Timeline({ children, palette }: { children: ReactNode; palette: Palette }) {
  return (
    <div className="relative space-y-[17px]" data-design-motif="dated-timeline">
      <span className="absolute bottom-[9px] left-[63px] top-[10px] w-px" style={{ background: palette.primary }} />
      {children}
    </div>
  );
}

function DatedItem({ date, children, palette }: { date: string; children: ReactNode; palette: Palette }) {
  const normalized = dateRangeParts(date);
  return (
    <article className="relative grid grid-cols-[82px_1fr] gap-[21px]">
      <div className="relative pr-[28px] text-right text-[0.625em] font-bold leading-[1.35]" style={{ color: palette.primary }}>
        {normalized.map((part) => <div key={part}>{part}</div>)}
        <span className="absolute right-[11px] top-[5px] h-[8px] w-[8px] rounded-full ring-[3px] ring-white" style={{ background: palette.primary }} />
      </div>
      <div className="min-w-0">{children}</div>
    </article>
  );
}

function dateRangeParts(value: string): string[] {
  const parts = value.split(/\s+[—–-]\s+/).map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, 2) : [value];
}

function AboutSection({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  if (!data.personalInfo.summary) return null;
  return (
    <section>
      <SectionBand palette={palette}>{labels.profile}</SectionBand>
      <p className="ml-[19px] mt-[18px] max-w-[337px] text-[0.65625em] leading-[1.9] text-[#555b64]">
        {data.personalInfo.summary}
      </p>
    </section>
  );
}

function EducationSection({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  if (data.education.length === 0 && data.certifications.length === 0) return null;
  return (
    <section>
      <SectionBand palette={palette}>{labels.education}</SectionBand>
      <div className="ml-[2px] mt-[18px]">
        <Timeline palette={palette}>
          {data.education.slice(0, 3).map((item) => (
            <DatedItem key={item.id} date={item.year} palette={palette}>
              <h3 className="text-[0.6875em] font-black uppercase tracking-[0.025em]" style={{ color: palette.primary }}>{item.degree}</h3>
              <p className="mt-[3px] text-[0.625em] font-semibold text-[#555b64]">{item.school}{item.location ? ` · ${item.location}` : ''}</p>
              {item.description && <p className="mt-[4px] text-[0.60625em] leading-[1.45] text-[#686d75]">{item.description}</p>}
            </DatedItem>
          ))}
          {data.certifications.slice(0, Math.max(0, 4 - data.education.length)).map((item) => (
            <DatedItem key={item.id} date={item.year} palette={palette}>
              <h3 className="text-[0.6875em] font-black uppercase" style={{ color: palette.primary }}>{item.name}</h3>
              <p className="mt-[3px] text-[0.625em] text-[#555b64]">{item.issuer}</p>
            </DatedItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}

function ExperienceSection({ experiences, palette, locale, continuation = false }: { experiences: Experience[]; palette: Palette; locale: TemplateProps['locale']; continuation?: boolean }) {
  const labels = sectionLabels(locale);
  if (experiences.length === 0) return null;
  return (
    <section>
      <SectionBand palette={palette}>{continuation ? `${labels.experience} · ${locale === 'fr' ? 'suite' : 'continued'}` : labels.experience}</SectionBand>
      <div className="ml-[2px] mt-[18px]">
        <Timeline palette={palette}>
          {experiences.map((item) => (
            <DatedItem key={item.id} date={dateRange(item, locale)} palette={palette}>
              <h3 className="text-[0.625em] font-black uppercase tracking-[0.02em]" style={{ color: palette.primary }}>{item.title}</h3>
              <p className="mt-[2px] text-[0.5625em] font-semibold text-[#555b64]">{item.company}{item.location ? ` · ${item.location}` : ''}</p>
              {item.description && (
                <p className="mt-[4px] text-[0.55em] leading-[1.35] text-[#686d75]">
                  {item.description.split('\n').map((line) => line.trim()).filter(Boolean).join(' ')}
                </p>
              )}
            </DatedItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}

function BottomCornerAccent({ palette }: { palette: Palette }) {
  return (
    <svg data-design-motif="bottom-corner-accent" className="absolute bottom-0 left-0 z-10 h-[34px] w-[286px]" viewBox="0 0 286 34" preserveAspectRatio="none" aria-hidden="true">
      <path data-design-motif="bottom-wave-cyan" fill={palette.secondary} d="M0 8C82 17 171 3 286 11V34H0Z" />
      <path data-design-motif="bottom-wave-navy" fill={palette.primary} d="M0 19C92 27 187 14 286 20V34H0Z" />
    </svg>
  );
}

function ContinuationPage({ experiences, data, palette, locale, fontScale }: { experiences: Experience[]; data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale']; fontScale: number }) {
  return (
    <div data-design-motif="continuation-page" className="relative h-[1123px] w-[794px] overflow-hidden bg-white font-sans text-[#555b64]" style={{ fontSize: `${16 * fontScale}px` }}>
      <svg className="absolute left-0 top-0 h-[108px] w-[794px]" viewBox="0 0 794 108" preserveAspectRatio="none" aria-hidden="true">
        <path fill={palette.secondary} d="M0 0H794V72C620 104 420 72 0 101Z" />
        <path fill={palette.primary} d="M0 0H794V54C588 89 365 55 0 82Z" />
      </svg>
      <header className="absolute left-[54px] right-[54px] top-[30px] z-20 flex items-center justify-between text-white">
        <h1 className="text-[1.25em] font-black uppercase tracking-[0.035em]">{data.personalInfo.fullName}</h1>
        <span className="text-[0.6875em] font-bold uppercase tracking-[0.12em]">{data.personalInfo.title}</span>
      </header>
      <main data-content-safe-bottom="true" className="absolute bottom-[62px] left-[82px] right-[82px] top-[146px] overflow-hidden">
        <ExperienceSection experiences={experiences} palette={palette} locale={locale} continuation />
      </main>
      <BottomCornerAccent palette={palette} />
    </div>
  );
}

function HarryNelsonTemplate({ data, accent, locale, variant, fontScale = 1 }: TemplateProps & { variant: Variant }) {
  const palette = paletteFromAccent(PALETTES[variant], accent);
  const personal = data.personalInfo;
  const safeFontScale = Math.max(0.9, Math.min(1.15, fontScale));
  const summaryCost = personal.summary.length * 0.75;
  const educationCost = data.education.slice(0, 3).reduce((total, item) => total + 125 + item.description.length * 0.6, 0);
  const firstPageBudget = Math.max(420, 1650 - summaryCost - educationCost);
  const experiencePages = paginateExperiences(data.experiences, firstPageBudget);
  return (
    <div data-design-reference={`harry-nelson-${variant}`} data-user-accent={accent} className="w-[794px] bg-white">
      <div className="relative h-[1123px] w-[794px] overflow-hidden font-sans text-[#555b64]" style={{ background: palette.paper, fontSize: `${16 * safeFontScale}px` }}>
        <div className="absolute bottom-0 left-0 top-0 w-[350px]" style={{ background: palette.sidebar }} />

        <svg className="absolute left-0 top-0 z-10 h-[216px] w-[794px]" viewBox="0 0 794 216" preserveAspectRatio="none" aria-hidden="true">
          <path data-design-motif="top-wave-cyan" fill={palette.secondary} d="M0 0H794V190C628 185 512 143 386 137C248 131 134 168 0 202Z" />
          <path data-design-motif="top-wave-navy" fill={palette.primary} d="M0 0H794V160C625 158 506 119 382 116C242 112 126 144 0 174Z" />
        </svg>

        <BottomCornerAccent palette={palette} />
        <PortraitCutout src={personal.photo} name={personal.fullName} palette={palette} />

        <header className="absolute left-[440px] top-[49px] z-30 w-[305px] text-white">
          <h1
            className="whitespace-nowrap font-black uppercase leading-[0.95] tracking-[-0.025em]"
            style={{ fontSize: (personal.fullName.length > 17 ? 31 : 38) * safeFontScale }}
          >
            {personal.fullName || (locale === 'fr' ? 'VOTRE NOM' : 'YOUR NAME')}
          </h1>
          <p className="mt-[13px] whitespace-nowrap pl-[34px] font-semibold uppercase tracking-[0.06em] text-white/95" style={{ fontSize: (personal.title.length > 27 ? 11.5 : 14) * safeFontScale }}>{personal.title}</p>
        </header>

        <div data-design-motif="two-column-grid">
          <ContactSection data={data} palette={palette} locale={locale} />
          <SkillsAndExtras data={data} palette={palette} locale={locale} />
          <main data-content-safe-bottom="true" className="absolute bottom-[60px] left-[379px] top-[220px] z-20 w-[355px] space-y-[22px] overflow-hidden">
            <AboutSection data={data} palette={palette} locale={locale} />
            <EducationSection data={data} palette={palette} locale={locale} />
            <ExperienceSection experiences={experiencePages[0]} palette={palette} locale={locale} />
          </main>
        </div>

        <div data-design-motif="footer-url" className="absolute bottom-[7px] left-[36px] z-30 max-w-[215px] truncate text-[0.5625em] font-black uppercase tracking-[0.03em] text-white">
          {personal.website || personal.linkedin || personal.email}
        </div>
      </div>
      {experiencePages.slice(1).map((experiences, index) => (
        <ContinuationPage key={`continuation-${index + 1}`} experiences={experiences} data={data} palette={palette} locale={locale} fontScale={safeFontScale} />
      ))}
    </div>
  );
}

export function RefWaveTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="original" />;
}
export function RefTealGeometryTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="teal" />;
}
export function RefNavyOrbitTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="royal" />;
}
export function RefGoldWaveTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="gold" />;
}
export function RefCitrusTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="forest" />;
}
export function RefBlueRingsTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="sky" />;
}
export function RefGoldenRibbonTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="burgundy" />;
}
export function RefRecruiterTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="slate" />;
}
export function RefAngularTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="violet" />;
}
export function RefTealDotsTemplate(props: TemplateProps) {
  return <HarryNelsonTemplate {...props} variant="graphite" />;
}
