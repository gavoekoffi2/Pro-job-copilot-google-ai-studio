import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx';
import type { CVData, Locale } from '../types';
import { dateRange } from '../components/cv/cvParts';

const NAVY = '153B63';
const CYAN = '63B6D2';
const TEXT = '334155';

function sectionTitle(label: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 110 },
    border: { bottom: { color: CYAN, style: BorderStyle.SINGLE, size: 12, space: 5 } },
    shading: { type: ShadingType.CLEAR, fill: 'EAF5F8' },
    children: [new TextRun({ text: label.toUpperCase(), bold: true, color: NAVY, size: 24 })],
  });
}

function detailLine(text: string, options: { bold?: boolean; italic?: boolean } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: 50 },
    children: [new TextRun({ text, color: TEXT, size: 20, ...options })],
  });
}

function descriptionParagraphs(text: string): Paragraph[] {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) return lines.map((line) => detailLine(line));
  return lines.map((line) => new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 45 },
    children: [new TextRun({ text: line, color: TEXT, size: 20 })],
  }));
}

function safeFileName(name: string): string {
  const clean = name.trim().replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '-').replace(/^-+|-+$/g, '');
  return `CV-${clean || 'JobTask-AI'}.docx`;
}

export async function exportCvToWord(data: CVData, locale: Locale): Promise<void> {
  const fr = locale === 'fr';
  const labels = fr
    ? { profile: 'Profil', experience: 'Expériences', education: 'Formations', skills: 'Compétences', languages: 'Langues', certifications: 'Certifications', interests: "Centres d’intérêt" }
    : { profile: 'Profile', experience: 'Experience', education: 'Education', skills: 'Skills', languages: 'Languages', certifications: 'Certifications', interests: 'Interests' };
  const p = data.personalInfo;
  const contact = [p.email, p.phone, p.address, p.linkedin, p.website].filter(Boolean).join('  •  ');
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 70 },
      children: [new TextRun({ text: p.fullName || (fr ? 'VOTRE NOM' : 'YOUR NAME'), bold: true, color: NAVY, size: 38 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: p.title, bold: true, color: CYAN, size: 24 })],
    }),
  ];

  if (contact) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [new TextRun({ text: contact, color: TEXT, size: 18 })],
    }));
  }

  if (p.summary) children.push(sectionTitle(labels.profile), detailLine(p.summary));

  if (data.experiences.length) {
    children.push(sectionTitle(labels.experience));
    data.experiences.forEach((item) => {
      children.push(new Paragraph({
        spacing: { before: 90, after: 35 },
        keepNext: true,
        children: [
          new TextRun({ text: item.title, bold: true, color: NAVY, size: 22 }),
          new TextRun({ text: `  |  ${dateRange(item, locale)}`, bold: true, color: CYAN, size: 19 }),
        ],
      }));
      children.push(detailLine([item.company, item.location].filter(Boolean).join(' · '), { italic: true }));
      children.push(...descriptionParagraphs(item.description));
    });
  }

  if (data.education.length) {
    children.push(sectionTitle(labels.education));
    data.education.forEach((item) => {
      children.push(new Paragraph({
        spacing: { before: 90, after: 35 },
        keepNext: true,
        children: [
          new TextRun({ text: item.degree, bold: true, color: NAVY, size: 22 }),
          new TextRun({ text: item.year ? `  |  ${item.year}` : '', bold: true, color: CYAN, size: 19 }),
        ],
      }));
      children.push(detailLine([item.school, item.location].filter(Boolean).join(' · '), { italic: true }));
      if (item.description) children.push(...descriptionParagraphs(item.description));
    });
  }

  if (data.skills.length) {
    children.push(sectionTitle(labels.skills));
    children.push(detailLine(data.skills.map((skill) => `${skill.name}${skill.level ? ` (${skill.level})` : ''}`).join('  •  ')));
  }

  if (data.languages.length) {
    children.push(sectionTitle(labels.languages));
    children.push(detailLine(data.languages.map((language) => `${language.name}${language.level ? ` — ${language.level}` : ''}`).join('  •  ')));
  }

  if (data.certifications.length) {
    children.push(sectionTitle(labels.certifications));
    data.certifications.forEach((item) => {
      children.push(detailLine([item.name, item.issuer, item.year].filter(Boolean).join(' · '), { bold: true }));
    });
  }

  if (data.interests.length) {
    children.push(sectionTitle(labels.interests), detailLine(data.interests.join('  •  ')));
  }

  const document = new Document({
    creator: 'JobTask AI',
    title: `CV ${p.fullName}`,
    description: 'CV professionnel éditable généré par JobTask AI',
    styles: {
      default: { document: { run: { font: 'Aptos', size: 20, color: TEXT }, paragraph: { spacing: { line: 276 } } } },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = safeFileName(p.fullName);
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
