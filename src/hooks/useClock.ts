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
  const [clock, setClock] = useState<ClockState>(formatClock());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync immediately on client mount to fix any server/client time mismatch
    setClock(formatClock());
    
    // Update every second to guarantee real-time accuracy without lag
    const interval = setInterval(() => {
      setClock(formatClock());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch by returning a clean state during SSR
  if (!mounted) {
    return { time: '', day: '', date: '' };
  }

  return clock;
}
