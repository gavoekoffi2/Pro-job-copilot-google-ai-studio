import { Check } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { TEMPLATES, ACCENT_PRESETS } from '../../data/templates';
import { TemplateThumb } from '../cv/TemplateThumb';
import { useT } from '../../i18n/LanguageContext';
import { cn } from '../../lib/utils';

const NEW_PREMIUM_TEMPLATE_IDS = new Set<TemplateId>(['atlas', 'volta', 'aurora', 'heritage']);

export function DesignPanel({
  templateId,
  setTemplateId,
  accent,
  setAccent,
  data,
  locale,
  fontScale,
  setFontScale,
}: {
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  accent: string;
  setAccent: (c: string) => void;
  data: CVData;
  locale: Locale;
  fontScale: number;
  setFontScale: (scale: number) => void;
}) {
  const t = useT();
  const orderedTemplates = [...TEMPLATES].sort((a, b) => {
    const aIsNew = NEW_PREMIUM_TEMPLATE_IDS.has(a.id);
    const bIsNew = NEW_PREMIUM_TEMPLATE_IDS.has(b.id);
    return Number(bIsNew) - Number(aIsNew);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
              {locale === 'fr' ? 'Taille des textes' : 'Text size'}
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              {locale === 'fr' ? 'Agrandissez ou réduisez les écritures du CV.' : 'Increase or reduce the CV text size.'}
            </p>
          </div>
          <output className="min-w-12 rounded-lg bg-white px-2 py-1 text-center text-sm font-extrabold text-ink-800 shadow-sm">
            {Math.round(fontScale * 100)}%
          </output>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs font-bold text-ink-500">A−</span>
          <input
            type="range"
            min="0.9"
            max="1.15"
            step="0.05"
            value={fontScale}
            onChange={(event) => setFontScale(Number(event.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label={locale === 'fr' ? 'Taille des textes du CV' : 'CV text size'}
          />
          <span className="text-sm font-black text-ink-700">A+</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
          {t.builder.design.accent}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110',
                accent.toLowerCase() === c.toLowerCase() ? 'ring-ink-900' : 'ring-transparent',
              )}
              style={{ background: c }}
              aria-label={c}
            >
              {accent.toLowerCase() === c.toLowerCase() && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
          <label
            className="relative grid h-8 w-8 cursor-pointer place-items-center overflow-hidden rounded-full border border-ink-200 bg-white text-[10px] font-bold text-ink-500"
            title="Couleur personnalisée"
          >
            +
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
            {t.builder.design.template}
          </h3>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700">
            {locale === 'fr'
              ? `${TEMPLATES.length} modèles · 4 nouveaux`
              : `${TEMPLATES.length} templates · 4 new`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {orderedTemplates.map((tpl) => {
            const active = tpl.id === templateId;
            const isNew = NEW_PREMIUM_TEMPLATE_IDS.has(tpl.id);
            return (
              <button
                key={tpl.id}
                onClick={() => setTemplateId(tpl.id)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-white text-left transition-all',
                  active
                    ? 'border-brand-500 ring-2 ring-brand-500/30'
                    : 'border-ink-200 hover:border-ink-300 hover:shadow-md',
                )}
              >
                <div className="overflow-hidden border-b border-ink-100">
                  <TemplateThumb
                    templateId={tpl.id}
                    data={data}
                    accent={active ? accent : tpl.accent}
                    locale={locale}
                    width={170}
                    className="w-full"
                  />
                </div>
                <div className="px-2.5 py-1.5">
                  <p className="text-xs font-bold text-ink-900">{tpl.name}</p>
                  <p className="text-[10px] text-ink-400">{tpl.category}</p>
                </div>
                {isNew && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-ink-950 shadow-sm">
                    {locale === 'fr' ? 'Nouveau' : 'New'}
                  </span>
                )}
                {active && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
