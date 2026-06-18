import { forwardRef } from 'react';
import type { CVData, Locale, TemplateId } from '../../types';
import type { TemplateProps } from './cvParts';
import {
  SahelTemplate,
  DakarTemplate,
  ExecutiveTemplate,
  LagosTemplate,
} from './templates/set1';
import {
  MinimalTemplate,
  KigaliTemplate,
  AbidjanTemplate,
  HorizonTemplate,
} from './templates/set2';
import {
  EclatTemplate,
  ClassicTemplate,
  TechTemplate,
  NairobiTemplate,
} from './templates/set3';
import { ZurichTemplate, AccraTemplate, CasablancaTemplate } from './templates/set4';
import { CapetownTemplate, MontrealTemplate, SavaneTemplate } from './templates/set5';

const REGISTRY: Record<TemplateId, (p: TemplateProps) => React.JSX.Element> = {
  sahel: SahelTemplate,
  dakar: DakarTemplate,
  executive: ExecutiveTemplate,
  lagos: LagosTemplate,
  minimal: MinimalTemplate,
  kigali: KigaliTemplate,
  abidjan: AbidjanTemplate,
  horizon: HorizonTemplate,
  eclat: EclatTemplate,
  classic: ClassicTemplate,
  tech: TechTemplate,
  nairobi: NairobiTemplate,
  zurich: ZurichTemplate,
  accra: AccraTemplate,
  casablanca: CasablancaTemplate,
  capetown: CapetownTemplate,
  montreal: MontrealTemplate,
  savane: SavaneTemplate,
};

interface CVRendererProps {
  templateId: TemplateId;
  data: CVData;
  accent: string;
  locale: Locale;
}

/**
 * Rend un CV au format A4 (794px de large). La `ref` pointe sur le nœud
 * pleine taille, utilisé tel quel pour l'export PDF (rendu net).
 */
export const CVRenderer = forwardRef<HTMLDivElement, CVRendererProps>(
  ({ templateId, data, accent, locale }, ref) => {
    const Template = REGISTRY[templateId] ?? SahelTemplate;
    return (
      <div ref={ref} className="origin-top bg-white">
        <Template data={data} accent={accent} locale={locale} />
      </div>
    );
  },
);

CVRenderer.displayName = 'CVRenderer';
