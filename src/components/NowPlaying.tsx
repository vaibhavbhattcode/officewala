'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  ListMusic,
  Volume2,
  VolumeX,
  Volume1,
  Loader2,
  Heart,
  Music,
} from 'lucide-react';
import Image from 'next/image';
import { PlayerState, StationConfig } from '@/types/types';
import { AudioPlayerActions } from '@/hooks/useAudioPlayer';

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

function fmt(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

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

  const seekRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const curTimeRef = useRef<HTMLSpanElement>(null);
  const durTimeRef = useRef<HTMLSpanElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  // 60fps progress painting via refs
  useEffect(() => {
    if (scrubbing) return;
    const frac = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${frac})`;
    if (knobRef.current) {
      const seekWidth = seekRef.current?.clientWidth || 0;
      knobRef.current.style.transform = `translate(-50%, -50%) translateX(${frac * seekWidth}px)`;
    }
    if (curTimeRef.current) curTimeRef.current.textContent = fmt(currentTime);
    if (durTimeRef.current) durTimeRef.current.textContent = fmt(duration);
  }, [currentTime, duration, scrubbing]);

  const fractionFromEvent = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!seekRef.current) return 0;
    const r = seekRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  }, []);

  const previewSeek = useCallback((frac: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${frac})`;
    if (knobRef.current) {
      const seekWidth = seekRef.current?.clientWidth || 0;
      knobRef.current.style.transform = `translate(-50%, -50%) translateX(${frac * seekWidth}px)`;
    }
    if (curTimeRef.current && duration > 0) {
      curTimeRef.current.textContent = fmt(duration * frac);
    }
  }, [duration]);

  const handleSeekDown = useCallback((e: React.PointerEvent) => {
    setScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    previewSeek(fractionFromEvent(e));
  }, [fractionFromEvent, previewSeek]);

  const handleSeekMove = useCallback((e: React.PointerEvent) => {
    if (scrubbing) previewSeek(fractionFromEvent(e));
  }, [scrubbing, fractionFromEvent, previewSeek]);

  const handleSeekUp = useCallback((e: React.PointerEvent) => {
    if (!scrubbing) return;
    setScrubbing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const frac = fractionFromEvent(e);
    if (duration > 0) playerActions.seek(duration * frac);
  }, [scrubbing, fractionFromEvent, duration, playerActions]);

  const handlePlayClick = useCallback(() => {
    if (!started) {
      onFirstPlay();
    } else {
      playerActions.togglePlay();
    }
  }, [started, onFirstPlay, playerActions]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <section
      className="player-pill glass-pill flex items-center gap-2 sm:gap-3.5 w-full select-none px-2 py-1.5 sm:py-[0.45rem] sm:pr-[0.9rem] sm:pl-[0.5rem]"
      style={{
        borderRadius: '999px',
        background: 'rgba(12, 12, 16, 0.85)',
        backdropFilter: 'blur(36px) saturate(170%)',
        WebkitBackdropFilter: 'blur(36px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.22)',
      }}
      aria-label="Music Player"
    >
      {/* Vinyl Disc Artwork with safe clearance */}
      <div
        className={`disc ${isPlaying ? 'disc--playing' : ''} flex-none w-[2.8rem] h-[2.8rem] sm:w-[3.4rem] sm:h-[3.4rem]`}
      >
        <div className="disc__ring shadow-lg shadow-black/60">
          {currentSong?.cover ? (
            <Image
              src={currentSong.cover}
              alt={currentSong.title || 'Album art'}
              width={54}
              height={54}
              className="disc__art"
              sizes="54px"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
              <Music className="w-5 h-5 text-white/40" />
            </div>
          )}
        </div>
        <span className="disc__hub" aria-hidden="true" />
      </div>

      {/* Meta + Seek Progress Bar */}
      <div className="flex-1 min-w-0 pr-1 py-0.5">
        {/* Title, Artist and Heart button */}
        <div className="flex items-center justify-between gap-2">
          <p
            className="font-bold text-xs sm:text-[13px] leading-tight text-white truncate"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
          >
            {currentSong?.title || 'Office Waala'}
            {isLoading && <Loader2 className="inline-block w-3 h-3 ml-1.5 animate-spin text-amber-400" />}
          </p>

          {/* Dedicated Favorite Heart Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="p-1 rounded-full text-white/40 hover:text-red-400 transition-all cursor-pointer flex-none active:scale-125"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Favorite song"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>

        <p className="text-[10px] sm:text-[11px] font-semibold text-white/60 truncate leading-tight mt-0.5">
          {error ? (
            <span className="text-red-400/90 font-medium">{error}</span>
          ) : (
            currentSong?.artist || station.tagline
          )}
        </p>

        {/* 60fps Seek bar with comfortable margin */}
        <div
          ref={seekRef}
          className="seek mt-1.5 mb-0.5"
          role="slider"
          tabIndex={0}
          aria-label="Seek track position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={duration > 0 ? Math.round((currentTime / duration) * 100) : 0}
          onPointerDown={handleSeekDown}
          onPointerMove={handleSeekMove}
          onPointerUp={handleSeekUp}
        >
          <div className="seek__rail">
            <div ref={fillRef} className="seek__fill" />
          </div>
          <div ref={knobRef} className="seek__knob" />
        </div>

        {/* Time elapsed / duration */}
        <div className="flex justify-between mt-0.5">
          <span
            ref={curTimeRef}
            className="text-[9px] sm:text-[10px] font-bold text-white/50 tabular-nums"
          >
            0:00
          </span>
          <span
            ref={durTimeRef}
            className="text-[9px] sm:text-[10px] font-bold text-white/50 tabular-nums"
          >
            0:00
          </span>
        </div>
      </div>

      {/* Control Buttons with comfortable touch targets and gap */}
      <div className="player-controls flex items-center gap-1 sm:gap-1.5 flex-none relative">
        {/* Shuffle Toggle Button */}
        <button
          type="button"
          onClick={playerActions.toggleShuffle}
          className={`ctrl-btn w-[1.85rem] h-[1.85rem] rounded-full transition-all duration-150 active:scale-90 ${
            isShuffle
              ? 'text-amber-400 bg-amber-400/20 border border-amber-400/40 shadow-sm shadow-amber-400/20'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-label="Toggle shuffle"
          aria-pressed={isShuffle}
          title={isShuffle ? 'Shuffle: ON (Randomized)' : 'Shuffle: OFF (Ordered)'}
        >
          <Shuffle className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={playerActions.previous}
          className="ctrl-btn w-[1.85rem] h-[1.85rem] rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
          aria-label="Previous track"
          title="Previous track"
        >
          <SkipBack className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" fill="currentColor" />
        </button>

        {/* Big Central Play/Pause Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          className="ctrl-btn ctrl-btn--play w-[2.35rem] h-[2.35rem] sm:w-[2.5rem] sm:h-[2.5rem] rounded-full shadow-lg shadow-black/50 active:scale-90 transition-transform duration-100 flex items-center justify-center cursor-pointer mx-0.5"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="currentColor" />
          ) : (
            <Play className="w-4 h-4 sm:w-[18px] sm:h-[18px] ml-[1.5px]" fill="currentColor" />
          )}
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={playerActions.next}
          className="ctrl-btn w-[1.85rem] h-[1.85rem] rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
          aria-label="Next track"
          title="Next track"
        >
          <SkipForward className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" fill="currentColor" />
        </button>

        {/* Playlist Toggle Button */}
        {onTogglePlaylist && (
          <button
            type="button"
            onClick={onTogglePlaylist}
            className={`ctrl-btn w-[1.85rem] h-[1.85rem] rounded-full transition-all duration-150 active:scale-90 ${
              isPlaylistOpen
                ? 'text-amber-400 bg-amber-400/20 border border-amber-400/40 shadow-sm shadow-amber-400/20'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Playlist"
            aria-expanded={isPlaylistOpen}
            title={isPlaylistOpen ? 'Hide Playlist' : 'Show Playlist'}
          >
            <ListMusic className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
          </button>
        )}

        {/* Expanding Volume Pill */}
        <div
          className={`relative flex items-center transition-all duration-300 ease-out overflow-hidden ${
            showVolumePopup
              ? 'w-[7rem] sm:w-[7.5rem] bg-white/[0.08] rounded-full shadow-inner border border-white/[0.08]'
              : 'w-[1.85rem] bg-transparent border border-transparent rounded-full'
          }`}
          onMouseEnter={() => setShowVolumePopup(true)}
          onMouseLeave={() => setShowVolumePopup(false)}
        >
          <button
            type="button"
            onClick={playerActions.toggleMute}
            className={`ctrl-btn flex-none w-[1.85rem] h-[1.85rem] rounded-full active:scale-90 transition-all flex items-center justify-center ${
              isMuted ? 'text-red-400' : 'text-white/75 hover:text-white'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : `Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          >
            <VolumeIcon className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
          </button>

          <div
            className={`flex-1 pr-2.5 flex items-center transition-opacity duration-300 ${
              showVolumePopup ? 'opacity-100 delay-100' : 'opacity-0 duration-75'
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => playerActions.setVolume(parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #fbbf24 ${
                  (isMuted ? 0 : volume) * 100
                }%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
