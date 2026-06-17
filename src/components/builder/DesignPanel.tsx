import { Check } from 'lucide-react';
import type { CVData, Locale, TemplateId } from '../../types';
import { TEMPLATES, ACCENT_PRESETS } from '../../data/templates';
import { TemplateThumb } from '../cv/TemplateThumb';
import { useT } from '../../i18n/LanguageContext';
import { cn } from '../../lib/utils';

export function DesignPanel({
  templateId,
  setTemplateId,
  accent,
  setAccent,
  data,
  locale,
}: {
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  accent: string;
  setAccent: (c: string) => void;
  data: CVData;
  locale: Locale;
}) {
  const t = useT();
  return (
    <div className="space-y-6">
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
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
          {t.builder.design.template}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TEMPLATES.map((tpl) => {
            const active = tpl.id === templateId;
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
