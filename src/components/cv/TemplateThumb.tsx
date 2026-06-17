import type { CVData, Locale, TemplateId } from '../../types';
import { CVRenderer } from './CVRenderer';

const A4_W = 794;
const A4_H = 1123;

/** Aperçu miniature non interactif d'un template (CVRenderer mis à l'échelle). */
export function TemplateThumb({
  templateId,
  data,
  accent,
  locale,
  width = 260,
  className,
}: {
  templateId: TemplateId;
  data: CVData;
  accent: string;
  locale: Locale;
  width?: number;
  className?: string;
}) {
  const scale = width / A4_W;
  return (
    <div
      className={className}
      style={{
        width,
        height: A4_H * scale,
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-hidden
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: A4_W,
          height: A4_H,
          pointerEvents: 'none',
        }}
      >
        <CVRenderer templateId={templateId} data={data} accent={accent} locale={locale} />
      </div>
    </div>
  );
}
