import { FREE_WATERMARK } from './downloadPolicy';

/**
 * Exporte un nœud DOM (le CV rendu au format A4) en PDF multi-pages haute qualité.
 * Le nœud doit avoir une largeur proche de 794px (A4 @ 96dpi) pour un rendu net.
 *
 * jsPDF et html2canvas sont importés dynamiquement : ils ne sont téléchargés
 * qu'au premier export, ce qui allège fortement le chargement initial.
 */

const UNSUPPORTED_COLOR_FUNCTIONS = /(oklch|oklab|color-mix)\(/i;
const OKLCH_RE = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg|rad|turn)?(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;
const OKLAB_RE = /oklab\(\s*([\d.]+%?)\s+(-?[\d.]+%?)\s+(-?[\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function formatRgbChannel(value: number) {
  return Math.round(clamp01(value) * 255);
}

function parsePercentOrNumber(value: string, percentBase = 1) {
  if (value.endsWith('%')) return (parseFloat(value) / 100) * percentBase;
  return parseFloat(value);
}

function linearSrgbToSrgb(value: number) {
  return value >= 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;
}

function oklchToRgbString(match: string, lightness: string, chroma: string, hue: string, alpha?: string) {
  const l = parsePercentOrNumber(lightness);
  const c = parseFloat(chroma);
  const h = (parseFloat(hue) * Math.PI) / 180;

  if ([l, c, h].some((value) => Number.isNaN(value))) return match;

  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = lPrime ** 3;
  const m3 = mPrime ** 3;
  const s3 = sPrime ** 3;

  const rLinear = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const r = formatRgbChannel(linearSrgbToSrgb(rLinear));
  const g = formatRgbChannel(linearSrgbToSrgb(gLinear));
  const blue = formatRgbChannel(linearSrgbToSrgb(bLinear));

  if (alpha) {
    const parsedAlpha = parsePercentOrNumber(alpha);
    return `rgba(${r}, ${g}, ${blue}, ${clamp01(parsedAlpha)})`;
  }

  return `rgb(${r}, ${g}, ${blue})`;
}

function oklabToRgbString(match: string, lightness: string, greenRed: string, blueYellow: string, alpha?: string) {
  const l = parsePercentOrNumber(lightness);
  const a = parsePercentOrNumber(greenRed, 0.4);
  const b = parsePercentOrNumber(blueYellow, 0.4);

  if ([l, a, b].some((value) => Number.isNaN(value))) return match;

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = lPrime ** 3;
  const m3 = mPrime ** 3;
  const s3 = sPrime ** 3;

  const rLinear = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const r = formatRgbChannel(linearSrgbToSrgb(rLinear));
  const g = formatRgbChannel(linearSrgbToSrgb(gLinear));
  const blue = formatRgbChannel(linearSrgbToSrgb(bLinear));

  if (alpha) {
    const parsedAlpha = parsePercentOrNumber(alpha);
    return `rgba(${r}, ${g}, ${blue}, ${clamp01(parsedAlpha)})`;
  }

  return `rgb(${r}, ${g}, ${blue})`;
}

function replaceUnsupportedColorFunctions(value: string) {
  if (!value || !UNSUPPORTED_COLOR_FUNCTIONS.test(value)) return value;
  return value
    .replace(OKLCH_RE, oklchToRgbString)
    .replace(OKLAB_RE, oklabToRgbString)
    .replace(/color-mix\([^)]*\)/gi, 'transparent');
}

function sanitizeInlineStyle(target: Element) {
  const htmlTarget = target as HTMLElement | SVGElement;
  const styleAttribute = target.getAttribute('style');
  if (styleAttribute && UNSUPPORTED_COLOR_FUNCTIONS.test(styleAttribute)) {
    target.setAttribute('style', replaceUnsupportedColorFunctions(styleAttribute));
  }

  const targetStyle = htmlTarget.style;
  for (let index = targetStyle.length - 1; index >= 0; index -= 1) {
    const property = targetStyle.item(index);
    const value = targetStyle.getPropertyValue(property);
    if (UNSUPPORTED_COLOR_FUNCTIONS.test(value)) {
      const normalizedValue = replaceUnsupportedColorFunctions(value);
      targetStyle.setProperty(property, normalizedValue || 'initial', targetStyle.getPropertyPriority(property));
    }
  }
}

function copyPdfSafeStyles(source: Element, target: Element) {
  sanitizeInlineStyle(target);

  const computed = window.getComputedStyle(source);
  const targetStyle = (target as HTMLElement | SVGElement).style;

  // Tailwind v4 exposes its palette as inherited CSS custom properties using
  // oklch(). html2canvas parses those declarations even when the final color
  // property was already normalized, so override every unsupported custom
  // property on the capture-only clone with an RGB-safe equivalent.
  for (const property of computed) {
    if (!property.startsWith('--')) continue;
    const value = computed.getPropertyValue(property);
    if (UNSUPPORTED_COLOR_FUNCTIONS.test(value)) {
      targetStyle.setProperty(property, replaceUnsupportedColorFunctions(value), 'important');
    }
  }

  const colorProperties = [
    'color',
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'fill',
    'stroke',
    'caretColor',
    'columnRuleColor',
  ];

  for (const property of colorProperties) {
    const value = replaceUnsupportedColorFunctions(computed.getPropertyValue(property));
    if (value) targetStyle.setProperty(property, value, 'important');
  }

  const backgroundImage = computed.getPropertyValue('background-image');
  targetStyle.setProperty(
    'background-image',
    UNSUPPORTED_COLOR_FUNCTIONS.test(backgroundImage) ? 'none' : replaceUnsupportedColorFunctions(backgroundImage),
    'important',
  );

  const boxShadow = computed.getPropertyValue('box-shadow');
  targetStyle.setProperty(
    'box-shadow',
    UNSUPPORTED_COLOR_FUNCTIONS.test(boxShadow) ? 'none' : replaceUnsupportedColorFunctions(boxShadow),
    'important',
  );

  const textShadow = computed.getPropertyValue('text-shadow');
  targetStyle.setProperty(
    'text-shadow',
    UNSUPPORTED_COLOR_FUNCTIONS.test(textShadow) ? 'none' : replaceUnsupportedColorFunctions(textShadow),
    'important',
  );

  targetStyle.setProperty('animation', 'none', 'important');
  targetStyle.setProperty('transition', 'none', 'important');
  targetStyle.setProperty('scrollbar-color', 'auto', 'important');
}

function addFreePreviewWatermark(clone: HTMLElement, width: number, height: number) {
  if (window.getComputedStyle(clone).position === 'static') clone.style.position = 'relative';
  clone.style.overflow = 'hidden';

  const overlay = document.createElement('div');
  overlay.setAttribute('data-free-preview-watermark', 'true');
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.zIndex = '2147483647';
  overlay.style.width = `${width}px`;
  overlay.style.height = `${height}px`;
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'space-around';
  overlay.style.overflow = 'hidden';
  overlay.style.pointerEvents = 'none';
  overlay.style.userSelect = 'none';

  for (let row = 0; row < FREE_WATERMARK.rows; row += 1) {
    const line = document.createElement('div');
    line.textContent = `${FREE_WATERMARK.text}     ${FREE_WATERMARK.text}`;
    line.style.width = '140%';
    line.style.marginLeft = '-20%';
    line.style.whiteSpace = 'nowrap';
    line.style.textAlign = 'center';
    line.style.fontFamily = 'Arial, sans-serif';
    line.style.fontSize = `${FREE_WATERMARK.fontSize}px`;
    line.style.fontWeight = '900';
    line.style.letterSpacing = '4px';
    line.style.lineHeight = '1';
    line.style.color = `rgba(100, 100, 100, ${FREE_WATERMARK.opacity})`;
    line.style.transform = `rotate(${FREE_WATERMARK.rotation}deg)`;
    line.style.transformOrigin = 'center';
    line.style.textShadow = '0 0 1px rgba(255,255,255,0.45)';
    overlay.appendChild(line);
  }

  clone.appendChild(overlay);
}

function buildPdfSafeClone(element: HTMLElement, watermark = false) {
  const clone = element.cloneNode(true) as HTMLElement;
  const originalNodes = [element, ...Array.from(element.querySelectorAll('*'))];
  const clonedNodes = [clone, ...Array.from(clone.querySelectorAll('*'))];

  originalNodes.forEach((source, index) => {
    const target = clonedNodes[index];
    if (target) copyPdfSafeStyles(source, target);
  });

  clone.style.width = `${element.scrollWidth || element.offsetWidth}px`;
  clone.style.minHeight = `${element.scrollHeight || element.offsetHeight}px`;
  clone.style.backgroundColor = '#ffffff';

  if (watermark) {
    addFreePreviewWatermark(
      clone,
      element.scrollWidth || element.offsetWidth,
      element.scrollHeight || element.offsetHeight,
    );
  }

  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-pdf-safe-export', 'true');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.zIndex = '-1';
  wrapper.style.background = '#ffffff';
  wrapper.style.pointerEvents = 'none';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return { wrapper, clone };
}

export async function exportElementToPdf(
  element: HTMLElement,
  fileName = 'cv.pdf',
  options: { watermark?: boolean } = {},
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const { wrapper, clone } = buildPdfSafeClone(element, options.watermark === true);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: clone.scrollWidth,
      onclone: (documentClone) => {
        const cloneView = documentClone.defaultView;
        documentClone.querySelectorAll('[data-pdf-safe-export], [data-pdf-safe-export] *').forEach((node) => {
          const htmlNode = node as HTMLElement;
          const styleAttribute = htmlNode.getAttribute('style');
          if (styleAttribute && UNSUPPORTED_COLOR_FUNCTIONS.test(styleAttribute)) {
            htmlNode.setAttribute('style', replaceUnsupportedColorFunctions(styleAttribute));
          }

          // html2canvas applies the document stylesheets again in its own clone.
          // Normalize the resulting computed declarations too (rings, alpha
          // utilities and Tailwind color-mix values otherwise reintroduce oklab).
          if (cloneView) {
            const computed = cloneView.getComputedStyle(htmlNode);
            for (const property of computed) {
              const value = computed.getPropertyValue(property);
              if (!UNSUPPORTED_COLOR_FUNCTIONS.test(value)) continue;
              const safeValue = property === 'background-image'
                ? 'none'
                : replaceUnsupportedColorFunctions(value);
              htmlNode.style.setProperty(property, safeValue || 'initial', 'important');
            }
          }

          htmlNode.style.setProperty('animation', 'none', 'important');
          htmlNode.style.setProperty('transition', 'none', 'important');
          htmlNode.style.setProperty('box-shadow', replaceUnsupportedColorFunctions(htmlNode.style.boxShadow), 'important');
          htmlNode.style.setProperty('text-shadow', replaceUnsupportedColorFunctions(htmlNode.style.textShadow), 'important');
          if (UNSUPPORTED_COLOR_FUNCTIONS.test(htmlNode.style.backgroundImage)) {
            htmlNode.style.setProperty('background-image', 'none', 'important');
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Hauteur de l'image rapportée à la largeur d'une page A4.
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Pages supplémentaires si le contenu dépasse une page.
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    wrapper.remove();
  }
}

/** Nettoie un nom de fichier à partir du nom de la personne. */
export function cvFileName(fullName: string): string {
  const base = fullName.trim().replace(/\s+/g, '_').replace(/[^\w\-]/g, '') || 'CV';
  return `CV_${base}.pdf`;
}
