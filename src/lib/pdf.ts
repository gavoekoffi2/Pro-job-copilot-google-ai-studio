/**
 * Exporte un nœud DOM (le CV rendu au format A4) en PDF multi-pages haute qualité.
 * Le nœud doit avoir une largeur proche de 794px (A4 @ 96dpi) pour un rendu net.
 *
 * jsPDF et html2canvas sont importés dynamiquement : ils ne sont téléchargés
 * qu'au premier export, ce qui allège fortement le chargement initial.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName = 'cv.pdf',
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
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
}

/** Nettoie un nom de fichier à partir du nom de la personne. */
export function cvFileName(fullName: string): string {
  const base = fullName.trim().replace(/\s+/g, '_').replace(/[^\w\-]/g, '') || 'CV';
  return `CV_${base}.pdf`;
}
