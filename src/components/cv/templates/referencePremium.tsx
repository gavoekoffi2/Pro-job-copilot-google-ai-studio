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

const contactRows = [
  ['email', Mail],
  ['phone', Phone],
  ['address', MapPin],
  ['website', Globe],
  ['linkedin', Linkedin],
] as const;

function SectionBand({ children, palette }: { children: string; palette: Palette }) {
  return (
    <div className="relative h-[51px] w-[253px]" style={{ background: palette.primary }}>
      <h2 className="flex h-full items-center justify-center px-4 text-center text-[20px] font-black uppercase tracking-[0.015em] text-white">
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
      className="absolute left-[54px] top-[45px] z-30 h-[282px] w-[246px] overflow-hidden"
      style={{ clipPath: 'ellipse(46% 49% at 50% 48%)' }}
    >
      {!hidden && src ? (
        <img
          src={src}
          alt={name}
          crossOrigin="anonymous"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[54px] font-black text-white" style={{ background: palette.secondary }}>
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
      <h2 className="mb-[25px] text-center text-[21px] font-black uppercase" style={{ color: palette.primary }}>
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
              <span className="break-words text-[11px] font-medium leading-[1.22] text-[#555b64]">{value}</span>
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
          <h2 className="mb-[25px] text-center text-[21px] font-black uppercase" style={{ color: palette.primary }}>
            {labels.skills}
          </h2>
          <div className="space-y-[10px]">
            {visibleSkills.map((skill) => (
              <div key={skill.id} className="grid grid-cols-[135px_1fr] items-center text-[11px] font-semibold text-[#555b64]">
                <span className="truncate pr-2">{skill.name}</span>
                <SkillDots percent={levelToPercent(skill.level)} palette={palette} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="absolute left-[50px] top-[850px] z-20 w-[245px]">
        <h2 className="mb-[25px] text-center text-[21px] font-black uppercase" style={{ color: palette.primary }}>
          {data.interests.length > 0 ? labels.interests : labels.languages}
        </h2>
        {data.interests.length > 0 ? (
          <div className="text-center text-[10.5px] font-semibold leading-[1.55] text-[#555b64]">
            <p>{data.interests.join(' · ')}</p>
            {data.languages.length > 0 && (
              <p className="mt-2 text-[9.5px] font-medium">
                {data.languages.slice(0, 4).map((language) => `${language.name} (${language.level})`).join(' · ')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5 text-[10.5px] text-[#555b64]">
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
      <span className="absolute bottom-[9px] left-[56px] top-[10px] w-px" style={{ background: palette.primary }} />
      {children}
    </div>
  );
}

function DatedItem({ date, children, palette }: { date: string; children: ReactNode; palette: Palette }) {
  const normalized = dateRangeParts(date);
  return (
    <article className="relative grid grid-cols-[75px_1fr] gap-[18px]">
      <div className="relative pr-[17px] text-right text-[10px] font-bold leading-[1.35]" style={{ color: palette.primary }}>
        {normalized.map((part) => <div key={part}>{part}</div>)}
        <span className="absolute right-[10px] top-[5px] h-[8px] w-[8px] rounded-full" style={{ background: palette.primary }} />
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
    <section className="absolute left-[379px] top-[220px] z-20 w-[355px]">
      <SectionBand palette={palette}>{labels.profile}</SectionBand>
      <p className="ml-[19px] mt-[18px] max-w-[337px] text-[10.5px] leading-[1.9] text-[#555b64]">
        {data.personalInfo.summary}
      </p>
    </section>
  );
}

function EducationSection({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  if (data.education.length === 0 && data.certifications.length === 0) return null;
  return (
    <section className="absolute left-[379px] top-[415px] z-20 w-[355px]">
      <SectionBand palette={palette}>{labels.education}</SectionBand>
      <div className="ml-[2px] mt-[18px]">
        <Timeline palette={palette}>
          {data.education.slice(0, 3).map((item) => (
            <DatedItem key={item.id} date={item.year} palette={palette}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.025em]" style={{ color: palette.primary }}>{item.degree}</h3>
              <p className="mt-[3px] text-[10px] font-semibold text-[#555b64]">{item.school}{item.location ? ` · ${item.location}` : ''}</p>
              {item.description && <p className="mt-[4px] text-[9.7px] leading-[1.45] text-[#686d75]">{item.description}</p>}
            </DatedItem>
          ))}
          {data.certifications.slice(0, Math.max(0, 4 - data.education.length)).map((item) => (
            <DatedItem key={item.id} date={item.year} palette={palette}>
              <h3 className="text-[11px] font-black uppercase" style={{ color: palette.primary }}>{item.name}</h3>
              <p className="mt-[3px] text-[10px] text-[#555b64]">{item.issuer}</p>
            </DatedItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}

function ExperienceSection({ data, palette, locale }: { data: TemplateProps['data']; palette: Palette; locale: TemplateProps['locale'] }) {
  const labels = sectionLabels(locale);
  if (data.experiences.length === 0) return null;
  return (
    <section className="absolute left-[379px] top-[736px] z-20 w-[355px]">
      <SectionBand palette={palette}>{labels.experience}</SectionBand>
      <div className="ml-[2px] mt-[18px]">
        <Timeline palette={palette}>
          {data.experiences.slice(0, 3).map((item) => (
            <DatedItem key={item.id} date={dateRange(item, locale)} palette={palette}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.02em]" style={{ color: palette.primary }}>{item.title}</h3>
              <p className="mt-[2px] text-[9px] font-semibold text-[#555b64]">{item.company}{item.location ? ` · ${item.location}` : ''}</p>
              {item.description && (
                <p className="mt-[4px] text-[8.8px] leading-[1.35] text-[#686d75]">
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

function HarryNelsonTemplate({ data, locale, variant }: TemplateProps & { variant: Variant }) {
  const palette = PALETTES[variant];
  const personal = data.personalInfo;
  return (
    <div
      data-design-reference={`harry-nelson-${variant}`}
      className="relative h-[1123px] w-[794px] overflow-hidden font-sans text-[#555b64]"
      style={{ background: palette.paper }}
    >
      <div className="absolute bottom-0 left-0 top-0 w-[350px]" style={{ background: palette.sidebar }} />

      <svg className="absolute left-0 top-0 z-10 h-[216px] w-[794px]" viewBox="0 0 794 216" preserveAspectRatio="none" aria-hidden="true">
        <path data-design-motif="top-wave-cyan" fill={palette.secondary} d="M0 0H794V215C720 201 659 181 600 187C505 196 433 173 352 153C279 135 225 131 160 150C97 169 50 204 0 194Z" />
        <path data-design-motif="top-wave-navy" fill={palette.primary} d="M0 0H794V183C718 171 658 153 600 164C509 180 432 158 352 141C279 125 222 120 158 137C96 153 48 179 0 163Z" />
      </svg>

      <svg className="absolute bottom-0 left-0 z-10 h-[146px] w-[794px]" viewBox="0 0 794 146" preserveAspectRatio="none" aria-hidden="true">
        <path data-design-motif="bottom-wave-cyan" fill={palette.secondary} d="M0 0C87 10 170 31 257 38C356 46 443 21 531 30C624 39 699 60 794 47V146H0Z" />
        <path data-design-motif="bottom-wave-navy" fill={palette.primary} d="M0 31C92 40 171 62 258 68C358 75 444 49 530 59C622 69 704 91 794 75V146H0Z" />
      </svg>

      <PortraitCutout src={personal.photo} name={personal.fullName} palette={palette} />

      <header className="absolute left-[440px] top-[49px] z-30 w-[305px] text-white">
        <h1
          className="whitespace-nowrap font-black uppercase leading-[0.95] tracking-[-0.025em]"
          style={{ fontSize: personal.fullName.length > 17 ? 31 : 38 }}
        >
          {personal.fullName || (locale === 'fr' ? 'VOTRE NOM' : 'YOUR NAME')}
        </h1>
        <p className="mt-[13px] whitespace-nowrap pl-[34px] font-semibold uppercase tracking-[0.06em] text-white/95" style={{ fontSize: personal.title.length > 27 ? 11.5 : 14 }}>{personal.title}</p>
      </header>

      <div data-design-motif="two-column-grid">
        <ContactSection data={data} palette={palette} locale={locale} />
        <SkillsAndExtras data={data} palette={palette} locale={locale} />
        <AboutSection data={data} palette={palette} locale={locale} />
        <EducationSection data={data} palette={palette} locale={locale} />
        <ExperienceSection data={data} palette={palette} locale={locale} />
      </div>

      <div data-design-motif="footer-url" className="absolute bottom-[35px] left-[51px] z-30 max-w-[250px] truncate text-[10px] font-black uppercase tracking-[0.03em] text-white">
        {personal.website || personal.linkedin || personal.email}
      </div>
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
