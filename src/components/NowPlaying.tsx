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
  ImageIcon,
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
  currentBackgroundUrl?: string;
  onNextBackground?: () => void;
}

/* ── Component ─────────────────────────────────── */

export function NowPlaying({
  playerState,
  playerActions,
  station,
  started = true,
  onFirstPlay,
  isPlaylistOpen = false,
  onTogglePlaylist,
  isFavorite = false,
  onToggleFavorite,
  currentBackgroundUrl,
  onNextBackground,
}: NowPlayingProps) {
  const { currentSong, isPlaying, isShuffle, currentTime, duration, volume, isMuted, isLoading, error } =
    playerState;

  const seekRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAirplayMenu, setShowAirplayMenu] = useState(false);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Element;
      if (target.closest('.ignore-click-outside')) return;
      
      setShowMoreMenu(false);
      setShowAirplayMenu(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Dynamic HSL color extraction from background image (fetching blob to avoid CORS canvas taint)
  const [accentHsl, setAccentHsl] = useState<{ h: number; s: number } | null>(null);
  // If the background is a video, use the song cover for color extraction instead
  const activeBg = currentBackgroundUrl || station.background;
  const isVideoBg = activeBg?.match(/\.(mp4|webm)$/i);
  const coverUrl = isVideoBg ? currentSong?.cover : (activeBg || currentSong?.cover);

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
    if (knobRef.current) knobRef.current.style.left = `${f * 100}%`;
  }, [currentTime, duration, scrubbing]);

  const frac = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!seekRef.current) return 0;
    const r = seekRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  }, []);

  const preview = useCallback((f: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${f})`;
    if (knobRef.current) knobRef.current.style.left = `${f * 100}%`;
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
  const cardBorder = '1px solid transparent';

  const outerBg = `hsla(${hue}, ${sat}%, 12%, 0.72)`;
  const outerBorder = '1px solid transparent';

  const popoverBg = `hsla(${hue}, ${sat}%, 13%, 0.95)`;
  const popoverBorder = '1px solid rgba(255, 255, 255, 0.08)';

  /* ── Render ── */
  return (
    <div className="relative w-full flex justify-center player-popover-area select-none">

      {/* ════════ OUTER GLASS PILL ════════ */}
      <section
        aria-label="Music Player"
        className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-[850px] max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-80px)] h-auto sm:h-[86px] rounded-[24px] sm:rounded-[44px] p-3 sm:p-0 sm:px-[42px] transition-all duration-500 relative"
        style={{
          background: outerBg,
          backdropFilter: 'blur(18px) saturate(130%)',
          WebkitBackdropFilter: 'blur(18px) saturate(130%)',
          border: outerBorder,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28)',
        }}
      >

        {/* ── DESKTOP LEFT: Utility Controls (Heart, Background, Volume) ── */}
        <div className="hidden sm:flex items-center gap-[32px] shrink-0 order-1 pr-4">
          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite?.()}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{ padding: '3px', cursor: 'pointer', background: 'none', border: 'none' }}
            className="hover:scale-105 active:scale-95 transition-all"
          >
            <Heart
              className={`w-[22px] h-[22px] transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white/65 hover:text-white'
              }`}
            />
          </button>

          {/* Change Background Button */}
          <button
            type="button"
            onClick={onNextBackground}
            aria-label="Change Background" title="Change Background"
            style={{ color: 'rgba(255,255,255,0.65)', padding: '3px', cursor: 'pointer', background: 'none', border: 'none' }}
            className="hover:text-white active:scale-95 transition-all ignore-click-outside outline-none focus:outline-none"
          >
            <ImageIcon className="w-[22px] h-[22px]" />
          </button>

          {/* Volume */}
          <div
            style={{
              position: 'relative', display: 'flex', alignItems: 'center',
              width: showVolumePopup ? '100px' : '26px',
              background: showVolumePopup ? 'rgba(255,255,255,0.07)' : 'transparent',
              borderRadius: '999px',
              border: showVolumePopup ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
              padding: showVolumePopup ? '1px 5px' : '0',
              transition: 'width 300ms ease, background 300ms ease, border 300ms ease, padding 300ms ease',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setShowVolumePopup(true)}
            onMouseLeave={() => setShowVolumePopup(false)}
          >
            <button
              type="button"
              onClick={playerActions.toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : `Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              style={{ color: 'rgba(255,255,255,0.65)', padding: '3px', cursor: 'pointer', flexShrink: 0, background: 'none', border: 'none' }}
              className="hover:text-white active:scale-95 transition-all"
            >
              <SpeakerIcon className="w-[22px] h-[22px]" />
            </button>
            <div style={{
              flex: 1, paddingRight: '5px', display: 'flex', alignItems: 'center',
              opacity: showVolumePopup ? 1 : 0,
              transition: 'opacity 200ms ease',
              transitionDelay: showVolumePopup ? '60ms' : '0ms',
              pointerEvents: showVolumePopup ? 'auto' : 'none',
            }}>
              <input
                type="range" min="0" max="1" step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => playerActions.setVolume(parseFloat(e.target.value))}
                className="w-full h-[3px] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
                style={{
                  background: `linear-gradient(to right, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.18) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
                aria-label="Volume slider"
              />
            </div>
          </div>
        </div>

        {/* ── CENTER: Dark Track Card (Top on Mobile) ── */}
        <div className="w-full sm:flex-1 min-w-0 flex justify-center sm:mx-[30px] relative order-1 sm:order-2">
          <div className="flex items-center w-full sm:w-[460px] max-w-full h-[60px] sm:h-[68px] rounded-[16px] sm:rounded-[18px] px-3 sm:px-[14px] gap-3 sm:gap-[12px] transition-all duration-500" style={{ background: cardBg, border: cardBorder }}>
            {/* Album Art */}
            <div className="relative w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-[10px] overflow-hidden shrink-0 bg-[#161520] border border-white/5">
              {currentSong?.cover ? (
                <Image src={currentSong.cover} alt="Cover" fill className="object-cover" sizes="50px" priority />
              ) : (
                <div className="flex items-center justify-center h-full"><Music className="w-[18px] h-[18px] text-white/25" /></div>
              )}
            </div>
            
            {/* Text + Progress */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[13px] sm:text-[14px] font-bold text-white leading-[18px] tracking-tight truncate m-0">
                {error ? <span className="text-red-400 font-normal">{error}</span> : (currentSong?.title || 'Rusuk')}
                {isLoading && <Loader2 className="inline-block animate-spin text-amber-400 w-3 h-3 ml-1.5" />}
              </p>
              <p className="text-[10px] sm:text-[11px] font-medium text-white/50 leading-[16px] mt-[2px] truncate m-0">
                {currentSong?.artist || 'Gery & Gany'}
              </p>
              {/* Progress */}
              <div ref={seekRef} role="slider" tabIndex={0} aria-label="Seek" aria-valuemin={0} aria-valuemax={100} aria-valuenow={duration > 0 ? Math.round((currentTime / duration) * 100) : 0} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} className="w-full h-[16px] flex items-center mt-[2px] cursor-pointer relative group outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
                <div className="w-full h-[4px] rounded-full bg-white/15 relative">
                  <div ref={fillRef} className="h-full rounded-full bg-white/90 origin-left transition-transform duration-75 linear" />
                  {/* Knob */}
                  <div 
                    ref={knobRef}
                    className="absolute top-1/2 w-[12px] h-[12px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ transform: 'translate(-50%, -50%)' }} 
                  />
                </div>
              </div>
            </div>

            {/* Right: Waveform + More */}
            <div className="flex items-center gap-2 sm:gap-[16px] shrink-0 pl-1 sm:pl-[8px] relative">
              <WaveformIcon isPlaying={isPlaying} className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ${isPlaying ? 'text-white' : 'text-white/30'}`} />
              <button type="button" onClick={(e) => { e.stopPropagation(); setShowMoreMenu(p => !p); setShowAirplayMenu(false); }} aria-label="More" title="Song options" className="text-white/45 hover:text-white transition-colors bg-transparent border-none p-[2px] cursor-pointer ignore-click-outside outline-none focus:outline-none">
                <MoreHorizontal className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* More popover */}
              {showMoreMenu && (
                <div className="absolute bottom-[calc(100%+12px)] right-0 sm:-right-2 w-[220px] z-50 rounded-[18px] p-2 transition-all ignore-click-outside" style={{ background: popoverBg, backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: popoverBorder, boxShadow: '0 16px 40px rgba(0,0,0,0.55)' }}>
                  <div className="px-[10px] py-[6px] border-b border-white/10 mb-1">
                    <p className="text-[12px] font-bold text-white truncate m-0">{currentSong?.title || 'Track Info'}</p>
                    <p className="text-[10px] text-white/50 truncate m-0">{currentSong?.artist || 'Office Waala'}</p>
                  </div>
                  {onToggleFavorite && (
                    <button type="button" onClick={() => { onToggleFavorite(); setShowMoreMenu(false); }} className="w-full flex items-center text-left hover:bg-white/10 transition-all gap-2 px-[10px] py-[7px] text-[11px] font-semibold text-white/85 rounded-[11px] bg-transparent border-none cursor-pointer outline-none focus:outline-none">
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/60'}`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  )}
                  <button type="button" onClick={() => { playerActions.toggleShuffle(); setShowMoreMenu(false); }} className="w-full flex items-center text-left hover:bg-white/10 transition-all gap-2 px-[10px] py-[7px] text-[11px] font-semibold text-white/85 rounded-[11px] bg-transparent border-none cursor-pointer outline-none focus:outline-none">
                    <Shuffle className={`w-3.5 h-3.5 ${isShuffle ? 'text-white font-bold' : 'text-white/60'}`} />
                    {isShuffle ? 'Shuffle: Enabled' : 'Shuffle: Disabled'}
                  </button>
                  {onTogglePlaylist && (
                    <button type="button" onClick={() => { onTogglePlaylist(); setShowMoreMenu(false); }} className="w-full flex items-center text-left hover:bg-white/10 transition-all gap-2 px-[10px] py-[7px] text-[11px] font-semibold text-white/85 rounded-[11px] bg-transparent border-none cursor-pointer outline-none focus:outline-none">
                      <ListMusic className="w-3.5 h-3.5 text-white/60" />
                      {isPlaylistOpen ? 'Hide Playlist' : 'Show Playlist'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP RIGHT: Playback Controls (Prev, Play/Pause, Next) ── */}
        <div className="hidden sm:flex items-center gap-[26px] shrink-0 order-3">
          <button type="button" onClick={playerActions.previous} aria-label="Previous" title="Previous" className="text-white/70 hover:text-white active:scale-95 transition-all bg-transparent border-none p-[3px] cursor-pointer outline-none focus:outline-none">
            <RewindIcon className="w-[22px] h-[22px]" />
          </button>
          <button type="button" onClick={handlePlay} aria-label="Play/Pause" title={isPlaying ? 'Pause' : 'Play'} className="text-white/80 hover:text-white active:scale-95 transition-all bg-transparent border-none p-[3px] cursor-pointer outline-none focus:outline-none">
            {isPlaying ? <PauseIcon className="w-[22px] h-[22px]" /> : <PlayIcon className="w-[22px] h-[22px]" />}
          </button>
          <button type="button" onClick={playerActions.next} aria-label="Next" title="Next" className="text-white/70 hover:text-white active:scale-95 transition-all bg-transparent border-none p-[3px] cursor-pointer outline-none focus:outline-none">
            <ForwardIcon className="w-[22px] h-[22px]" />
          </button>
        </div>

        {/* ── MOBILE ROW 2: All Controls ── */}
        <div className="flex sm:hidden w-full items-center mt-4 mb-2 order-3 relative h-[32px]">
          <div className="flex items-center gap-4 absolute left-2 top-1/2 -translate-y-1/2">
            {/* Mobile Heart */}
            <button type="button" onClick={() => onToggleFavorite?.()} className="active:scale-95 transition-all bg-transparent border-none p-1 cursor-pointer outline-none focus:outline-none">
              <Heart className={`w-[20px] h-[20px] transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/65 hover:text-white'}`} />
            </button>
            
            {/* Mobile Change Background */}
            <button type="button" onClick={onNextBackground} className="text-white/65 hover:text-white active:scale-95 transition-all bg-transparent border-none p-1 cursor-pointer ignore-click-outside outline-none focus:outline-none">
              <ImageIcon className="w-[20px] h-[20px]" />
            </button>
          </div>

          {/* Mobile Playback Controls (Centered Perfectly) */}
          <div className="flex items-center gap-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button type="button" onClick={playerActions.previous} className="text-white/70 hover:text-white active:scale-95 transition-all bg-transparent border-none p-1 cursor-pointer outline-none focus:outline-none">
              <RewindIcon className="w-[20px] h-[20px]" />
            </button>
            <button type="button" onClick={handlePlay} className="text-white hover:text-white active:scale-95 transition-all bg-transparent border-none p-1 cursor-pointer outline-none focus:outline-none">
              {isPlaying ? <PauseIcon className="w-[28px] h-[28px]" /> : <PlayIcon className="w-[28px] h-[28px]" />}
            </button>
            <button type="button" onClick={playerActions.next} className="text-white/70 hover:text-white active:scale-95 transition-all bg-transparent border-none p-1 cursor-pointer outline-none focus:outline-none">
              <ForwardIcon className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
