import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { CVRenderer } from '../cv/CVRenderer';
import { Button } from '../ui/ui';
import { cvFileName, exportElementToPdf } from '../../lib/pdf';
import {
  clearPendingCheckout,
  loadPendingCheckout,
  verifyGeniusPayPayment,
  type PendingCheckout,
} from '../../lib/payment';

/**
 * Gère le retour GeniusPay (?payment=success/error) et télécharge le CV sauvegardé
 * dans le navigateur avant la redirection paiement. Cela couvre aussi le mode simulation.
 */
export function PaymentReturnHandler() {
  // Capturé une seule fois : après nettoyage de l'URL, le bandeau doit rester visible.
  // GeniusPay peut revenir avec `?payment=success` OU seulement `?reference=...`
  // selon le parcours de paiement. Les deux doivent déclencher la vérification.
  const [returnParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const reference = params.get('reference') || params.get('transaction_id') || params.get('transaction');
    return {
      paymentState: payment || (reference ? 'success' : null),
      reference,
    };
  });
  const [pending] = useState<PendingCheckout | null>(() => loadPendingCheckout());
  const [status, setStatus] = useState<'idle' | 'checking' | 'downloading' | 'done' | 'error'>(
    returnParams.paymentState ? 'checking' : 'idle',
  );
  const [message, setMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (!returnParams.paymentState || didRun.current) return;
    didRun.current = true;

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('reference');
      url.searchParams.delete('transaction_id');
      url.searchParams.delete('transaction');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const run = async () => {
      if (returnParams.paymentState === 'error') {
        setStatus('error');
        setMessage('Le paiement a été annulé ou refusé. Vous pouvez relancer le téléchargement depuis le créateur de CV.');
        cleanUrl();
        return;
      }

      const referenceToVerify = returnParams.reference || pending?.reference;

      if (!pending?.cv?.personalInfo || !referenceToVerify) {
        setStatus('error');
        setMessage('Paiement détecté, mais le CV à télécharger n’a pas été retrouvé sur cet appareil. Rouvrez le CV puis cliquez sur Télécharger.');
        cleanUrl();
        return;
      }

      try {
        setStatus('checking');
        const result = await verifyGeniusPayPayment(referenceToVerify);
        if (!result.paid) {
          setStatus('error');
          setMessage(`Paiement non confirmé pour le moment. Statut actuel : ${result.status || 'pending'}. Cliquez sur le bouton ci-dessous après confirmation.`);
          cleanUrl();
          return;
        }

        setStatus('downloading');
        // Laisser React rendre le CV invisible avant capture PDF.
        await new Promise((resolve) => setTimeout(resolve, 250));
        if (!previewRef.current) throw new Error('Aperçu PDF indisponible.');
        await exportElementToPdf(previewRef.current, cvFileName(pending.cv.personalInfo.fullName));
        clearPendingCheckout();
        setStatus('done');
        setMessage('Paiement confirmé. Le téléchargement du CV a été lancé automatiquement.');
        cleanUrl();
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Impossible de vérifier le paiement ou de télécharger le CV.');
        cleanUrl();
      }
    };

    run();
  }, [returnParams, pending]);

  if (!returnParams.paymentState || status === 'idle') return null;

  const retryDownload = async () => {
    if (!pending?.reference) return;
    setMessage('');
    setStatus('checking');
    try {
      const result = await verifyGeniusPayPayment(pending.reference);
      if (!result.paid) {
        setStatus('error');
        setMessage(`Paiement non confirmé pour le moment. Statut actuel : ${result.status || 'pending'}.`);
        return;
      }
      setStatus('downloading');
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (!previewRef.current) throw new Error('Aperçu PDF indisponible.');
      await exportElementToPdf(previewRef.current, cvFileName(pending.cv.personalInfo.fullName));
      clearPendingCheckout();
      setStatus('done');
      setMessage('Téléchargement relancé.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Impossible de relancer le téléchargement.');
    }
  };

  return (
    <>
      {pending && (
        <div className="pointer-events-none fixed -left-[10000px] top-0 w-[794px] bg-white opacity-0">
          <CVRenderer
            ref={previewRef}
            data={pending.cv}
            templateId={pending.templateId}
            accent={pending.accent}
            locale={pending.locale}
          />
        </div>
      )}

      <div className="fixed inset-x-4 top-24 z-[120] mx-auto max-w-xl rounded-2xl border border-ink-100 bg-white p-4 shadow-2xl no-print">
        <div className="flex items-start gap-3">
          {status === 'done' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : status === 'error' ? (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          ) : (
            <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-brand-600" />
          )}
          <div className="flex-1">
            <p className="font-display text-base font-extrabold text-ink-950">
              {status === 'done'
                ? 'CV téléchargé'
                : status === 'error'
                  ? 'Téléchargement à confirmer'
                  : 'Vérification du paiement'}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              {message || 'Nous vérifions le paiement et lançons le téléchargement du CV automatiquement…'}
            </p>
            {status === 'error' && pending?.reference && (
              <Button className="mt-3" onClick={retryDownload}>
                Vérifier encore et télécharger
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
