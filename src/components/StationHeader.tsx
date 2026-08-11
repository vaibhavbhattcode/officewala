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
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-3 sm:py-4 grid grid-cols-3 items-center gap-2">
        {/* Left: Clock */}
        <div className="flex flex-col items-start pointer-events-auto min-w-0 justify-self-start">
          <span
            className="font-extrabold text-xs sm:text-base md:text-lg tracking-wide text-white tabular-nums leading-tight truncate w-full"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          >
            {clock.time}
          </span>
          <span
            className="text-[9px] sm:text-[11px] text-white/70 tracking-[0.1em] sm:tracking-[0.18em] uppercase font-bold mt-0.5 truncate w-full"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.85)' }}
          >
            {clock.day} <span className="hidden sm:inline">·</span> {clock.date}
          </span>
        </div>

        {/* Center: Live Office Listeners Badge */}
        <div className="pointer-events-auto flex items-center justify-center justify-self-center">
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-emerald-500/35 bg-black/55 backdrop-blur-2xl shadow-xl shadow-black/50 hover:border-emerald-400/50 transition-colors max-w-full overflow-hidden"
            title="Real-time listeners active in the office"
          >
            {/* Pulsing Emerald Radar Dot */}
            <div className="relative flex items-center justify-center flex-none w-2 sm:w-2.5 h-2 sm:h-2.5">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              <span className="absolute inset-0 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400/60 animate-ping" />
            </div>

            {/* Listener count number */}
            <span className="font-black text-[11px] sm:text-sm text-white tabular-nums tracking-tight">
              {listenerCount}
            </span>

            {/* Location Label */}
            <span className="text-[9px] sm:text-[11px] text-emerald-300 font-extrabold tracking-wider uppercase hidden md:inline truncate">
              {station.locationText}
            </span>
          </div>
        </div>

        {/* Right: Premium Favorites Button */}
        <div className="flex items-center justify-end pointer-events-auto min-w-0 justify-self-end">
          <button
            type="button"
            onClick={onToggleFavoritesMode}
            className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full border transition-all duration-200 cursor-pointer shadow-xl ${
              isFavoritesMode
                ? 'bg-red-950/60 border-red-400/80 text-white shadow-red-500/30 ring-2 ring-red-500/40'
                : 'bg-black/50 border-white/20 text-white/90 hover:text-white hover:bg-black/70 hover:border-white/40'
            }`}
            style={{ backdropFilter: 'blur(24px)' }}
            aria-label="Toggle favorites station mode"
            title={isFavoritesMode ? 'Favorites Mode: Active (Click for All Songs)' : 'Play Liked Songs Only'}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-[15px] sm:h-[15px] transition-transform group-active:scale-90 ${
                isFavoritesMode ? 'fill-red-500 text-red-500' : 'text-white/60 group-hover:text-red-400'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wide uppercase hidden sm:inline">
              {isFavoritesMode ? 'Favorites' : 'Favorites'}
            </span>
            {favoritesCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tabular-nums transition-colors hidden sm:flex ${
                  isFavoritesMode ? 'bg-red-500/20 text-red-400' : 'bg-white/15 text-white'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
});
