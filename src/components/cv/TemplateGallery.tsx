'use client';

import { motion } from 'framer-motion';
import { Check, Camera, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { CV_TEMPLATES, SAMPLE_CV, type CVTemplate } from '@/types/cv';
import { TEMPLATE_COMPONENTS } from './templates';

const CATEGORY_COLORS: Record<string, string> = {
  Corporate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Executive: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Modern:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Creative:  'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Minimal:   'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

// ─── Thumbnail Preview ────────────────────────────────────────
function TemplateThumbnail({ templateId, accentColor }: { templateId: string; accentColor: string }) {
  const TemplateComp = TEMPLATE_COMPONENTS[templateId];
  if (!TemplateComp) return null;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Scale the 794px template down to fit ~190px wide */}
      <div style={{ transform: 'scale(0.24)', transformOrigin: 'top left', width: 794, height: 1123, pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }}>
        <TemplateComp cv={{ ...SAMPLE_CV, templateId }} />
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────
function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: CVTemplate;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(template.id)}
      className={clsx(
        'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300',
        selected
          ? 'ring-2 ring-purple-500 shadow-glow'
          : 'ring-1 ring-white/8 hover:ring-white/20'
      )}
    >
      {/* Preview area */}
      <div
        className="relative overflow-hidden bg-white"
        style={{ height: 190, width: '100%' }}
      >
        <TemplateThumbnail templateId={template.id} accentColor={template.accentColor} />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {/* Selected badge */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center shadow-glow"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Photo badge */}
        {template.hasPhoto && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
            <Camera className="w-3 h-3" />
            Photo
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-[#0f0f1a] border-t border-white/8">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">{template.name}</h3>
            <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{template.description}</p>
          </div>
          <span className={clsx('shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border', CATEGORY_COLORS[template.category])}>
            {template.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────
interface TemplateGalleryProps {
  selectedId: string;
  onSelect: (id: string) => void;
  mode?: 'grid' | 'sidebar';
}

const CATEGORIES = ['Tous', 'Corporate', 'Executive', 'Modern', 'Creative', 'Minimal'];

export function TemplateGallery({ selectedId, onSelect, mode = 'grid' }: TemplateGalleryProps) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CV_TEMPLATES.map((template, i) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={template.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar version (narrower) ──────────────────────────────
export function TemplateSidebar({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {CV_TEMPLATES.map((template) => {
        const TemplateComp = TEMPLATE_COMPONENTS[template.id];
        const selected = template.id === selectedId;
        return (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelect(template.id)}
            className={clsx(
              'group relative rounded-xl overflow-hidden cursor-pointer transition-all',
              selected ? 'ring-2 ring-purple-500 shadow-glow' : 'ring-1 ring-white/8 hover:ring-white/20'
            )}
          >
            <div className="relative overflow-hidden bg-white" style={{ height: 120 }}>
              {TemplateComp && (
                <div style={{ transform: 'scale(0.15)', transformOrigin: 'top left', width: 794, height: 1123, pointerEvents: 'none', position: 'absolute' }}>
                  <TemplateComp cv={{ ...SAMPLE_CV, templateId: template.id }} />
                </div>
              )}
              {selected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="px-3 py-2 bg-[#0f0f1a]">
              <div className="text-xs font-bold text-white">{template.name}</div>
              <div className="text-[10px] text-white/40">{template.category}{template.hasPhoto ? ' · Photo' : ''}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
