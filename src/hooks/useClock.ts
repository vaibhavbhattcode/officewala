'use client';

import { useState, useEffect } from 'react';

interface ClockState {
  time: string;
  day: string;
  date: string;
}

function formatClock(): ClockState {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ];

  return {
    time: `${displayHours}:${displayMinutes} ${ampm}`,
    day: days[now.getDay()],
    date: `${now.getDate()} ${months[now.getMonth()]}`,
  };
}

export function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({ time: '', day: '', date: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setClock(formatClock()); // Initial update on mount

    const interval = setInterval(() => {
      setClock(formatClock());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return { time: '', day: '', date: '' };
  }

  return clock;
}
