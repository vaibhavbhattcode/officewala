'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useOneLiner(oneLiners: string[], intervalMs: number = 15000): string {
  const [current, setCurrent] = useState(() =>
    oneLiners.length > 0 ? oneLiners[Math.floor(Math.random() * oneLiners.length)] : ''
  );
  const lastIndexRef = useRef<number>(-1);

  const getNextOneLiner = useCallback(() => {
    if (oneLiners.length === 0) return '';
    if (oneLiners.length === 1) return oneLiners[0];

    let nextIndex: number;
    do {
      nextIndex = Math.floor(Math.random() * oneLiners.length);
    } while (nextIndex === lastIndexRef.current);

    lastIndexRef.current = nextIndex;
    return oneLiners[nextIndex];
  }, [oneLiners]);

  useEffect(() => {
    if (oneLiners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent(getNextOneLiner());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [oneLiners, intervalMs, getNextOneLiner]);

  return current;
}
