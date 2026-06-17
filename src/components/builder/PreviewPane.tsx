import { forwardRef, useEffect, useRef, useState } from 'react';
import type { CVData, Locale, TemplateId } from '../../types';
import { CVRenderer } from '../cv/CVRenderer';

const A4_W = 794;
const A4_H = 1123;

interface PreviewPaneProps {
  data: CVData;
  templateId: TemplateId;
  accent: string;
  locale: Locale;
}

/**
 * Affiche le CV à l'échelle pour tenir dans la colonne d'aperçu.
 * La `ref` est transmise au nœud CVRenderer pleine taille (export PDF net).
 */
export const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(
  ({ data, templateId, accent, locale }, ref) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);

    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      const update = () => {
        const w = el.clientWidth;
        setScale(Math.min(w / A4_W, 1));
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return (
      <div ref={wrapRef} className="w-full">
        <div
          className="mx-auto overflow-hidden rounded-xl shadow-2xl ring-1 ring-ink-200"
          style={{ width: A4_W * scale, height: A4_H * scale }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: A4_W,
            }}
          >
            <CVRenderer ref={ref} templateId={templateId} data={data} accent={accent} locale={locale} />
          </div>
        </div>
      </div>
    );
  },
);

PreviewPane.displayName = 'PreviewPane';
