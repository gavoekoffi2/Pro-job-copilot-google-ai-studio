'use client';

import { motion } from 'framer-motion';
import { Sparkles, Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { AILoadingSkeleton } from '@/components/ui/SkeletonLoader';

interface AIStreamOutputProps {
  content: string;
  isLoading?: boolean;
  title?: string;
  className?: string;
  allowCopy?: boolean;
  allowDownload?: boolean;
  downloadFilename?: string;
  preformatted?: boolean;
}

export function AIStreamOutput({
  content,
  isLoading = false,
  title = 'AI Result',
  className,
  allowCopy = true,
  allowDownload = false,
  downloadFilename = 'ai-result.txt',
  preformatted = false,
}: AIStreamOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={clsx('glass rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white/80">{title}</span>
        </div>
        {content && !isLoading && (
          <div className="flex items-center gap-2">
            {allowCopy && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <AILoadingSkeleton />
        ) : content ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {preformatted ? (
              <pre className="prose-ai text-white/85 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {content}
              </pre>
            ) : (
              <div className="prose-ai text-white/85 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-white/30">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">AI output will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
