'use client';

import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 25,
  className,
  onComplete,
  cursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setDone(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={clsx('whitespace-pre-wrap', className)}>
      {displayed}
      {cursor && !done && (
        <span className="inline-block w-0.5 h-5 bg-purple-400 ml-0.5 align-middle animate-[typewriter-cursor_0.8s_step-end_infinite]" />
      )}
    </span>
  );
}

interface HeroTypewriterProps {
  phrases: string[];
  className?: string;
}

export function HeroTypewriter({ phrases, className }: HeroTypewriterProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const phrase = phrases[currentPhrase];

    if (!isDeleting && displayed.length < phrase.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(phrase.slice(0, displayed.length + 1));
      }, 60);
    } else if (!isDeleting && displayed.length === phrase.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, 30);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, currentPhrase, phrases]);

  return (
    <span className={clsx('inline-block min-w-[2ch]', className)}>
      {displayed}
      <span className="animate-[typewriter-cursor_0.8s_step-end_infinite] text-purple-400">|</span>
    </span>
  );
}
