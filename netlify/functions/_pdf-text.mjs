import { PDFParse } from 'pdf-parse';

function cleanExtractedText(value) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n')
    .trim();
}

/** Extrait localement la couche texte d'un PDF numérique, sans intervention IA. */
export async function extractEmbeddedPdfText(file) {
  if (!file?.base64Data || !String(file?.mimeType || '').toLowerCase().includes('pdf')) return '';

  let parser;
  try {
    const data = new Uint8Array(Buffer.from(file.base64Data, 'base64'));
    parser = new PDFParse({ data });
    const result = await parser.getText();
    return cleanExtractedText(result?.text);
  } catch {
    // PDF scanné, chiffré ou non standard : l'appelant basculera vers l'OCR visuel.
    return '';
  } finally {
    await parser?.destroy().catch(() => {});
  }
}
