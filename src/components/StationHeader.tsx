'use client';

import { memo } from 'react';
import { Heart, Radio } from 'lucide-react';
import { StationConfig } from '@/types/types';
import { useClock } from '@/hooks/useClock';
import { useFirebasePresence } from '@/hooks/useFirebasePresence';

interface StationHeaderProps {
  station: StationConfig;
  favoritesCount: number;
  isFavoritesMode: boolean;
  onToggleFavoritesMode: () => void;
}

export const StationHeader = memo(function StationHeader({
  station,
  favoritesCount,
  isFavoritesMode,
  onToggleFavoritesMode,
}: StationHeaderProps) {
  const clock = useClock();
  const listenerCount = useFirebasePresence();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full pointer-events-none">
      <div className="flex justify-between sm:block w-full p-4 sm:p-0">
        {/* Left: Clock */}
        <div className="pointer-events-auto flex flex-col items-start z-10 sm:absolute sm:top-4 sm:left-8">
          <span
            className="font-[var(--font-space-grotesk)] font-medium text-sm sm:text-base md:text-lg tracking-tight text-white/70 tabular-nums leading-none"
            style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)' }}
          >
            {clock.time}
          </span>
          <span
            className="text-[9px] sm:text-[10px] text-white/45 font-normal tracking-[0.18em] uppercase mt-1 whitespace-nowrap"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}
          >
            {clock.day} · {clock.date}
          </span>
        </div>

        {/* Right on mobile, Center on desktop: Live Office Listeners Badge */}
        <div className="pointer-events-auto flex items-start sm:items-center justify-center z-20 sm:absolute sm:top-4 sm:left-1/2 sm:-translate-x-1/2">
        <div
          className="inline-flex items-center gap-2 sm:gap-2.5 px-4 py-1.5 rounded-full select-none transition-all duration-300"
          style={{
            background: 'rgba(18, 16, 28, 0.65)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
          }}
          title="Real-time listeners active in the office"
        >
          {/* Pulsing Emerald Radar Dot */}
          <div className="relative flex items-center justify-center flex-none w-2 h-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80" />
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400/70 animate-ping" />
          </div>

          {/* Listener count number */}
          <span className="font-extrabold text-xs sm:text-sm text-white tabular-nums tracking-tight">
            {listenerCount}
          </span>

          {/* Location Label */}
          <span className="text-[10px] sm:text-[11px] text-white/85 font-bold tracking-[0.12em] uppercase">
            {station.locationText}
          </span>
        </div>
        </div>
      </div>
    </header>
  );
});
