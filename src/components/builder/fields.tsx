import { ChevronDown, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

const inputBase =
  'w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold text-ink-600">{children}</label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(inputBase, 'resize-y leading-relaxed')}
      />
    </div>
  );
}

/** Section repliable du formulaire. */
export function Collapse({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-ink-50"
      >
        <span className="flex items-center gap-2.5 font-display text-[15px] font-bold text-ink-900">
          {icon && <span className="text-brand-600">{icon}</span>}
          {title}
          {badge}
        </span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-ink-400 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="space-y-4 border-t border-ink-100 px-4 py-4">{children}</div>}
    </div>
  );
}

/** Carte d'élément de liste (expérience, formation…) avec bouton supprimer. */
export function ItemCard({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="relative space-y-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
      <button
        onClick={onRemove}
        className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
    >
      + {label}
    </button>
  );
}
