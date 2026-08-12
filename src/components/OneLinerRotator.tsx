'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCw } from 'lucide-react';

interface OneLinerRotatorProps {
  oneLiners: string[];
  intervalMs?: number;
}

export function OneLinerRotator({ oneLiners, intervalMs = 15000 }: OneLinerRotatorProps) {
  const [index, setIndex] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextLiner = useCallback(() => {
    if (oneLiners.length <= 1) return;
    setIsSwapping(true);

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % oneLiners.length);
      setIsSwapping(false);
    }, 240);
  }, [oneLiners.length]);

  const handleManualNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    nextLiner();
    timerRef.current = setInterval(nextLiner, intervalMs);
  }, [nextLiner, intervalMs]);

  useEffect(() => {
    if (oneLiners.length <= 1) return;
    timerRef.current = setInterval(nextLiner, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [oneLiners.length, intervalMs, nextLiner]);

  if (!oneLiners || oneLiners.length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto px-4 text-center select-none shrink-0">
      <p
        className="inline-flex items-center justify-center gap-2 text-center font-medium tracking-wide text-white/80 leading-relaxed"
        style={{
          fontSize: 'clamp(0.84rem, 2vw, 0.98rem)',
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
        }}
      >
        <span
          className={`bumper-text transition-opacity duration-200 ${isSwapping ? 'is-swapping opacity-0' : 'opacity-100'}`}
          style={{ textWrap: 'balance' }}
        >
          {oneLiners[index]}
        </span>
      </p>
    </div>
  );
}
