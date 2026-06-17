/* =========================================================================
   Imagerie — 100 % talents africains.
   Photos Pexels (licence gratuite) vérifiées comme disponibles.
   Chaque consommateur d'image prévoit un fallback (dégradé) en cas d'échec.
   ========================================================================= */

/** Construit une URL Pexels optimisée (compression + recadrage). */
export function pexels(id: number, w: number, h?: number): string {
  const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  const params = new URLSearchParams({
    auto: 'compress',
    cs: 'tinysrgb',
    w: String(w),
    dpr: '2',
  });
  if (h) {
    params.set('h', String(h));
    params.set('fit', 'crop');
  }
  return `${base}?${params.toString()}`;
}

/** Photos « héros » (portraits verticaux de professionnels africains). */
export const HERO_IMAGES = {
  womanOrange: 5717310, // cadre en blazer orange, bureau en hauteur
  manVest: 3874040, // jeune pro en gilet, ordinateur + café
  manSuitSmile: 7446937, // homme souriant en costume, téléphone
  womanAfro: 3727474, // femme à l'ordinateur, lunettes
} as const;

/** Photos de sections (scènes professionnelles plus larges). */
export const SCENE_IMAGES = {
  team: 9301197, // équipe autour d'un ordinateur
  office: 30688593, // groupe en bureau moderne
  deskMan: 10376240, // homme au bureau, planification
  duoStreet: 12179674, // deux cadres, téléphone, extérieur
} as const;

/** Visages pour les témoignages (recadrage carré). */
export const FACE_IMAGES = {
  amenan: 7446937,
  kwame: 3874040,
  fatou: 3727474,
  zainab: 7876449,
  ange: 5717310,
} as const;

export function face(id: number, size = 160): string {
  return pexels(id, size, size);
}

/** Dégradé de repli si une image ne se charge pas. */
export const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #064e3b 0%, #047857 45%, #f59e0b 130%)';

/**
 * Pose un fond dégradé sur le conteneur parent quand l'image échoue,
 * pour un repli élégant plutôt qu'une image cassée.
 */
export function onImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  img.style.visibility = 'hidden';
  const parent = img.parentElement;
  if (parent) {
    parent.style.background = FALLBACK_GRADIENT;
  }
}
