'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Heart,
  ListMusic,
  Shuffle,
  Loader2,
  Music,
  Check,
  Radio,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { PlayerState, StationConfig } from '@/types/types';
import { AudioPlayerActions } from '@/hooks/useAudioPlayer';

/* ── SVG Icons ─────────────────────────────────── */

function RewindIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M11 18.2V5.8L2.8 12L11 18.2ZM20.2 18.2V5.8L12 12L20.2 18.2Z" />
    </svg>
  );
}

function ForwardIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M3.8 18.2V5.8L12 12L3.8 18.2ZM13 18.2V5.8L21.2 12L13 18.2Z" />
    </svg>
  );
}

function PauseIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="5.5" y="4.5" width="4.5" height="15" rx="2.25" />
      <rect x="14" y="4.5" width="4.5" height="15" rx="2.25" />
    </svg>
  );
}

function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M6.5 4.8V19.2L18.5 12L6.5 4.8Z" />
    </svg>
  );
}

function AirPlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 14.5C4 10.6 7.3 7.5 12 7.5C16.7 7.5 20 10.6 20 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 14.5C7 12 9.2 10 12 10C14.8 10 17 12 17 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.8 14.5C9.8 13.5 10.8 12.5 12 12.5C13.2 12.5 14.2 13.5 14.2 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polygon points="12,13 16.5,19.5 7.5,19.5" fill="currentColor" />
    </svg>
  );
}

function SlidersIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <line x1="3" y1="8" x2="21" y2="8" />
      <circle cx="16" cy="8" r="2.5" fill="currentColor" stroke="none" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <circle cx="8" cy="16" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SpeakerIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10.8 4.6L6.2 8.3H3.8C3.1 8.3 2.5 8.9 2.5 9.6V14.4C2.5 15.1 3.1 15.7 3.8 15.7H6.2L10.8 19.4C11.4 19.9 12.3 19.4 12.3 18.6V5.4C12.3 4.6 11.4 4.1 10.8 4.6Z"
        fill="currentColor"
      />
      <path
        d="M15.5 9.2C16.4 10.1 16.9 11.2 16.9 12.5C16.9 13.8 16.4 14.9 15.5 15.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M18.8 6.5C20.4 8.1 21.3 10.2 21.3 12.5C21.3 14.8 20.4 16.9 18.8 18.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WaveformIcon({ className = '', isPlaying = false }: { className?: string; isPlaying?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2" y="10" width="2.2" height="4" rx="1" className={isPlaying ? 'anim-waveform-1' : ''} />
      <rect x="5.8" y="7" width="2.2" height="10" rx="1" className={isPlaying ? 'anim-waveform-2' : ''} />
      <rect x="9.6" y="4" width="2.2" height="16" rx="1" className={isPlaying ? 'anim-waveform-3' : ''} />
      <rect x="13.4" y="8" width="2.2" height="8" rx="1" className={isPlaying ? 'anim-waveform-4' : ''} />
      <rect x="17.2" y="5" width="2.2" height="14" rx="1" className={isPlaying ? 'anim-waveform-5' : ''} />
    </svg>
  );
}

/* ── Types ─────────────────────────────────────── */

interface NowPlayingProps {
  playerState: PlayerState;
  playerActions: AudioPlayerActions;
  station: StationConfig;
  started: boolean;
  onFirstPlay: () => void;
  isPlaylistOpen?: boolean;
  onTogglePlaylist?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const EQ_PRESETS = ['Flat', 'Bass Boost', 'Vocal Focus', 'Office Warmth', 'Studio HD'];

/* ── Component ─────────────────────────────────── */

export function NowPlaying({
  playerState,
  playerActions,
  station,
  started,
  onFirstPlay,
  isPlaylistOpen,
  onTogglePlaylist,
  isFavorite = false,
  onToggleFavorite,
}: NowPlayingProps) {
  const { currentSong, isPlaying, isShuffle, currentTime, duration, volume, isMuted, isLoading, error } =
    playerState;

  const fillRef = useRef<HTMLDivElement>(null);
  const fillRefMobile = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEqMenu, setShowEqMenu] = useState(false);
  const [showAirplayMenu, setShowAirplayMenu] = useState(false);
  const [localPreset, setLocalPreset] = useState<string>(playerState.activePreset || 'Flat');

  useEffect(() => {
    setLocalPreset(playerState.activePreset || 'Flat');
  }, [playerState.activePreset]);

  // Dynamic HSL color extraction from background image (fetching blob to avoid CORS canvas taint)
  const [accentHsl, setAccentHsl] = useState<{ h: number; s: number } | null>(null);
  const coverUrl = station.background || currentSong?.cover;

  useEffect(() => {
    if (!coverUrl) return;

    let isMounted = true;

    fetch(coverUrl)
      .then((res) => res.blob())
      .then((blob) => {
        if (!isMounted) return;
        const blobUrl = URL.createObjectURL(blob);
        const img = new window.Image();
        img.src = blobUrl;

        img.onload = () => {
          if (!isMounted) {
            URL.revokeObjectURL(blobUrl);
            return;
          }
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, 40, 40);
            const data = ctx.getImageData(0, 0, 40, 40).data;

            let maxSat = -1;
            let bestH = 265;
            let bestS = 50;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const sat = max - min;

              // Sample vibrant colorful pixels (sky, hoodie, sunset)
              if (sat > maxSat && max > 45 && min < 220) {
                maxSat = sat;
                let h = 0;
                const d = max - min;
                if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
                else if (max === g) h = (b - r) / d + 2;
                else if (max === b) h = (r - g) / d + 4;
                h = Math.round((h / 6) * 360);

                bestH = h;
                bestS = Math.min(75, Math.max(35, Math.round((sat / max) * 100)));
              }
            }

            if (maxSat > 15) {
              setAccentHsl({ h: bestH, s: bestS });
            }
          } catch {
            // Fallback
          } finally {
            URL.revokeObjectURL(blobUrl);
          }
        };
      })
      .catch(() => {
        // Fallback
      });

    return () => {
      isMounted = false;
    };
  }, [coverUrl]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.player-popover-area')) {
        setShowMoreMenu(false);
        setShowEqMenu(false);
        setShowAirplayMenu(false);
      }
    }
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (scrubbing) return;
    const f = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${f})`;
    if (fillRefMobile.current) fillRefMobile.current.style.transform = `scaleX(${f})`;
  }, [currentTime, duration, scrubbing]);

  const frac = useCallback((e: PointerEvent | React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  }, []);

  const preview = useCallback((f: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${f})`;
    if (fillRefMobile.current) fillRefMobile.current.style.transform = `scaleX(${f})`;
  }, []);

  const onDown = useCallback((e: React.PointerEvent) => {
    setScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    preview(frac(e));
  }, [frac, preview]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (scrubbing) preview(frac(e));
  }, [scrubbing, frac, preview]);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (!scrubbing) return;
    setScrubbing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const f = frac(e);
    if (duration > 0) playerActions.seek(duration * f);
  }, [scrubbing, frac, duration, playerActions]);

  const handlePlay = useCallback(() => {
    if (!started) onFirstPlay();
    else playerActions.togglePlay();
  }, [started, onFirstPlay, playerActions]);

  const hue = accentHsl ? accentHsl.h : 265;
  const sat = accentHsl ? accentHsl.s : 50;

  // Dark Card Background: Rich midnight dark hue matching background sky/accent (e.g. dark violet/purple)
  const cardBg = `hsla(${hue}, ${sat}%, 8%, 0.92)`;
  const cardBorder = `1px solid hsla(${hue}, ${sat}%, 55%, 0.22)`;

  // Outer Glass Player Background: Translucent dark glowing glass
  const outerBg = `hsla(${hue}, ${sat}%, 12%, 0.72)`;
  const outerBorder = `1px solid hsla(${hue}, ${sat}%, 60%, 0.25)`;

  // Dynamic Dialog Popover Background
  const popoverBg = `hsla(${hue}, ${sat}%, 13%, 0.95)`;
  const popoverBorder = `1px solid hsla(${hue}, ${sat}%, 60%, 0.22)`;

  /* ── Render ── */
  /* ── Helper ── */
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  /* ── Render ── */
  return (
    <div className="relative w-full flex justify-center player-popover-area select-none">
      <section
        aria-label="Music Player"
        className="flex items-center justify-between w-full max-w-[1100px] h-[68px] sm:h-[90px] rounded-[20px] sm:rounded-[24px] px-3 sm:px-6 relative group"
        style={{
          background: outerBg,
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          border: outerBorder,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          transition: 'background 500ms ease, border-color 500ms ease',
        }}
      >
        {/* MOBILE ONLY: Absolute Bottom Progress Bar */}
        <div 
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="absolute bottom-0 left-0 right-0 h-[14px] sm:hidden cursor-pointer touch-none flex items-end overflow-hidden rounded-b-[20px]"
        >
          <div className="w-full h-[3px] bg-white/10 relative">
            <div 
              ref={fillRefMobile}
              className="absolute top-0 left-0 bottom-0 w-full bg-white/80 origin-left"
              style={{
                transition: scrubbing ? 'none' : 'transform 75ms linear',
                transform: `scaleX(${duration > 0 ? currentTime / duration : 0})`,
              }}
            />
          </div>
        </div>

        {/* ── LEFT: Cover & Info ── */}
        <div className="flex items-center w-auto sm:w-[30%] min-w-0 shrink-1 gap-2.5 sm:gap-4">
          <div
            className="relative w-[44px] h-[44px] sm:w-[60px] sm:h-[60px] shrink-0 overflow-hidden bg-[#161520] rounded-lg sm:rounded-xl shadow-md"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {currentSong?.cover ? (
              <Image
                src={currentSong.cover}
                alt={currentSong.title || 'Album cover'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 44px, 60px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Music className="w-5 h-5 text-white/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 justify-center pr-2">
            <p className="text-[13px] sm:text-[15px] font-bold text-white leading-tight tracking-tight truncate">
              {currentSong?.title || 'Track Title'}
            </p>
            <p className="text-[11px] sm:text-[13px] font-medium text-white/55 leading-tight mt-0.5 truncate">
              {error ? <span className="text-red-400 font-normal">{error}</span> : (currentSong?.artist || 'Artist Name')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite?.()}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="hidden sm:block p-2 cursor-pointer bg-transparent border-none hover:scale-110 active:scale-95 transition-all shrink-0 ml-1"
          >
            <Heart
              className={`w-[18px] h-[18px] transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white/40 hover:text-white/80'
              }`}
            />
          </button>
        </div>

        {/* ── CENTER: Playback Controls & Progress (Desktop) ── */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 max-w-[460px] px-4">
          <div className="flex items-center gap-6 mb-1.5">
            <button
              type="button"
              onClick={playerActions.toggleShuffle}
              className={`p-1.5 cursor-pointer bg-transparent border-none transition-all hover:scale-110 active:scale-95 ${isShuffle ? 'text-amber-400' : 'text-white/40 hover:text-white/80'}`}
              title="Shuffle"
            >
              <Shuffle className="w-[18px] h-[18px]" />
            </button>
            <button
              type="button"
              onClick={playerActions.previous}
              className="text-white/70 p-1.5 cursor-pointer bg-transparent border-none hover:text-white hover:scale-110 active:scale-95 transition-all"
            >
              <RewindIcon className="w-[20px] h-[20px]" />
            </button>
            <button
              type="button"
              onClick={handlePlay}
              className="text-white p-2 cursor-pointer bg-white/10 hover:bg-white/20 border-none rounded-full active:scale-95 transition-all shadow-lg"
            >
              {isPlaying ? <PauseIcon className="w-[24px] h-[24px]" /> : <PlayIcon className="w-[24px] h-[24px] ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={playerActions.next}
              className="text-white/70 p-1.5 cursor-pointer bg-transparent border-none hover:text-white hover:scale-110 active:scale-95 transition-all"
            >
              <ForwardIcon className="w-[20px] h-[20px]" />
            </button>
            <button
              type="button"
              onClick={playerActions.toggleMute}
              className={`p-1.5 cursor-pointer bg-transparent border-none transition-all hover:scale-110 active:scale-95 ${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white/80'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <SpeakerIcon className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="flex items-center w-full gap-3">
            <span className="text-[10px] text-white/40 font-medium tabular-nums min-w-[32px] text-right">
              {formatTime(currentTime)}
            </span>
            <div
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              className="flex-1 h-[6px] rounded-full bg-white/10 hover:bg-white/15 cursor-pointer relative overflow-hidden group/seek touch-none"
            >
              <div
                ref={fillRef}
                className="absolute top-0 left-0 bottom-0 w-full rounded-full bg-white/50 group-hover/seek:bg-white transition-colors origin-left"
                style={{
                  transform: `scaleX(${duration > 0 ? currentTime / duration : 0})`,
                }}
              />
            </div>
            <span className="text-[10px] text-white/40 font-medium tabular-nums min-w-[32px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Desktop Volume & Playlist | Mobile Play Controls ── */}
        <div className="flex items-center justify-end sm:w-[30%] shrink-0 gap-1 sm:gap-4">
          
          {/* Mobile Only: Play/Pause */}
          <button
            type="button"
            onClick={handlePlay}
            className="sm:hidden text-white p-2 cursor-pointer bg-transparent border-none active:scale-95 transition-all"
          >
            {isPlaying ? <PauseIcon className="w-[26px] h-[26px]" /> : <PlayIcon className="w-[26px] h-[26px]" />}
          </button>

          {/* Desktop EQ */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowEqMenu(p => !p); setShowAirplayMenu(false); setShowMoreMenu(false); }}
              className="text-white/50 p-2 cursor-pointer bg-transparent border-none hover:text-white active:scale-95 transition-all hover:bg-white/5 rounded-full"
              title="Equalizer Settings"
            >
              <SlidersIcon className="w-[18px] h-[18px]" />
            </button>
            {showEqMenu && (
              <div style={{
                position: 'absolute', bottom: '100%', marginBottom: '16px', right: '-40px', width: '210px', zIndex: 50,
                background: popoverBg, backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
                border: popoverBorder, borderRadius: '18px',
                padding: '10px', boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
              }}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 pl-1">
                  <Sparkles className="w-3.5 h-3.5 text-white/80" />
                  <p className="text-[12px] font-bold text-white">Audio Presets</p>
                </div>
                <div className="flex flex-col gap-1">
                  {EQ_PRESETS.map((p) => (
                    <button key={p} type="button" onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        setLocalPreset(p);
                        if (playerActions && playerActions.setPreset) {
                          playerActions.setPreset(p as any); 
                        } else {
                          alert("Audio Engine not connected properly! Please do a HARD REFRESH (Ctrl+Shift+R).");
                        }
                        setShowEqMenu(false); 
                      }}
                      className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-white/10 ${localPreset === p ? 'text-white font-bold bg-white/10 border border-white/20' : 'text-white/60 font-medium border border-transparent'}`}
                    >
                      <span>{p}</span>
                      {localPreset === p && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Volume Slider */}
          <div className="hidden lg:flex items-center w-[90px] group/vol cursor-pointer gap-2" title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}>
             <input
                type="range" min="0" max="1" step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => playerActions.setVolume(parseFloat(e.target.value))}
                className="w-full h-[4px] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:opacity-0 group-hover/vol:[&::-webkit-slider-thumb]:opacity-100 transition-all"
                style={{
                  background: `linear-gradient(to right, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
          </div>

          <div className="w-[1px] h-6 bg-white/10 hidden sm:block mx-1"></div>

          {/* Playlist Button */}
          {onTogglePlaylist && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onTogglePlaylist(); }}
              className={`playlist-toggle-btn p-2 cursor-pointer rounded-full transition-all active:scale-95 border ${isPlaylistOpen ? 'bg-white/15 text-white border-white/20 shadow-inner' : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5'}`}
              aria-label="Toggle playlist"
              title="Playlist"
            >
              <ListMusic className="w-[20px] h-[20px] sm:w-[20px] sm:h-[20px]" />
            </button>
          )}

          {/* Mobile Heart (shows here instead of left) */}
          <button
            type="button"
            onClick={() => onToggleFavorite?.()}
            className="sm:hidden p-2 cursor-pointer bg-transparent border-none active:scale-95 transition-all"
          >
            <Heart className={`w-[20px] h-[20px] transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/40'}`} />
          </button>
        </div>
      </section>
    </div>
  );
}
