export { ApexCorporate } from './ApexCorporate';
export { ExecutiveSuite } from './ExecutiveSuite';
export { VegaModern } from './VegaModern';
export { NexusDark } from './NexusDark';
export { AuraGradient } from './AuraGradient';
export { BlancMinimal } from './BlancMinimal';
export { NordicClean } from './NordicClean';
export { PrestigePhoto } from './PrestigePhoto';
export { CanvasCreative } from './CanvasCreative';
export { DiamondElite } from './DiamondElite';
export { TechStackPro } from './TechStackPro';
export { HorizonBold } from './HorizonBold';

import { CVData } from '@/types/cv';
import { ApexCorporate } from './ApexCorporate';
import { ExecutiveSuite } from './ExecutiveSuite';
import { VegaModern } from './VegaModern';
import { NexusDark } from './NexusDark';
import { AuraGradient } from './AuraGradient';
import { BlancMinimal } from './BlancMinimal';
import { NordicClean } from './NordicClean';
import { PrestigePhoto } from './PrestigePhoto';
import { CanvasCreative } from './CanvasCreative';
import { DiamondElite } from './DiamondElite';
import { TechStackPro } from './TechStackPro';
import { HorizonBold } from './HorizonBold';

type TemplateComponent = React.ComponentType<{ cv: CVData }>;

export const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  'apex-corporate': ApexCorporate,
  'executive-suite': ExecutiveSuite,
  'vega-purple': VegaModern,
  'nexus-dark': NexusDark,
  'aura-gradient': AuraGradient,
  'blanc-minimal': BlancMinimal,
  'nordic-clean': NordicClean,
  'prestige-photo': PrestigePhoto,
  'canvas-creative': CanvasCreative,
  'diamond-elite': DiamondElite,
  'techstack-pro': TechStackPro,
  'horizon-bold': HorizonBold,
};
