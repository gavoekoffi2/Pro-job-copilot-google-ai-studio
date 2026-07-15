/**
 * Calcule le nombre de pages A4 nécessaires pour une image de CV.
 *
 * Le rendu A4 web (794 × 1123 px) donne 297,015 mm après conversion,
 * soit un dépassement purement dû aux arrondis par rapport aux 297 mm de
 * jsPDF. La tolérance empêche ce reliquat sub-pixel de créer une page vide.
 */
export function pdfPageCount(
  imageHeightMm: number,
  pageHeightMm: number,
  roundingToleranceMm = 0.5,
): number {
  if (!Number.isFinite(imageHeightMm) || imageHeightMm <= 0) return 1;
  if (!Number.isFinite(pageHeightMm) || pageHeightMm <= 0) return 1;

  const effectiveHeight = Math.max(0, imageHeightMm - roundingToleranceMm);
  return Math.max(1, Math.ceil(effectiveHeight / pageHeightMm));
}
