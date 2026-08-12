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
    <header className="fixed top-0 left-0 right-0 z-30 w-full select-none pointer-events-none">
      {/* Left: Clock */}
      <div 
        className="absolute top-4 left-4 sm:left-8 pointer-events-auto flex flex-col items-start z-10 select-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-300"
        style={{
          background: 'rgba(18, 16, 28, 0.45)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        }}
      >
        <span
          suppressHydrationWarning
          className="font-[var(--font-space-grotesk)] font-medium text-sm sm:text-base md:text-lg tracking-tight text-white/90 tabular-nums leading-none"
        >
          {clock.time}
        </span>
        <span
          suppressHydrationWarning
          className="text-[9px] sm:text-[10px] text-white/60 font-normal tracking-[0.18em] uppercase mt-1 whitespace-nowrap"
        >
          {clock.day} · {clock.date}
        </span>
      </div>

      {/* Center on Desktop, Right on Mobile: Live Office Listeners Badge */}
      <div className="pointer-events-auto fixed top-4 right-4 translate-x-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 flex items-center justify-center z-20">
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

      {/* Top Right on Desktop, Below Live Badge on Mobile: Favorites Toggle */}
      <div className="pointer-events-auto fixed top-16 right-4 sm:top-4 sm:right-8 z-20 flex items-center justify-end">
        <button
          onClick={onToggleFavoritesMode}
          className={`group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-300 cursor-pointer ${
            isFavoritesMode 
              ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
              : 'bg-[rgba(18,16,28,0.45)] border-[rgba(255,255,255,0.1)] text-white/80 hover:text-white'
          }`}
          style={{
            backdropFilter: 'blur(16px) saturate(140%)',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: isFavoritesMode ? undefined : '0 4px 16px rgba(0, 0, 0, 0.25)',
          }}
          title={isFavoritesMode ? "Disable Favorites Only Mode" : "Play Only My Favorites"}
        >
          <Heart className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform group-active:scale-95 ${isFavoritesMode ? 'fill-current text-red-500' : ''}`} />
          <span className="text-xs sm:text-sm font-bold tabular-nums leading-none mb-[1px]">
            {favoritesCount}
          </span>
        </button>
      </div>
    </header>
  );
});
