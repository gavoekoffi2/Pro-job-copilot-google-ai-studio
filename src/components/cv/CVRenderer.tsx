import { forwardRef } from 'react';
import type { CVData, Locale, TemplateId } from '../../types';
import type { TemplateProps } from './cvParts';
import {
  TechTemplate,
  NairobiTemplate,
} from './templates/set3';
import { ZurichTemplate, AccraTemplate, CasablancaTemplate } from './templates/set4';
import { CapetownTemplate, MontrealTemplate, SavaneTemplate } from './templates/set5';
import { LomeTemplate, KpalimeTemplate, MaritimeTemplate } from './templates/set6';
import { AtlasTemplate, VoltaTemplate, AuroraTemplate, HeritageTemplate } from './templates/set7';
import {
  RefWaveTemplate,
  RefTealGeometryTemplate,
  RefNavyOrbitTemplate,
  RefGoldWaveTemplate,
  RefCitrusTemplate,
  RefBlueRingsTemplate,
  RefGoldenRibbonTemplate,
  RefRecruiterTemplate,
  RefAngularTemplate,
  RefTealDotsTemplate,
} from './templates/referencePremium';

const REGISTRY: Record<TemplateId, (p: TemplateProps) => React.JSX.Element> = {
  sahel: RefWaveTemplate,
  dakar: RefTealGeometryTemplate,
  executive: RefNavyOrbitTemplate,
  lagos: RefGoldWaveTemplate,
  minimal: RefCitrusTemplate,
  kigali: RefBlueRingsTemplate,
  abidjan: RefGoldenRibbonTemplate,
  horizon: RefRecruiterTemplate,
  eclat: RefAngularTemplate,
  classic: RefTealDotsTemplate,
  tech: TechTemplate,
  nairobi: NairobiTemplate,
  zurich: ZurichTemplate,
  accra: AccraTemplate,
  casablanca: CasablancaTemplate,
  capetown: CapetownTemplate,
  montreal: MontrealTemplate,
  savane: SavaneTemplate,
  lome: LomeTemplate,
  kpalime: KpalimeTemplate,
  maritime: MaritimeTemplate,
  atlas: AtlasTemplate,
  volta: VoltaTemplate,
  aurora: AuroraTemplate,
  heritage: HeritageTemplate,
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
    const Template = REGISTRY[templateId] ?? RefWaveTemplate;
    const renderData = data.personalInfo.showPhoto === false
      ? { ...data, personalInfo: { ...data.personalInfo, photo: '__HIDE_PHOTO__' } }
      : data;
    return (
      <div ref={ref} className="origin-top bg-white">
        <Template data={renderData} accent={accent} locale={locale} />
      </div>
    );
  },
);

CVRenderer.displayName = 'CVRenderer';
