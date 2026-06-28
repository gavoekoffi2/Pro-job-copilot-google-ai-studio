/* Petites fonctions utilitaires partagées. */

/** Concatène des classes conditionnelles (façon `clsx` minimaliste). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Identifiant court unique pour les éléments de liste. */
export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Borne une valeur entre min et max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Initiales à partir d'un nom complet (ex. "Awa Diallo" -> "AD"). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Convertit un fichier en data URL base64. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Sépare la partie base64 pure d'une data URL. */
export function stripDataUrlPrefix(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return { mimeType: 'application/octet-stream', data: dataUrl };
  return { mimeType: match[1], data: match[2] };
}

/**
 * Redimensionne une image (scan/photo de CV) et la réencode en JPEG.
 * Objectif : rester sous la limite de taille de requête (fonction Netlify ~6 Mo)
 * tout en gardant une résolution suffisante pour l'OCR. On ne fait jamais
 * d'upscale (l'échelle est bornée à 1).
 */
function downscaleImage(file: File, maxDim = 3000, quality = 0.92): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      if (!width || !height) {
        reject(new Error('Image illisible'));
        return;
      }
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas indisponible'));
        return;
      }
      // Fond blanc : les PNG transparents deviendraient noirs en JPEG.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossible de charger l'image"));
    };
    img.src = objectUrl;
  });
}

/**
 * Prépare un fichier (CV) pour l'envoi à l'IA : les images sont compressées /
 * redimensionnées pour fiabiliser l'OCR et éviter de dépasser la limite de
 * requête ; les autres fichiers (PDF) sont transmis tels quels.
 */
export async function fileToUploadPayload(
  file: File,
): Promise<{ mimeType: string; data: string }> {
  if (file.type.startsWith('image/')) {
    try {
      const dataUrl = await downscaleImage(file);
      return stripDataUrlPrefix(dataUrl);
    } catch {
      /* Repli sur le fichier d'origine si le redimensionnement échoue. */
    }
  }
  return stripDataUrlPrefix(await fileToDataUrl(file));
}

/** Convertit un CVData en texte lisible (pour l'analyse / l'adaptation). */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
