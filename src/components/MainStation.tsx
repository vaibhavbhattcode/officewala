'use client';

import { useState, useMemo, useEffect } from 'react';
import { Song, StationConfig, PlayerState } from '@/types/types';
import { AudioPlayerActions } from '@/hooks/useAudioPlayer';
import { HeroBackground } from './HeroBackground';
import { StationHeader } from './StationHeader';
import { OneLinerRotator } from './OneLinerRotator';
import { NowPlaying } from './NowPlaying';
import { PlaylistDrawer } from './PlaylistDrawer';

interface MainStationProps {
  station: StationConfig;
  songs: Song[];
  oneLiners: string[];
  playerState: PlayerState;
  playerActions: AudioPlayerActions;
  started: boolean;
  onFirstPlay: () => void;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
  isFavoritesMode: boolean;
  onToggleFavoritesMode: () => void;
}

export function MainStation({
  station,
  songs,
  oneLiners,
  playerState,
  playerActions,
  started,
  onFirstPlay,
  favorites,
  onToggleFavorite,
  isFavoritesMode,
  onToggleFavoritesMode,
}: MainStationProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Click outside to close playlist
  useEffect(() => {
    if (!showPlaylist) return;
    function close(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.playlist-popup') && !target.closest('.playlist-toggle-btn')) {
        setShowPlaylist(false);
      }
    }
    // Delay adding the listener to avoid the immediate toggle click
    setTimeout(() => {
      window.addEventListener('click', close);
    }, 10);
    return () => window.removeEventListener('click', close);
  }, [showPlaylist]);

  // Active playlist based on mode
  const displayedSongs = useMemo(() => {
    if (isFavoritesMode) {
      const favs = songs.filter((s) => favorites.includes(s.id));
      return favs.length > 0 ? favs : songs;
    }
    return songs;
  }, [isFavoritesMode, favorites, songs]);

  const isCurrentFav = playerState.currentSong
    ? favorites.includes(playerState.currentSong.id)
    : false;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      {/* Background - Using the actual video as requested */}
      <HeroBackground 
        backgroundUrl={station.background || "/backgrounds/270983.mp4"} 
        backgrounds={station.backgrounds && station.backgrounds.length > 0 ? station.backgrounds : undefined} 
      />

      {/* Top Header with Live Presence and Favorites button */}
      <StationHeader
        station={station}
        favoritesCount={favorites.length}
        isFavoritesMode={isFavoritesMode}
        onToggleFavoritesMode={onToggleFavoritesMode}
      />

      {/* Main Center Area */}
      <main
        className="relative z-10 flex-1 flex flex-col items-center justify-between w-full h-full"
        style={{
          padding: `max(var(--edge), env(safe-area-inset-top)) var(--edge) max(var(--edge), env(safe-area-inset-bottom))`,
        }}
      >
        {/* Center spacing spacer */}
        <div className="flex-1" />

        {/* Bottom Dock: Playlist Popup + Bumper Quote + Pill Player */}
        <div
          className="anim-rise w-full max-w-[1100px] mx-auto flex flex-col items-center justify-end relative px-2 sm:px-4 lg:px-8 shrink-0 gap-6 sm:gap-10 lg:gap-12"
          style={{
            marginBottom: 'clamp(0.6rem, 4vh, 2.5rem)',
            animationDelay: '0.16s',
          }}
        >
          {/* One-Liner Quote / Bumper */}
          <OneLinerRotator
            oneLiners={oneLiners}
            intervalMs={station.oneLinerInterval}
          />

          {/* Core Player Pill with Playlist Anchor */}
          <div className="relative w-full">
            {/* Playlist popup directly above the player pill, centered on mobile, right aligned on desktop */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-auto sm:-translate-x-0 sm:right-0 z-50 mb-2 sm:mb-3 flex justify-center sm:justify-end w-full sm:w-auto pointer-events-none">
              <PlaylistDrawer
                isOpen={showPlaylist}
                onClose={() => setShowPlaylist(false)}
                songs={displayedSongs}
                currentIndex={playerState.currentIndex}
                isPlaying={playerState.isPlaying}
                onPlaySong={(idx) => {
                  playerActions.playSong(idx);
                  if (!started) onFirstPlay();
                }}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                isFavoritesMode={isFavoritesMode}
              />
            </div>

            <NowPlaying
              playerState={playerState}
              playerActions={playerActions}
              station={station}
              started={started}
              onFirstPlay={onFirstPlay}
              isPlaylistOpen={showPlaylist}
              onTogglePlaylist={() => setShowPlaylist((p) => !p)}
              isFavorite={isCurrentFav}
              onToggleFavorite={() => {
                if (playerState.currentSong) {
                  onToggleFavorite(playerState.currentSong.id);
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
